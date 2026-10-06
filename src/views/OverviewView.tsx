import React, { useState } from 'react';
import { BottleState, UserHydration, IntakeLog } from '../types';
import { soundEffects } from '../utils/audio';

interface OverviewViewProps {
  bottle: BottleState;
  hydration: UserHydration;
  logs: IntakeLog[];
  onOpenManualLog: () => void;
  onOpenSensorDetails: () => void;
  onQuickSync: () => void;
  onDrinkNow: () => void;
  onSnooze: () => void;
  onOpenPdfReport: () => void;
  isSyncing: boolean;
}

export const OverviewView: React.FC<OverviewViewProps> = ({
  bottle,
  hydration,
  logs,
  onOpenManualLog,
  onOpenSensorDetails,
  onQuickSync,
  onDrinkNow,
  onSnooze,
  onOpenPdfReport,
  isSyncing,
}) => {
  const [drinkSuccessMsg, setDrinkSuccessMsg] = useState(false);
  const [snoozeMsg, setSnoozeMsg] = useState(false);

  // Hourly intake data for the circadian chart
  const hourlyData = [
    { hour: '07h', amount: 150, heightPercent: 25 },
    { hour: '08h', amount: 200, heightPercent: 35 },
    { hour: '09h', amount: 100, heightPercent: 18 },
    { hour: '10h', amount: 300, heightPercent: 52 },
    { hour: '11h', amount: 300, heightPercent: 52 },
    { hour: '12h', amount: 150, heightPercent: 25 },
    { hour: '13h', amount: 50, heightPercent: 10 },
    { hour: '14h', amount: 450, heightPercent: 78, isPeak: true },
    { hour: '15h', amount: 150, heightPercent: 26 },
    { hour: '16h', amount: 200, heightPercent: 35, isFuture: true },
    { hour: '17h', amount: 150, heightPercent: 25, isFuture: true },
  ];

  // Daily interval milestones
  const milestones = [
    { time: '08:30', amount: '350ml' },
    { time: '10:15', amount: '400ml' },
    { time: '11:45', amount: '300ml' },
    { time: '14:00', amount: '500ml' },
    { time: '15:30', amount: '300ml' },
  ];

  const handleDrinkClick = () => {
    soundEffects.playWaterDrop();
    onDrinkNow();
    setDrinkSuccessMsg(true);
    setTimeout(() => setDrinkSuccessMsg(false), 2200);
  };

  const handleSnoozeClick = () => {
    soundEffects.playDigitalCue();
    onSnooze();
    setSnoozeMsg(true);
    setTimeout(() => setSnoozeMsg(false), 2200);
  };

  // Remaining milliliters calculation
  const remainingMl = Math.max(0, hydration.dailyGoalMl - hydration.currentIntakeMl);
  const progressPercent = Math.min(100, Math.round((hydration.currentIntakeMl / hydration.dailyGoalMl) * 100));

  // Circular progress calculations for r=50 (circumference = 314.15)
  const circumference = 314.15;
  const strokeOffset = circumference - (circumference * progressPercent) / 100;

  // Bottle water level percentage
  const bottleLevelPercent = Math.min(100, Math.round((bottle.waterLevelMl / bottle.capacityMl) * 100));

  // Format countdown mm:ss
  const minutes = Math.floor(hydration.countdownSeconds / 60);
  const seconds = hydration.countdownSeconds % 60;
  const countdownFormatted = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

  return (
    <div className="flex flex-col w-full gap-6">
      {/* Welcome Banner Card */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#ffffff] p-6 rounded-2xl shadow-[0_4px_24px_rgba(0,101,141,0.04)] border border-[#ebeef1] relative overflow-hidden">
        <div className="absolute -right-16 -top-16 w-56 h-56 bg-[#00a8e8]/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="flex flex-col gap-1 relative z-10">
          <div className="flex items-center gap-2">
            <h1 className="text-[26px] md:text-[30px] font-bold text-[#181c1e] tracking-tight">
              Chào buổi chiều, Minh Anh! 👋
            </h1>
          </div>
          <p className="text-[15px] text-[#49607e] max-w-2xl leading-relaxed">
            Bạn đang duy trì thói quen rất tốt. Hãy uống thêm một ngụm nước để giữ năng lượng sảng khoái nhé!
          </p>
        </div>
        <div className="flex items-center gap-3 relative z-10 flex-wrap">
          <button
            onClick={onQuickSync}
            type="button"
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#f1f4f7] text-[#00658d] hover:bg-[#ebeef1] transition-all font-semibold text-[14px]"
          >
            <span className={`material-symbols-outlined text-[20px] ${isSyncing ? 'animate-spin' : ''}`}>
              sync
            </span>
            <span>Đồng bộ ngay</span>
          </button>
          <button
            onClick={onOpenManualLog}
            type="button"
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#00a8e8] to-[#00658d] text-white shadow-[0_4px_16px_rgba(0,168,232,0.3)] hover:shadow-[0_0_20px_rgba(0,219,233,0.5)] hover:scale-[1.01] active:scale-[0.98] transition-all font-bold text-[14px]"
          >
            <span className="material-symbols-outlined text-[20px]">add_circle</span>
            <span>Ghi nhận uống thủ công</span>
          </button>
        </div>
      </div>

      {/* Top 3-Columns Grid: Smart Bottle / Hydration Progress / Next Reminder */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Card 1: Bình Nước HydroPulse Telemetry */}
        <div className="lg:col-span-4 bg-[#ffffff] rounded-2xl p-6 shadow-[0_4px_20px_rgba(10,37,64,0.04)] border border-[#ebeef1] flex flex-col justify-between relative overflow-hidden">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[#00658d] text-[22px]">smart_toy</span>
              <h2 className="text-[18px] font-bold text-[#181c1e]">Bình Nước HydroPulse</h2>
            </div>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#c4dcff]/60 text-[#00658d] text-[11px] font-bold">
              <span className="w-2 h-2 rounded-full bg-[#00aeb9] animate-pulse"></span>
              LED Sẵn sàng
            </span>
          </div>

          {/* Fluid Cylinder Visualizer & Specs */}
          <div className="my-5 flex flex-col sm:flex-row items-center justify-center gap-6 relative">
            {/* Visualizer Cylinder */}
            <div className="relative w-28 h-64 bg-[#f1f4f7] rounded-3xl p-1.5 flex flex-col justify-end shadow-inner overflow-hidden border border-[#bdc8d1]/30">
              <div className="absolute top-2 inset-x-0 mx-auto w-12 h-3 bg-[#e5e8eb] rounded-full opacity-60"></div>
              
              {/* Dynamic Animated Liquid Layer */}
              <div
                className="w-full bg-gradient-to-t from-[#00658d] to-[#00a8e8] rounded-2xl relative overflow-hidden transition-all duration-1000 shadow-[0_0_20px_rgba(0,168,232,0.4)]"
                style={{ height: `${bottleLevelPercent}%` }}
              >
                <svg
                  className="absolute -top-3 left-0 w-[200%] h-6 fill-[#ffffff]/30 animate-wave"
                  preserveAspectRatio="none"
                  viewBox="0 0 100 20"
                >
                  <path d="M0 10 Q 25 20, 50 10 T 100 10 V 20 H 0 Z"></path>
                </svg>
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#00dbe9]/20 to-[#00658d]/40"></div>
              </div>

              {/* Water Metric Text Overlay */}
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-[34px] font-extrabold text-[#181c1e] drop-shadow-sm leading-tight">
                  {bottleLevelPercent}%
                </span>
                <span className="text-[12px] font-semibold text-[#49607e]">
                  {bottle.waterLevelMl} / {bottle.capacityMl}ml
                </span>
              </div>
            </div>

            {/* Quick Metrics Column */}
            <div className="flex flex-col gap-2.5 w-full sm:w-auto">
              <div className="p-3 rounded-xl bg-[#f1f4f7] flex items-center gap-3 border border-[#ebeef1]">
                <div className="w-9 h-9 rounded-lg bg-[#7df4ff]/30 flex items-center justify-center text-[#006970]">
                  <span className="material-symbols-outlined text-[20px]">thermostat</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold text-[#49607e] uppercase">Nhiệt độ nước</span>
                  <span className="text-[14px] font-bold text-[#181c1e]">
                    {bottle.temperatureC}°C <span className="text-[#006970] font-normal text-[12px]">• Mát lành</span>
                  </span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-[#f1f4f7] flex items-center gap-3 border border-[#ebeef1]">
                <div className="w-9 h-9 rounded-lg bg-[#c4dcff] flex items-center justify-center text-[#00658d]">
                  <span className="material-symbols-outlined text-[20px]">battery_charging_full</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold text-[#49607e] uppercase">Dung lượng pin</span>
                  <span className="text-[14px] font-bold text-[#181c1e]">
                    {bottle.batteryPercent}% <span className="text-[#49607e] font-normal text-[12px]">• ~{bottle.batteryDaysEstimate} ngày</span>
                  </span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-[#f1f4f7] flex items-center gap-3 border border-[#ebeef1]">
                <div className="w-9 h-9 rounded-lg bg-[#c6e7ff] flex items-center justify-center text-[#004c6b]">
                  <span className="material-symbols-outlined text-[20px]">verified</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold text-[#49607e] uppercase">Khử khuẩn UV-C</span>
                  <span className="text-[14px] font-semibold text-[#00658d]">
                    {bottle.isSterilizing ? 'Đang khử trùng...' : `Tự động sau ${bottle.nextUvHours}h`}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between text-[#49607e] pt-1 border-t border-[#ebeef1]">
            <span className="text-[12px]">Cập nhật qua BLE: Vừa xong</span>
            <button
              onClick={onOpenSensorDetails}
              className="text-[#00658d] font-bold text-[12px] hover:underline"
              type="button"
            >
              Chi tiết cảm biến →
            </button>
          </div>
        </div>

        {/* Card 2: Tiến Độ Uống Nước */}
        <div className="lg:col-span-5 bg-[#ffffff] rounded-2xl p-6 shadow-[0_4px_20px_rgba(10,37,64,0.04)] border border-[#ebeef1] flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <div className="flex flex-col">
              <h2 className="text-[18px] font-bold text-[#181c1e]">Tiến Độ Uống Nước</h2>
              <span className="text-[12px] text-[#49607e]">Mục tiêu cá nhân hoá theo thể trạng</span>
            </div>
            <span className="px-3 py-1 rounded-full bg-[#c6e7ff] text-[#001e2d] text-[12px] font-bold">
              Mục tiêu: {hydration.dailyGoalMl.toLocaleString()}ml
            </span>
          </div>

          {/* Radial Gauge & Remaining breakdown */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 my-4">
            <div className="relative w-40 h-40 flex items-center justify-center shrink-0">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
                <circle
                  cx="60"
                  cy="60"
                  r="50"
                  fill="transparent"
                  stroke="#e5e8eb"
                  strokeWidth="10"
                />
                <circle
                  cx="60"
                  cy="60"
                  r="50"
                  fill="transparent"
                  stroke="#00658d"
                  strokeWidth="10"
                  strokeLinecap="round"
                  strokeDasharray="314.15"
                  strokeDashoffset={strokeOffset}
                  className="transition-all duration-1000 ease-out"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-[38px] font-extrabold text-[#00658d] leading-none">
                  {progressPercent}%
                </span>
                <span className="text-[11px] font-bold text-[#49607e] mt-1">
                  {hydration.currentIntakeMl.toLocaleString()}ml nạp
                </span>
              </div>
            </div>

            <div className="flex flex-col gap-2 w-full">
              <div className="p-3 rounded-xl bg-[#f1f4f7] flex justify-between items-center border border-[#ebeef1]">
                <span className="text-[13px] text-[#49607e]">Còn thiếu để đạt chỉ tiêu:</span>
                <span className="text-[18px] font-bold text-[#00658d]">{remainingMl} ml</span>
              </div>
              <div className="p-3 rounded-xl bg-[#f1f4f7] flex justify-between items-center border border-[#ebeef1]">
                <span className="text-[13px] text-[#49607e]">Thời gian hoạt động còn:</span>
                <span className="text-[14px] font-bold text-[#181c1e]">
                  {hydration.activeHoursLeft} giờ {hydration.activeMinutesLeft} phút
                </span>
              </div>
              <div className="flex items-center gap-1.5 px-1 text-[#49607e] mt-0.5">
                <span className="material-symbols-outlined text-[16px] text-[#006970]">check_circle</span>
                <span className="text-[12px]">Đã vượt 15% so với cùng giờ hôm qua</span>
              </div>
            </div>
          </div>

          {/* Daily Milestone Chips */}
          <div className="flex flex-col gap-1.5 pt-2 border-t border-[#ebeef1]">
            <span className="text-[10px] font-bold text-[#49607e] uppercase tracking-wider">
              Các mốc nạp nước trong ngày
            </span>
            <div className="grid grid-cols-5 gap-1.5 text-center">
              {milestones.map((m, idx) => (
                <div key={idx} className="p-1.5 rounded-lg bg-[#f1f4f7] border border-[#ebeef1]">
                  <div className="text-[10px] font-semibold text-[#49607e]">{m.time}</div>
                  <div className="text-[12px] font-bold text-[#00658d]">{m.amount}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Card 3: Nhắc Nhở Kế */}
        <div className="lg:col-span-3 bg-gradient-to-br from-[#00a8e8]/10 via-[#ffffff] to-[#ffffff] rounded-2xl p-6 shadow-[0_4px_20px_rgba(10,37,64,0.04)] border border-[#ebeef1] flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <h2 className="text-[18px] font-bold text-[#181c1e]">Nhắc Nhở Kế</h2>
            <span className="material-symbols-outlined text-[#00658d] text-[24px]">
              notifications_active
            </span>
          </div>

          <div className="my-4 flex flex-col items-center text-center p-4 rounded-2xl bg-[#ffffff]/90 backdrop-blur-md shadow-sm border border-[#ebeef1]">
            <div className="w-16 h-16 rounded-full bg-[#c6e7ff] flex items-center justify-center mb-2 relative">
              <span className="material-symbols-outlined text-[#00658d] text-[32px]">
                hourglass_top
              </span>
              <span className="absolute -top-1 -right-1 flex h-4 w-4">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#006970] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-4 w-4 bg-[#00aeb9]"></span>
              </span>
            </div>
            <span className="text-[10px] font-bold text-[#49607e] uppercase tracking-wider">
              Đếm ngược uống nước
            </span>
            <span className="text-[40px] font-extrabold text-[#181c1e] my-0.5 tracking-tight">
              {countdownFormatted}
            </span>
            <span className="text-[13px] font-semibold text-[#00658d]">
              Dự kiến lúc 16:15 ({hydration.countdownSeconds > 0 ? '200ml' : 'Đến giờ!'})
            </span>
            <div className="flex items-center gap-1.5 mt-2 text-[#49607e] text-[11px] font-medium">
              <span className="material-symbols-outlined text-[16px] text-[#00aeb9]">
                light_mode
              </span>
              <span>Đèn LED xanh & chuông nhẹ</span>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <button
              onClick={handleDrinkClick}
              type="button"
              className="w-full py-2.5 rounded-xl bg-[#00658d] hover:bg-[#004c6b] text-white font-bold text-[14px] shadow-[0_4px_12px_rgba(0,101,141,0.25)] transition-all active:scale-95"
            >
              {drinkSuccessMsg ? 'Đã ghi nhận! 💧' : 'Uống ngay bây giờ'}
            </button>
            <button
              onClick={handleSnoozeClick}
              type="button"
              className="w-full py-2 rounded-xl bg-[#e5e8eb] hover:bg-[#e0e3e6] text-[#181c1e] font-semibold text-[13px] transition-colors"
            >
              {snoozeMsg ? 'Đã hoãn 15 phút ⏰' : 'Hoãn 15 phút'}
            </button>
          </div>
        </div>
      </div>

      {/* Middle 3 KPI Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-[#ffffff] p-5 rounded-2xl shadow-[0_2px_12px_rgba(10,37,64,0.03)] border border-[#ebeef1] flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-[#c4dcff] flex items-center justify-center text-[#00658d] shrink-0">
            <span className="material-symbols-outlined text-[26px]">pace</span>
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] font-bold text-[#49607e] uppercase tracking-wider">
              Tần suất trung bình
            </span>
            <div className="flex items-baseline gap-1">
              <span className="text-[24px] font-bold text-[#181c1e] leading-tight">
                {hydration.avgFrequencyMinutes}
              </span>
              <span className="text-[13px] text-[#49607e]">phút / lần</span>
            </div>
            <span className="text-[12px] text-[#006970] mt-0.5 font-medium">
              Tối ưu cho thận & năng lượng
            </span>
          </div>
        </div>

        <div className="bg-[#ffffff] p-5 rounded-2xl shadow-[0_2px_12px_rgba(10,37,64,0.03)] border border-[#ebeef1] flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-[#7df4ff]/30 flex items-center justify-center text-[#006970] shrink-0">
            <span className="material-symbols-outlined text-[26px]">device_thermostat</span>
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] font-bold text-[#49607e] uppercase tracking-wider">
              Nhiệt độ nạp ưa thích
            </span>
            <div className="flex items-baseline gap-1">
              <span className="text-[24px] font-bold text-[#181c1e] leading-tight">
                {hydration.preferredTempC}°C
              </span>
              <span className="text-[13px] text-[#49607e]">trung bình</span>
            </div>
            <span className="text-[12px] text-[#00658d] mt-0.5 font-medium">
              Đạt ngưỡng hấp thu tốt nhất
            </span>
          </div>
        </div>

        <div className="bg-[#ffffff] p-5 rounded-2xl shadow-[0_2px_12px_rgba(10,37,64,0.03)] border border-[#ebeef1] flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-[#ffdad6]/40 flex items-center justify-center text-[#ba1a1a] shrink-0">
            <span className="material-symbols-outlined text-[26px]">local_fire_department</span>
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] font-bold text-[#49607e] uppercase tracking-wider">
              Chuỗi ngày kỷ lục (Streak)
            </span>
            <div className="flex items-baseline gap-1">
              <span className="text-[24px] font-bold text-[#181c1e] leading-tight">
                {hydration.streakDays}
              </span>
              <span className="text-[13px] text-[#49607e]">ngày liên tục 🔥</span>
            </div>
            <span className="text-[12px] text-[#49617f] mt-0.5 font-medium">
              Top 5% người dùng tích cực nhất
            </span>
          </div>
        </div>
      </div>

      {/* Bottom Grid: Hourly Intake vs Circadian Rhythm & Recent Activity Logs */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Hourly Chart (8 cols) */}
        <div className="lg:col-span-8 bg-[#ffffff] p-6 rounded-2xl shadow-[0_4px_20px_rgba(10,37,64,0.04)] border border-[#ebeef1] flex flex-col justify-between">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
            <div className="flex flex-col">
              <h2 className="text-[18px] font-bold text-[#181c1e]">
                Lượng Nước Tiêu Thụ Theo Giờ
              </h2>
              <span className="text-[12px] text-[#49607e]">
                So sánh với mức khuyến nghị nhịp sinh học
              </span>
            </div>
            <div className="flex items-center gap-4 text-[12px]">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-sm bg-[#00a8e8]"></span>
                <span className="text-[#49607e] font-semibold">Thực tế (ml)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-0.5 bg-[#b0c8eb]"></span>
                <span className="text-[#49607e] font-semibold">Khuyến nghị sinh học</span>
              </div>
            </div>
          </div>

          {/* Interactive Chart Canvas */}
          <div className="h-64 w-full relative flex items-end justify-between pt-6 pb-2 px-2">
            <div className="absolute inset-x-0 top-12 h-px bg-[#e0e3e6]/40"></div>
            <div className="absolute inset-x-0 top-28 h-px bg-[#e0e3e6]/40"></div>
            <div className="absolute inset-x-0 top-44 h-px bg-[#e0e3e6]/40"></div>

            {/* Curving guideline SVG overlay */}
            <svg
              className="absolute inset-0 w-full h-full pointer-events-none"
              preserveAspectRatio="none"
              viewBox="0 0 600 200"
            >
              <path
                d="M 20 170 Q 150 140, 280 110 T 580 90"
                fill="none"
                stroke="#b0c8eb"
                strokeDasharray="4 4"
                strokeWidth="2"
              ></path>
            </svg>

            {/* Hourly Bars */}
            {hourlyData.map((d, index) => (
              <div
                key={index}
                className={`flex flex-col items-center gap-1.5 h-full justify-end z-10 w-8 group cursor-pointer ${
                  d.isFuture ? 'opacity-40' : ''
                }`}
              >
                <span className="text-[10px] font-bold text-[#00658d] opacity-0 group-hover:opacity-100 transition-opacity">
                  {d.amount}
                </span>
                <div
                  className={`w-full rounded-t-md transition-all ${
                    d.isPeak
                      ? 'bg-[#00658d] shadow-[0_0_12px_rgba(0,101,141,0.3)]'
                      : d.isFuture
                      ? 'border border-dashed border-[#00a8e8]'
                      : 'bg-[#00a8e8]/60 group-hover:bg-[#00a8e8]'
                  }`}
                  style={{ height: `${d.heightPercent}%` }}
                ></div>
                <span className="text-[11px] font-semibold text-[#49607e] mt-1">{d.hour}</span>
              </div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between pt-2 bg-[#f1f4f7]/70 px-4 py-2.5 rounded-xl mt-3 text-[12px] gap-2 border border-[#ebeef1]">
            <span className="text-[#49607e]">
              Thời điểm uống nhiều nhất: <b className="text-[#181c1e]">14:00 (450ml sau giờ thể thao nhẹ)</b>
            </span>
            <span className="text-[11px] text-[#006970] font-bold bg-[#c6e7ff]/40 px-2 py-0.5 rounded-full">
              Nhịp sinh học chuẩn 92%
            </span>
          </div>
        </div>

        {/* Recent Intake Logs (4 cols) */}
        <div className="lg:col-span-4 bg-[#ffffff] p-6 rounded-2xl shadow-[0_4px_20px_rgba(10,37,64,0.04)] border border-[#ebeef1] flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[#00658d] text-[22px]">history</span>
              <h2 className="text-[18px] font-bold text-[#181c1e]">Nhật Ký Gần Đây</h2>
            </div>
            <button
              onClick={onOpenPdfReport}
              className="text-[#00658d] font-bold text-[12px] hover:underline"
              type="button"
            >
              Tất cả
            </button>
          </div>

          <div className="flex flex-col gap-2 divide-y divide-[#ebeef1]">
            {logs.map((log) => (
              <div key={log.id} className="flex items-center justify-between py-2">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                      log.type === 'auto'
                        ? 'bg-[#f1f4f7] text-[#00658d]'
                        : 'bg-[#c4dcff]/50 text-[#49607e]'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[20px]">
                      {log.type === 'auto' ? 'water_drop' : 'edit_note'}
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[13px] font-bold text-[#181c1e]">
                        +{log.amountMl} ml
                      </span>
                      <span
                        className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                          log.type === 'auto'
                            ? 'bg-[#c6e7ff] text-[#001e2d]'
                            : 'bg-[#e5e8eb] text-[#3e4850]'
                        }`}
                      >
                        {log.type === 'auto' ? 'Tự động' : 'Nhập tay'}
                      </span>
                    </div>
                    <span className="text-[11px] text-[#49607e]">{log.note}</span>
                  </div>
                </div>
                <span className="text-[11px] font-semibold text-[#49607e]">{log.time}</span>
              </div>
            ))}
          </div>

          <div className="mt-4 pt-2 border-t border-[#ebeef1]">
            <button
              onClick={onOpenPdfReport}
              className="w-full py-2.5 rounded-xl bg-[#f1f4f7] text-[#00658d] font-bold text-[13px] hover:bg-[#ebeef1] transition-colors flex items-center justify-center gap-1.5"
              type="button"
            >
              <span className="material-symbols-outlined text-[18px]">download</span>
              <span>Xuất báo cáo PDF ngày</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
