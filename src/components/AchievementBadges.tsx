// 创建 src/components/AchievementBadges.tsx
import React from 'react';
import { Achievement } from '../stores/useStore';

interface AchievementBadgesProps {
  achievements: Achievement[];
  unlockedCount: number;
}

export const AchievementBadges: React.FC<AchievementBadgesProps> = ({
  achievements,
  unlockedCount
}) => {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-piggy-blue">成就徽章</h2>
        <span className="text-piggy-orange font-bold">
          {unlockedCount}/{achievements.length} 已解锁
        </span>
      </div>
      
      <div className="grid grid-cols-3 gap-4">
        {achievements.map(achievement => (
          <div
            key={achievement.id}
            className={`text-center p-4 rounded-lg transition-all duration-300 hover:scale-105 ${
              achievement.unlocked
                ? 'bg-yellow-100 scale-105 shadow-md border-2 border-yellow-300'
                : 'bg-gray-100 opacity-50 hover:opacity-75'
            }`}
          >
            <div className={`text-4xl mb-2 ${achievement.unlocked ? 'animate-pulse' : ''}`}>
              {achievement.icon}
            </div>
            <h3 className="font-bold text-sm mb-1">{achievement.name}</h3>
            <p className="text-xs text-gray-600 mb-2">{achievement.description}</p>
            {achievement.unlocked && achievement.unlockedDate && (
              <p className="text-xs text-piggy-green font-medium">
                ✅ {new Date(achievement.unlockedDate).toLocaleDateString('zh-CN')}
              </p>
            )}
            {!achievement.unlocked && (
              <p className="text-xs text-gray-400">🔒 未解锁</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};