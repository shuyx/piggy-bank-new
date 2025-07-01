import React, { useState, useEffect, useCallback } from 'react';
import { useStore } from '../stores/useStore';
import { TodayStats } from '../components/TodayStats';
import { TodayTasks } from '../components/TodayTasks';
import { WeeklyChart } from '../components/WeeklyChart';
import { CelebrationAnimation } from '../components/CelebrationAnimation';
import { TaskManager } from '../components/TaskManager';
import { DailyReport } from '../components/DailyReport';
import { InstallPrompt } from '../components/InstallPrompt';

export const HomePage: React.FC = () => {
  const {
    totalStars,
    getTodayTasks,
    completeTask,
    uncompleteTask,
    deleteTask,
    getTodayProgress,
    getWeeklyStats,
    achievements,
    dailyRecords,
    currentStreak
  } = useStore();

  const [celebrationVisible, setCelebrationVisible] = useState(false);

  const todayTasks = getTodayTasks();
  const todayProgress = getTodayProgress();
  const weeklyStats = getWeeklyStats();
  const unlockedCount = achievements.filter(a => a.unlocked).length;

  // 任务操作处理函数
  const handleCompleteTask = useCallback((taskId: string) => {
    console.log('完成任务:', taskId);
    
    try {
      completeTask(taskId);
      
      // 显示庆祝动画
      setCelebrationVisible(true);
      setTimeout(() => setCelebrationVisible(false), 2000);
      
    } catch (error) {
      console.error('完成任务时出错:', error);
    }
  }, [completeTask]);

  const handleUncompleteTask = useCallback((taskId: string) => {
    console.log('恢复任务:', taskId);
    
    try {
      uncompleteTask(taskId);
    } catch (error) {
      console.error('恢复任务时出错:', error);
    }
  }, [uncompleteTask]);

  const handleDeleteTask = useCallback((taskId: string, taskName: string) => {
    if (window.confirm(`确定要删除任务"${taskName}"吗？`)) {
      console.log('删除任务:', taskId);
      
      try {
        deleteTask(taskId);
      } catch (error) {
        console.error('删除任务时出错:', error);
      }
    }
  }, [deleteTask]);

  // 准备图表数据
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (6 - i));
    return date.toISOString().split('T')[0];
  });

  const chartData = last7Days.map(date => {
    const record = dailyRecords.find(r => r.date === date);
    return {
      date: new Date(date).toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' }),
      stars: record?.totalStars || 0,
      completedTasks: record?.tasks.filter(t => t.completed).length || 0,
      totalTasks: record?.tasks.length || 0
    };
  });

  const maxStars = Math.max(...chartData.map(d => d.stars), 10);

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-blue-50 to-yellow-50 p-4 relative">
      {/* 庆祝动画 */}
      <CelebrationAnimation visible={celebrationVisible} />

      <div className="max-w-6xl mx-auto">
        {/* 顶部标题栏 */}
        <header className="text-center py-8 mb-8">
          <h1 className="text-5xl font-bold text-piggy-pink mb-4 animate-pulse">
            🐷 猪猪银行 🐷
          </h1>
          <TodayStats 
            totalStars={totalStars}
            todayProgress={todayProgress}
            currentStreak={currentStreak}
            unlockedCount={unlockedCount}
          />
        </header>

        {/* 主要内容区域 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* 今日任务 */}
          <TodayTasks
            tasks={todayTasks}
            onCompleteTask={handleCompleteTask}
            onUncompleteTask={handleUncompleteTask}
            onDeleteTask={handleDeleteTask}
          />

          {/* 任务管理器 */}
          <TaskManager />

          {/* 周数据图表 */}
          <WeeklyChart 
            chartData={chartData}
            maxStars={maxStars}
          />

          {/* 每日报告 */}
          <DailyReport />
        </div>

        {/* 安装提示 */}
        <InstallPrompt />
      </div>
    </div>
  );
};