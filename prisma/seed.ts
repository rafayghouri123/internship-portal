import "dotenv/config";
import bcrypt from "bcryptjs";
import { PrismaClient, UserRole } from "@prisma/client";

const prisma = new PrismaClient();

const departments = [
  "Quality Assurance",
  "Finance",
  "HR",
  "Marketing",
  "Supply Chain",
  "R&D",
  "IT",
  "Operations"
];

async function main() {
  const hrPassword = await bcrypt.hash("HR@123", 10);

  await prisma.user.deleteMany({
    where: { email: "admin@daldafoods.com" }
  });

  await prisma.user.upsert({
    where: { email: "hr@daldafoods.com" },
    update: { name: "HR Officer", role: UserRole.HR, password: hrPassword },
    create: {
      name: "HR Officer",
      email: "hr@daldafoods.com",
      password: hrPassword,
      role: UserRole.HR
    }
  });

  for (const name of departments) {
    const department = await prisma.department.upsert({
      where: { name },
      update: {},
      create: { name }
    });

    for (let index = 1; index <= 2; index += 1) {
      const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-");

      await prisma.supervisor.upsert({
        where: { email: `${slug}-supervisor-${index}@daldafoods.com` },
        update: { departmentId: department.id },
        create: {
          name: `${name} Supervisor ${index}`,
          email: `${slug}-supervisor-${index}@daldafoods.com`,
          contactNumber: `03001234${String(index).padStart(2, "0")}`,
          departmentId: department.id
        }
      });
    }
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
