import React, { useState } from 'react';
import { UserHydration } from '../types';
import { downloadSourceCodeZip } from '../utils/exportSource';

interface HeaderProps {
  hydration: UserHydration;
  onOpenNotifications?: () => void;
  onOpenProfile?: () => void;
  onViewApiDocs?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  hydration,
  onViewApiDocs,
}) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [downloadingZip, setDownloadingZip] = useState(false);

  const handleDownloadSource = async () => {
    try {
      setDownloadingZip(true);
      await downloadSourceCodeZip();
    } catch (e) {
      console.error(e);
    } finally {
      setTimeout(() => setDownloadingZip(false), 1000);
    }
  };

  const notificationsList = [
    {
      id: '1',
      title: 'Nhắc nhở uống nước',
      desc: 'Đã đến giờ nạp 200ml để giữ trạng thái hydrat hóa tốt!',
      time: '5 phút trước',
      unread: true,
    },
    {
      id: '2',
      title: 'Đã hoàn thành khử khuẩn UV-C',
      desc: 'Bình HydroPulse Pro đã tự khử khuẩn bằng tia UV-C 280nm thành công.',
      time: '1 giờ trước',
      unread: false,
    },
    {
      id: '3',
      title: 'Đồng bộ Apple Health',
      desc: 'Đã nạp 500ml từ bài tập thể dục buổi sáng.',
      time: '2 giờ trước',
      unread: false,
    },
  ];

  return (
    <header className="fixed top-0 left-72 right-0 h-16 bg-[#ffffff]/90 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.03)] border-b border-[#ebeef1] z-40 flex items-center justify-between px-6">
      {/* Left: Weather Context Capsule */}
      <div className="flex items-center gap-3">
        <span className="material-symbols-outlined text-[#00658d] text-[22px]">
          bubble_chart
        </span>
        <div className="flex items-center gap-2 bg-[#f1f4f7] px-4 py-1.5 rounded-full border border-[#e0e3e6]/60 shadow-[0_1px_4px_rgba(0,0,0,0.02)]">
          <span className="material-symbols-outlined text-[18px] text-[#00aeb9]">
            routine
          </span>
          <span className="text-[13px] text-[#181c1e] font-medium">
            Hà Nội, 28°C • Độ ẩm 65% - Khuyến nghị tăng 300ml
          </span>
        </div>
      </div>

      {/* Right: Actions, Notifications, User Profile */}
      <div className="flex items-center gap-3">
        {/* 1-Click Source Code ZIP Download Button */}
        <button
          type="button"
          onClick={handleDownloadSource}
          disabled={downloadingZip}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#00658d] hover:bg-[#004c6b] text-white text-[12px] font-bold shadow-sm transition-all active:scale-95 disabled:opacity-75"
          title="Tải toàn bộ mã nguồn dự án về máy tính (.zip)"
        >
          <span className={`material-symbols-outlined text-[16px] ${downloadingZip ? 'animate-spin' : ''}`}>
            {downloadingZip ? 'sync' : 'download'}
          </span>
          <span>{downloadingZip ? 'Đang nén zip...' : 'Tải Source Code (.zip)'}</span>
        </button>

        {onViewApiDocs && (
          <button
            type="button"
            onClick={onViewApiDocs}
            className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#c6e7ff]/60 hover:bg-[#c6e7ff] text-[#004c6b] text-[12px] font-bold border border-[#83cfff]/50 transition-all shadow-sm"
          >
            <span className="material-symbols-outlined text-[16px]">integration_instructions</span>
            <span>API Docs cho BE</span>
          </button>
        )}

        {/* Notifications Button */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 rounded-full hover:bg-[#ebeef1] text-[#3e4850] transition-colors"
            title="Thông báo"
          >
            <span className="material-symbols-outlined text-[22px]">notifications</span>
            <span className="absolute top-1.5 right-1.5 h-2.5 w-2.5 rounded-full bg-[#ba1a1a] ring-2 ring-white"></span>
          </button>

          {/* Notifications Dropdown */}
          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-[#bdc8d1]/50 p-3 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
              <div className="flex items-center justify-between pb-2 border-b border-[#ebeef1]">
                <span className="font-bold text-[14px] text-[#181c1e]">Thông báo</span>
                <span className="text-[11px] text-[#00658d] font-semibold cursor-pointer hover:underline">
                  Đánh dấu đã đọc
                </span>
              </div>
              <div className="flex flex-col gap-2 mt-2 max-h-72 overflow-y-auto">
                {notificationsList.map((n) => (
                  <div
                    key={n.id}
                    className={`p-2.5 rounded-xl transition-all ${
                      n.unread ? 'bg-[#f1f4f7]' : 'hover:bg-[#f7fafd]'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[13px] font-bold text-[#181c1e]">{n.title}</span>
                      <span className="text-[10px] text-[#6e7881]">{n.time}</span>
                    </div>
                    <p className="text-[12px] text-[#3e4850] mt-0.5">{n.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* User Profile */}
        <div className="flex items-center gap-3 pl-2 border-l border-[#ebeef1]">
          <div className="flex flex-col text-right">
            <span className="text-[14px] font-bold text-[#181c1e] leading-tight">
              Minh Anh
            </span>
            <span className="text-[12px] text-[#00658d] font-semibold">
              Mục tiêu: {hydration.currentIntakeMl.toLocaleString()} / {hydration.dailyGoalMl.toLocaleString()}ml
            </span>
          </div>
          <div className="relative">
            <img
              alt="Minh Anh Profile"
              className="w-9 h-9 rounded-full object-cover shadow-[0_0_0_2px_rgba(0,168,232,0.4)]"
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80"
            />
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-[#00aeb9] ring-1.5 ring-white"></span>
          </div>
        </div>
      </div>
    </header>
  );
};
