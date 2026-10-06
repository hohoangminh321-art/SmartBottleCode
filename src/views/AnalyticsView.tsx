import React, { useState } from 'react';
import { UserHydration } from '../types';
import { soundEffects } from '../utils/audio';

interface AnalyticsViewProps {
  hydration: UserHydration;
  onOpenPdfReport: () => void;
  onQuickLog: (amountMl: number, note: string) => void;
  onApplyAiSuggestions: () => void;
}

export const AnalyticsView: React.FC<AnalyticsViewProps> = ({
  hydration,
  onOpenPdfReport,
  onQuickLog,
  onApplyAiSuggestions,
}) => {
  const [period, setPeriod] = useState<'week' | 'month' | 'year'>('week');
  const [aiApplied, setAiApplied] = useState(false);
  const [appleHealthSyncing, setAppleHealthSyncing] = useState(false);
  const [activeDayIndex, setActiveDayIndex] = useState<number | null>(6); // Default Sunday

  const daysData = [
    { day: 'T2', amount: 2420, height: 140, y: 70, note: 'Đạt 96.8% mục tiêu' },
    { day: 'T3', amount: 2600, height: 152, y: 58, note: 'Vượt mục tiêu +100ml' },
    { day: 'T4', amount: 2550, height: 148, y: 62, note: 'Vượt mục tiêu +50ml' },
    { day: 'T5', amount: 2320, height: 133, y: 77, note: 'Lệch -180ml do họp dài' },
    { day: 'T6', amount: 2520, height: 146, y: 64, note: 'Đạt 100.8% mục tiêu' },
    { day: 'T7', amount: 2700, height: 160, y: 50, note: 'Vượt +200ml (Ngày chạy bộ)' },
    { day: 'CN', amount: 1740, height: 85, y: 125, isCurrent: true, note: 'Đang diễn ra (Dự kiến 2.500ml)' },
  ];

  const handleApplyAi = () => {
    soundEffects.playWaterDrop();
    onApplyAiSuggestions();
    setAiApplied(true);
    setTimeout(() => setAiApplied(false), 3000);
  };

  const handleAppleHealthSync = () => {
    setAppleHealthSyncing(true);
    soundEffects.playDigitalCue();
    setTimeout(() => {
      setAppleHealthSyncing(false);
    }, 1200);
  };

  return (
    <div className="flex flex-col gap-6 w-full max-w-[1360px] mx-auto pb-8">
      {/* Page Header & Global Filtering */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 bg-[#ffffff] p-6 rounded-2xl shadow-sm border border-[#ebeef1]">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center justify-center p-1 rounded-full bg-[#00a8e8]/15 text-[#00658d]">
              <span className="material-symbols-outlined text-[18px]">query_stats</span>
            </span>
            <span className="text-[11px] uppercase tracking-widest text-[#49607e] font-bold">
              Báo cáo Sinh trắc học Hydro-IoT
            </span>
          </div>
          <h1 className="text-[28px] md:text-[32px] font-bold text-[#181c1e] tracking-tight">
            Phân tích & Báo cáo Thói quen
          </h1>
          <p className="text-[14px] text-[#49607e]">
            Đồng bộ hoá tự động từ cảm biến bình HydroPulse Pro và dữ liệu sinh học cá nhân
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Period Selector Tabs */}
          <div className="inline-flex p-1 bg-[#f1f4f7] rounded-xl border border-[#ebeef1]">
            <button
              type="button"
              onClick={() => setPeriod('week')}
              className={`px-4 py-1.5 rounded-lg text-[13px] font-bold transition-all ${
                period === 'week'
                  ? 'bg-white text-[#00658d] shadow-sm'
                  : 'text-[#49607e] hover:text-[#181c1e]'
              }`}
            >
              Tuần này
            </button>
            <button
              type="button"
              onClick={() => setPeriod('month')}
              className={`px-4 py-1.5 rounded-lg text-[13px] font-bold transition-all ${
                period === 'month'
                  ? 'bg-white text-[#00658d] shadow-sm'
                  : 'text-[#49607e] hover:text-[#181c1e]'
              }`}
            >
              Tháng này
            </button>
            <button
              type="button"
              onClick={() => setPeriod('year')}
              className={`px-4 py-1.5 rounded-lg text-[13px] font-bold transition-all ${
                period === 'year'
                  ? 'bg-white text-[#00658d] shadow-sm'
                  : 'text-[#49607e] hover:text-[#181c1e]'
              }`}
            >
              Năm nay
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onOpenPdfReport}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#ebeef1] text-[#181c1e] hover:bg-[#e0e3e6] transition-colors text-[13px] font-bold shadow-sm"
            >
              <span className="material-symbols-outlined text-[18px] text-[#006970]">download</span>
              <span>Xuất PDF</span>
            </button>
            <button
              type="button"
              onClick={handleAppleHealthSync}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#00a8e8] text-white hover:bg-[#008fc7] shadow-sm transition-all text-[13px] font-bold active:scale-95"
            >
              <span className={`material-symbols-outlined text-[18px] ${appleHealthSyncing ? 'animate-spin' : ''}`}>
                sync_saved_locally
              </span>
              <span>{appleHealthSyncing ? 'Đang đồng bộ...' : 'Apple Health'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* KPI Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1 */}
        <div className="flex flex-col justify-between p-6 rounded-2xl bg-[#ffffff] shadow-sm border border-[#ebeef1]">
          <div className="flex items-center justify-between">
            <span className="text-[12px] font-bold text-[#49607e]">Tổng lượng tiêu thụ</span>
            <span className="material-symbols-outlined text-[#00658d] p-2 bg-[#00a8e8]/10 rounded-xl text-[20px]">
              water_drop
            </span>
          </div>
          <div className="my-3">
            <div className="flex items-baseline gap-1">
              <span className="text-[36px] font-extrabold text-[#181c1e] leading-tight">
                {period === 'week' ? '16.850' : period === 'month' ? '72.400' : '840.500'}
              </span>
              <span className="text-[13px] font-bold text-[#49607e]">ml</span>
            </div>
            <div className="w-full bg-[#ebeef1] rounded-full h-1.5 mt-2 overflow-hidden">
              <div className="bg-[#00658d] h-full rounded-full" style={{ width: '96%' }}></div>
            </div>
          </div>
          <div className="flex items-center justify-between text-[11px]">
            <span className="text-[#006970] font-bold flex items-center gap-0.5">
              <span className="material-symbols-outlined text-[14px]">arrow_upward</span>+8% tuần trước
            </span>
            <span className="text-[#49607e] font-semibold">Đạt 96% mục tiêu</span>
          </div>
        </div>

        {/* KPI 2 */}
        <div className="flex flex-col justify-between p-6 rounded-2xl bg-[#ffffff] shadow-sm border border-[#ebeef1]">
          <div className="flex items-center justify-between">
            <span className="text-[12px] font-bold text-[#49607e]">Hoàn thành mục tiêu</span>
            <span className="material-symbols-outlined text-[#006970] p-2 bg-[#00aeb9]/10 rounded-xl text-[20px]">
              verified
            </span>
          </div>
          <div className="my-3">
            <div className="flex items-baseline gap-1">
              <span className="text-[36px] font-extrabold text-[#181c1e] leading-tight">
                6<span className="text-[#49607e]/50 text-[20px]">/7</span>
              </span>
              <span className="text-[13px] font-bold text-[#49607e]">ngày</span>
            </div>
            <div className="w-full bg-[#ebeef1] rounded-full h-1.5 mt-2 overflow-hidden">
              <div className="bg-[#00aeb9] h-full rounded-full" style={{ width: '85.7%' }}></div>
            </div>
          </div>
          <div className="flex items-center justify-between text-[11px]">
            <span className="text-[#006970] font-bold">Hiệu suất 85.7%</span>
            <span className="text-[#49607e]">Lệch T5 (-180ml)</span>
          </div>
        </div>

        {/* KPI 3 */}
        <div className="flex flex-col justify-between p-6 rounded-2xl bg-[#ffffff] shadow-sm border border-[#ebeef1]">
          <div className="flex items-center justify-between">
            <span className="text-[12px] font-bold text-[#49607e]">Tần suất trung bình</span>
            <span className="material-symbols-outlined text-[#00658d] p-2 bg-[#c4dcff]/30 rounded-xl text-[20px]">
              pace
            </span>
          </div>
          <div className="my-3">
            <div className="flex items-baseline gap-1">
              <span className="text-[36px] font-extrabold text-[#181c1e] leading-tight">7.2</span>
              <span className="text-[13px] font-bold text-[#49607e]">lần / ngày</span>
            </div>
            <p className="text-[12px] text-[#49607e] mt-1 font-medium">Chu kỳ uống: ~2.1 giờ/lần</p>
          </div>
          <div className="flex items-center gap-1 text-[11px] text-[#006970] font-bold">
            <span className="material-symbols-outlined text-[14px]">check_circle</span>
            <span>Nhịp sinh học ổn định</span>
          </div>
        </div>

        {/* KPI 4 */}
        <div className="flex flex-col justify-between p-6 rounded-2xl bg-[#ffffff] shadow-sm border border-[#ebeef1]">
          <div className="flex items-center justify-between">
            <span className="text-[12px] font-bold text-[#49607e]">Nhiệt độ ưa chuộng</span>
            <span className="material-symbols-outlined text-[#00658d] p-2 bg-[#c6e7ff]/40 rounded-xl text-[20px]">
              device_thermostat
            </span>
          </div>
          <div className="my-3">
            <div className="flex items-baseline gap-1">
              <span className="text-[36px] font-extrabold text-[#181c1e] leading-tight">20° - 24°</span>
              <span className="text-[13px] font-bold text-[#49607e]">C</span>
            </div>
            <p className="text-[12px] text-[#49607e] mt-1 font-medium">Nước mát nhiệt độ phòng</p>
          </div>
          <div className="flex items-center justify-between text-[11px]">
            <span className="px-2 py-0.5 rounded-full bg-[#c4dcff] text-[#003952] font-bold">
              Tối ưu hấp thụ
            </span>
            <span className="text-[#49607e] font-medium">Cảm biến nắp</span>
          </div>
        </div>
      </div>

      {/* Main Visualizations: Daily Intake Spline Chart & Heatmap */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Volume Chart (2 Cols) */}
        <div className="lg:col-span-2 flex flex-col p-6 rounded-2xl bg-[#ffffff] shadow-sm border border-[#ebeef1]">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4">
            <div className="flex flex-col">
              <h2 className="text-[18px] font-bold text-[#181c1e]">
                Lượng nước & Độ đều đặn hàng ngày
              </h2>
              <p className="text-[12px] text-[#49607e]">
                So sánh thực tế uống với hạn mức tiêu chuẩn 2.500ml
              </p>
            </div>
            <div className="flex items-center gap-4 text-[12px]">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-[#00a8e8]"></span>
                <span className="text-[#181c1e] font-semibold">Lượng uống (ml)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3.5 h-0.5 bg-[#ba1a1a]"></span>
                <span className="text-[#ba1a1a] font-bold">Mục tiêu (2.500ml)</span>
              </div>
            </div>
          </div>

          {/* SVG Hydration Bar & Target Line Chart */}
          <div className="relative w-full h-64 mt-2">
            <svg
              className="w-full h-full"
              fill="none"
              preserveAspectRatio="none"
              viewBox="0 0 700 240"
            >
              {/* Grid Lines */}
              <line stroke="#E5E8EB" strokeDasharray="3 3" x1="40" x2="680" y1="20" y2="20"></line>
              <text className="text-[10px] font-semibold" fill="#6E7881" x="5" y="24">3.000</text>
              <line stroke="#BA1A1A" strokeDasharray="4 2" strokeOpacity="0.6" x1="40" x2="680" y1="65" y2="65"></line>
              <text className="text-[10px] font-bold" fill="#BA1A1A" x="5" y="69">2.500</text>
              <line stroke="#E5E8EB" strokeDasharray="3 3" x1="40" x2="680" y1="120" y2="120"></line>
              <text className="text-[10px] font-semibold" fill="#6E7881" x="5" y="124">1.800</text>
              <line stroke="#E5E8EB" strokeDasharray="3 3" x1="40" x2="680" y1="175" y2="175"></line>
              <text className="text-[10px] font-semibold" fill="#6E7881" x="5" y="179">1.000</text>
              <line stroke="#BDC8D1" x1="40" x2="680" y1="210" y2="210"></line>

              {/* Target reference pill */}
              <rect fill="#FFDAD6" height="20" rx="4" width="95" x="585" y="52"></rect>
              <text className="text-[10px] font-bold" fill="#93000A" x="592" y="66">Mục tiêu ngày</text>

              {/* Bars for Mon - Sun */}
              <rect onClick={() => setActiveDayIndex(0)} className="cursor-pointer hover:opacity-80 transition-opacity" fill="#00A8E8" height="140" rx="6" width="36" x="75" y="70"></rect>
              <rect onClick={() => setActiveDayIndex(1)} className="cursor-pointer hover:opacity-80 transition-opacity" fill="#00658D" height="152" rx="6" width="36" x="160" y="58"></rect>
              <rect onClick={() => setActiveDayIndex(2)} className="cursor-pointer hover:opacity-80 transition-opacity" fill="#00A8E8" height="148" rx="6" width="36" x="245" y="62"></rect>
              <rect onClick={() => setActiveDayIndex(3)} className="cursor-pointer hover:opacity-80 transition-opacity" fill="#83CFFF" height="133" rx="6" width="36" x="330" y="77"></rect>
              <rect onClick={() => setActiveDayIndex(4)} className="cursor-pointer hover:opacity-80 transition-opacity" fill="#00658D" height="146" rx="6" width="36" x="415" y="64"></rect>
              <rect onClick={() => setActiveDayIndex(5)} className="cursor-pointer hover:opacity-80 transition-opacity" fill="#00A8E8" height="160" rx="6" width="36" x="500" y="50"></rect>
              {/* Sun (ongoing) */}
              <rect onClick={() => setActiveDayIndex(6)} className="cursor-pointer" fill="#00A8E8" fillOpacity="0.4" height="85" rx="6" stroke="#00A8E8" strokeDasharray="3 3" width="36" x="585" y="125"></rect>

              {/* Daily Spline Trend Overlay */}
              <path
                d="M 93 70 C 135 60, 140 58, 178 58 C 215 58, 220 62, 263 62 C 300 62, 310 77, 348 77 C 390 77, 395 64, 433 64 C 475 64, 480 50, 518 50 C 555 50, 565 125, 603 125"
                fill="none"
                stroke="#006970"
                strokeLinecap="round"
                strokeWidth="2.5"
              ></path>

              {/* Spline Nodes */}
              <circle cx="93" cy="70" fill="#FFFFFF" r="4" stroke="#006970" strokeWidth="2.5"></circle>
              <circle cx="178" cy="58" fill="#FFFFFF" r="4" stroke="#006970" strokeWidth="2.5"></circle>
              <circle cx="263" cy="62" fill="#FFFFFF" r="4" stroke="#006970" strokeWidth="2.5"></circle>
              <circle cx="348" cy="77" fill="#FFFFFF" r="4" stroke="#006970" strokeWidth="2.5"></circle>
              <circle cx="433" cy="64" fill="#FFFFFF" r="4" stroke="#006970" strokeWidth="2.5"></circle>
              <circle cx="518" cy="50" fill="#FFFFFF" r="4" stroke="#006970" strokeWidth="2.5"></circle>
              <circle cx="603" cy="125" fill="#FFFFFF" r="4" stroke="#006970" strokeWidth="2.5"></circle>

              {/* X Labels */}
              <text className="font-bold text-[12px]" fill="#3E4850" x="80" y="230">T2</text>
              <text className="font-bold text-[12px]" fill="#3E4850" x="166" y="230">T3</text>
              <text className="font-bold text-[12px]" fill="#3E4850" x="251" y="230">T4</text>
              <text className="font-bold text-[12px]" fill="#3E4850" x="336" y="230">T5</text>
              <text className="font-bold text-[12px]" fill="#3E4850" x="421" y="230">T6</text>
              <text className="font-bold text-[12px]" fill="#3E4850" x="506" y="230">T7</text>
              <text className="font-extrabold text-[12px]" fill="#00658D" x="591" y="230">CN</text>
            </svg>
          </div>

          <div className="mt-4 pt-3 flex flex-wrap items-center justify-between text-[#49607e] text-[12px] bg-[#f1f4f7] p-3 rounded-xl border border-[#ebeef1]">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px] text-[#006970]">info</span>
              <span>
                {activeDayIndex !== null ? (
                  <>
                    <strong className="text-[#181c1e]">{daysData[activeDayIndex].day}: </strong>
                    {daysData[activeDayIndex].amount.toLocaleString()}ml ({daysData[activeDayIndex].note})
                  </>
                ) : (
                  'Hôm nay (Chủ nhật) đã hoàn tất 1.740ml lúc 16:30. Dự kiến đạt 2.500ml trước 21:00.'
                )}
              </span>
            </div>
            <span className="font-bold text-[#00658d] bg-[#c6e7ff]/40 px-2 py-0.5 rounded-full">
              Tiến độ 69.6%
            </span>
          </div>
        </div>

        {/* Hydration Heatmap (1 Col) */}
        <div className="flex flex-col justify-between p-6 rounded-2xl bg-[#ffffff] shadow-sm border border-[#ebeef1]">
          <div className="flex flex-col">
            <div className="flex items-center justify-between">
              <h2 className="text-[18px] font-bold text-[#181c1e]">Bản đồ nhiệt giờ uống</h2>
              <span className="p-1 rounded-lg bg-[#ebeef1] text-[#49607e]">
                <span className="material-symbols-outlined text-[18px]">wb_sunny</span>
              </span>
            </div>
            <p className="text-[12px] text-[#49607e] mt-0.5">
              Phân bổ lượng nước tiêu thụ qua các khung giờ
            </p>
          </div>

          {/* Heatmap Grid */}
          <div className="flex flex-col gap-2 my-4">
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#f1f4f7]">
              <div className="flex items-center gap-2.5">
                <span className="text-[11px] font-semibold text-[#49607e] w-20">06:00 - 09:00</span>
                <div className="flex gap-1">
                  <span className="w-5 h-5 rounded bg-[#00a8e8]/20"></span>
                  <span className="w-5 h-5 rounded bg-[#00a8e8]/40"></span>
                  <span className="w-5 h-5 rounded bg-[#00a8e8]/60"></span>
                </div>
              </div>
              <span className="text-[11px] font-bold text-[#3e4850]">380 ml</span>
            </div>

            <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#00a8e8]/10 border border-[#00a8e8]/20">
              <div className="flex items-center gap-2.5">
                <span className="text-[11px] font-bold text-[#00658d] w-20">09:00 - 11:00</span>
                <div className="flex gap-1">
                  <span className="w-5 h-5 rounded bg-[#00a8e8]"></span>
                  <span className="w-5 h-5 rounded bg-[#00658d]"></span>
                  <span className="w-5 h-5 rounded bg-[#00658d]"></span>
                </div>
              </div>
              <span className="text-[11px] font-bold text-[#00658d]">820 ml (Cao điểm)</span>
            </div>

            <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#f1f4f7]">
              <div className="flex items-center gap-2.5">
                <span className="text-[11px] font-semibold text-[#49607e] w-20">11:00 - 14:00</span>
                <div className="flex gap-1">
                  <span className="w-5 h-5 rounded bg-[#00a8e8]/30"></span>
                  <span className="w-5 h-5 rounded bg-[#00a8e8]/30"></span>
                  <span className="w-5 h-5 rounded bg-[#00a8e8]/40"></span>
                </div>
              </div>
              <span className="text-[11px] font-bold text-[#3e4850]">420 ml</span>
            </div>

            <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#00a8e8]/10 border border-[#00a8e8]/20">
              <div className="flex items-center gap-2.5">
                <span className="text-[11px] font-bold text-[#00658d] w-20">14:00 - 16:00</span>
                <div className="flex gap-1">
                  <span className="w-5 h-5 rounded bg-[#00658d]"></span>
                  <span className="w-5 h-5 rounded bg-[#00a8e8]"></span>
                  <span className="w-5 h-5 rounded bg-[#00658d]"></span>
                </div>
              </div>
              <span className="text-[11px] font-bold text-[#00658d]">760 ml (Cao điểm)</span>
            </div>

            <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#f1f4f7]">
              <div className="flex items-center gap-2.5">
                <span className="text-[11px] font-semibold text-[#49607e] w-20">18:00 - 22:00</span>
                <div className="flex gap-1">
                  <span className="w-5 h-5 rounded bg-[#00a8e8]/20"></span>
                  <span className="w-5 h-5 rounded bg-[#00a8e8]/10"></span>
                  <span className="w-5 h-5 rounded bg-[#e0e3e6]"></span>
                </div>
              </div>
              <span className="text-[11px] font-semibold text-[#49607e]">210 ml (Thấp)</span>
            </div>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-[#ebeef1] text-[11px] text-[#49607e] font-medium">
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-[#e0e3e6]"></span>Ít uống
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-[#00a8e8]"></span>Vừa phải
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-[#00658d]"></span>Uống dồn
            </span>
          </div>
        </div>
      </div>

      {/* Secondary Row: Temperature Breakdown Donut + AI Expert Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Donut Chart (5 Cols) */}
        <div className="lg:col-span-5 flex flex-col justify-between p-6 rounded-2xl bg-[#ffffff] shadow-sm border border-[#ebeef1]">
          <div>
            <div className="flex items-center justify-between mb-1">
              <h2 className="text-[18px] font-bold text-[#181c1e]">Nhiệt độ & Độ tươi của nước</h2>
              <span className="material-symbols-outlined text-[#006970]">water_ph</span>
            </div>
            <p className="text-[12px] text-[#49607e]">Phân tích cảm biến lòng bình kép HydroPulse</p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-around gap-6 my-5">
            {/* Donut SVG Chart */}
            <div className="relative w-36 h-36 flex items-center justify-center shrink-0">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
                <circle cx="60" cy="60" fill="transparent" r="48" stroke="#EBEEF1" strokeWidth="14"></circle>
                {/* Nước mát 62% */}
                <circle
                  cx="60"
                  cy="60"
                  fill="transparent"
                  r="48"
                  stroke="#00A8E8"
                  strokeDasharray="301.6"
                  strokeDashoffset="114.6"
                  strokeLinecap="round"
                  strokeWidth="14"
                ></circle>
                {/* Nước ấm 28% */}
                <circle
                  className="origin-center rotate-[223deg]"
                  cx="60"
                  cy="60"
                  fill="transparent"
                  r="48"
                  stroke="#00658D"
                  strokeDasharray="301.6"
                  strokeDashoffset="217.2"
                  strokeLinecap="round"
                  strokeWidth="14"
                ></circle>
                {/* Nước lạnh 10% */}
                <circle
                  className="origin-center rotate-[324deg]"
                  cx="60"
                  cy="60"
                  fill="transparent"
                  r="48"
                  stroke="#00DBE9"
                  strokeDasharray="301.6"
                  strokeDashoffset="271.5"
                  strokeLinecap="round"
                  strokeWidth="14"
                ></circle>
              </svg>
              <div className="absolute flex flex-col items-center">
                <span className="text-[22px] font-bold text-[#181c1e]">22°C</span>
                <span className="text-[10px] font-bold text-[#49607e]">Trung bình</span>
              </div>
            </div>

            {/* Donut Legend */}
            <div className="flex flex-col gap-3 w-full sm:w-auto">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-[#00a8e8]"></span>
                  <span className="text-[13px] text-[#181c1e]">Nước mát (20-25°C)</span>
                </div>
                <span className="text-[13px] font-bold text-[#181c1e]">62%</span>
              </div>
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-[#00658d]"></span>
                  <span className="text-[13px] text-[#181c1e]">Nước ấm (35-45°C)</span>
                </div>
                <span className="text-[13px] font-bold text-[#181c1e]">28%</span>
              </div>
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-[#00dbe9]"></span>
                  <span className="text-[13px] text-[#181c1e]">Nước lạnh (&lt;15°C)</span>
                </div>
                <span className="text-[13px] font-bold text-[#181c1e]">10%</span>
              </div>
            </div>
          </div>

          {/* Freshness Guard Card */}
          <div className="flex items-start gap-3 p-4 rounded-xl bg-[#f1f4f7] border border-[#ebeef1]">
            <div className="p-2 rounded-lg bg-white text-[#00658d] shadow-sm">
              <span className="material-symbols-outlined text-[20px]">timer</span>
            </div>
            <div className="flex flex-col flex-1">
              <div className="flex items-center justify-between">
                <span className="text-[13px] font-bold text-[#181c1e]">
                  Thời gian lưu nước hiện tại
                </span>
                <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-[#c4dcff] text-[#003952] font-bold">
                  6 giờ 20 phút
                </span>
              </div>
              <p className="text-[12px] text-[#49607e] mt-1 leading-relaxed">
                Chu kỳ tiệt trùng UV-C tự động còn <span className="text-[#006970] font-bold">4h 12p</span>. Hệ thống sẽ phát chuông cảnh báo thay nước nếu vượt quá 18 giờ.
              </p>
            </div>
          </div>
        </div>

        {/* AI HydroPulse Insights (7 Cols) */}
        <div className="lg:col-span-7 flex flex-col justify-between p-6 rounded-2xl bg-gradient-to-br from-[#ffffff] via-[#ffffff] to-[#c4dcff]/20 shadow-sm border border-[#ebeef1] relative overflow-hidden">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-[#00658d] text-white shadow-sm">
                <span className="material-symbols-outlined text-[20px]">auto_awesome</span>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-[18px] font-bold text-[#181c1e]">
                    Góc Chuyên gia AI HydroPulse
                  </h2>
                  <span className="px-2 py-0.5 rounded-full bg-[#7df4ff] text-[#002022] text-[10px] font-bold">
                    Thuật toán v3.4
                  </span>
                </div>
                <p className="text-[12px] text-[#49607e]">
                  Phân tích nhịp uống cá nhân hoá theo lịch sinh hoạt & thời tiết
                </p>
              </div>
            </div>
            <span className="material-symbols-outlined text-[#49607e]">more_horiz</span>
          </div>

          <div className="flex flex-col gap-3 my-4">
            {/* Pattern Alert Card */}
            <div className="p-4 rounded-xl bg-white shadow-sm border border-[#ebeef1] flex flex-col gap-1.5">
              <div className="flex items-center gap-2 text-[#00658d] text-[12px] font-bold">
                <span className="material-symbols-outlined text-[18px]">history_toggle_off</span>
                <span>Phát hiện thói quen bù nước</span>
              </div>
              <p className="text-[13px] text-[#181c1e]">
                <strong className="text-[#181c1e]">Thứ 4 và Thứ 5</strong> bạn thường uống dồn dập vào cuối buổi chiều (15:00 - 17:30) thay vì chia đều trong ngày.
              </p>
              <div className="flex items-center gap-2 text-[#ba1a1a] text-[12px] font-medium pt-0.5">
                <span className="material-symbols-outlined text-[16px]">warning</span>
                <span>Việc uống dồn hơn 650ml cùng lúc làm thận tăng tải 24% và giảm hiệu quả hydrat hoá tế bào.</span>
              </div>
            </div>

            {/* Contextual Recommendation Card */}
            <div className="p-4 rounded-xl bg-[#00a8e8]/10 border border-[#00a8e8]/20 flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-[#003952] text-[12px] font-bold">
                  <span className="material-symbols-outlined text-[18px]">directions_run</span>
                  <span>Gợi ý tối ưu cho ngày mai (Thứ 2)</span>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#00a8e8] text-white font-bold">
                  Khuyến nghị cao
                </span>
              </div>
              <p className="text-[13px] text-[#181c1e]">
                Dự báo ngày mai thời tiết khô nóng <strong>32°C</strong> kèm lịch chạy bộ ngoài trời <strong>5km</strong> từ Apple Fitness, hệ thống khuyến nghị:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div className="flex items-center gap-2 p-2.5 rounded-xl bg-white shadow-sm">
                  <span className="material-symbols-outlined text-[#00658d] text-[22px]">add_circle</span>
                  <div className="flex flex-col">
                    <span className="text-[10px] text-[#49607e] uppercase font-bold">Tăng mục tiêu</span>
                    <span className="text-[13px] font-bold text-[#181c1e]">2.800 ml (+300ml)</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 p-2.5 rounded-xl bg-white shadow-sm">
                  <span className="material-symbols-outlined text-[#006970] text-[22px]">notifications_active</span>
                  <div className="flex flex-col">
                    <span className="text-[10px] text-[#49607e] uppercase font-bold">Chu kỳ nhắc LED bình</span>
                    <span className="text-[13px] font-bold text-[#181c1e]">35 phút / lần</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 pt-1 border-t border-[#ebeef1]">
            <span className="text-[12px] text-[#49607e] flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[16px] text-[#006970]">check_circle</span>
              <span>Đã đồng bộ với Apple Watch Ultra 2</span>
            </span>
            <button
              type="button"
              onClick={handleApplyAi}
              className={`px-4 py-2 rounded-xl text-[13px] font-bold transition-all shadow-sm ${
                aiApplied
                  ? 'bg-[#00aeb9] text-white'
                  : 'bg-[#00658d] text-white hover:bg-[#004c6b]'
              }`}
            >
              {aiApplied ? 'Đã áp dụng thành công! ⚡' : 'Áp dụng thiết lập tự động'}
            </button>
          </div>
        </div>
      </div>

      {/* Quick Micro-Intake Logging Banner */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-5 rounded-2xl bg-[#ffffff] shadow-sm border border-[#ebeef1]">
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-full bg-[#c4dcff] text-[#00658d]">
            <span className="material-symbols-outlined text-[24px]">local_cafe</span>
          </div>
          <div className="flex flex-col">
            <span className="text-[14px] font-bold text-[#181c1e]">
              Bạn vừa uống nước ngoài bình HydroPulse?
            </span>
            <span className="text-[12px] text-[#49607e]">
              Ghi nhận nhanh cà phê, trà hoặc nước lọc từ ly văn phòng để chỉ số luôn chính xác
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0 flex-wrap">
          <button
            type="button"
            onClick={() => onQuickLog(150, 'Ly nhỏ 150ml')}
            className="px-4 py-2 rounded-xl bg-[#f1f4f7] hover:bg-[#c6e7ff] text-[#181c1e] hover:text-[#003952] font-bold text-[13px] transition-all"
          >
            +150ml Ly nhỏ
          </button>
          <button
            type="button"
            onClick={() => onQuickLog(250, 'Cốc vừa 250ml')}
            className="px-4 py-2 rounded-xl bg-[#f1f4f7] hover:bg-[#c6e7ff] text-[#181c1e] hover:text-[#003952] font-bold text-[13px] transition-all"
          >
            +250ml Cốc vừa
          </button>
          <button
            type="button"
            onClick={() => onQuickLog(350, 'Cà phê/Trà 350ml')}
            className="px-4 py-2 rounded-xl bg-[#f1f4f7] hover:bg-[#c6e7ff] text-[#181c1e] hover:text-[#003952] font-bold text-[13px] transition-all"
          >
            +350ml Cà phê/Trà
          </button>
        </div>
      </div>
    </div>
  );
};
