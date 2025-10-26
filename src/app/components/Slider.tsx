export default function Slider({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
}) {
  return (
    <div className="flex flex-col">
      <span className="text-sm text-[#bfe8ffcc] mb-2">{label}</span>
      <input
        type="range"
        min={0}
        max={100}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full accent-[#25b6f8] cursor-pointer"
      />
      <div className="text-xs text-[#8bc9ff99] mt-1">{value}%</div>
    </div>
  );
}
