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
      case 'behavior': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'creativity': return 'bg-purple-100 text-purple-800 border-purple-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-piggy-blue">今日任务</h2>
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
                  ? 'bg-green-50 opacity-75 border-2 border-green-200'
                  : 'bg-piggy-cream hover:bg-yellow-100 border-2 border-transparent hover:border-yellow-200'
              }`}
            >
              <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
                <span className={`text-xl sm:text-2xl ${task.completed ? 'grayscale' : ''}`}>
                  {getCategoryIcon(task.category)}
                </span>
                <div className="flex-1 min-w-0">
                  <span className={`font-medium text-sm sm:text-base ${task.completed ? 'line-through text-gray-500' : 'text-gray-800'}`}>
                    {task.name}
                  </span>
                  <div className="flex items-center gap-2 mt-1 flex-wrap">
                    <span className={`text-xs px-2 py-1 rounded-full border ${getCategoryColor(task.category)}`}>
                      {task.category === 'study' ? '学习' :
                       task.category === 'exercise' ? '运动' :
                       task.category === 'behavior' ? '行为' : '创造'}
                    </span>
                    <span className="text-xs text-gray-500 flex items-center gap-1">
                      <span>⭐</span>
                      <span>{task.stars}</span>
                    </span>
                  </div>
                </div>
              </div>
              
              {/* 任务操作按钮 */}
              <div className="flex gap-1 sm:gap-2 flex-shrink-0 ml-2">
                {task.completed ? (
                  <>
                    <button
                      id={`restore-btn-${task.id}`}
                      onClick={() => onUncompleteTask(task.id)}
                      className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all transform hover:scale-105"
                    >
                      🔄 恢复
                    </button>
                    <button
                      onClick={() => onDeleteTask(task.id, task.name)}
                      className="bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all transform hover:scale-105"
                    >
                      🗑️ 删除
                    </button>
                  </>
                ) : (
                  <button
                    id={`complete-btn-${task.id}`}
                    onClick={() => onCompleteTask(task.id)}
                    className="bg-piggy-green hover:bg-green-600 text-white px-3 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all transform hover:scale-105"
                  >
                    ✅ 完成
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};