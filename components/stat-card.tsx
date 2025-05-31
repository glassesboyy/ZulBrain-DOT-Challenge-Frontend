import { motion } from "framer-motion";
import type { ReactNode } from "react";

interface StatCardProps {
  icon: ReactNode;
  value: number;
  label: string;
  bgColor: string;
  textColor: string;
  borderColor: string;
}

export function StatCard({
  icon,
  value,
  label,
  bgColor,
  textColor,
  borderColor,
}: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex items-center p-4 rounded-lg border ${bgColor} ${borderColor}`}
    >
      <div className="shrink-0">{icon}</div>
      <div className="ml-4">
        <div className={`text-2xl font-bold ${textColor}`}>{value}</div>
        <div className={`text-sm ${textColor}/70`}>{label}</div>
      </div>
    </motion.div>
  );
}
