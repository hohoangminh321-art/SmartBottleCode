import React from 'react';
import { NavigationTab } from '../types';

interface SidebarProps {
  currentTab: NavigationTab;
  onSelectTab: (tab: NavigationTab) => void;
  bleConnected: boolean;
  batteryPercent: number;
  onQuickSync: () => void;
  isSyncing: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onSelectTab,
  bleConnected,
  batteryPercent,
  onQuickSync,
  isSyncing,
}) => {
  const navItems = [
    {
      id: 'overview' as NavigationTab,
      label: 'Tổng quan',
      icon: 'water_drop',
    },
    {
      id: 'reminders' as NavigationTab,
      label: 'Lịch & Hẹn giờ nhắc',
      icon: 'alarm',
    },
    {
      id: 'analytics' as NavigationTab,
      label: 'Phân tích & Báo cáo',
      icon: 'insights',
    },
    {
      id: 'device' as NavigationTab,
      label: 'Quản lý thiết bị',
      icon: 'tune',
    },
  ];

  return (
    <aside className="fixed left-0 top-0 h-full w-72 bg-[#ffffff] shadow-[0_1px_12px_rgba(0,101,141,0.06)] z-50 flex flex-col justify-between p-4 border-r border-[#ebeef1]">
      <div className="flex flex-col gap-6">
        {/* Brand Header */}
        <div className="flex items-center gap-3 px-1 cursor-pointer" onClick={() => onSelectTab('overview')}>
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#00658d] to-[#00dbe9] flex items-center justify-center text-white shadow-md shadow-[#00a8e8]/20">
            <span className="material-symbols-outlined text-[24px]">water_drop</span>
          </div>
          <div className="flex flex-col">
            <span className="text-[18px] font-bold text-[#00658d] leading-tight tracking-tight">
              HydroPulse
            </span>
            <span className="text-[10px] font-bold text-[#49607e] uppercase tracking-wider">
              Smart Hydration
            </span>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="flex flex-col gap-1">
          {navItems.map((item) => {
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onSelectTab(item.id)}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-xl font-semibold text-[14px] transition-all text-left ${
                  isActive
                    ? 'bg-[#c6e7ff] text-[#003952] shadow-sm font-bold'
                    : 'text-[#3e4850] hover:bg-[#ebeef1] hover:text-[#181c1e]'
                }`}
              >
                <span
                  className={`material-symbols-outlined text-[22px] ${
                    isActive ? 'text-[#00658d]' : 'text-[#49607e]'
                  }`}
                >
                  {item.icon}
                </span>
                <span>{item.label}</span>
              </button>
            );
          })}

          {/* Special Dev API Spec Tab */}
          <div className="pt-2 mt-2 border-t border-[#ebeef1]">
            <button
              type="button"
              onClick={() => onSelectTab('api-docs')}
              className={`w-full flex items-center justify-between px-4 py-2.5 rounded-xl font-semibold text-[13px] transition-all text-left ${
                currentTab === 'api-docs'
                  ? 'bg-[#00a8e8]/15 text-[#00658d] border border-[#00a8e8]/30 font-bold'
                  : 'text-[#49607e] hover:bg-[#f1f4f7] hover:text-[#00658d]'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-[20px] text-[#00aeb9]">
                  terminal
                </span>
                <span>Đặc tả Backend (BE)</span>
              </div>
              <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-[#00aeb9]/15 text-[#006970] font-bold">
                API Docs
              </span>
            </button>
          </div>
        </nav>
      </div>

      {/* Persistent Bottom Hardware Status Card */}
      <div className="p-4 rounded-2xl bg-[#f1f4f7] shadow-[0_2px_8px_rgba(0,101,141,0.04)] border border-[#e0e3e6]/60 flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2.5 w-2.5">
              <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${bleConnected ? 'bg-[#00aeb9]' : 'bg-[#ba1a1a]'} opacity-75`}></span>
              <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${bleConnected ? 'bg-[#006970]' : 'bg-[#ba1a1a]'}`}></span>
            </span>
            <span className="text-[12px] text-[#181c1e] font-bold">HydroPulse Pro</span>
          </div>
          <button
            onClick={onQuickSync}
            title="Đồng bộ ngay qua BLE"
            className="p-1 rounded-lg text-[#00658d] hover:bg-[#e5e8eb] transition-all active:scale-95"
            type="button"
          >
            <span className={`material-symbols-outlined text-[18px] inline-block ${isSyncing ? 'animate-spin' : ''}`}>
              sync
            </span>
          </button>
        </div>
        <div className="flex items-center justify-between text-[#49607e]">
          <span className="text-[12px] font-medium">
            {bleConnected ? 'BLE Đã kết nối' : 'Mất kết nối BLE'}
          </span>
          <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-[#c4dcff] text-[#003952]">
            Pin {batteryPercent}%
          </span>
        </div>
      </div>
    </aside>
  );
};
