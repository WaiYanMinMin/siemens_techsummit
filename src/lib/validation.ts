import { z } from "zod";

import { breakoutTracks, digitalChallenges, industries } from "@/lib/constants";

const phoneRegex = /^[+\d\s()-]{8,20}$/;

export const registrationSchema = z.object({
  firstName: z.string().trim().min(1, "First name is required"),
  lastName: z.string().trim().min(1, "Last name is required"),
  email: z.string().trim().email("Please enter a valid email"),
  mobileNumber: z
    .string()
    .trim()
    .regex(phoneRegex, "Please enter a valid mobile number"),
  jobTitle: z.string().trim().min(1, "Job title is required"),
  company: z.string().trim().min(1, "Organization / company is required"),
  industry: z.enum(industries, { message: "Please select an industry" }),
  breakoutTrack: z.enum(breakoutTracks, { message: "Please select one track" }),
  challenges: z.array(z.enum(digitalChallenges)).default([]),
  needTimeline: z.enum(["6_months", "12_months", "exploring", "no_requirement"]),
  consent: z.literal(true, {
    message: "You must agree to the privacy policy and data processing terms",
  }),
});

export type RegistrationInput = z.infer<typeof registrationSchema>;
