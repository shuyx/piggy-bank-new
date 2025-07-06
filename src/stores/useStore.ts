import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Task {
  id: string;
  name: string;
  category: 'study' | 'exercise' | 'behavior' | 'creativity';
  completed: boolean;
  stars: number;
  date: string;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlockedDate?: string;
}

export interface DailyRecord {
  date: string;
  tasks: Task[];
  totalStars: number;
  report?: string;
}

export interface AppState {
  // 基础数据
  totalStars: number;
  currentStreak: number;
  dailyRecords: DailyRecord[];
  achievements: Achievement[];
  customTasks: Task[];
  
  // 操作方法
  addTask: (task: Omit<Task, 'id' | 'date'>) => void;
  completeTask: (taskId: string) => void;
  uncompleteTask: (taskId: string) => void;
  deleteTask: (taskId: string) => void;
  addCustomTask: (name: string, category: Task['category'], stars: number) => void;
  generateDailyReport: () => string;
  unlockAchievement: (achievementId: string) => void;
  getTodayTasks: () => Task[];
  getTodayProgress: () => number;
  getWeeklyStats: () => { totalStars: number; completionRate: number };
  clearTodayTasks: () => void;
  loadFromCloud: (cloudData: any) => void;
}

// 初始成就列表
const initialAchievements: Achievement[] = [
  {
    id: 'first-star',
    name: '初次闪耀',
    description: '获得第一颗星星',
    icon: '🌟',
    unlocked: false
  },
  {
    id: 'star-collector-50',
    name: '星星新手',
    description: '累计获得50颗星星',
    icon: '✨',
    unlocked: false
  },
  {
    id: 'star-collector-100',
    name: '星星收集者',
    description: '累计获得100颗星星',
    icon: '💫',
    unlocked: false
  },
  {
    id: 'star-collector-200',
    name: '星星猎人',
    description: '累计获得200颗星星',
    icon: '🌠',
    unlocked: false
  },
  {
    id: 'star-collector-300',
    name: '星星大师',
    description: '累计获得300颗星星',
    icon: '⭐',
    unlocked: false
  },
  {
    id: 'star-collector-500',
    name: '星星收藏家',
    description: '累计获得500颗星星',
    icon: '🌟',
    unlocked: false
  },
  {
    id: 'star-collector-1000',
    name: '星星大魔王',
    description: '累计获得1000颗星星',
    icon: '👹',
    unlocked: false
  },
  {
    id: 'star-collector-2000',
    name: '星星宇宙大魔王',
    description: '累计获得2000颗星星',
    icon: '🌌',
    unlocked: false
  },
  {
    id: 'perfect-day',
    name: '完美一天',
    description: '单日获得所有星星',
    icon: '🎯',
    unlocked: false
  },
  {
    id: 'week-warrior',
    name: '周冠军',
    description: '连续7天完成任务(排除周日)',
    icon: '🏆',
    unlocked: false
  },
  {
    id: 'week-warrior-2',
    name: '双周战士',
    description: '连续14天完成任务(排除周日)',
    icon: '🥇',
    unlocked: false
  },
  {
    id: 'month-master',
    name: '月度大师',
    description: '连续30天完成任务(排除周日)',
    icon: '👑',
    unlocked: false
  },
  {
    id: 'early-bird',
    name: '早起鸟儿',
    description: '连续7天早上8点前完成任务',
    icon: '🐦',
    unlocked: false
  },
  {
    id: 'all-rounder',
    name: '全能选手',
    description: '单日完成所有类别的任务',
    icon: '🎨',
    unlocked: false
  },
  {
    id: 'super-day',
    name: '超级一天',
    description: '单日获得超过20颗星星',
    icon: '🚀',
    unlocked: false
  }
];

// 辅助函数：检查成就解锁条件
const checkAchievements = (state: any, newTotalStars: number, todayTasks: Task[]) => {
  const newAchievements = [...state.achievements];
  let hasNewUnlock = false;

  // 检查第一颗星星成就
  if (newTotalStars >= 1 && !newAchievements.find(a => a.id === 'first-star')?.unlocked) {
    const achievementIndex = newAchievements.findIndex(a => a.id === 'first-star');
    newAchievements[achievementIndex] = {
      ...newAchievements[achievementIndex],
      unlocked: true,
      unlockedDate: new Date().toISOString()
    };
    hasNewUnlock = true;
  }

  // 检查星星收集成就（多个等级）
  const starMilestones = [
    { stars: 50, id: 'star-collector-50' },
    { stars: 100, id: 'star-collector-100' },
    { stars: 200, id: 'star-collector-200' },
    { stars: 300, id: 'star-collector-300' },
    { stars: 500, id: 'star-collector-500' },
    { stars: 1000, id: 'star-collector-1000' },
    { stars: 2000, id: 'star-collector-2000' }
  ];

  starMilestones.forEach(milestone => {
    if (newTotalStars >= milestone.stars && !newAchievements.find(a => a.id === milestone.id)?.unlocked) {
      const achievementIndex = newAchievements.findIndex(a => a.id === milestone.id);
      newAchievements[achievementIndex] = {
        ...newAchievements[achievementIndex],
        unlocked: true,
        unlockedDate: new Date().toISOString()
      };
      hasNewUnlock = true;
    }
  });

  // 检查完美一天成就
  const completedTasksToday = todayTasks.filter(t => t.completed).length;
  const totalTasksToday = todayTasks.length;
  if (completedTasksToday === totalTasksToday && totalTasksToday > 0 &&
      !newAchievements.find(a => a.id === 'perfect-day')?.unlocked) {
    const achievementIndex = newAchievements.findIndex(a => a.id === 'perfect-day');
    newAchievements[achievementIndex] = {
      ...newAchievements[achievementIndex],
      unlocked: true,
      unlockedDate: new Date().toISOString()
    };
    hasNewUnlock = true;
  }

  // 检查超级一天成就（单日20+星星）
  const todayStars = todayTasks.filter(t => t.completed).reduce((sum, t) => sum + t.stars, 0);
  if (todayStars >= 20 && !newAchievements.find(a => a.id === 'super-day')?.unlocked) {
    const achievementIndex = newAchievements.findIndex(a => a.id === 'super-day');
    newAchievements[achievementIndex] = {
      ...newAchievements[achievementIndex],
      unlocked: true,
      unlockedDate: new Date().toISOString()
    };
    hasNewUnlock = true;
  }

  // 检查全能选手成就（单日完成所有类别）
  const categories = ['study', 'exercise', 'behavior', 'creativity'];
  const completedCategories = new Set(todayTasks.filter(t => t.completed).map(t => t.category));
  if (completedCategories.size === categories.length && !newAchievements.find(a => a.id === 'all-rounder')?.unlocked) {
    const achievementIndex = newAchievements.findIndex(a => a.id === 'all-rounder');
    newAchievements[achievementIndex] = {
      ...newAchievements[achievementIndex],
      unlocked: true,
      unlockedDate: new Date().toISOString()
    };
    hasNewUnlock = true;
  }

  return { newAchievements, hasNewUnlock };
};

// 辅助函数：计算连续天数（排除周日）
const calculateStreak = (dailyRecords: DailyRecord[], currentStreak: number, excludeSunday: boolean = true) => {
  const today = new Date().toISOString().split('T')[0];
  const todayRecord = dailyRecords.find(r => r.date === today);
  
  if (!todayRecord || todayRecord.tasks.filter(t => t.completed).length === 0) {
    return 0;
  }

  let streak = 1;
  const sortedRecords = dailyRecords
    .filter(r => r.tasks.some(t => t.completed))
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  for (let i = 1; i < sortedRecords.length; i++) {
    const prevDate = new Date(sortedRecords[i-1].date);
    const currDate = new Date(sortedRecords[i].date);
    
    // 如果排除周日，计算实际间隔天数时需要考虑中间的周日
    let actualDayDiff = 0;
    let checkDate = new Date(currDate);
    checkDate.setDate(checkDate.getDate() + 1);
    
    while (checkDate <= prevDate) {
      if (!excludeSunday || checkDate.getDay() !== 0) {
        actualDayDiff++;
      }
      checkDate.setDate(checkDate.getDate() + 1);
    }
    
    if (actualDayDiff === 1) {
      streak++;
    } else {
      break;
    }
  }

  return streak;
};

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      totalStars: 0,
      currentStreak: 0,
      dailyRecords: [],
      achievements: initialAchievements,
      customTasks: [],

      addTask: (taskData) => {
        const newTask: Task = {
          ...taskData,
          id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
          date: new Date().toISOString().split('T')[0],
          completed: false
        };

        console.log('useStore: 添加新任务:', newTask.name, 'ID:', newTask.id);

        set((state) => {
          const today = new Date().toISOString().split('T')[0];
          const todayRecord = state.dailyRecords.find(r => r.date === today);

          if (todayRecord) {
            return {
              dailyRecords: state.dailyRecords.map(record =>
                record.date === today
                  ? { ...record, tasks: [...record.tasks, newTask] }
                  : record
              )
            };
          } else {
            return {
              dailyRecords: [...state.dailyRecords, {
                date: today,
                tasks: [newTask],
                totalStars: 0
              }]
            };
          }
        });
      },

      completeTask: (taskId) => {
        console.log('useStore: 开始完成任务，ID:', taskId);
        
        set((state) => {
          const today = new Date().toISOString().split('T')[0];
          let starsEarned = 0;
          let taskFound = false;
          let completedTaskName = '';

          // 更新任务状态
          const newDailyRecords = state.dailyRecords.map(record => {
            if (record.date === today) {
              const newTasks = record.tasks.map(task => {
                if (task.id === taskId && !task.completed) {
                  console.log('useStore: 找到并完成任务:', task.name, '星星:', task.stars);
                  starsEarned = task.stars;
                  taskFound = true;
                  completedTaskName = task.name;
                  return { ...task, completed: true };
                }
                return task;
              });

              return {
                ...record,
                tasks: newTasks,
                totalStars: newTasks.filter(t => t.completed).reduce((sum, t) => sum + t.stars, 0)
              };
            }
            return record;
          });

          if (!taskFound) {
            console.warn('useStore: 未找到要完成的任务，ID:', taskId);
            return state;
          }

          console.log('useStore: 任务完成成功:', completedTaskName, '获得星星:', starsEarned);

          // 更新总星星数
          const newTotalStars = state.totalStars + starsEarned;

          // 获取今日任务（更新后的）
          const todayRecord = newDailyRecords.find(r => r.date === today);
          const todayTasks = todayRecord?.tasks || [];

          // 检查成就解锁
          const { newAchievements } = checkAchievements(state, newTotalStars, todayTasks);

          // 计算连续天数
          const newStreak = calculateStreak(newDailyRecords, state.currentStreak);

          // 检查连续天数成就
          const finalAchievements = [...newAchievements];
          if (newStreak >= 7 && !finalAchievements.find(a => a.id === 'week-warrior')?.unlocked) {
            const achievementIndex = finalAchievements.findIndex(a => a.id === 'week-warrior');
            finalAchievements[achievementIndex] = {
              ...finalAchievements[achievementIndex],
              unlocked: true,
              unlockedDate: new Date().toISOString()
            };
            console.log('useStore: 解锁成就 - 周冠军');
          }

          if (newStreak >= 14 && !finalAchievements.find(a => a.id === 'week-warrior-2')?.unlocked) {
            const achievementIndex = finalAchievements.findIndex(a => a.id === 'week-warrior-2');
            finalAchievements[achievementIndex] = {
              ...finalAchievements[achievementIndex],
              unlocked: true,
              unlockedDate: new Date().toISOString()
            };
            console.log('useStore: 解锁成就 - 双周战士');
          }

          if (newStreak >= 30 && !finalAchievements.find(a => a.id === 'month-master')?.unlocked) {
            const achievementIndex = finalAchievements.findIndex(a => a.id === 'month-master');
            finalAchievements[achievementIndex] = {
              ...finalAchievements[achievementIndex],
              unlocked: true,
              unlockedDate: new Date().toISOString()
            };
            console.log('useStore: 解锁成就 - 月度大师');
          }

          console.log('useStore: 状态更新完成，总星星:', newTotalStars, '连续天数:', newStreak);

          return {
            totalStars: newTotalStars,
            currentStreak: newStreak,
            dailyRecords: newDailyRecords,
            achievements: finalAchievements
          };
        });
      },

      uncompleteTask: (taskId) => {
        console.log('useStore: 开始恢复任务，ID:', taskId);
        
        set((state) => {
          const today = new Date().toISOString().split('T')[0];
          let starsLost = 0;
          let taskFound = false;
          let restoredTaskName = '';

          // 更新任务状态
          const newDailyRecords = state.dailyRecords.map(record => {
            if (record.date === today) {
              const newTasks = record.tasks.map(task => {
                if (task.id === taskId && task.completed) {
                  console.log('useStore: 找到并恢复任务:', task.name, '扣除星星:', task.stars);
                  starsLost = task.stars;
                  taskFound = true;
                  restoredTaskName = task.name;
                  return { ...task, completed: false };
                }
                return task;
              });

              return {
                ...record,
                tasks: newTasks,
                totalStars: newTasks.filter(t => t.completed).reduce((sum, t) => sum + t.stars, 0)
              };
            }
            return record;
          });

          if (!taskFound) {
            console.warn('useStore: 未找到要恢复的任务，ID:', taskId);
            return state;
          }

          console.log('useStore: 任务恢复成功:', restoredTaskName, '扣除星星:', starsLost);

          // 更新总星星数
          const newTotalStars = Math.max(0, state.totalStars - starsLost);

          // 重新计算连续天数
          const newStreak = calculateStreak(newDailyRecords, state.currentStreak);

          console.log('useStore: 恢复状态更新完成，总星星:', newTotalStars, '连续天数:', newStreak);

          return {
            totalStars: newTotalStars,
            currentStreak: newStreak,
            dailyRecords: newDailyRecords
          };
        });
      },

      deleteTask: (taskId) => {
        console.log('useStore: 开始删除任务，ID:', taskId);
        
        set((state) => {
          const today = new Date().toISOString().split('T')[0];
          let starsLost = 0;
          let taskFound = false;
          let deletedTaskName = '';

          // 更新任务状态
          const newDailyRecords = state.dailyRecords.map(record => {
            if (record.date === today) {
              const taskToDelete = record.tasks.find(task => task.id === taskId);
              if (taskToDelete) {
                console.log('useStore: 找到要删除的任务:', taskToDelete.name);
                taskFound = true;
                deletedTaskName = taskToDelete.name;
                // 如果任务已完成，需要扣除星星
                if (taskToDelete.completed) {
                  starsLost = taskToDelete.stars;
                }
              }

              const newTasks = record.tasks.filter(task => task.id !== taskId);

              return {
                ...record,
                tasks: newTasks,
                totalStars: newTasks.filter(t => t.completed).reduce((sum, t) => sum + t.stars, 0)
              };
            }
            return record;
          });

          if (!taskFound) {
            console.warn('useStore: 未找到要删除的任务，ID:', taskId);
            return state;
          }

          console.log('useStore: 任务删除成功:', deletedTaskName, '扣除星星:', starsLost);

          // 更新总星星数
          const newTotalStars = Math.max(0, state.totalStars - starsLost);

          // 重新计算连续天数
          const newStreak = calculateStreak(newDailyRecords, state.currentStreak);

          console.log('useStore: 删除状态更新完成，总星星:', newTotalStars, '连续天数:', newStreak);

          return {
            totalStars: newTotalStars,
            currentStreak: newStreak,
            dailyRecords: newDailyRecords
          };
        });
      },

      clearTodayTasks: () => {
        console.log('useStore: 清除今日所有任务');
        
        set((state) => {
          const today = new Date().toISOString().split('T')[0];
          
          // 计算要减少的星星数
          const todayRecord = state.dailyRecords.find(r => r.date === today);
          const starsToDeduct = todayRecord?.totalStars || 0;
          
          const newDailyRecords = state.dailyRecords.map(record => {
            if (record.date === today) {
              return {
                ...record,
                tasks: [],
                totalStars: 0
              };
            }
            return record;
          });

          const newTotalStars = Math.max(0, state.totalStars - starsToDeduct);
          const newStreak = calculateStreak(newDailyRecords, state.currentStreak);

          console.log('useStore: 清除完成，扣除星星:', starsToDeduct, '新总星星:', newTotalStars);

          return {
            totalStars: newTotalStars,
            currentStreak: newStreak,
            dailyRecords: newDailyRecords
          };
        });
      },

      addCustomTask: (name, category, stars) => {
        console.log('useStore: 添加自定义任务:', name, '分类:', category, '星星:', stars);
        const newTask = {
          name,
          category,
          stars,
          completed: false
        };
        get().addTask(newTask);
      },

      generateDailyReport: () => {
        const today = new Date().toISOString().split('T')[0];
        const todayRecord = get().dailyRecords.find(r => r.date === today);
        
        console.log('useStore: 生成今日报告，日期:', today);
        
        if (!todayRecord) {
          console.log('useStore: 今天没有任务记录');
          return '今天还没有任务记录哦！';
        }

        const completedTasks = todayRecord.tasks.filter(t => t.completed);
        const totalTasks = todayRecord.tasks.length;
        const completionRate = totalTasks > 0 ? (completedTasks.length / totalTasks * 100).toFixed(0) : 0;

        console.log('useStore: 报告数据 - 完成任务:', completedTasks.length, '总任务:', totalTasks, '完成率:', completionRate + '%');

        const categoryStats = {
          study: completedTasks.filter(t => t.category === 'study').length,
          exercise: completedTasks.filter(t => t.category === 'exercise').length,
          behavior: completedTasks.filter(t => t.category === 'behavior').length,
          creativity: completedTasks.filter(t => t.category === 'creativity').length
        };

        let report = `📊 今日表现报告\n\n`;
        report += `完成率：${completionRate}% (${completedTasks.length}/${totalTasks})\n`;
        report += `获得星星：${todayRecord.totalStars} ⭐\n\n`;
        report += `分类完成情况：\n`;
        report += `📚 学习：${categoryStats.study} 项\n`;
        report += `🏃 运动：${categoryStats.exercise} 项\n`;
        report += `😊 行为：${categoryStats.behavior} 项\n`;
        report += `🎨 创造：${categoryStats.creativity} 项\n\n`;

        if (Number(completionRate) === 100) {
          report += `🎉 太棒了！今天所有任务都完成了！`;
        } else if (Number(completionRate) >= 80) {
          report += `💪 很不错！继续加油！`;
        } else if (Number(completionRate) >= 60) {
          report += `😊 还可以，明天继续努力！`;
        } else {
          report += `💡 加油！明天会更好的！`;
        }

        return report;
      },

      unlockAchievement: (achievementId) => {
        console.log('useStore: 解锁成就:', achievementId);
        set((state) => ({
          achievements: state.achievements.map(a =>
            a.id === achievementId
              ? { ...a, unlocked: true, unlockedDate: new Date().toISOString() }
              : a
          )
        }));
      },

      getTodayTasks: () => {
        const today = new Date().toISOString().split('T')[0];
        const todayRecord = get().dailyRecords.find(r => r.date === today);
        const tasks = todayRecord?.tasks || [];
        console.log('useStore: 获取今日任务，数量:', tasks.length);
        return tasks;
      },

      getTodayProgress: () => {
        const todayTasks = get().getTodayTasks();
        if (todayTasks.length === 0) return 0;
        const completed = todayTasks.filter(t => t.completed).length;
        const progress = (completed / todayTasks.length) * 100;
        console.log('useStore: 今日进度:', progress.toFixed(1) + '%', '(' + completed + '/' + todayTasks.length + ')');
        return progress;
      },

      getWeeklyStats: () => {
        const today = new Date();
        const weekAgo = new Date();
        weekAgo.setDate(today.getDate() - 7);

        const weekRecords = get().dailyRecords.filter(record => {
          const recordDate = new Date(record.date);
          return recordDate >= weekAgo && recordDate <= today;
        });

        const totalStars = weekRecords.reduce((sum, record) => sum + record.totalStars, 0);
        const totalTasks = weekRecords.reduce((sum, record) => sum + record.tasks.length, 0);
        const completedTasks = weekRecords.reduce((sum, record) => 
          sum + record.tasks.filter(t => t.completed).length, 0);
        
        const completionRate = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

        console.log('useStore: 周统计 - 总星星:', totalStars, '完成率:', completionRate.toFixed(1) + '%');

        return { totalStars, completionRate };
      },

      loadFromCloud: (cloudData) => {
        console.log('useStore: 从云端加载数据:', cloudData);
        set(() => ({
          totalStars: cloudData.total_stars || 0,
          currentStreak: cloudData.current_streak || 0,
          dailyRecords: cloudData.daily_records || [],
          achievements: cloudData.achievements || initialAchievements,
          customTasks: cloudData.custom_tasks || []
        }));
        console.log('useStore: 云端数据加载完成');
      }
    }),
    {
      name: 'piggy-bank-storage',
      version: 2, // 增加版本号
      migrate: (persistedState: any, version: number) => {
        if (version === 0 || version === 1) {
          // 从旧版本迁移，更新成就列表
          console.log('Migrating achievements from version', version, 'to version 2');
          
          // 确保所有数据都被保留
          const migratedState = {
            ...persistedState,
            achievements: initialAchievements.map(newAch => {
              // 保留已解锁的成就状态
              const oldAch = persistedState.achievements?.find((a: Achievement) => a.id === newAch.id);
              if (oldAch && oldAch.unlocked) {
                return { ...newAch, unlocked: true, unlockedDate: oldAch.unlockedDate };
              }
              return newAch;
            })
          };
          
          // 保留所有其他数据
          return {
            totalStars: persistedState.totalStars || 0,
            currentStreak: persistedState.currentStreak || 0,
            dailyRecords: persistedState.dailyRecords || [],
            customTasks: persistedState.customTasks || [],
            ...migratedState
          };
        }
        return persistedState;
      },
    }
  )
);

// 修改：不再自动初始化默认任务
export const initializeTodayTasks = () => {
  const store = useStore.getState();
  const todayTasks = store.getTodayTasks();
  
  console.log('initializeTodayTasks: 当前任务数量:', todayTasks.length);
  console.log('initializeTodayTasks: 不再自动添加默认任务，保持空白状态');
  
  // 移除了自动添加默认任务的逻辑
  // 现在今日任务将保持空白，等待用户手动添加
};