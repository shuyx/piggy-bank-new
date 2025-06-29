import React, { useEffect, useState, useCallback } from 'react';
import { useStore, initializeTodayTasks } from '../stores/useStore';

export const HomePage: React.FC = () => {
  const {
    totalStars,
    getTodayTasks,
    completeTask,
    uncompleteTask,
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
  const [isGenerating, setIsGenerating] = useState(false);
  const [celebrationVisible, setCelebrationVisible] = useState(false);

  const todayTasks = getTodayTasks();
  const todayProgress = getTodayProgress();
  const weeklyStats = getWeeklyStats();
  const unlockedCount = achievements.filter(a => a.unlocked).length;

  useEffect(() => {
    initializeTodayTasks();
  }, []);

  // 使用 useCallback 确保每个任务有独立的处理函数
  const handleCompleteTask = useCallback((taskId: string) => {
    console.log('完成任务:', taskId); // 调试日志
    
    try {
      completeTask(taskId);
      
      // 显示庆祝动画
      setCelebrationVisible(true);
      setTimeout(() => setCelebrationVisible(false), 2000);
      
      // 任务完成动画效果
      const button = document.getElementById(`complete-btn-${taskId}`);
      if (button) {
        button.classList.add('animate-bounce');
        setTimeout(() => {
          button.classList.remove('animate-bounce');
        }, 1000);
      }
    } catch (error) {
      console.error('完成任务时出错:', error);
    }
  }, [completeTask]);

  // 使用 useCallback 确保每个任务有独立的恢复函数
  const handleUncompleteTask = useCallback((taskId: string) => {
    console.log('恢复任务:', taskId); // 调试日志
    
    try {
      uncompleteTask(taskId);
      
      // 恢复动画效果
      const button = document.getElementById(`restore-btn-${taskId}`);
      if (button) {
        button.classList.add('animate-pulse');
        setTimeout(() => {
          button.classList.remove('animate-pulse');
        }, 1000);
      }
    } catch (error) {
      console.error('恢复任务时出错:', error);
    }
  }, [uncompleteTask]);

  const handleAddTask = () => {
    if (taskName.trim()) {
      addCustomTask(taskName, taskCategory, taskStars);
      setTaskName('');
      setTaskStars(1);
      setShowAddTask(false);
    }
  };

  const handleGenerateReport = async () => {
    setIsGenerating(true);
    
    setTimeout(() => {
      const newReport = generateDailyReport();
      setReport(newReport);
      setShowReport(true);
      setIsGenerating(false);
    }, 800);
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'study': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'exercise': return 'bg-green-100 text-green-800 border-green-200';
      case 'behavior': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'creativity': return 'bg-purple-100 text-purple-800 border-purple-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
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
      stars: record?.totalStars || 0,
      completedTasks: record?.tasks.filter(t => t.completed).length || 0,
      totalTasks: record?.tasks.length || 0
    };
  });

  const maxStars = Math.max(...chartData.map(d => d.stars), 10);

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-blue-50 to-yellow-50 p-4 relative">
      {/* 庆祝动画 */}
      {celebrationVisible && (
        <div className="fixed inset-0 pointer-events-none z-50 flex items-center justify-center">
          <div className="text-6xl animate-bounce">🎉</div>
        </div>
      )}

      <div className="max-w-6xl mx-auto">
        {/* 顶部标题栏 */}
        <header className="text-center py-8 mb-8">
          <h1 className="text-5xl font-bold text-piggy-pink mb-4 animate-pulse">
            🐷 猪猪银行 🐷
          </h1>
          <div className="flex justify-center items-center gap-6 flex-wrap">
            <div className="bg-yellow-400 text-white px-8 py-4 rounded-full shadow-lg transform hover:scale-105 transition-transform cursor-pointer">
              <span className="text-3xl font-bold">⭐ {totalStars}</span>
              <span className="block text-sm">总星星</span>
            </div>
            <div className="bg-piggy-blue text-white px-6 py-3 rounded-full shadow-lg hover:shadow-xl transition-shadow">
              <span className="text-xl font-bold">📈 {weeklyStats.completionRate.toFixed(0)}%</span>
              <span className="block text-sm">周完成率</span>
            </div>
            <div className="bg-piggy-orange text-white px-6 py-3 rounded-full shadow-lg hover:shadow-xl transition-shadow">
              <span className="text-xl font-bold">🔥 {currentStreak}</span>
              <span className="block text-sm">连续天数</span>
            </div>
          </div>
        </header>

        {/* 今日任务和任务管理器 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* 今日任务 */}
          <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-piggy-blue">今日任务</h2>
              <div className="text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
                进度：{todayProgress.toFixed(0)}%
              </div>
            </div>
            
            {/* 进度条 */}
            <div className="w-full bg-gray-200 rounded-full h-4 mb-6 overflow-hidden">
              <div
                className="bg-gradient-to-r from-piggy-green to-green-500 h-4 rounded-full transition-all duration-1000 relative"
                style={{ width: `${todayProgress}%` }}
              >
                {todayProgress > 0 && (
                  <div className="absolute right-2 top-0 h-full flex items-center">
                    <span className="text-white text-xs font-bold">
                      {todayProgress.toFixed(0)}%
                    </span>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-3 max-h-96 overflow-y-auto custom-scrollbar">
              {todayTasks.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <div className="text-4xl mb-2">📝</div>
                  <div>还没有任务，点击右侧添加任务开始吧！</div>
                </div>
              ) : (
                todayTasks.map((task, index) => {
                  // 确保每个任务有唯一的标识
                  const uniqueTaskKey = `${task.id}-${task.date}-${index}`;
                  
                  return (
                    <div
                      key={uniqueTaskKey}
                      className={`flex items-center justify-between p-4 rounded-lg transition-all duration-300 hover:scale-102 ${
                        task.completed
                          ? 'bg-green-50 opacity-75 border-2 border-green-200'
                          : 'bg-piggy-cream hover:bg-yellow-100 border-2 border-transparent hover:border-yellow-200'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className={`text-2xl ${task.completed ? 'grayscale' : ''}`}>
                          {getCategoryIcon(task.category)}
                        </span>
                        <div>
                          <span className={`font-medium ${task.completed ? 'line-through text-gray-500' : 'text-gray-800'}`}>
                            {task.name}
                          </span>
                          <div className="flex items-center gap-2 mt-1">
                            <span className={`text-xs px-2 py-1 rounded-full border ${getCategoryColor(task.category)}`}>
                              {task.category === 'study' ? '学习' :
                               task.category === 'exercise' ? '运动' :
                               task.category === 'behavior' ? '行为' : '创造'}
                            </span>
                            <span className="text-xs text-gray-500 flex items-center gap-1">
                              <span>⭐</span>
                              <span>{task.stars}</span>
                            </span>
                            {/* 调试信息 */}
                            <span className="text-xs text-gray-400">
                              ID: {task.id.slice(-4)}
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      {/* 修改按钮部分 - 确保每个任务独立操作 */}
                      <div className="flex gap-2">
                        {task.completed ? (
                          <>
                            <button
                              id={`restore-btn-${task.id}`}
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                console.log('点击恢复按钮，任务ID:', task.id);
                                handleUncompleteTask(task.id);
                              }}
                              className="px-3 py-2 rounded-lg font-medium transition-all transform bg-orange-500 text-white hover:bg-orange-600 hover:scale-105 active:scale-95"
                              title="点错了？恢复任务"
                              type="button"
                            >
                              🔄 恢复
                            </button>
                            <div className="px-4 py-2 rounded-lg font-medium bg-gray-300 text-gray-500">
                              ✅ 已完成
                            </div>
                          </>
                        ) : (
                          <button
                            id={`complete-btn-${task.id}`}
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              console.log('点击完成按钮，任务ID:', task.id);
                              handleCompleteTask(task.id);
                            }}
                            className="px-4 py-2 rounded-lg font-medium transition-all transform bg-piggy-green text-white hover:bg-green-600 hover:scale-105 active:scale-95"
                            type="button"
                          >
                            完成
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* 任务管理器 */}
          <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-piggy-blue">任务管理</h2>
              <button
                onClick={() => setShowAddTask(!showAddTask)}
                className="bg-piggy-pink text-white px-4 py-2 rounded-lg hover:bg-pink-600 transition-colors transform hover:scale-105"
              >
                + 添加任务
              </button>
            </div>

            {showAddTask && (
              <div className="mb-6 p-4 bg-piggy-cream rounded-lg animate-fadeIn">
                <div className="space-y-3">
                  <input
                    type="text"
                    placeholder="任务名称"
                    value={taskName}
                    onChange={(e) => setTaskName(e.target.value)}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:border-piggy-blue focus:ring-2 focus:ring-piggy-blue focus:ring-opacity-20"
                  />
                  
                  <div className="flex gap-2 flex-wrap">
                    {categoryOptions.map(option => (
                      <button
                        key={option.value}
                        onClick={() => setTaskCategory(option.value as any)}
                        className={`px-3 py-1 rounded-full text-sm font-medium transition-all transform hover:scale-105 ${
                          taskCategory === option.value
                            ? option.color
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-gray-700 font-medium">星星数：</span>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map(star => (
                        <button
                          key={star}
                          onClick={() => setTaskStars(star)}
                          className={`text-2xl transition-all hover:scale-110 ${
                            star <= taskStars ? 'text-yellow-400' : 'text-gray-300'
                          }`}
                        >
                          ⭐
                        </button>
                      ))}
                    </div>
                    <span className="text-piggy-orange font-bold text-lg">{taskStars}</span>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={handleAddTask}
                      disabled={!taskName.trim()}
                      className="flex-1 bg-piggy-green text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
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

            {!showAddTask && (
              <div className="text-center text-gray-500 py-8">
                <div className="text-4xl mb-2">✨</div>
                <div>点击"添加任务"创建自定义任务</div>
              </div>
            )}
          </div>
        </div>

        {/* 统计图表和每日报告 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* 统计图表 */}
          <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-piggy-blue">本周统计</h2>
              <div className="text-right">
                <div className="text-piggy-orange font-bold text-lg">
                  🔥 连续 {currentStreak} 天
                </div>
                <div className="text-sm text-gray-500">坚持就是胜利</div>
              </div>
            </div>
            
            <div className="h-48 flex items-end gap-2 bg-gradient-to-t from-blue-50 to-transparent rounded-lg p-4">
              {chartData.map((data, index) => (
                <div key={index} className="flex-1 flex flex-col items-center">
                  <div className="relative w-full">
                    <div
                      className="bg-gradient-to-t from-piggy-pink to-pink-300 rounded-t-lg transition-all duration-700 hover:opacity-80 cursor-pointer"
                      style={{
                        height: `${(data.stars / maxStars) * 140}px`,
                        minHeight: data.stars > 0 ? '20px' : '0px'
                      }}
                      title={`${data.date}: ${data.stars}⭐ (${data.completedTasks}/${data.totalTasks}任务)`}
                    >
                      {data.stars > 0 && (
                        <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 text-sm font-bold text-piggy-pink bg-white rounded-full px-2 py-1 shadow-md">
                          {data.stars}⭐
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="mt-3 text-xs text-gray-600 font-medium">{data.date}</div>
                  {data.totalTasks > 0 && (
                    <div className="text-xs text-gray-400 mt-1">
                      {data.completedTasks}/{data.totalTasks}
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="mt-4 flex justify-between text-xs text-gray-500">
              <span>📊 每日星星统计</span>
              <span>最近7天趋势</span>
            </div>
          </div>

          {/* 每日报告 */}
          <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-piggy-blue">每日总结</h2>
              <div className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                📅 {new Date().toLocaleDateString('zh-CN')}
              </div>
            </div>

            <button
              onClick={handleGenerateReport}
              disabled={isGenerating}
              className={`w-full bg-gradient-to-r from-piggy-blue to-blue-500 text-white px-6 py-3 rounded-lg font-medium transition-all transform hover:scale-105 ${
                isGenerating ? 'opacity-75 cursor-not-allowed' : 'hover:shadow-lg'
              }`}
            >
              {isGenerating ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                  正在生成报告...
                </div>
              ) : (
                '📊 生成今日报告'
              )}
            </button>
            
            {showReport && (
              <div className="mt-4 animate-fadeIn">
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-4 border border-blue-200">
                  <pre className="whitespace-pre-wrap text-sm text-gray-700 font-medium leading-relaxed">
                    {report}
                  </pre>
                </div>
                
                <div className="flex gap-2 mt-3">
                  <button
                    onClick={() => {
                      if (navigator.share) {
                        navigator.share({
                          title: '猪猪银行 - 今日报告',
                          text: report,
                        });
                      } else {
                        navigator.clipboard.writeText(report).then(() => {
                          alert('报告已复制到剪贴板！');
                        });
                      }
                    }}
                    className="flex-1 bg-piggy-green text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors text-sm transform hover:scale-105"
                  >
                    📤 分享报告
                  </button>
                  <button
                    onClick={() => setShowReport(false)}
                    className="px-4 py-2 text-piggy-blue hover:bg-blue-50 rounded-lg transition-colors text-sm"
                  >
                    ✕ 关闭
                  </button>
                </div>
              </div>
            )}

            {!showReport && (
              <div className="mt-4 text-center text-gray-400 text-sm">
                <div className="mb-2 text-2xl">📈</div>
                <div>生成报告查看今日表现详情</div>
              </div>
            )}
          </div>
        </div>

        {/* 成就系统 */}
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
      </div>
    </div>
  );
};