import * as XLSX from "xlsx";

export type RegistrationImportRow = {
  firstName: string;
  lastName: string;
  email: string;
  mobileNumber: string;
  jobTitle: string;
  company: string;
  industry: string;
  breakoutTrack: string;
  challenges: string[];
  needTimeline: "6_months" | "12_months" | "exploring" | "no_requirement";
  consent: boolean;
};

export type InvitationImportRow = {
  firstName: string;
  email: string;
  associationName: string;
  invitationType: "csuites" | "associates";
};

type AnyRow = Record<string, unknown>;

function normalizeHeader(value: string) {
  return value.trim().toLowerCase().replace(/\s+/g, "_");
}

export function parseWorkbookRows(buffer: ArrayBuffer) {
  const workbook = XLSX.read(buffer, { type: "array" });
  const sheetName = workbook.SheetNames[0];

  if (!sheetName) {
    throw new Error("Workbook does not contain a sheet.");
  }

  const sheet = workbook.Sheets[sheetName];
  return XLSX.utils.sheet_to_json<AnyRow>(sheet, { defval: "" });
}

function toStringValue(value: unknown) {
  return String(value ?? "").trim();
}

function toBooleanValue(value: unknown) {
  const normalized = toStringValue(value).toLowerCase();
  return normalized === "true" || normalized === "yes" || normalized === "1";
}

export function parseRegistrationRows(rows: AnyRow[]) {
  return rows.map((row, index) => {
    const normalized = Object.fromEntries(
      Object.entries(row).map(([key, value]) => [normalizeHeader(key), value]),
    );

    const firstName = toStringValue(normalized.first_name);
    const lastName = toStringValue(normalized.last_name);
    const email = toStringValue(normalized.email).toLowerCase();
    const mobileNumber = toStringValue(normalized.mobile_number);
    const jobTitle = toStringValue(normalized.job_title);
    const company = toStringValue(normalized.company);
    const industry = toStringValue(normalized.industry);
    const breakoutTrack = toStringValue(normalized.breakout_track);
    const challengesRaw = toStringValue(normalized.challenges);
    const needTimelineRaw = toStringValue(normalized.need_timeline) as RegistrationImportRow["needTimeline"];
    const consent = toBooleanValue(normalized.consent);

    const challenges = challengesRaw
      .split("|")
      .map((item) => item.trim())
      .filter(Boolean);

    if (!firstName || !lastName || !email) {
      throw new Error(`Row ${index + 2}: first_name, last_name and email are required.`);
    }

    return {
      firstName,
      lastName,
      email,
      mobileNumber,
      jobTitle,
      company,
      industry,
      breakoutTrack,
      challenges,
      needTimeline: ["6_months", "12_months", "exploring", "no_requirement"].includes(
        needTimelineRaw,
      )
        ? needTimelineRaw
        : "exploring",
      consent,
    } satisfies RegistrationImportRow;
  });
}

export function parseInvitationRows(rows: AnyRow[]) {
  return rows.map((row, index) => {
    const normalized = Object.fromEntries(
      Object.entries(row).map(([key, value]) => [normalizeHeader(key), value]),
    );

    const firstName = toStringValue(normalized.first_name);
    const email = toStringValue(normalized.email).toLowerCase();
    const associationName = toStringValue(normalized.association_name);
    const invitationTypeRaw = toStringValue(normalized.invitation_type).toLowerCase();
    const invitationType =
      invitationTypeRaw === "associates" ? "associates" : "csuites";

    if (!firstName || !email) {
      throw new Error(`Row ${index + 2}: first_name and email are required.`);
    }

    return {
      firstName,
      email,
      associationName,
      invitationType,
    } satisfies InvitationImportRow;
  });
}

function toWorkbookBuffer(rows: AnyRow[], sheetName: string) {
  const worksheet = XLSX.utils.json_to_sheet(rows);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
  return XLSX.write(workbook, { type: "buffer", bookType: "xlsx" });
}

export function registrationTemplateBuffer() {
  return toWorkbookBuffer(
    [
      {
        first_name: "Jane",
        last_name: "Doe",
        email: "jane@example.com",
        mobile_number: "+6591234567",
        job_title: "Director",
        company: "Acme Industries",
        industry: "Manufacturing",
        breakout_track: "Track 2: Smart Manufacturing with Industrial AI",
        challenges: "Fragmented software and data silos|Leveraging AI/ML for product innovation",
        need_timeline: "6_months",
        consent: true,
      },
    ],
    "registrations",
  );
}

export function invitationTemplateBuffer() {
  return toWorkbookBuffer(
    [
      {
        first_name: "Jane",
        email: "jane@example.com",
        association_name: "Association Example",
        invitation_type: "associates",
      },
    ],
    "invitations",
  );
}
