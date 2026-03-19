import { Phone } from "lucide-react";
import { SiWhatsapp } from "react-icons/si";
import type { CallType } from "../types/call";

interface Props {
  type: CallType;
  size?: number;
}

export function CallTypeIcon({ type, size = 16 }: Props) {
  if (type === "WhatsApp") {
    return <SiWhatsapp size={size} style={{ color: "oklch(0.55 0.18 145)" }} />;
  }
  return <Phone size={size} style={{ color: "oklch(0.52 0.22 264)" }} />;
}
