import { useEffect, useState } from "react";
import QRCode from "qrcode";

interface Props {
  token: string;
  elderNome: string;
  onFinish: () => void;
}

export default function StepConvite({ token, elderNome, onFinish }: Props) {
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null);
  const [waSent, setWaSent] = useState(false);

  const confirmUrl = `${window.location.origin}/confirmar/${token}`;

  useEffect(() => {
    QRCode.toDataURL(confirmUrl, { width: 220, margin: 1, color: { dark: "#163B33", light: "#FFFFFF" } })
      .then(setQrDataUrl)
      .catch(() => setQrDataUrl(null));
  }, [confirmUrl]);

  function sendWhatsApp() {
    const texto = encodeURIComponent(
      `Oi, ${elderNome}! Preparei o AmaVida pra você. Toque no link pra confirmar: ${confirmUrl}`,
    );
    window.open(`https://wa.me/?text=${texto}`, "_blank", "noopener,noreferrer");
    setWaSent(true);
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="mt-2 rounded-2xl border border-rio/15 bg-white p-6 text-center">
        {qrDataUrl ? (
          <img src={qrDataUrl} alt="QR code do convite" width={180} height={180} className="mx-auto rounded-xl" />
        ) : (
          <div className="mx-auto h-[180px] w-[180px] animate-pulse rounded-xl bg-paper-2" />
        )}
        <h3 className="mt-3 text-lg">Cartão de convite</h3>
        <p className="mt-1.5 text-sm text-[#4a564f]">
          Mostre o QR code ou envie o link para <strong>{elderNome}</strong> confirmar o cadastro.
        </p>
        <p className="mt-2 break-all rounded-lg bg-paper-2 px-3 py-2 text-xs text-[#5a6660]">{confirmUrl}</p>
        <button
          type="button"
          onClick={sendWhatsApp}
          className="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl bg-[#25D366] py-3.5 font-bold text-white"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2a10 10 0 0 0-8.6 15L2 22l5.2-1.4A10 10 0 1 0 12 2Zm5.4 14.2c-.2.6-1.3 1.2-1.8 1.3-.5.1-1 .1-1.7-.1-.4-.1-.9-.3-1.6-.6-2.8-1.2-4.6-4-4.7-4.2-.1-.2-1.1-1.5-1.1-2.8 0-1.3.7-2 1-2.2.3-.3.6-.3.8-.3h.6c.2 0 .4 0 .6.5.2.5.7 1.8.8 1.9.1.2.1.4 0 .6-.1.2-.2.3-.3.5-.2.2-.3.3-.5.5-.2.2-.4.4-.2.7.2.3.9 1.5 2 2.4 1.3 1.2 2.5 1.6 2.8 1.7.3.1.5.1.7-.1.2-.2.8-.9 1-1.2.2-.3.4-.2.7-.1.3.1 1.8.8 2.1.9.3.2.5.2.6.3.1.2.1.9-.1 1.5Z" />
          </svg>
          Enviar link por WhatsApp
        </button>
        <div className="mt-2.5 min-h-[18px] text-sm font-bold text-mata">
          {waSent ? "Abrimos o WhatsApp com o link pronto pra enviar." : " "}
        </div>
      </div>

      <button
        type="button"
        onClick={onFinish}
        className="w-full rounded-2xl bg-rio py-4 font-bold text-white transition-colors hover:bg-mata"
      >
        Concluir cadastro
      </button>
    </div>
  );
}
