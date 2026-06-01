"use client";

import { CheckCircle2, Loader2 } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import type { ContactConfig, FinalCtaConfig, IntegrationsConfig, ServicesConfig } from "@/config/types";
import { useT } from "@/i18n/LocaleProvider";
import { safeArray } from "@/lib/utils";

interface BookingForm {
  name: string;
  phone: string;
  email: string;
  date: string;
  time: string;
  service: string;
  message: string;
  callback: boolean;
  privacy: boolean;
}

type SubmitState = "idle" | "success" | "error";

function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null;
  return (
    <p id={id} className="mt-2 text-sm font-semibold text-red-700">
      {message}
    </p>
  );
}

export function FinalCta({
  finalCta,
  integrations,
  contact,
  services
}: {
  finalCta: FinalCtaConfig;
  integrations: IntegrationsConfig;
  contact: ContactConfig;
  services: ServicesConfig;
}) {
  const [submitState, setSubmitState] = useState<SubmitState>("idle");
  const tr = useT();
  const form = finalCta?.form;
  const requiredError = tr(form?.requiredError) || tr({ de: "Bitte füllen Sie dieses Feld aus.", en: "Please complete this field." });
  const privacyError = tr(form?.privacyError) || tr({ de: "Bitte stimmen Sie der Datenschutzerklärung zu.", en: "Please accept the privacy policy." });
  const invalidEmailError = tr(form?.invalidEmailError) || tr({ de: "Bitte geben Sie eine gültige E-Mail-Adresse ein.", en: "Please enter a valid email address." });
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting }
  } = useForm<BookingForm>({
    defaultValues: {
      name: "",
      phone: "",
      email: "",
      date: "",
      time: "",
      service: "",
      message: "",
      callback: false,
      privacy: false
    }
  });

  async function onSubmit(values: BookingForm) {
    setSubmitState("idle");
    const endpoint = integrations?.formEndpoint?.trim();
    const payload = {
      ...values,
      submittedAt: new Date().toISOString()
    };

    try {
      if (endpoint) {
        const response = await fetch(endpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });
        if (!response.ok) throw new Error(`Form endpoint returned ${response.status}`);
      } else {
        const subject = encodeURIComponent(tr({ de: "Terminanfrage", en: "Appointment request" }));
        const body = encodeURIComponent(
          [
            `Name: ${values.name}`,
            `Phone: ${values.phone}`,
            `Email: ${values.email || "-"}`,
            `Preferred date: ${values.date || "-"}`,
            `Preferred time: ${values.time || "-"}`,
            `Service: ${values.service || "-"}`,
            `Callback: ${values.callback ? "yes" : "no"}`,
            `Message: ${values.message || "-"}`
          ].join("\n")
        );
        window.location.href = `mailto:${contact?.email || ""}?subject=${subject}&body=${body}`;
      }
      reset();
      setSubmitState("success");
    } catch {
      setSubmitState("error");
    }
  }

  const fieldClass =
    "focus-ring min-h-12 w-full rounded-2xl border border-transparent bg-[var(--color-surface)] px-4 text-base text-[var(--color-primary)] outline-none transition placeholder:text-[var(--color-text-muted)] focus:border-[var(--color-primary)]";
  const errorClass = "border-red-500 bg-red-50";

  return (
    <section id="book" className="container-page pb-16">
      <div className="overflow-hidden rounded-[2rem] bg-[var(--color-primary)] p-5 text-[var(--color-white)] sm:p-8 lg:p-12">
        <div className="grid gap-8 xl:grid-cols-[0.76fr_1.24fr] xl:items-start">
          <div className="min-w-0">
            <div className="mb-7 flex flex-wrap gap-3">
              {form?.badgePrimary ? <span className="rounded-[1.2rem] bg-[var(--color-accent)] px-5 py-3 font-heading text-lg font-bold text-[var(--color-primary)]">{tr(form.badgePrimary)}</span> : null}
              {form?.badgeSecondary ? <span className="rounded-full bg-[var(--color-white)] px-5 py-3 text-sm font-bold text-[var(--color-primary)]">{tr(form.badgeSecondary)}</span> : null}
            </div>
            <h2 className="font-heading text-[clamp(2.35rem,6vw,5.2rem)] font-bold leading-tight">{tr(finalCta?.heading) || "Book your visit"}</h2>
            <p className="mt-5 max-w-2xl text-base leading-7 text-white/78 md:text-lg md:leading-8">{tr(finalCta?.description)}</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} noValidate className="grid gap-4 rounded-[1.6rem] bg-[var(--color-white)] p-4 text-[var(--color-primary)] shadow-sm sm:p-5">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label htmlFor="booking-name" className="mb-2 block text-sm font-bold">
                  {tr(form?.nameLabel) || "Name"}
                </label>
                <input id="booking-name" className={`${fieldClass} ${errors.name ? errorClass : ""}`} aria-invalid={Boolean(errors.name)} aria-describedby={errors.name ? "booking-name-error" : undefined} {...register("name", { required: requiredError })} />
                <FieldError id="booking-name-error" message={errors.name?.message} />
              </div>

              <div>
                <label htmlFor="booking-phone" className="mb-2 block text-sm font-bold">
                  {tr(form?.phoneLabel) || "Phone"}
                </label>
                <input id="booking-phone" type="tel" className={`${fieldClass} ${errors.phone ? errorClass : ""}`} aria-invalid={Boolean(errors.phone)} aria-describedby={errors.phone ? "booking-phone-error" : undefined} {...register("phone", { required: requiredError })} />
                <FieldError id="booking-phone-error" message={errors.phone?.message} />
              </div>

              <div>
                <label htmlFor="booking-email" className="mb-2 block text-sm font-bold">
                  {tr(form?.emailLabel) || "Email"}
                </label>
                <input id="booking-email" type="email" className={`${fieldClass} ${errors.email ? errorClass : ""}`} aria-invalid={Boolean(errors.email)} aria-describedby={errors.email ? "booking-email-error" : undefined} {...register("email", { pattern: { value: /^\S+@\S+\.\S+$/, message: invalidEmailError } })} />
                <FieldError id="booking-email-error" message={errors.email?.message} />
              </div>

              <div>
                <label htmlFor="booking-service" className="mb-2 block text-sm font-bold">
                  {tr(form?.serviceLabel) || "Service"}
                </label>
                <select id="booking-service" className={fieldClass} {...register("service")}>
                  <option value="">{tr(form?.selectPlaceholder) || tr({ de: "Leistung auswählen", en: "Select a service" })}</option>
                  {safeArray(services?.items).map((service) => (
                    <option key={tr(service.title)} value={tr(service.title)}>
                      {tr(service.title)}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="booking-date" className="mb-2 block text-sm font-bold">
                  {tr(form?.dateLabel) || "Preferred date"}
                </label>
                <input id="booking-date" type="date" className={fieldClass} {...register("date")} />
              </div>

              <div>
                <label htmlFor="booking-time" className="mb-2 block text-sm font-bold">
                  {tr(form?.timeLabel) || "Preferred time"}
                </label>
                <input id="booking-time" type="time" className={fieldClass} {...register("time")} />
              </div>
            </div>

            <div>
              <label htmlFor="booking-message" className="mb-2 block text-sm font-bold">
                {tr(form?.messageLabel) || "Message"}
              </label>
              <textarea id="booking-message" rows={4} className={`${fieldClass} min-h-28 resize-y rounded-[1.4rem] py-3`} {...register("message")} />
            </div>

            <label className="flex min-h-12 min-w-0 items-start gap-3 rounded-[1.2rem] bg-[var(--color-surface)] px-4 py-3 text-sm font-semibold">
              <input type="checkbox" className="mt-0.5 size-5 shrink-0 accent-[var(--color-primary)]" aria-invalid={Boolean(errors.privacy)} aria-describedby={errors.privacy ? "booking-privacy-error" : undefined} {...register("privacy", { required: privacyError })} />
              <span>{tr(form?.privacyConsentLabel) || "I agree to the privacy policy."}</span>
            </label>
            <FieldError id="booking-privacy-error" message={errors.privacy?.message} />

            <label className="flex min-h-12 min-w-0 items-center gap-3 rounded-[1.2rem] bg-[var(--color-surface)] px-4 py-3 text-sm font-bold">
              <input type="checkbox" className="size-5 shrink-0 accent-[var(--color-primary)]" {...register("callback")} />
              <span>{tr(form?.callbackLabel) || "Request a callback"}</span>
            </label>

            <button type="submit" disabled={isSubmitting} className="focus-ring inline-flex min-h-14 items-center justify-center gap-2 rounded-full bg-[var(--color-primary)] px-7 font-bold text-[var(--color-white)] transition active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-70">
              {isSubmitting ? <Loader2 className="size-5 animate-spin" aria-hidden="true" /> : null}
              {isSubmitting ? tr(form?.loadingLabel) || tr({ de: "Wird gesendet...", en: "Sending..." }) : tr(form?.submitLabel) || "Book"}
            </button>

            {submitState === "success" ? (
              <p className="flex items-start gap-2 rounded-[1.2rem] bg-green-50 px-4 py-3 text-sm font-semibold text-green-800" role="status">
                <CheckCircle2 className="mt-0.5 size-4 shrink-0" />
                {tr(form?.successMessage) || tr({ de: "Danke, Ihre Anfrage wurde vorbereitet.", en: "Thank you, your request has been prepared." })}
              </p>
            ) : null}
            {submitState === "error" ? (
              <p className="rounded-[1.2rem] bg-red-50 px-4 py-3 text-sm font-semibold text-red-800" role="alert">
                {tr(form?.errorMessage) || tr({ de: "Leider konnte die Anfrage nicht gesendet werden. Bitte versuchen Sie es erneut.", en: "We could not send the request. Please try again." })}
              </p>
            ) : null}
          </form>
        </div>
      </div>
    </section>
  );
}
