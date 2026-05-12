"use client";

import dynamic from "next/dynamic";

const RegistrationForm = dynamic(
  () =>
    import("@/components/registration-form").then(
      (module) => module.RegistrationForm,
    ),
  { ssr: false },
);

export function RegistrationFormShell() {
  return <RegistrationForm />;
}
