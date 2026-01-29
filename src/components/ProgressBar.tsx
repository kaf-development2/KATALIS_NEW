interface ProgressBarProps {
  label: string;
  value: number;
  percentage: number;
}

export default function ProgressBar({ label, value, percentage }: ProgressBarProps) {
  return (
    <div className="mb-6 last:mb-0">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-gray-700">{label}</span>
        <span className="text-sm font-semibold text-gray-900">${value.toLocaleString()}.00</span>
      </div>
      <div className="flex items-center gap-3">
        <div className="flex-1 bg-gray-200 rounded-full h-2 overflow-hidden">
          <div 
            className="bg-primary-600 h-full rounded-full transition-all duration-500"
            style={{ width: `${percentage}%` }}
          />
        </div>
        <span className="text-sm font-medium text-gray-600 min-w-[3rem] text-right">{percentage}%</span>
      </div>
    </div>
  );
}
