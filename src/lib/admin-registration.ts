import { breakoutTracks, digitalChallenges, industries } from "@/lib/constants";

export type RegistrationRecordInput = {
  firstName: string;
  lastName: string;
  email: string;
  mobileNumber?: string;
  jobTitle?: string;
  company?: string;
  industry?: string;
  breakoutTrack?: string;
  challenges?: string[];
  needTimeline?: "6_months" | "12_months" | "exploring" | "no_requirement";
  consent?: boolean;
};

export function toRegistrationInsertPayload(input: RegistrationRecordInput) {
  return {
    first_name: input.firstName.trim(),
    last_name: input.lastName.trim(),
    email: input.email.trim().toLowerCase(),
    mobile_number: input.mobileNumber?.trim() || "N/A",
    job_title: input.jobTitle?.trim() || "N/A",
    company: input.company?.trim() || "N/A",
    industry: input.industry?.trim() || industries[0],
    breakout_track: input.breakoutTrack?.trim() || breakoutTracks[0],
    challenges:
      input.challenges && input.challenges.length > 0
        ? input.challenges
        : [digitalChallenges[0]],
    need_timeline: input.needTimeline || "exploring",
    consent: input.consent ?? true,
  };
}
