import React, { useState } from 'react';
import { useStore } from '../stores/useStore';

export const DailyReport: React.FC = () => {
  const { generateDailyReport } = useStore();
  const [showReport, setShowReport] = useState(false);
  const [report, setReport] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerateReport = async () => {
    setIsGenerating(true);
    
    // 添加一点延迟效果，让用户感受到在生成报告
    setTimeout(() => {
      const newReport = generateDailyReport();
      setReport(newReport);
      setShowReport(true);
      setIsGenerating(false);
    }, 800);
  };

  const shareReport = () => {
    if (navigator.share) {
      navigator.share({
        title: '猪猪银行 - 今日报告',
        text: report,
      });
    } else {
      // 复制到剪贴板
      navigator.clipboard.writeText(report).then(() => {
        alert('报告已复制到剪贴板！');
      });
    }
  };

  return (
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
              onClick={shareReport}
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
  );
};

export {};