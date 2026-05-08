export function CyberGridBackground() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 overflow-hidden">
      <div className="absolute inset-0 bg-background bg-mesh" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(103,232,249,.1),transparent_28%),radial-gradient(circle_at_bottom,rgba(52,211,153,.08),transparent_24%)]" />
      <div
        className="absolute inset-0 animate-pulsegrid opacity-20"
        style={{
          backgroundImage:
            "linear-gradient(rgba(148,163,184,.12) 1px, transparent 1px), linear-gradient(90deg, rgba(148,163,184,.12) 1px, transparent 1px)",
          backgroundSize: "72px 72px"
        }}
      />
      <div className="absolute left-[12%] top-[10%] h-72 w-72 animate-float rounded-full bg-cyan/10 blur-3xl" />
      <div className="absolute bottom-[8%] right-[8%] h-96 w-96 animate-float rounded-full bg-violet/10 blur-3xl [animation-delay:-4s]" />
      <div className="absolute left-1/2 top-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 animate-float rounded-full bg-emerald/10 blur-3xl [animation-delay:-8s]" />
      <div className="absolute inset-x-0 top-0 h-56 bg-[linear-gradient(180deg,rgba(7,11,20,.3),transparent)]" />
    </div>
  );
}
