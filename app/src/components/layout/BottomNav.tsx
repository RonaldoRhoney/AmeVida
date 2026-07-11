import { NavLink } from "react-router-dom";

const NAV_ITEMS = [
  {
    to: "/app/inicio",
    label: "Início",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        <path d="M3 11l9-8 9 8" />
        <path d="M5 10v10h14V10" />
      </svg>
    ),
  },
  {
    to: "/app/remedios",
    label: "Remédios",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        <rect x="3" y="9" width="18" height="9" rx="2" />
        <path d="M3 9V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4v2" />
      </svg>
    ),
  },
  {
    to: "/app/saude",
    label: "Saúde",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        <path d="M3 21c0-4 4-6 9-6s9 2 9 6" />
        <circle cx="12" cy="8" r="4" />
      </svg>
    ),
  },
  {
    to: "/app/familia",
    label: "Família",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
  },
];

export default function BottomNav() {
  return (
    <nav className="flex border-t border-rio/15 bg-white px-1.5 pb-[calc(10px+env(safe-area-inset-bottom,0px))] pt-2.5">
      {NAV_ITEMS.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          className={({ isActive }) =>
            `flex flex-1 flex-col items-center gap-1 rounded-2xl px-1 py-2 text-xs font-bold transition-colors ${
              isActive ? "text-mata" : "text-[#8a938c]"
            }`
          }
        >
          {({ isActive }) => (
            <>
              <span className={`flex h-[34px] w-[34px] items-center justify-center rounded-[10px] ${isActive ? "bg-mata/10" : ""}`}>
                {item.icon}
              </span>
              {item.label}
            </>
          )}
        </NavLink>
      ))}
    </nav>
  );
}
