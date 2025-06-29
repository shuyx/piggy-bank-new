import React, { useEffect, useState } from 'react';
import { useStore, initializeTodayTasks } from '../stores/useStore';

export const HomePage: React.FC = () => {
  const {
    totalStars,
    getTodayTasks,
    completeTask,
    getTodayProgress,
    getWeeklyStats,
    addCustomTask,
    achievements,
    generateDailyReport,
    dailyRecords,
    currentStreak
  } = useStore();

  const [showAddTask, setShowAddTask] = useState(false);
  const [taskName, setTaskName] = useState('');
  const [taskCategory, setTaskCategory] = useState<'study' | 'exercise' | 'behavior' | 'creativity'>('study');
  const [taskStars, setTaskStars] = useState(1);
  const [showReport, setShowReport] = useState(false);
  const [report, setReport] = useState('');

  const todayTasks = getTodayTasks();
  const todayProgress = getTodayProgress();
  const weeklyStats = getWeeklyStats();
  const unlockedCount = achievements.filter(a => a.unlocked).length;

  useEffect(() => {
    initializeTodayTasks();
  }, []);

  const handleCompleteTask = (taskId: string) => {
    completeTask(taskId);
    // 显示动画效果
    const button = document.getElementById(`task-${taskId}`);
    if (button) {
      button.classList.add('animate-bounce');
      setTimeout(() => {
        button.classList.remove('animate-bounce');
      }, 1000);
    }
  };

  const handleAddTask = () => {
    if (taskName.trim()) {
      addCustomTask(taskName, taskCategory, taskStars);
      setTaskName('');
      setTaskStars(1);
      setShowAddTask(false);
    }
  };

  const handleGenerateReport = () => {
    const newReport = generateDailyReport();
    setReport(newReport);
    setShowReport(true);
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'study': return 'bg-blue-100 text-blue-800';
      case 'exercise': return 'bg-green-100 text-green-800';
      case 'behavior': return 'bg-yellow-100 text-yellow-800';
      case 'creativity': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'study': return '📚';
      case 'exercise': return '🏃';
      case 'behavior': return '😊';
      case 'creativity': return '🎨';
      default: return '⭐';
    }
  };

  const categoryOptions = [
    { value: 'study', label: '📚 学习', color: 'bg-blue-100 text-blue-800' },
    { value: 'exercise', label: '🏃 运动', color: 'bg-green-100 text-green-800' },
    { value: 'behavior', label: '😊 行为', color: 'bg-yellow-100 text-yellow-800' },
    { value: 'creativity', label: '🎨 创造', color: 'bg-purple-100 text-purple-800' }
  ];

  // 获取最近7天的数据用于图表
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (6 - i));
    return date.toISOString().split('T')[0];
  });

  const chartData = last7Days.map(date => {
    const record = dailyRecords.find(r => r.date === date);
    return {
      date: new Date(date).toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' }),
      stars: record?.totalStars || 0
    };
  });

  const maxStars = Math.max(...chartData.map(d => d.stars), 10);

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-blue-50 to-yellow-50 p-4">
      <div className="max-w-6xl mx-auto">
        {/* 顶部标题栏 */}
        <header className="text-center py-8 mb-8">
          <h1 className="text-5xl font-bold text-piggy-pink mb-4 animate-pulse">
            🐷 猪猪银行 🐷
          </h1>
          <div className="flex justify-center items-center gap-6">
            <div className="bg-yellow-400 text-white px-8 py-4 rounded-full shadow-lg transform hover:scale-105 transition-transform">
              <span className="text-3xl font-bold">⭐ {totalStars}</span>
              <span className="block text-sm">总星星</span>
            </div>
            <div className="bg-piggy-blue text-white px-6 py-3 rounded-full shadow-lg">
              <span className="text-xl font-bold">📈 {weeklyStats.completionRate.toFixed(0)}%</span>
              <span className="block text-sm">周完成率</span>
            </div>
            <div className="bg-piggy-orange text-white px-6 py-3 rounded-full shadow-lg">
              <span className="text-xl font-bold">🔥 {currentStreak}</span>
              <span className="block text-sm">连续天数</span>
            </div>
          </div>
        </header>

        {/* 今日任务和任务管理器 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* 今日任务 */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-piggy-blue">今日任务</h2>
              <div className="text-sm text-gray-600">
                进度：{todayProgress.toFixed(0)}%
              </div>
            </div>
            
            {/* 进度条 */}
            <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
              <div
                className="bg-gradient-to-r from-piggy-green to-green-500 h-3 rounded-full transition-all duration-500"
                style={{ width: `${todayProgress}%` }}
              />
            </div>

            <div className="space-y-3">
              {todayTasks.map(task => (
                <div
                  key={task.id}
                  className={`flex items-center justify-between p-4 rounded-lg transition-all ${
                    task.completed
                      ? 'bg-green-50 opacity-75'
                      : 'bg-piggy-cream hover:bg-yellow-100'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{getCategoryIcon(task.category)}</span>
                    <div>
                      <span className={`font-medium ${task.completed ? 'line-through text-gray-500' : ''}`}>
                        {task.name}
                      </span>
                      <div className="flex items-center gap-2 mt-1">
                        <span className={`text-xs px-2 py-1 rounded-full ${getCategoryColor(task.category)}`}>
                          {task.category === 'study' ? '学习' :
                           task.category === 'exercise' ? '运动' :
                           task.category === 'behavior' ? '行为' : '创造'}
                        </span>
                        <span className="text-xs text-gray-500">
                          {task.stars} ⭐
                        </span>
                      </div>
                    </div>
                  </div>
                  <button
                    id={`task-${task.id}`}
                    onClick={() => handleCompleteTask(task.id)}
                    disabled={task.completed}
                    className={`px-4 py-2 rounded-lg font-medium transition-all ${
                      task.completed
                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        : 'bg-piggy-green text-white hover:bg-green-600 transform hover:scale-105'
                    }`}
                  >
                    {task.completed ? '已完成' : '完成'}
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* 任务管理器 */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-piggy-blue">任务管理</h2>
              <button
                onClick={() => setShowAddTask(!showAddTask)}
                className="bg-piggy-pink text-white px-4 py-2 rounded-lg hover:bg-pink-600 transition-colors"
              >
                + 添加任务
              </button>
            </div>

            {showAddTask && (
              <div className="mb-6 p-4 bg-piggy-cream rounded-lg">
                <div className="space-y-3">
                  <input
                    type="text"
                    placeholder="任务名称"
                    value={taskName}
                    onChange={(e) => setTaskName(e.target.value)}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:border-piggy-blue"
                  />
                  
                  <div className="flex gap-2">
                    {categoryOptions.map(option => (
                      <button
                        key={option.value}
                        onClick={() => setTaskCategory(option.value as any)}
                        className={`px-3 py-1 rounded-full text-sm font-medium transition-all ${
                          taskCategory === option.value
                            ? option.color
                            : 'bg-gray-100 text-gray-600'
                        }`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-gray-700">星星数：</span>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map(star => (
                        <button
                          key={star}
                          onClick={() => setTaskStars(star)}
                          className={`text-2xl ${star <= taskStars ? 'text-yellow-400' : 'text-gray-300'}`}
                        >
                          ⭐
                        </button>
                      ))}
                    </div>
                    <span className="text-piggy-orange font-bold">{taskStars}</span>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={handleAddTask}
                      className="flex-1 bg-piggy-green text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors"
                    >
                      确认添加
                    </button>
                    <button
                      onClick={() => {
                        setShowAddTask(false);
                        setTaskName('');
                      }}
                      className="flex-1 bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition-colors"
                    >
                      取消
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* 统计图表和每日报告 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* 统计图表 */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-piggy-blue">本周统计</h2>
              <span className="text-piggy-orange font-bold">
                🔥 连续 {currentStreak} 天
              </span>
            </div>
            
            <div className="h-48 flex items-end gap-2">
              {chartData.map((data, index) => (
                <div key={index} className="flex-1 flex flex-col items-center">
                  <div className="relative w-full">
                    <div
                      className="bg-gradient-to-t from-piggy-pink to-pink-300 rounded-t-lg transition-all duration-500 hover:opacity-80"
                      style={{
                        height: `${(data.stars / maxStars) * 160}px`,
                        minHeight: data.stars > 0 ? '20px' : '0px'
                      }}
                    >
                      {data.stars > 0 && (
                        <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-sm font-bold text-piggy-pink">
                          {data.stars}⭐
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="mt-2 text-xs text-gray-600">{data.date}</div>
                </div>
              ))}
            </div>
          </div>

          {/* 每日报告 */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-2xl font-bold text-piggy-blue mb-4">每日总结</h2>
            <button
              onClick={handleGenerateReport}
              className="w-full bg-gradient-to-r from-piggy-blue to-blue-500 text-white px-6 py-3 rounded-lg hover:opacity-90 transition-opacity"
            >
              生成今日报告 📊
            </button>
            
            {showReport && (
              <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                <pre className="whitespace-pre-wrap text-sm text-gray-700">{report}</pre>
                <button
                  onClick={() => setShowReport(false)}
                  className="mt-3 text-sm text-piggy-blue hover:underline"
                >
                  关闭
                </button>
              </div>
            )}
          </div>
        </div>

        {/* 成就系统 */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
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
                className={`text-center p-4 rounded-lg transition-all ${
                  achievement.unlocked
                    ? 'bg-yellow-100 scale-105 shadow-md'
                    : 'bg-gray-100 opacity-50'
                }`}
              >
                <div className="text-4xl mb-2">{achievement.icon}</div>
                <h3 className="font-bold text-sm">{achievement.name}</h3>
                <p className="text-xs text-gray-600 mt-1">{achievement.description}</p>
                {achievement.unlocked && achievement.unlockedDate && (
                  <p className="text-xs text-piggy-green mt-2">
                    ✅ {new Date(achievement.unlockedDate).toLocaleDateString()}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};