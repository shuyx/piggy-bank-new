import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface Task {
  id: string;
  name: string;
  category: 'study' | 'exercise' | 'behavior' | 'creativity';
  completed: boolean;
  stars: number;
  date: string;
}

interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlockedDate?: string;
}

interface DailyRecord {
  date: string;
  tasks: Task[];
  totalStars: number;
  report?: string;
}

interface AppState {
  // 基础数据
  totalStars: number;
  currentStreak: number;
  dailyRecords: DailyRecord[];
  achievements: Achievement[];
  customTasks: Task[];
  
  // 操作方法
  addTask: (task: Omit<Task, 'id' | 'date'>) => void;
  completeTask: (taskId: string) => void;
  addCustomTask: (name: string, category: Task['category'], stars: number) => void;
  generateDailyReport: () => string;
  unlockAchievement: (achievementId: string) => void;
  getTodayTasks: () => Task[];
  getTodayProgress: () => number;
  getWeeklyStats: () => { totalStars: number; completionRate: number };
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
    id: 'week-warrior',
    name: '周冠军',
    description: '连续7天完成任务',
    icon: '🏆',
    unlocked: false
  },
  {
    id: 'star-collector',
    name: '星星收集者',
    description: '累计获得100颗星星',
    icon: '💫',
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
    id: 'month-master',
    name: '月度大师',
    description: '连续30天完成任务',
    icon: '👑',
    unlocked: false
  }
];

// 默认任务模板
const defaultTaskTemplates = [
  { name: '完成作业', category: 'study' as const, stars: 3 },
  { name: '阅读30分钟', category: 'study' as const, stars: 2 },
  { name: '运动30分钟', category: 'exercise' as const, stars: 3 },
  { name: '帮助做家务', category: 'behavior' as const, stars: 2 },
  { name: '画画或手工', category: 'creativity' as const, stars: 2 }
];

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
          id: Date.now().toString(),
          date: new Date().toISOString().split('T')[0],
          completed: false
        };

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
        set((state) => {
          const today = new Date().toISOString().split('T')[0];
          let starsEarned = 0;
          let totalTasksToday = 0;
          let completedTasksToday = 0;

          const newDailyRecords = state.dailyRecords.map(record => {
            if (record.date === today) {
              const newTasks = record.tasks.map(task => {
                if (task.id === taskId && !task.completed) {
                  starsEarned = task.stars;
                  return { ...task, completed: true };
                }
                return task;
              });

              totalTasksToday = newTasks.length;
              completedTasksToday = newTasks.filter(t => t.completed).length;

              return {
                ...record,
                tasks: newTasks,
                totalStars: newTasks.filter(t => t.completed).reduce((sum, t) => sum + t.stars, 0)
              };
            }
            return record;
          });

          const newTotalStars = state.totalStars + starsEarned;
          const newAchievements = [...state.achievements];

          // 检查成就解锁
          if (newTotalStars >= 1 && !newAchievements.find(a => a.id === 'first-star')?.unlocked) {
            const achievementIndex = newAchievements.findIndex(a => a.id === 'first-star');
            newAchievements[achievementIndex] = {
              ...newAchievements[achievementIndex],
              unlocked: true,
              unlockedDate: new Date().toISOString()
            };
          }

          if (newTotalStars >= 100 && !newAchievements.find(a => a.id === 'star-collector')?.unlocked) {
            const achievementIndex = newAchievements.findIndex(a => a.id === 'star-collector');
            newAchievements[achievementIndex] = {
              ...newAchievements[achievementIndex],
              unlocked: true,
              unlockedDate: new Date().toISOString()
            };
          }

          if (completedTasksToday === totalTasksToday && totalTasksToday > 0 &&
              !newAchievements.find(a => a.id === 'perfect-day')?.unlocked) {
            const achievementIndex = newAchievements.findIndex(a => a.id === 'perfect-day');
            newAchievements[achievementIndex] = {
              ...newAchievements[achievementIndex],
              unlocked: true,
              unlockedDate: new Date().toISOString()
            };
          }

          // 计算连续天数
          let newStreak = state.currentStreak;
          const yesterday = new Date();
          yesterday.setDate(yesterday.getDate() - 1);
          const yesterdayStr = yesterday.toISOString().split('T')[0];
          const yesterdayRecord = state.dailyRecords.find(r => r.date === yesterdayStr);

          if (yesterdayRecord && yesterdayRecord.tasks.some(t => t.completed)) {
            newStreak = state.currentStreak + 1;
          } else if (completedTasksToday > 0) {
            newStreak = 1;
          }

          // 连续天数成就
          if (newStreak >= 7 && !newAchievements.find(a => a.id === 'week-warrior')?.unlocked) {
            const achievementIndex = newAchievements.findIndex(a => a.id === 'week-warrior');
            newAchievements[achievementIndex] = {
              ...newAchievements[achievementIndex],
              unlocked: true,
              unlockedDate: new Date().toISOString()
            };
          }

          if (newStreak >= 30 && !newAchievements.find(a => a.id === 'month-master')?.unlocked) {
            const achievementIndex = newAchievements.findIndex(a => a.id === 'month-master');
            newAchievements[achievementIndex] = {
              ...newAchievements[achievementIndex],
              unlocked: true,
              unlockedDate: new Date().toISOString()
            };
          }

          return {
            totalStars: newTotalStars,
            currentStreak: newStreak,
            dailyRecords: newDailyRecords,
            achievements: newAchievements
          };
        });
      },

      addCustomTask: (name, category, stars) => {
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
        
        if (!todayRecord) return '今天还没有任务记录哦！';

        const completedTasks = todayRecord.tasks.filter(t => t.completed);
        const totalTasks = todayRecord.tasks.length;
        const completionRate = totalTasks > 0 ? (completedTasks.length / totalTasks * 100).toFixed(0) : 0;

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
        return todayRecord?.tasks || [];
      },

      getTodayProgress: () => {
        const todayTasks = get().getTodayTasks();
        if (todayTasks.length === 0) return 0;
        const completed = todayTasks.filter(t => t.completed).length;
        return (completed / todayTasks.length) * 100;
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

        return { totalStars, completionRate };
      }
    }),
    {
      name: 'piggy-bank-storage',
    }
  )
);

// 初始化今天的默认任务
export const initializeTodayTasks = () => {
  const store = useStore.getState();
  const todayTasks = store.getTodayTasks();
  
  if (todayTasks.length === 0) {
    defaultTaskTemplates.forEach(template => {
      store.addTask({
        ...template,
        completed: false
      });
    });
  }
};