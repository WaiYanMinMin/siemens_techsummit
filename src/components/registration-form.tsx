"use client";

import { FormEvent, useMemo, useState } from "react";

import {
  breakoutTracks,
  digitalChallenges,
  industries,
  timelineNeeds,
} from "@/lib/constants";

type FormState = {
  firstName: string;
  lastName: string;
  email: string;
  mobileNumber: string;
  jobTitle: string;
  company: string;
  industry: string;
  breakoutTrack: string;
  challenges: string[];
  needTimeline: string;
  consent: boolean;
};

const initialState: FormState = {
  firstName: "",
  lastName: "",
  email: "",
  mobileNumber: "",
  jobTitle: "",
  company: "",
  industry: "",
  breakoutTrack: "",
  challenges: [],
  needTimeline: "exploring",
  consent: false,
};

export function RegistrationForm() {
  const [formData, setFormData] = useState<FormState>(initialState);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const canSubmit = useMemo(() => !isSubmitting, [isSubmitting]);

  function onChallengeToggle(challenge: string) {
    setFormData((prev) => {
      const isSelected = prev.challenges.includes(challenge);
      return {
        ...prev,
        challenges: isSelected
          ? prev.challenges.filter((item) => item !== challenge)
          : [...prev.challenges, challenge],
      };
    });
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setError("");
    setSuccess("");

    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const body = (await response.json()) as { error?: string; message?: string };

      if (!response.ok) {
        setError(body.error ?? "Unable to submit registration. Please try again.");
        return;
      }

      setSuccess(
        body.message ??
          "Registration successful. We will share QR access details closer to the event.",
      );
      setFormData(initialState);
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Input
          label="First Name *"
          value={formData.firstName}
          onChange={(value) => setFormData((prev) => ({ ...prev, firstName: value }))}
        />
        <Input
          label="Last Name *"
          value={formData.lastName}
          onChange={(value) => setFormData((prev) => ({ ...prev, lastName: value }))}
        />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Input
          type="email"
          label="Email *"
          value={formData.email}
          onChange={(value) => setFormData((prev) => ({ ...prev, email: value }))}
        />
        <Input
          label="Mobile Number *"
          value={formData.mobileNumber}
          onChange={(value) => setFormData((prev) => ({ ...prev, mobileNumber: value }))}
        />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Input
          label="Job Title *"
          value={formData.jobTitle}
          onChange={(value) => setFormData((prev) => ({ ...prev, jobTitle: value }))}
        />
        <Input
          label="Organization / Company *"
          value={formData.company}
          onChange={(value) => setFormData((prev) => ({ ...prev, company: value }))}
        />
      </div>

      <label className="flex flex-col gap-2 text-sm font-medium text-white/90">
        Industry / Sector *
        <select
          required
          value={formData.industry}
          onChange={(event) =>
            setFormData((prev) => ({ ...prev, industry: event.target.value }))
          }
          className={`${inputClassName} cursor-pointer appearance-none pr-10`}
        >
          <option value="" style={{ backgroundColor: "#02023e", color: "#cbd5e1" }}>
            Select an industry
          </option>
          {industries.map((industry) => (
            <option
              key={industry}
              value={industry}
              style={{ backgroundColor: "#02023e", color: "#ffffff" }}
            >
              {industry}
            </option>
          ))}
        </select>
      </label>

      <fieldset className="space-y-3 rounded-lg border border-white/15 bg-white/5 p-4">
        <legend className="px-2 text-sm font-semibold text-[#00d7c7]">
          Breakout Selection (Select One) *
        </legend>
        {breakoutTracks.map((track) => (
          <label
            key={track}
            className="hitech-interactive flex items-start gap-3 rounded-md p-2 text-sm text-white/90 transition hover:bg-white/5"
          >
            <input
              type="radio"
              name="breakoutTrack"
              value={track}
              checked={formData.breakoutTrack === track}
              onChange={(event) =>
                setFormData((prev) => ({ ...prev, breakoutTrack: event.target.value }))
              }
              required
              className="mt-1 h-4 w-4 accent-[#11d3b7]"
            />
            {track}
          </label>
        ))}
      </fieldset>

      <fieldset className="space-y-3 rounded-lg border border-white/15 bg-white/5 p-4">
        <legend className="px-2 text-sm font-semibold text-[#00d7c7]">
          What digital transformation challenges are you facing?
        </legend>
        {digitalChallenges.map((challenge) => (
          <label
            key={challenge}
            className="hitech-interactive flex items-start gap-3 rounded-md p-2 text-sm text-white/90 transition hover:bg-white/5"
          >
            <input
              type="checkbox"
              checked={formData.challenges.includes(challenge)}
              onChange={() => onChallengeToggle(challenge)}
              className="mt-1 h-4 w-4 rounded accent-[#11d3b7]"
            />
            {challenge}
          </label>
        ))}
      </fieldset>

      <fieldset className="space-y-3 rounded-lg border border-white/15 bg-white/5 p-4">
        <legend className="px-2 text-sm font-semibold text-[#00d7c7]">
          Do you have a need for digitalization solutions?
        </legend>
        {timelineNeeds.map((option) => (
          <label
            key={option.value}
            className="hitech-interactive flex items-start gap-3 rounded-md p-2 text-sm text-white/90 transition hover:bg-white/5"
          >
            <input
              type="radio"
              name="needTimeline"
              value={option.value}
              checked={formData.needTimeline === option.value}
              onChange={(event) =>
                setFormData((prev) => ({ ...prev, needTimeline: event.target.value }))
              }
              className="mt-1 h-4 w-4 accent-[#11d3b7]"
            />
            {option.label}
          </label>
        ))}
      </fieldset>

      <label className="flex items-start gap-3 rounded-md border border-white/20 bg-white/5 p-4 text-sm text-white/90">
        <input
          type="checkbox"
          checked={formData.consent}
          onChange={(event) => setFormData((prev) => ({ ...prev, consent: event.target.checked }))}
          required
          className="mt-1 h-4 w-4 rounded accent-[#11d3b7]"
        />
        <span>
          I agree to the{" "}
          <a
            href="https://www.siemens.com/en-us/company/compliance/data-privacy/"
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-[#7de6d5] underline underline-offset-2"
          >
            privacy policy
          </a>{" "}
          and data processing terms.
        </span>
      </label>

      {error && (
        <p className="rounded-md border border-red-400/50 bg-red-500/10 p-3 text-sm text-red-200">
          {error}
        </p>
      )}
      {success && (
        <p className="rounded-md border border-emerald-300/50 bg-emerald-500/10 p-3 text-sm text-emerald-200">
          {success}
        </p>
      )}

      <button
        type="submit"
        disabled={!canSubmit}
        className="hitech-interactive inline-flex h-11 items-center justify-center rounded-sm bg-[#7de6d5] px-6 text-sm font-bold text-[#00153b] transition hover:brightness-95 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isSubmitting ? "Submitting..." : "Register Now"}
      </button>
    </form>
  );
}

type InputProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: "text" | "email";
};

function Input({ label, value, onChange, type = "text" }: InputProps) {
  return (
    <label className="flex flex-col gap-2 text-sm font-medium text-white/90">
      {label}
      <input
        required
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className={inputClassName}
      />
    </label>
  );
}

const inputClassName =
  "h-11 rounded-md border border-white/25 bg-white/10 px-3 text-sm text-white placeholder:text-white/50 outline-none transition focus:border-[#11d3b7] focus:ring-2 focus:ring-[#11d3b7]/35";
