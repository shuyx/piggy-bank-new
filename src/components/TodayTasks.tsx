import React from 'react';
import { Task } from '../stores/useStore';

interface TodayTasksProps {
  tasks: Task[];
  onCompleteTask: (taskId: string) => void;
  onUncompleteTask: (taskId: string) => void;
  onDeleteTask: (taskId: string, taskName: string) => void;
}

export const TodayTasks: React.FC<TodayTasksProps> = ({
  tasks,
  onCompleteTask,
  onUncompleteTask,
  onDeleteTask
}) => {
  // 计算今日累计星星数（只统计已完成的任务）
  const todayTotalStars = tasks
    .filter(task => task.completed)
    .reduce((total, task) => total + task.stars, 0);
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'study': return '📚';
      case 'exercise': return '🏃';
      case 'behavior': return '😊';
      case 'creativity': return '🎨';
      default: return '📝';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'study': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'exercise': return 'bg-green-100 text-green-800 border-green-200';
      case 'behavior': return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'creativity': return 'bg-purple-100 text-purple-800 border-purple-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getCategoryBgColor = (category: string) => {
    switch (category) {
      case 'study': return 'bg-blue-50';
      case 'exercise': return 'bg-green-50';
      case 'behavior': return 'bg-amber-50';
      case 'creativity': return 'bg-purple-50';
      default: return 'bg-gray-50';
    }
  };

  const getCategoryBorderColor = (category: string) => {
    switch (category) {
      case 'study': return 'border-blue-200';
      case 'exercise': return 'border-green-200';
      case 'behavior': return 'border-amber-200';
      case 'creativity': return 'border-purple-200';
      default: return 'border-gray-200';
    }
  };

  const getCategoryHoverColor = (category: string) => {
    switch (category) {
      case 'study': return 'hover:bg-blue-100 hover:border-blue-300';
      case 'exercise': return 'hover:bg-green-100 hover:border-green-300';
      case 'behavior': return 'hover:bg-amber-100 hover:border-amber-300';
      case 'creativity': return 'hover:bg-purple-100 hover:border-purple-300';
      default: return 'hover:bg-gray-100 hover:border-gray-300';
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <h2 className="text-2xl font-bold text-piggy-blue">今日任务</h2>
          <div className="flex items-center gap-1 bg-gradient-to-r from-yellow-100 to-orange-100 px-3 py-1 rounded-full border border-yellow-200 transition-all duration-300 hover:shadow-md">
            <span className="text-yellow-600 font-bold text-sm animate-pulse">⭐</span>
            <span className="text-yellow-700 font-bold text-sm">{todayTotalStars}</span>
          </div>
        </div>
        <div className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
          📅 {new Date().toLocaleDateString('zh-CN')}
        </div>
      </div>

      <div className="space-y-3 max-h-96 overflow-y-auto custom-scrollbar">
        {tasks.length === 0 ? (
          <div className="text-center py-8">
            <div className="text-6xl mb-4 animate-float">🌟</div>
            <p className="text-gray-500 text-lg">暂无任务，点击"任务管理"添加新任务！</p>
          </div>
        ) : (
          tasks.map((task) => (
            <div
              key={task.id}
              id={`task-${task.id}`}
              className={`p-4 rounded-xl border-2 transition-all transform hover:scale-[1.02] ${
                task.completed
                  ? 'bg-gray-100 opacity-75 border-gray-300'
                  : `${getCategoryBgColor(task.category)} border-2 ${getCategoryBorderColor(task.category)} ${getCategoryHoverColor(task.category)}`
              }`}
            >
              {/* 任务标题层 */}
              <div className="flex items-center gap-2 mb-2">
                <span className={`text-lg ${task.completed ? 'grayscale' : ''}`}>
                  {getCategoryIcon(task.category)}
                </span>
                <span className={`font-medium text-sm ${task.completed ? 'line-through text-gray-500' : 'text-gray-800'} flex-1 min-w-0`}>
                  {task.name}
                </span>
              </div>
              
              {/* 任务详情层 - 包含标签和按钮 */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className={`text-xs px-2 py-1 rounded border ${getCategoryColor(task.category)}`}>
                    {task.category === 'study' ? '学习' :
                     task.category === 'exercise' ? '运动' :
                     task.category === 'behavior' ? '行为' : '创造'}
                  </span>
                  <span className="text-xs text-gray-500 flex items-center gap-1">
                    <span>⭐</span>
                    <span>{task.stars}</span>
                  </span>
                </div>
                
                {/* 任务操作按钮 - 只显示图标 */}
                <div className="flex gap-1 flex-shrink-0">
                  {task.completed ? (
                    <>
                      <button
                        id={`restore-btn-${task.id}`}
                        onClick={() => onUncompleteTask(task.id)}
                        className="p-1.5 text-yellow-600 hover:bg-yellow-100 rounded transition-colors"
                        title="恢复任务"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                      </button>
                      <button
                        onClick={() => onDeleteTask(task.id, task.name)}
                        className="p-1.5 text-red-600 hover:bg-red-100 rounded transition-colors"
                        title="删除任务"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        id={`complete-btn-${task.id}`}
                        onClick={() => onCompleteTask(task.id)}
                        className="p-1.5 text-green-600 hover:bg-green-100 rounded transition-colors"
                        title="完成任务"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </button>
                      <button
                        onClick={() => onDeleteTask(task.id, task.name)}
                        className="p-1.5 text-red-600 hover:bg-red-100 rounded transition-colors"
                        title="删除任务"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};