import { CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";

type ToastProps = {
  message: string;
};

export default function Toast({ message }: ToastProps) {
  return (
    <motion.div
      animate={{ opacity: 1, y: 0 }}
      className="fixed bottom-5 right-5 z-50 flex items-center gap-3 rounded-lg border border-emerald-300/25 bg-slate-950/90 px-4 py-3 text-sm font-semibold text-emerald-100 shadow-2xl backdrop-blur-xl"
      initial={{ opacity: 0, y: 16 }}
      exit={{ opacity: 0, y: 16 }}
    >
      <CheckCircle2 size={18} />
      {message}
    </motion.div>
  );
}
