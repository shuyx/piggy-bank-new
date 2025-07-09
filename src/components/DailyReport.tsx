import React, { useState } from 'react';
import { useStore } from '../stores/useStore';

export const DailyReport: React.FC = () => {
  const { generateDailyReport, exportData, importData } = useStore();
  const [showReport, setShowReport] = useState(false);
  const [report, setReport] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [isImporting, setIsImporting] = useState(false);

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

  const handleExportData = async () => {
    setIsExporting(true);
    
    try {
      const dataJson = exportData();
      const blob = new Blob([dataJson], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `猪猪银行数据备份_${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      alert('数据导出成功！');
    } catch (error) {
      console.error('导出失败:', error);
      alert('导出失败，请重试');
    } finally {
      setIsExporting(false);
    }
  };

  const handleImportData = async () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;
      
      setIsImporting(true);
      
      try {
        const text = await file.text();
        const success = await importData(text);
        
        if (success) {
          alert('数据导入成功！页面即将刷新。');
          setTimeout(() => {
            window.location.reload();
          }, 1000);
        } else {
          alert('数据导入失败，请检查文件格式是否正确。');
        }
      } catch (error) {
        console.error('导入失败:', error);
        alert('导入失败，请检查文件格式是否正确。');
      } finally {
        setIsImporting(false);
      }
    };
    input.click();
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

      {/* 数据导出导入区域 */}
      <div className="mt-6 pt-4 border-t border-gray-200">
        <h3 className="text-2xl font-bold text-piggy-blue mb-3">数据管理</h3>
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={handleExportData}
            disabled={isExporting}
            className={`flex-1 bg-gradient-to-r from-green-500 to-emerald-500 text-white px-4 py-2 rounded-lg font-medium transition-all transform hover:scale-105 ${
              isExporting ? 'opacity-75 cursor-not-allowed' : 'hover:shadow-lg'
            }`}
          >
            {isExporting ? (
              <div className="flex items-center justify-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                导出中...
              </div>
            ) : (
              <div className="flex items-center justify-center gap-2">
                <span>💾</span>
                导出数据
              </div>
            )}
          </button>
          
          <button
            onClick={handleImportData}
            disabled={isImporting}
            className={`flex-1 bg-gradient-to-r from-blue-500 to-indigo-500 text-white px-4 py-2 rounded-lg font-medium transition-all transform hover:scale-105 ${
              isImporting ? 'opacity-75 cursor-not-allowed' : 'hover:shadow-lg'
            }`}
          >
            {isImporting ? (
              <div className="flex items-center justify-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                导入中...
              </div>
            ) : (
              <div className="flex items-center justify-center gap-2">
                <span>📥</span>
                导入数据
              </div>
            )}
          </button>
        </div>
        
        <div className="mt-3 text-xs text-gray-500 text-center">
          <div className="mb-1">💡 导出：下载包含所有历史数据的JSON文件</div>
          <div>📤 导入：从JSON文件恢复数据（会覆盖当前数据）</div>
        </div>
      </div>
    </div>
  );
};

export {};