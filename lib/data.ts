import { addDays, differenceInCalendarDays, format } from "date-fns";
import { InternStatus, Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { mockDepartments, mockInterns, mockSupervisors } from "@/lib/mock-data";
import { internshipOfficeOptions } from "@/lib/intern-options";

type InternListFilters = {
  q?: string;
  status?: string;
};

async function withFallback<T>(query: () => Promise<T>, fallback: T): Promise<T> {
  if (!process.env.DATABASE_URL) {
    return fallback;
  }

  return await query();
}

export async function getDepartments() {
  return withFallback(
    () =>
      prisma.department.findMany({
        orderBy: { name: "asc" },
        include: {
          supervisors: true,
          _count: { select: { interns: true } }
        }
      }),
    mockDepartments.map((department) => ({
      ...department,
      supervisors: mockSupervisors.filter((supervisor) => supervisor.departmentId === department.id),
      _count: {
        interns: mockInterns.filter((intern) => intern.departmentId === department.id).length
      }
    }))
  );
}

export async function getSupervisors(departmentId?: string) {
  return withFallback(
    () =>
      prisma.supervisor.findMany({
        where: departmentId ? { departmentId } : undefined,
        orderBy: { name: "asc" }
      }),
    departmentId
      ? mockSupervisors.filter((supervisor) => supervisor.departmentId === departmentId)
      : mockSupervisors
  );
}

export async function getDashboardData() {
  const completingSoonDate = addDays(new Date(), 7);

  return withFallback(
    async () => {
      const [
        total,
        active,
        completed,
        completingSoon,
        departmentBreakdown,
        universityGroups,
        officeGroups,
        internEndDates
      ] =
        await Promise.all([
          prisma.intern.count(),
          prisma.intern.count({
            where: {
              status: {
                in: [InternStatus.ACTIVE, InternStatus.EXTENDED]
              }
            }
          }),
          prisma.intern.count({
            where: { status: InternStatus.COMPLETED }
          }),
          prisma.intern.findMany({
            where: {
              status: { in: [InternStatus.ACTIVE, InternStatus.EXTENDED] },
              endDate: { lte: completingSoonDate }
            },
            orderBy: { endDate: "asc" },
            include: { department: true }
          }),
          prisma.department.findMany({
            include: {
              _count: { select: { interns: true } }
            },
            orderBy: { name: "asc" }
          }),
          prisma.intern.groupBy({
            by: ["university"],
            _count: { _all: true }
          }),
          prisma.intern.groupBy({
            by: ["officeLocation"],
            _count: { _all: true }
          }),
          prisma.intern.findMany({
            select: { endDate: true }
          })
        ]);

      const universityBreakdown = buildUniversityBreakdown(universityGroups);
      const officeBreakdown = buildOfficeBreakdown(officeGroups);
      const yearlyBreakdown = buildYearlyBreakdown(internEndDates.map((intern) => intern.endDate));

      return {
        stats: {
          total,
          active,
          completingSoon: completingSoon.length,
          completed
        },
        completingSoon,
        departmentBreakdown: departmentBreakdown.map((department) => ({
          name: department.name,
          total: department._count.interns
        })),
        universityBreakdown,
        officeBreakdown,
        yearlyBreakdown
      };
    },
    {
      stats: {
        total: mockInterns.length,
        active: mockInterns.filter(
          (intern) => intern.status === InternStatus.ACTIVE || intern.status === InternStatus.EXTENDED
        ).length,
        completingSoon: mockInterns.filter(
          (intern) =>
            (intern.status === InternStatus.ACTIVE || intern.status === InternStatus.EXTENDED) &&
            intern.endDate <= completingSoonDate
        ).length,
        completed: mockInterns.filter((intern) => intern.status === InternStatus.COMPLETED).length
      },
      completingSoon: mockInterns.filter(
        (intern) =>
          (intern.status === InternStatus.ACTIVE || intern.status === InternStatus.EXTENDED) &&
          intern.endDate <= completingSoonDate
      ),
      departmentBreakdown: mockDepartments.map((department) => ({
        name: department.name,
        total: mockInterns.filter((intern) => intern.departmentId === department.id).length
      })),
      universityBreakdown: buildUniversityBreakdown(
        aggregateUniversityCounts(mockInterns, (intern) => intern.university)
      ),
      officeBreakdown: buildOfficeBreakdown(
        aggregateOfficeCounts(mockInterns, (intern) => intern.officeLocation ?? "Unspecified")
      ),
      yearlyBreakdown: buildYearlyBreakdown(mockInterns.map((intern) => intern.endDate))
    } as any
  );
}

function buildUniversityBreakdown(groups: Array<{ university: string; _count: { _all: number } }>) {
  const sorted = [...groups]
    .filter((group) => group.university)
    .sort((a, b) => b._count._all - a._count._all);

  const top = sorted.slice(0, 5).map((group) => ({
    name: group.university,
    total: group._count._all
  }));

  const otherTotal = sorted.slice(5).reduce((sum, group) => sum + group._count._all, 0);

  return otherTotal > 0 ? [...top, { name: "Other", total: otherTotal }] : top;
}

function buildOfficeBreakdown(groups: Array<{ officeLocation: string | null; _count: { _all: number } }>) {
  const counts = new Map<string, number>();
  for (const group of groups) {
    const key = group.officeLocation ?? "Unspecified";
    counts.set(key, (counts.get(key) ?? 0) + group._count._all);
  }

  const officeRows: Array<{ name: string; total: number }> = internshipOfficeOptions.map((office) => ({
    name: office,
    total: counts.get(office) ?? 0
  }));

  if (counts.has("Unspecified")) {
    officeRows.push({ name: "Unspecified", total: counts.get("Unspecified") ?? 0 });
  }

  return officeRows;
}

function aggregateUniversityCounts<T>(items: T[], getKey: (item: T) => string | undefined | null) {
  const counts = new Map<string, number>();

  for (const item of items) {
    const key = getKey(item);
    if (!key) {
      continue;
    }
    counts.set(key, (counts.get(key) ?? 0) + 1);
  }

  return Array.from(counts.entries()).map(([key, total]) => ({
    university: key,
    _count: { _all: total }
  }));
}

function aggregateOfficeCounts<T>(items: T[], getKey: (item: T) => string | undefined | null) {
  const counts = new Map<string, number>();

  for (const item of items) {
    const key = getKey(item);
    if (!key) {
      continue;
    }
    counts.set(key, (counts.get(key) ?? 0) + 1);
  }

  return Array.from(counts.entries()).map(([key, total]) => ({
    officeLocation: key,
    _count: { _all: total }
  }));
}

function buildYearlyBreakdown(endDates: Date[]) {
  const counts = new Map<number, number>();

  for (const date of endDates) {
    const year = new Date(date).getFullYear();
    counts.set(year, (counts.get(year) ?? 0) + 1);
  }

  return Array.from(counts.entries())
    .map(([year, total]) => ({ year, total }))
    .sort((a, b) => a.year - b.year);
}

export async function getInterns(filters: InternListFilters = {}) {
  const search = filters.q?.trim();

  return withFallback(
    () =>
      prisma.intern.findMany({
        where: {
          ...(filters.status && filters.status !== "ALL"
            ? filters.status === "COMPLETING_SOON"
              ? {
                  status: { in: [InternStatus.ACTIVE, InternStatus.EXTENDED] },
                  endDate: { lte: addDays(new Date(), 7) }
                }
              : { status: filters.status as InternStatus }
            : {}),
          ...(search
            ? {
                OR: [
                  { fullName: { contains: search, mode: Prisma.QueryMode.insensitive } },
                  { cnicNumber: { contains: search, mode: Prisma.QueryMode.insensitive } },
                  { university: { contains: search, mode: Prisma.QueryMode.insensitive } }
                ]
              }
            : {})
        },
        orderBy: { joiningDate: "desc" },
        include: {
          department: true
        }
      }),
    mockInterns.filter((intern) => {
      const matchesStatus =
        !filters.status ||
        filters.status === "ALL" ||
        (filters.status === "COMPLETING_SOON"
          ? (intern.status === InternStatus.ACTIVE || intern.status === InternStatus.EXTENDED) &&
            intern.endDate <= addDays(new Date(), 7)
          : intern.status === filters.status);

      const haystack = `${intern.fullName} ${intern.cnicNumber} ${intern.university}`.toLowerCase();
      const matchesSearch = !search || haystack.includes(search.toLowerCase());

      return matchesStatus && matchesSearch;
    }) as any
  );
}

export async function getInternById(id: string) {
  return withFallback(
    () =>
      prisma.intern.findUnique({
        where: { id },
        include: {
          department: true,
          addedBy: true,
          extensionLogs: {
            include: {
              extendedBy: true
            },
            orderBy: { createdAt: "desc" }
          }
        }
      }),
    (mockInterns.find((intern) => intern.id === id) ?? null) as any
  );
}

export function mapInternToExportRow(intern: {
  fullName: string;
  cnicNumber: string;
  university: string;
  department?: { name: string } | null;
  supervisorName?: string | null;
  joiningDate: Date;
  endDate: Date;
  status: string;
}) {
  return {
    Name: intern.fullName,
    CNIC: intern.cnicNumber,
    University: intern.university,
    Department: intern.department?.name ?? "Unassigned",
    Supervisor: intern.supervisorName ?? "Pending",
    "Joining Date": format(intern.joiningDate, "PPP"),
    "End Date": format(intern.endDate, "PPP"),
    Status: intern.status === "TERMINATED" ? "Intern left" : intern.status.replaceAll("_", " ")
  };
}

export function getDaysRemaining(endDate: Date) {
  return differenceInCalendarDays(endDate, new Date());
}
