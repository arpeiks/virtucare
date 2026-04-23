export const Details = () => {
  return (
    <div className="relative bg-muted border-l border-border overflow-hidden flex-col p-14 hidden lg:flex">
      <svg aria-hidden width="100%" height="100%" className="absolute inset-0 opacity-50 pointer-events-none">
        <defs>
          <pattern id="lg-grid" width="32" height="32" patternUnits="userSpaceOnUse">
            <path d="M32 0H0V32" fill="none" stroke="var(--color-border)" strokeWidth="1" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#lg-grid)" />
      </svg>

      <div className="relative flex-1 flex flex-col justify-center max-w-[520px]">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-card border border-border text-xs text-muted-foreground self-start">
          <span className="w-1.5 h-1.5 rounded-full bg-success" />
          Telehealth appointments available today
        </div>

        <h2 className="font-serif font-normal text-[56px] leading-[1.02] tracking-[-0.8px] mt-5 mb-3.5 text-foreground">
          Care that fits
          <br />
          <em className="italic text-primary">around your day.</em>
        </h2>
        <p className="text-[15px] text-muted-foreground leading-relaxed max-w-[440px]">
          Book video visits with board-certified physicians in minutes. No phone calls, no waiting rooms — just your
          care team, when you need them.
        </p>

        <div className="mt-9 grid grid-cols-3 gap-3.5">
          {[
            { k: "24/7", v: "Same-day booking" },
            { k: "120+", v: "Specialists" },
            { k: "4.9", v: "Avg. rating" },
          ].map((s) => (
            <div key={s.k} className="p-4 bg-card border border-border rounded-xl">
              <div className="font-serif text-[28px] text-foreground leading-none">{s.k}</div>
              <div className="text-xs text-subtle-foreground mt-1.5">{s.v}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
