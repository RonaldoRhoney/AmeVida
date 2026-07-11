import { useState } from "react";

export default function MicButton() {
  const [listening, setListening] = useState(false);
  const [caption, setCaption] = useState(" ");

  function handleClick() {
    if (listening) return;
    setListening(true);
    setCaption("Ouvindo...");
    setTimeout(() => {
      setCaption("Prontinho, pode falar comigo assim a qualquer hora.");
      setListening(false);
    }, 1400);
  }

  return (
    <div className="mt-[18px]">
      <button
        type="button"
        onClick={handleClick}
        className={`relative flex w-full items-center gap-3.5 rounded-[20px] bg-mata px-[18px] py-5 font-bold text-white transition-colors active:bg-rio ${
          listening ? "animate-pulse" : ""
        }`}
      >
        <span className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full bg-white/20">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M12 19v3" />
            <path d="M8 22h8" />
            <rect x="9" y="2" width="6" height="11" rx="3" />
            <path d="M5 10a7 7 0 0 0 14 0" />
          </svg>
        </span>
        Toque e fale o que precisa
      </button>
      <div className="mt-2 min-h-[18px] text-sm font-bold text-mata">{caption}</div>
    </div>
  );
}
