import Papa from "papaparse";
import * as XLSX from "xlsx";
import type { RosterStudent } from "./types";

const EXPECTED_HEADERS = ["first name", "last name", "email", "student id", "class/period"];

function normalizeHeader(h: string): string {
  return h.toLowerCase().trim().replace(/[_\-]/g, " ");
}

function mapRow(row: Record<string, string>, idx: number): RosterStudent {
  const keys = Object.keys(row);
  const findCol = (targets: string[]) => {
    const key = keys.find((k) => targets.includes(normalizeHeader(k)));
    return key ? (row[key] || "").trim() : "";
  };

  const firstName = findCol(["first name", "firstname", "first"]);
  const lastName = findCol(["last name", "lastname", "last"]);
  const email = findCol(["email", "email address", "e mail"]);
  const studentId = findCol(["student id", "studentid", "id", "student number"]);
  const classPeriod = findCol(["class/period", "class", "period", "section"]);

  const errors: string[] = [];
  if (!firstName) errors.push("First Name is required");
  if (!lastName) errors.push("Last Name is required");
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.push("Invalid email format");
  }

  return {
    rowIndex: idx + 1,
    firstName,
    lastName,
    email,
    studentId,
    classPeriod,
    errors,
    isDuplicate: false,
  };
}

function flagDuplicates(students: RosterStudent[]): RosterStudent[] {
  const seen = new Map<string, number[]>();
  students.forEach((s, i) => {
    if (!s.firstName || !s.lastName) return;
    const key = `${s.firstName.toLowerCase()}|${s.lastName.toLowerCase()}`;
    if (!seen.has(key)) seen.set(key, []);
    seen.get(key)!.push(i);
  });

  return students.map((s, i) => {
    const key = `${s.firstName.toLowerCase()}|${s.lastName.toLowerCase()}`;
    const indices = seen.get(key);
    const isDuplicate = !!indices && indices.length > 1;
    return { ...s, isDuplicate };
  });
}

export async function parseCSV(file: File): Promise<RosterStudent[]> {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete(results) {
        if (!results.data || results.data.length === 0) {
          reject(new Error("No data found in file"));
          return;
        }
        const students = (results.data as Record<string, string>[]).map(mapRow);
        resolve(flagDuplicates(students));
      },
      error(err) {
        reject(new Error(`CSV parsing error: ${err.message}`));
      },
    });
  });
}

export async function parseXLSX(file: File): Promise<RosterStudent[]> {
  const buffer = await file.arrayBuffer();
  const workbook = XLSX.read(buffer, { type: "array" });
  const sheetName = workbook.SheetNames[0];
  if (!sheetName) throw new Error("No sheets found in file");

  const sheet = workbook.Sheets[sheetName];
  const data = XLSX.utils.sheet_to_json<Record<string, string>>(sheet, { defval: "" });

  if (data.length === 0) throw new Error("No data found in file");

  const students = data.map(mapRow);
  return flagDuplicates(students);
}

export async function parseRosterFile(file: File): Promise<RosterStudent[]> {
  const ext = file.name.split(".").pop()?.toLowerCase();
  if (ext === "csv") return parseCSV(file);
  if (ext === "xlsx" || ext === "xls") return parseXLSX(file);
  throw new Error("Unsupported file format. Please upload a .csv or .xlsx file.");
}

export function generateCSVTemplate(): string {
  const headers = "First Name,Last Name,Email,Student ID,Class/Period";
  const example = "Jane,Doe,jane.doe@school.edu,STU001,Period 1";
  return `${headers}\n${example}\n`;
}

export function generateXLSXTemplate(): Blob {
  const wb = XLSX.utils.book_new();
  const data = [
    ["First Name", "Last Name", "Email", "Student ID", "Class/Period"],
    ["Jane", "Doe", "jane.doe@school.edu", "STU001", "Period 1"],
  ];
  const ws = XLSX.utils.aoa_to_sheet(data);
  ws["!cols"] = [{ wch: 15 }, { wch: 15 }, { wch: 25 }, { wch: 12 }, { wch: 15 }];
  XLSX.utils.book_append_sheet(wb, ws, "Roster");
  const buf = XLSX.write(wb, { bookType: "xlsx", type: "array" });
  return new Blob([buf], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
}
