import React, { useState } from 'react';
import { useStore } from '../stores/useStore';

export const TaskManager: React.FC = () => {
  const { addCustomTask } = useStore();
  const [showAddTask, setShowAddTask] = useState(false);
  const [taskName, setTaskName] = useState('');
  const [taskCategory, setTaskCategory] = useState<'study' | 'exercise' | 'behavior' | 'creativity'>('study');
  const [taskStars, setTaskStars] = useState<number | string>(1);

  const handleAddTask = () => {
    if (taskName.trim()) {
      const starsValue = typeof taskStars === 'string' || taskStars < 1 ? 1 : taskStars;
      addCustomTask(taskName, taskCategory, starsValue);
      setTaskName('');
      setTaskStars(1);
      setShowAddTask(false);
    }
  };

  const categoryOptions = [
    { value: 'study', label: '📚 学习', color: 'bg-blue-100 text-blue-800' },
    { value: 'exercise', label: '🏃 运动', color: 'bg-green-100 text-green-800' },
    { value: 'behavior', label: '😊 行为', color: 'bg-yellow-100 text-yellow-800' },
    { value: 'creativity', label: '🎨 创造', color: 'bg-purple-100 text-purple-800' }
  ];

  return (
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

            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <span className="text-gray-700 font-medium">星星数：</span>
                <input
                  type="number"
                  min="1"
                  max="99"
                  value={taskStars}
                  onChange={(e) => {
                    const inputValue = e.target.value;
                    if (inputValue === '') {
                      setTaskStars('' as any);
                    } else {
                      const value = parseInt(inputValue);
                      if (!isNaN(value)) {
                        setTaskStars(value);
                      }
                    }
                  }}
                  onBlur={() => {
                    if (taskStars === '' || Number(taskStars) < 1) {
                      setTaskStars(1);
                    } else if (Number(taskStars) > 99) {
                      setTaskStars(99);
                    }
                  }}
                  className="w-16 px-2 py-1.5 rounded-lg border border-gray-300 text-center font-bold text-piggy-orange focus:outline-none focus:border-piggy-blue focus:ring-2 focus:ring-piggy-blue focus:ring-opacity-20"
                />
              </div>
              <div className="flex gap-1 flex-wrap">
                {[1, 2, 3, 5, 10].map(preset => (
                  <button
                    key={preset}
                    onClick={() => setTaskStars(preset)}
                    className={`px-3 py-1 rounded-lg text-sm font-medium transition-all transform hover:scale-105 ${
                      Number(taskStars) === preset
                        ? 'bg-yellow-400 text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {preset}⭐
                  </button>
                ))}
              </div>
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
  );
};

export {};