export default function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-[#1aa8e255] bg-[#0b1730]/50 p-4 md:p-5 shadow-[inset_0_0_12px_rgba(0,200,255,0.06)]">
      <h2 className="text-lg md:text-xl font-title text-[#9edfff] font-bold mb-3 tracking-wide">
        {title}
      </h2>
      {children}
    </div>
  );
}