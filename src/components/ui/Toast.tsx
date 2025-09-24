import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { CheckCircle, XCircle, AlertTriangle, Info, X } from "lucide-react";

interface ToastProps {
  message: string;
  type?: "success" | "error" | "warning" | "info";
  duration?: number;
  onClose: () => void;
  className?: string;
}

export function Toast({
  message,
  type = "info",
  onClose,
  className,
}: ToastProps) {
  const types = {
    success: "bg-green-600 text-white border-green-700 shadow-xl",
    error: "bg-red-600 text-white border-red-700 shadow-xl",
    warning: "bg-yellow-600 text-white border-yellow-700 shadow-xl",
    info: "bg-blue-600 text-white border-blue-700 shadow-xl",
  };

  const icons = {
    success: CheckCircle,
    error: XCircle,
    warning: AlertTriangle,
    info: Info,
  };

  const Icon = icons[type];

  return (
    <AnimatePresence>
      <motion.div
        className={cn(
          "flex items-center justify-between p-4 rounded-lg shadow-xl max-w-sm border",
          types[type],
          className
        )}
        initial={{ opacity: 0, y: 50, scale: 0.3 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.2 } }}
        transition={{ duration: 0.3, ease: "easeOut" }}
      >
        <div className='flex items-center space-x-3'>
          <Icon className='w-5 h-5 flex-shrink-0' />
          <span className='font-medium'>{message}</span>
        </div>
        <button
          onClick={onClose}
          className='ml-4 text-white/80 hover:text-white transition-colors flex-shrink-0'
        >
          <X className='w-4 h-4' />
        </button>
      </motion.div>
    </AnimatePresence>
  );
}
