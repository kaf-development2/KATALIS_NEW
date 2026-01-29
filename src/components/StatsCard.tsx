interface StatsCardProps {
  title: string;
  value: string;
  change: string;
  changeLabel: string;
  isPositive: boolean;
}

export default function StatsCard({ title, value, change, changeLabel, isPositive }: StatsCardProps) {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-sm font-medium text-gray-600 mb-2">{title}</h3>
      <div className="flex items-end justify-between">
        <div>
          <p className="text-3xl font-bold text-gray-900">{value}</p>
          <div className="flex items-center gap-2 mt-2">
            <span className={`text-sm font-medium ${isPositive ? "text-green-600" : "text-red-600"} flex items-center gap-1`}>
              {isPositive ? (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                </svg>
              ) : (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                </svg>
              )}
              {change}
            </span>
            <span className="text-sm text-gray-500">{changeLabel}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
