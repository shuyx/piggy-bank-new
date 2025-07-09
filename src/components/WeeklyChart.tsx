import React from 'react';

interface ChartData {
  date: string;
  stars: number;
  completedTasks: number;
  totalTasks: number;
}

interface WeeklyChartProps {
  chartData: ChartData[];
  maxStars: number;
}

export const WeeklyChart: React.FC<WeeklyChartProps> = ({ chartData, maxStars }) => {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow">
      <h2 className="text-2xl font-bold text-piggy-blue mb-6">本周表现</h2>
      
      <div className="space-y-6">
        {/* 星星趋势图 */}
        <div>
          <h3 className="text-lg font-semibold text-gray-700 mb-3 flex items-center gap-2">
            <span>⭐</span>
            星星获得趋势
          </h3>
          <div className="flex items-end justify-between gap-2 h-32 bg-gradient-to-t from-yellow-50 to-transparent rounded-lg p-3">
            {chartData.map((day, index) => (
              <div key={index} className="flex flex-col items-center flex-1">
                <div
                  className="bg-gradient-to-t from-yellow-400 to-yellow-300 rounded-t-lg transition-all hover:shadow-lg cursor-pointer w-full"
                  style={{
                    height: `${maxStars > 0 ? (day.stars / maxStars) * 100 : 0}%`,
                    minHeight: day.stars > 0 ? '8px' : '2px'
                  }}
                  title={`${day.date}: ${day.stars} 星星`}
                />
                <span className="text-xs text-gray-600 mt-2 font-medium">{day.date}</span>
                <span className="text-xs text-yellow-600 font-bold">{day.stars}</span>
              </div>
            ))}
          </div>
        </div>

        {/* 任务完成率 */}
        <div>
          <h3 className="text-lg font-semibold text-gray-700 mb-3 flex items-center gap-2">
            <span>📊</span>
            任务完成情况
          </h3>
          <div className="space-y-2">
            {chartData.map((day, index) => {
              const completionRate = day.totalTasks > 0 ? (day.completedTasks / day.totalTasks) * 100 : 0;
              return (
                <div key={index} className="flex items-center gap-3">
                  <span className="text-sm text-gray-600 w-16">{day.date}</span>
                  <div className="flex-1 bg-gray-200 rounded-full h-3 overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-piggy-blue to-blue-500 h-full rounded-full transition-all duration-300"
                      style={{ width: `${completionRate}%` }}
                    />
                  </div>
                  <span className="text-sm text-gray-700 w-20">
                    {day.completedTasks}/{day.totalTasks}
                  </span>
                  <span className="text-sm font-bold text-piggy-blue w-12">
                    {Math.round(completionRate)}%
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};