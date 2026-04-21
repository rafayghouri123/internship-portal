export const testDepartments = [
  "IT",
  "MARKETING",
  "ELECTRONICS",
  "CHEMICAL",
  "FINANCE",
  "QUALITY_ASSURANCE",
  "SUPPLY_CHAIN",
  "MECHANICAL"
] as const;

export type TestDepartment = (typeof testDepartments)[number];

export const testDepartmentLabels: Record<TestDepartment, string> = {
  IT: "IT",
  MARKETING: "Marketing",
  ELECTRONICS: "Electronics",
  CHEMICAL: "Chemical",
  FINANCE: "Finance",
  QUALITY_ASSURANCE: "Quality Assurance",
  SUPPLY_CHAIN: "Supply Chain",
  MECHANICAL: "Mechanical"
};

export type TestSection = "FUNCTIONAL" | "LOGICAL" | "REASONING" | "MATH";

export type CandidateInfo = {
  fullName: string;
  fatherName: string;
  university: string;
  department: TestDepartment;
};

export type QuestionOption = {
  id: "A" | "B" | "C" | "D";
  label: string;
};

export type TestQuestion = {
  id: string;
  section: TestSection;
  question: string;
  options: QuestionOption[];
};

export type InternalQuestion = {
  id: string;
  question: string;
  options: string[];
  answer: "A" | "B" | "C" | "D";
};

export type AttemptPayload = {
  candidate: CandidateInfo;
  startedAt: number;
  questions: TestQuestion[];
};

export type SignedSessionPayload = {
  sid: string;
  startedAt: number;
  candidate: CandidateInfo;
  questionIds: {
    functional: string[];
    logical: string[];
    reasoning: string[];
    math: string[];
  };
};
