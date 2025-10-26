export default function Toggle({
  label,
  checked,
  onChange,
  disabled,
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
  disabled?: boolean;
}) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className={`text-sm ${disabled ? "text-[#8aa9c099]" : "text-[#bfe8ffcc]"}`}>
        {label}
      </span>
      <label className="relative inline-flex items-center cursor-pointer">
        <input
          type="checkbox"
          className="sr-only peer"
          checked={checked}
          disabled={disabled}
          onChange={(e) => onChange(e.target.checked)}
        />
        <div
          className={`w-12 h-6 rounded-full transition
            ${disabled ? "bg-[#13314f] border border-[#10314f]" : "bg-[#0f2744] border border-[#1aa8e255]"}
            peer-checked:bg-[#0fd9c7] peer-checked:border-[#38ffe9]
            shadow-[inset_0_0_10px_rgba(0,200,255,0.12)]`}
        />
        <span
          className={`absolute left-1 top-1 w-4 h-4 rounded-full bg-[#a8d6ff]
            transition-transform peer-checked:translate-x-6
            shadow-[0_0_10px_rgba(80,200,255,0.45)]`}
        />
      </label>
    </div>
  );
}