interface Props {
  elderName: string;
  message: string;
  hora: string;
  /** Fundo escuro (usado no painel do cuidador) ou claro (usado em material de divulgação) */
  variant?: "dark" | "light";
}

export default function CheckinHighlight({ elderName, message, hora, variant = "light" }: Props) {
  const isDark = variant === "dark";

  return (
    <div
      className={`flex items-start gap-3.5 rounded-2xl border p-4 ${
        isDark ? "border-white/15 bg-white/[0.08]" : "border-rio/15 bg-paper-2"
      }`}
    >
      <span className="flex h-[42px] w-[42px] flex-shrink-0 items-center justify-center rounded-xl bg-mata text-white">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <path d="M20 6 9 17l-5-5" />
        </svg>
      </span>
      <div>
        <strong className={`block text-sm ${isDark ? "text-white" : "text-rio"}`}>{elderName}</strong>
        <p className={`mt-1 text-[0.88rem] leading-snug ${isDark ? "text-[#dce6e1]" : "text-[#3a4640]"}`}>
          {message}
        </p>
        <small className={`mt-1.5 block text-xs ${isDark ? "text-[#9fb8ac]" : "text-[#8a938c]"}`}>
          {hora} — via AmaVida
        </small>
        <span className="mt-2 block font-serif text-[0.85rem] italic text-mata">É alívio, não vigilância.</span>
      </div>
    </div>
  );
}
