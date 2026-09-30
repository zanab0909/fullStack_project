const GlowLogo = ({ light = false }) => {
  return (
    <div className="flex items-center gap-3 select-none">
      <svg
        width="42"
        height="42"
        viewBox="0 0 42 42"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0"
      >
        <path
          d="M30.8 11.4C27.9 8.4 23.8 7 19.8 7.5C13 8.4 8 14.3 8 21.2C8 28.7 14 34.7 21.5 34.7C28.4 34.7 34.2 29.7 35.1 23"
          stroke={light ? "#F7F3E8" : "#8A724C"}
          strokeWidth="2.4"
          strokeLinecap="round"
        />
        <path
          d="M29.4 14.2C25.9 13.3 22.2 14.3 19.6 16.9C15.5 21 15.5 27.7 19.6 31.8"
          stroke={light ? "#DCC9A7" : "#B99668"}
          strokeWidth="2.4"
          strokeLinecap="round"
        />
        <path
          d="M25.2 20.8H34.5"
          stroke={light ? "#EDE2CC" : "#332A23"}
          strokeWidth="2.4"
          strokeLinecap="round"
        />
        <path
          d="M29.8 20.8V27.1"
          stroke={light ? "#EDE2CC" : "#332A23"}
          strokeWidth="2.4"
          strokeLinecap="round"
        />
      </svg>

      <div className="leading-none">
        <div
          className={`font-serif text-[25px] tracking-[0.18em] ${
            light ? "text-[#F7F3E8]" : "text-[#332A23]"
          }`}
        >
          GLOW
        </div>

        <div
          className={`mt-1 text-[8px] tracking-[0.32em] uppercase ${
            light ? "text-[#DCC9A7]" : "text-[#8A724C]"
          }`}
        >
          Beauty Studio
        </div>
      </div>
    </div>
  )
}

export default GlowLogo