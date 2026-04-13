"use client";

import { useMemo, useState } from "react";
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Label } from "@/components/ui/label";

type YearRangeChartProps = {
  data: Array<{ year: number; total: number }>;
};

export function YearRangeChart({ data }: YearRangeChartProps) {
  const sorted = useMemo(() => [...data].sort((a, b) => a.year - b.year), [data]);
  const minYear = sorted[0]?.year ?? new Date().getFullYear();
  const maxYear = sorted[sorted.length - 1]?.year ?? minYear;

  const [fromYear, setFromYear] = useState<number>(minYear);
  const [toYear, setToYear] = useState<number>(maxYear);

  const filtered = useMemo(() => {
    const start = Math.min(fromYear, toYear);
    const end = Math.max(fromYear, toYear);

    return sorted.filter((row) => row.year >= start && row.year <= end);
  }, [fromYear, toYear, sorted]);

  const yearOptions = sorted.map((row) => row.year);

  return (
    <div className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <Label htmlFor="fromYear">From year</Label>
          <select
            id="fromYear"
            className="mt-2 flex h-10 w-full rounded-md border border-dalda-gray-100 bg-white px-3 py-2 text-sm text-dalda-gray-900 shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-dalda-green"
            value={fromYear}
            onChange={(event) => setFromYear(Number(event.target.value))}
          >
            {yearOptions.map((year) => (
              <option key={`from-${year}`} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>
        <div>
          <Label htmlFor="toYear">To year</Label>
          <select
            id="toYear"
            className="mt-2 flex h-10 w-full rounded-md border border-dalda-gray-100 bg-white px-3 py-2 text-sm text-dalda-gray-900 shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-dalda-green"
            value={toYear}
            onChange={(event) => setToYear(Number(event.target.value))}
          >
            {yearOptions.map((year) => (
              <option key={`to-${year}`} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="h-[320px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={filtered} margin={{ top: 8, right: 12, left: 0, bottom: 8 }}>
            <XAxis dataKey="year" tick={{ fill: "#5A5B57", fontSize: 12 }} />
            <YAxis allowDecimals={false} tick={{ fill: "#5A5B57", fontSize: 12 }} />
            <Tooltip cursor={{ fill: "#E8F5EB" }} />
            <Bar dataKey="total" fill="#1F6B2E" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
