import React, { useState, useEffect } from 'react';

interface ChartData {
  date: string;
  stars: number;
  completedTasks: number;
  totalTasks: number;
}

interface DailyRecord {
  date: string;
  tasks: { id: string; completed: boolean; }[];
  totalStars: number;
}

interface WeeklyChartProps {
  chartData: ChartData[];
  maxStars: number;
  dailyRecords: DailyRecord[];
}

export const WeeklyChart: React.FC<WeeklyChartProps> = ({ chartData, maxStars, dailyRecords }) => {
  const [sliderPosition, setSliderPosition] = useState(0); // 滑块位置 (0-100)
  const [isDragging, setIsDragging] = useState(false);
  const [weekIndex, setWeekIndex] = useState(0); // 当前周索引 (0=本周, 1=上周, 2=两周前, 3=三周前)
  
  // 生成按周分组的历史数据（最近4周）
  const generateWeeklyData = () => {
    const weeksData: ChartData[][] = [];
    const today = new Date();
    
    // 生成4周的数据
    for (let week = 0; week < 4; week++) {
      const weekData: ChartData[] = [];
      for (let day = 0; day < 7; day++) {
        const date = new Date(today);
        date.setDate(today.getDate() - (week * 7 + (6 - day)));
        const dateStr = date.toISOString().split('T')[0];
        
        // 从dailyRecords中查找对应日期的数据
        const record = dailyRecords.find(r => r.date === dateStr);
        
        if (record) {
          weekData.push({
            date: date.toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' }),
            stars: record.totalStars,
            completedTasks: record.tasks.filter(t => t.completed).length,
            totalTasks: record.tasks.length
          });
        } else {
          weekData.push({
            date: date.toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' }),
            stars: 0,
            completedTasks: 0,
            totalTasks: 0
          });
        }
      }
      weeksData.push(weekData);
    }
    
    return weeksData;
  };
  
  const weeksData = generateWeeklyData();
  const visibleDaysData = weeksData[weekIndex] || chartData;
  
  // 计算当前显示数据的最大星星数
  const currentMaxStars = Math.max(...visibleDaysData.map(d => d.stars), 10);
  
  // 磁吸到周位置
  const snapToWeekPosition = (position: number) => {
    const weekPositions = [0, 33.33, 66.67, 100]; // 4个周位置
    const closest = weekPositions.reduce((prev, curr) => 
      Math.abs(curr - position) < Math.abs(prev - position) ? curr : prev
    );
    const newWeekIndex = weekPositions.indexOf(closest);
    setWeekIndex(newWeekIndex);
    setSliderPosition(closest);
  };
  
  // 处理滑块拖动
  const handleSliderMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDragging) return;
    
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const position = ((clientX - rect.left) / rect.width) * 100;
    setSliderPosition(Math.max(0, Math.min(100, position)));
  };
  
  const handleSliderStart = (e: React.MouseEvent | React.TouchEvent) => {
    setIsDragging(true);
    handleSliderMove(e);
  };
  
  const handleSliderEnd = () => {
    setIsDragging(false);
    snapToWeekPosition(sliderPosition);
  };
  
  
  // 添加全局事件监听器
  useEffect(() => {
    if (isDragging) {
      const handleMouseMove = (e: MouseEvent) => {
        const sliderElement = document.querySelector('.slider-container');
        if (sliderElement) {
          const rect = sliderElement.getBoundingClientRect();
          const position = ((e.clientX - rect.left) / rect.width) * 100;
          setSliderPosition(Math.max(0, Math.min(100, position)));
        }
      };
      
      const handleMouseUp = () => {
        setIsDragging(false);
        snapToWeekPosition(sliderPosition);
      };
      
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.addEventListener('touchmove', handleMouseMove as any);
      document.addEventListener('touchend', handleMouseUp);
      
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
        document.removeEventListener('touchmove', handleMouseMove as any);
        document.removeEventListener('touchend', handleMouseUp);
      };
    }
  }, [isDragging, sliderPosition]);
  
  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-piggy-blue">表现趋势</h2>
      </div>
      
      <div className="space-y-6">
        {/* 星星趋势图 */}
        <div>
          <h3 className="text-lg font-semibold text-gray-700 mb-3 flex items-center gap-2">
            <span>⭐</span>
            星星获得趋势
          </h3>
          <div className="relative">
            <div className="flex items-end justify-between gap-2 h-32 bg-gradient-to-t from-yellow-50 to-transparent rounded-lg p-3">
              {visibleDaysData.map((day, index) => (
                <div key={index} className="flex flex-col items-center flex-1">
                  <div
                    className="bg-gradient-to-t from-yellow-400 to-yellow-300 rounded-t-lg transition-all hover:shadow-lg cursor-pointer w-full"
                    style={{
                      height: `${currentMaxStars > 0 ? (day.stars / currentMaxStars) * 100 : 0}%`,
                      minHeight: day.stars > 0 ? '8px' : '2px'
                    }}
                    title={`${day.date}: ${day.stars} 星星`}
                  />
                  <span className="text-xs text-gray-600 mt-2 font-medium">{day.date}</span>
                  <span className="text-xs text-yellow-600 font-bold">{day.stars}</span>
                </div>
              ))}
            </div>
            
            {/* 滑块控件 */}
            <div className="mt-4">
              <div 
                className="slider-container relative w-full h-8 cursor-pointer"
                onMouseDown={handleSliderStart}
                onTouchStart={handleSliderStart}
                onMouseMove={handleSliderMove}
                onTouchMove={handleSliderMove}
              >
                {/* 滑块轨道背景 */}
                <div className="absolute top-1/2 left-0 w-full h-3 bg-gray-300 rounded-full transform -translate-y-1/2 border border-gray-400"></div>
                
                {/* 滑块进度条 */}
                <div 
                  className="absolute top-1/2 left-0 h-3 bg-blue-500 rounded-full transform -translate-y-1/2 transition-all duration-300"
                  style={{ width: `${sliderPosition}%` }}
                ></div>
                
                {/* 周位置标记点 */}
                {[0, 33.33, 66.67, 100].map((position, index) => (
                  <div
                    key={index}
                    className="absolute top-1/2 w-1 h-1 bg-gray-500 rounded-full transform -translate-y-1/2 -translate-x-1/2"
                    style={{ left: `${position}%` }}
                  />
                ))}
                
                {/* 滑块按钮 */}
                <div 
                  className={`absolute top-1/2 w-6 h-6 bg-blue-600 rounded-full shadow-lg transform -translate-y-1/2 -translate-x-1/2 cursor-grab border-2 border-white ${isDragging ? 'cursor-grabbing scale-110' : ''} transition-all duration-200`}
                  style={{ left: `${sliderPosition}%` }}
                >
                  <div className="absolute inset-1 bg-blue-400 rounded-full"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 任务完成率 */}
        <div>
          <h3 className="text-lg font-semibold text-gray-700 mb-3 flex items-center gap-2">
            <span>📊</span>
            任务完成情况
          </h3>
          <div className="space-y-2">
            {visibleDaysData.map((day, index) => {
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