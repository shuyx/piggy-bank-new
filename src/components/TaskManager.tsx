import React, { useState } from 'react';
import { useStore } from '../stores/useStore';

export const TaskManager: React.FC = () => {
  const { 
    addCustomTask, 
    getActiveTaskTemplates, 
    getDeletedTaskTemplates, 
    deleteTaskTemplate, 
    restoreTaskTemplate, 
    addTaskFromTemplate 
  } = useStore();
  const [showAddTask, setShowAddTask] = useState(false);
  const [taskName, setTaskName] = useState('');
  const [taskCategory, setTaskCategory] = useState<'study' | 'exercise' | 'behavior' | 'creativity'>('study');
  const [taskStars, setTaskStars] = useState<number | string>(1);
  const [showDeletedTemplates, setShowDeletedTemplates] = useState(false);
  
  const activeTemplates = getActiveTaskTemplates();
  const deletedTemplates = getDeletedTaskTemplates();

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

  const getCategoryLabel = (category: string) => {
    const option = categoryOptions.find(opt => opt.value === category);
    return option ? option.label : category;
  };

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
        <div className="space-y-6">
          {/* 任务模板列表 */}
          {activeTemplates.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-gray-700 mb-3">任务模板</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {activeTemplates.map((template) => (
                  <div
                    key={template.id}
                    className="bg-gray-50 rounded-lg p-3 hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-sm font-medium">{template.name}</span>
                          <span className="text-xs px-2 py-1 rounded-full bg-yellow-100 text-yellow-800">
                            {template.stars}⭐
                          </span>
                        </div>
                        <div className="text-xs text-gray-500">
                          {getCategoryLabel(template.category)} • 使用 {template.usageCount} 次
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => addTaskFromTemplate(template.id)}
                          className="p-1 text-green-600 hover:bg-green-100 rounded transition-colors"
                          title="添加到今日任务"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                          </svg>
                        </button>
                        <button
                          onClick={() => deleteTaskTemplate(template.id)}
                          className="p-1 text-red-600 hover:bg-red-100 rounded transition-colors"
                          title="删除模板"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 回收站按钮 */}
          {deletedTemplates.length > 0 && (
            <div className="text-center">
              <button
                onClick={() => setShowDeletedTemplates(!showDeletedTemplates)}
                className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
              >
                🗑️ 回收站 ({deletedTemplates.length})
              </button>
            </div>
          )}

          {/* 回收站内容 */}
          {showDeletedTemplates && deletedTemplates.length > 0 && (
            <div className="border-t pt-4">
              <h3 className="text-sm font-semibold text-gray-500 mb-3">已删除的模板</h3>
              <div className="space-y-2">
                {deletedTemplates.map((template) => (
                  <div
                    key={template.id}
                    className="bg-red-50 rounded-lg p-3 flex items-center justify-between"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-medium text-gray-600">{template.name}</span>
                        <span className="text-xs px-2 py-1 rounded-full bg-gray-200 text-gray-600">
                          {template.stars}⭐
                        </span>
                      </div>
                      <div className="text-xs text-gray-500">
                        {getCategoryLabel(template.category)}
                      </div>
                    </div>
                    <button
                      onClick={() => restoreTaskTemplate(template.id)}
                      className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded hover:bg-green-200 transition-colors"
                    >
                      恢复
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 空状态 */}
          {activeTemplates.length === 0 && (
            <div className="text-center text-gray-500 py-8">
              <div className="text-4xl mb-2">✨</div>
              <div>点击"添加任务"创建自定义任务</div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export {};