import React from 'react';
import { useStore } from '../stores/useStore';

interface TodayStatsProps {
  totalStars: number;
  todayProgress: any;
  currentStreak: number;
  unlockedCount: number;
}

export const TodayStats: React.FC<TodayStatsProps> = ({
  totalStars,
  todayProgress,
  currentStreak,
  unlockedCount
}) => {
  return (
    <div className="flex justify-center items-center gap-6 flex-wrap">
      <div className="bg-yellow-400 text-white px-8 py-4 rounded-full shadow-lg transform hover:scale-105 transition-transform cursor-pointer">
        <span className="text-3xl font-bold">⭐ {totalStars}</span>
        <span className="block text-sm">总星星</span>
      </div>
      
      <div className="bg-piggy-blue text-white px-6 py-3 rounded-full shadow-lg hover:shadow-xl transition-shadow">
        <span className="text-2xl font-bold">{todayProgress.percentage}%</span>
        <span className="block text-sm">今日完成</span>
      </div>
      
      <div className="bg-piggy-green text-white px-6 py-3 rounded-full shadow-lg hover:shadow-xl transition-shadow">
        <span className="text-2xl font-bold">{currentStreak}</span>
        <span className="block text-sm">连续天数</span>
      </div>
      
      <div className="bg-purple-500 text-white px-6 py-3 rounded-full shadow-lg hover:shadow-xl transition-shadow">
        <span className="text-2xl font-bold">{unlockedCount}</span>
        <span className="block text-sm">解锁成就</span>
      </div>
    </div>
  );
};