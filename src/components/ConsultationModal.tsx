import { motion, AnimatePresence } from "framer-motion";
import { useCallback, useEffect, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { ApiError, InquiryContext, siteApi } from "@/lib/site-api";

interface ConsultationModalProps {
  open: boolean;
  context: InquiryContext | null;
  onClose: () => void;
}

export function ConsultationModal({ open, context, onClose }: ConsultationModalProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [submitError, setSubmitError] = useState<string | null>(null);

  const inquiryMutation = useMutation({
    mutationFn: siteApi.submitInquiry,
    onSuccess: (response) => {
      toast.success(response.message);
      resetForm();
      onClose();
    },
    onError: (error) => {
      if (error instanceof ApiError) {
        setSubmitError(error.message);
        setFieldErrors({
          name: error.fieldErrors?.name?.[0] ?? "",
          email: error.fieldErrors?.email?.[0] ?? "",
          message: error.fieldErrors?.message?.[0] ?? "",
        });
        return;
      }

      setSubmitError("We could not send your request just now. Please try again.");
    },
  });

  const mutationReset = inquiryMutation.reset;
  const resetForm = useCallback(() => {
    setName("");
    setEmail("");
    setMessage("");
    setFieldErrors({});
    setSubmitError(null);
    mutationReset();
  }, [mutationReset]);

  useEffect(() => {
    if (!open) {
      setName("");
      setEmail("");
      setMessage("");
      setFieldErrors({});
      setSubmitError(null);
      mutationReset();
      return;
    }

    setFieldErrors({});
    setSubmitError(null);

    if (!context || context.source === "consultation") {
      setMessage("");
      return;
    }

    if (context.source === "product") {
      setMessage(`I would like to learn more about: ${context.productName}`);
      return;
    }

    setMessage(`I would like to reserve this composition: ${context.configSummary}`);
  }, [open, context, mutationReset]);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedName = name.trim();
    const trimmedEmail = email.trim();
    const trimmedMessage = message.trim();
    const nextErrors: Record<string, string> = {};

    if (!trimmedName) {
      nextErrors.name = "Please share your full name.";
    }

    if (!trimmedEmail) {
      nextErrors.email = "Please share your email so we may reach you.";
    }

    if (Object.keys(nextErrors).length > 0) {
      setFieldErrors(nextErrors);
      setSubmitError(null);
      return;
    }

    setFieldErrors({});
    setSubmitError(null);

    inquiryMutation.mutate({
      source: context?.source ?? "consultation",
      name: trimmedName,
      email: trimmedEmail,
      message: trimmedMessage,
      context: context?.context ?? null,
      productId: context?.source === "product" ? context.productId : null,
      productName: context?.source === "product" ? context.productName : null,
      configSummary: context?.source === "configurator" ? context.configSummary : null,
      configSelection: context?.source === "configurator" ? context.configSelection : null,
    });
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[60] flex items-center justify-center p-4 sm:p-6 bg-onyx/85 backdrop-blur-md overflow-y-auto"
          onClick={onClose}
        >
          <motion.div
            initial={{ y: 40, opacity: 0, scale: 0.97 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 40, opacity: 0, scale: 0.97 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-2xl glass-panel rounded-sm overflow-hidden p-6 sm:p-10 md:p-12 my-8"
          >
            <div className="text-[10px] tracking-[0.35em] uppercase text-gold mb-4">Private consultation</div>
            <h3 className="font-serif text-4xl text-ivory mb-3">
              A moment with our <span className="italic text-gradient-gold">atelier</span>.
            </h3>
            <p className="text-ivory/60 font-light mb-8">
              Share a few details and we shall arrange a private conversation, in our Milano showroom or by video.
            </p>

            <form onSubmit={submit} noValidate className="space-y-5">
              <Field label="Full name">
                <input
                  type="text"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    setFieldErrors((current) => ({ ...current, name: "" }));
                  }}
                  className="luxury-input"
                  placeholder="Your name"
                  disabled={inquiryMutation.isPending}
                />
                {fieldErrors.name ? <FieldError message={fieldErrors.name} /> : null}
              </Field>
              <Field label="Email">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setFieldErrors((current) => ({ ...current, email: "" }));
                  }}
                  className="luxury-input"
                  placeholder="you@maison.com"
                  disabled={inquiryMutation.isPending}
                />
                {fieldErrors.email ? <FieldError message={fieldErrors.email} /> : null}
              </Field>
              <Field label="Message">
                <textarea
                  value={message}
                  onChange={(e) => {
                    setMessage(e.target.value);
                    setFieldErrors((current) => ({ ...current, message: "" }));
                  }}
                  rows={3}
                  className="luxury-input resize-none"
                  placeholder="Tell us about the space, the piece, the vision…"
                  disabled={inquiryMutation.isPending}
                />
                {fieldErrors.message ? <FieldError message={fieldErrors.message} /> : null}
              </Field>

              {submitError ? (
                <p className="text-sm text-red-300/90 font-light">{submitError}</p>
              ) : null}

              <div className="flex items-center justify-between gap-4 pt-4">
                <button
                  type="button"
                  onClick={onClose}
                  disabled={inquiryMutation.isPending}
                  className="text-[10px] tracking-[0.3em] uppercase text-ivory/60 hover:text-ivory transition-colors duration-500 disabled:opacity-50"
                >
                  Cancel
                </button>
                <button type="submit" disabled={inquiryMutation.isPending} className="btn-gold disabled:opacity-70">
                  {inquiryMutation.isPending ? "Sending..." : "Request Appointment"}
                </button>
              </div>
            </form>

            <button
              onClick={onClose}
              className="absolute top-5 right-5 w-9 h-9 rounded-full border border-ivory/20 text-ivory/70 hover:text-gold hover:border-gold transition-colors duration-500 disabled:opacity-50"
              aria-label="Close"
              disabled={inquiryMutation.isPending}
            >
              ✕
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="block text-[10px] tracking-[0.3em] uppercase text-gold/70 mb-2">{label}</span>
      {children}
    </label>
  );
}

function FieldError({ message }: { message: string }) {
  return <span className="mt-2 block text-xs text-red-300/90">{message}</span>;
}
