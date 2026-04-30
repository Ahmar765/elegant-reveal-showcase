import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface ConsultationModalProps {
  open: boolean;
  context?: string | null;
  onClose: () => void;
}

export function ConsultationModal({ open, context, onClose }: ConsultationModalProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (open && context) setMessage(`I would like to learn more about: ${context}`);
  }, [open, context]);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) {
      toast.error("Please share your name and email so we may reach you.");
      return;
    }
    toast.success("Your request has been received.", {
      description: "An atelier director will write to you within one business day.",
    });
    setName("");
    setEmail("");
    setMessage("");
    onClose();
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[60] flex items-center justify-center p-6 bg-onyx/85 backdrop-blur-md"
          onClick={onClose}
        >
          <motion.div
            initial={{ y: 40, opacity: 0, scale: 0.97 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 40, opacity: 0, scale: 0.97 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-2xl glass-panel rounded-sm overflow-hidden p-12"
          >
            <div className="text-[10px] tracking-[0.35em] uppercase text-gold mb-4">Private consultation</div>
            <h3 className="font-serif text-4xl text-ivory mb-3">
              A moment with our <span className="italic text-gradient-gold">atelier</span>.
            </h3>
            <p className="text-ivory/60 font-light mb-8">
              Share a few details and we shall arrange a private conversation, in our Milano showroom or by video.
            </p>

            <form onSubmit={submit} className="space-y-5">
              <Field label="Full name">
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="luxury-input"
                  placeholder="Your name"
                />
              </Field>
              <Field label="Email">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="luxury-input"
                  placeholder="you@maison.com"
                />
              </Field>
              <Field label="Message">
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={3}
                  className="luxury-input resize-none"
                  placeholder="Tell us about the space, the piece, the vision…"
                />
              </Field>

              <div className="flex items-center justify-between gap-4 pt-4">
                <button type="button" onClick={onClose} className="text-[10px] tracking-[0.3em] uppercase text-ivory/60 hover:text-ivory transition-colors duration-500">
                  Cancel
                </button>
                <button type="submit" className="btn-gold">Request Appointment</button>
              </div>
            </form>

            <button
              onClick={onClose}
              className="absolute top-5 right-5 w-9 h-9 rounded-full border border-ivory/20 text-ivory/70 hover:text-gold hover:border-gold transition-colors duration-500"
              aria-label="Close"
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
