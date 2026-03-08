export interface RosterStudent {
  rowIndex: number;
  firstName: string;
  lastName: string;
  email: string;
  studentId: string;
  classPeriod: string;
  errors: string[];
  isDuplicate: boolean;
}

export interface ImportResult {
  email: string;
  username: string;
  password: string;
  displayName: string;
  joinCode: string;
  joinLink: string;
  success: boolean;
  error?: string;
}

export type ImportStep = "upload" | "preview" | "assign" | "importing" | "results";
