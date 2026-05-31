"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import type { ContactConfig, FinalCtaConfig, IntegrationsConfig } from "@/config/types";

interface BookingForm {
  name: string;
  phone: string;
}

export function FinalCta({ finalCta, integrations, contact }: { finalCta: FinalCtaConfig; integrations: IntegrationsConfig; contact: ContactConfig }) {
  const [status, setStatus] = useState("");
  const { register, handleSubmit, reset, formState } = useForm<BookingForm>();

  async function onSubmit(values: BookingForm) {
    const endpoint = integrations?.formEndpoint?.trim();
    if (endpoint) {
      await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values)
      });
      setStatus("Request sent.");
    } else {
      const subject = encodeURIComponent("Appointment request");
      const body = encodeURIComponent(`Name: ${values.name}\nPhone: ${values.phone}`);
      window.location.href = `mailto:${contact?.email || ""}?subject=${subject}&body=${body}`;
      setStatus("Opening email client.");
    }
    reset();
  }

  return (
    <section id="book" className="container-page pb-16">
      <div className="relative overflow-hidden rounded-[2rem] bg-[var(--color-primary)] p-7 text-[var(--color-white)] sm:p-10 lg:p-14">
        <div className="absolute right-8 top-8 hidden rounded-[1.4rem] bg-[var(--color-accent)] px-5 py-4 font-heading text-xl font-bold text-[var(--color-primary)] md:block">
          24h
        </div>
        <div className="absolute bottom-8 right-28 hidden rounded-full bg-[var(--color-white)] px-5 py-3 text-sm font-bold text-[var(--color-primary)] lg:block">
          Smile consult
        </div>
        <div className="relative max-w-4xl">
          <h2 className="font-heading text-4xl font-bold leading-tight md:text-6xl">{finalCta?.heading || "Book your visit"}</h2>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-white/75">{finalCta?.description || ""}</p>
          <form onSubmit={handleSubmit(onSubmit)} className="mt-8 grid gap-3 rounded-[1.5rem] bg-[var(--color-white)] p-3 sm:grid-cols-[1fr_1fr_auto]">
            <label className="sr-only" htmlFor="booking-name">{finalCta?.form?.nameLabel || "Name"}</label>
            <input
              id="booking-name"
              className="focus-ring min-h-14 rounded-full bg-[var(--color-surface)] px-5 text-[var(--color-primary)]"
              placeholder={finalCta?.form?.nameLabel || "Name"}
              {...register("name", { required: true })}
            />
            <label className="sr-only" htmlFor="booking-phone">{finalCta?.form?.phoneLabel || "Phone"}</label>
            <input
              id="booking-phone"
              className="focus-ring min-h-14 rounded-full bg-[var(--color-surface)] px-5 text-[var(--color-primary)]"
              placeholder={finalCta?.form?.phoneLabel || "Phone"}
              {...register("phone", { required: true })}
            />
            <button type="submit" disabled={formState.isSubmitting} className="focus-ring min-h-14 rounded-full bg-[var(--color-primary)] px-6 font-bold text-[var(--color-white)] disabled:opacity-70">
              {formState.isSubmitting ? "Sending..." : finalCta?.form?.submitLabel || "Book"}
            </button>
          </form>
          {status ? <p className="mt-4 text-sm text-white/75" role="status">{status}</p> : null}
        </div>
      </div>
    </section>
  );
}
