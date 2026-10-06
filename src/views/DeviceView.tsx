import React, { useState } from 'react';
import { BottleState, UserHydration } from '../types';
import { soundEffects } from '../utils/audio';

interface DeviceViewProps {
  bottle: BottleState;
  hydration: UserHydration;
  onUpdateBottle: (updated: Partial<BottleState>) => void;
  onOpenBleScan: () => void;
  onOpenFirmware: () => void;
}

export const DeviceView: React.FC<DeviceViewProps> = ({
  bottle,
  hydration,
  onUpdateBottle,
  onOpenBleScan,
  onOpenFirmware,
}) => {
  const [toast, setToast] = useState<{ title: string; desc: string; icon: string } | null>(null);
  const [googleFitConnected, setGoogleFitConnected] = useState(false);
  const [calibrating, setCalibrating] = useState(false);
  const [uvTimer, setUvTimer] = useState<number | null>(bottle.isSterilizing ? bottle.uvSecondsLeft : null);

  const showToast = (title: string, desc: string, icon = 'check_circle') => {
    setToast({ title, desc, icon });
    setTimeout(() => {
      setToast(null);
    }, 3800);
  };

  // Find My Bottle
  const handleFindBottle = () => {
    soundEffects.playFindBottleAlert();
    showToast(
      'Đang phát tín hiệu tìm bình',
      'Bình HydroPulse Pro đang phát chuông âm thanh 85dB và nhấp nháy đèn LED Cyan 360°!',
      'notifications_active'
    );
  };

  // Calibrate 0ml
  const handleCalibrate = () => {
    setCalibrating(true);
    soundEffects.playDigitalCue();
    showToast(
      'Bắt đầu hiệu chuẩn 0ml',
      'Vui lòng giữ bình rỗng đứng yên trên mặt bàn phẳng trong 3 giây để cảm biến siêu âm thiết lập mốc không.',
      'square_foot'
    );
    setTimeout(() => {
      setCalibrating(false);
      showToast('Hiệu chuẩn hoàn tất', 'Cảm biến siêu âm đã cân chỉnh mốc 0ml với độ lệch ±0.5ml.', 'verified');
    }, 3500);
  };

  // Soft Restart
  const handleRestart = () => {
    soundEffects.playDigitalCue();
    showToast(
      'Đang khởi động lại phần cứng',
      'Vi điều khiển HydroLogic OS đang Soft-Reset. Kết nối BLE sẽ tái lập sau 3s.',
      'restart_alt'
    );
  };

  // Trigger UV-C Sterilization
  const handleStartUv = () => {
    if (uvTimer !== null) return;
    onUpdateBottle({ isSterilizing: true });
    setUvTimer(180); // 3 minutes
    soundEffects.playDigitalCue();
    showToast(
      'Đã kích hoạt chu trình UV-C',
      'Đèn LED cực tím 280nm nắp bình đang hoạt động trong 180 giây. Diệt 99.9% vi khuẩn.',
      'wb_iridescent'
    );

    const interval = setInterval(() => {
      setUvTimer((prev) => {
        if (prev === null || prev <= 1) {
          clearInterval(interval);
          onUpdateBottle({ isSterilizing: false, lastUvMinutesAgo: 0 });
          return null;
        }
        return prev - 1;
      });
    }, 1000);
  };

  // Toggle Google Fit
  const handleToggleGoogleFit = () => {
    const nextState = !googleFitConnected;
    setGoogleFitConnected(nextState);
    soundEffects.playWaterDrop();
    showToast(
      nextState ? 'Đã liên kết Google Fit' : 'Đã ngắt kết nối Google Fit',
      nextState ? 'Dữ liệu nước uống sẽ được đồng bộ 2 chiều với Google Account.' : 'Đã hủy quyền truy cập Google Fit.'
    );
  };

  return (
    <div className="flex flex-col w-full gap-6">
      {/* Top Control Bar / Page Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="flex flex-col">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[11px] font-bold text-[#00658d] uppercase tracking-widest bg-[#c6e7ff] px-2.5 py-0.5 rounded-full">
              Hệ thống phần cứng IoT
            </span>
            <span className="inline-block w-2 h-2 rounded-full bg-[#00aeb9] animate-pulse"></span>
            <span className="text-[12px] font-semibold text-[#006970]">Trực tuyến</span>
          </div>
          <h1 className="text-[28px] md:text-[32px] font-bold text-[#181c1e] tracking-tight">
            Quản lý thiết bị & Cài đặt bình
          </h1>
          <p className="text-[14px] text-[#49607e] flex items-center gap-2 mt-0.5">
            <span className="material-symbols-outlined text-[16px] text-[#00aeb9]">sensors</span>
            <span>Bình đang kết nối trực tuyến qua Bluetooth 5.3 & Wi-Fi Sync (HydroPulse Core v2.4)</span>
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3 flex-wrap">
          <button
            type="button"
            onClick={onOpenBleScan}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#e5e8eb] hover:bg-[#e0e3e6] text-[#181c1e] font-bold text-[13px] transition-all shadow-sm active:scale-95"
          >
            <span className="material-symbols-outlined text-[18px] text-[#00658d]">
              bluetooth_searching
            </span>
            <span>Quét tìm bình mới</span>
          </button>

          <button
            type="button"
            onClick={onOpenFirmware}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#00658d] text-white font-bold text-[13px] shadow-md hover:shadow-[0_0_20px_rgba(0,168,232,0.4)] transition-all active:scale-95"
          >
            <span className="material-symbols-outlined text-[18px]">system_update</span>
            <span>Cập nhật Firmware</span>
            <span className="ml-1 text-[10px] font-extrabold px-1.5 py-0.5 rounded bg-white/20 text-white uppercase tracking-wider">
              {bottle.firmwareVersion} Mới nhất
            </span>
          </button>
        </div>
      </div>

      {/* Main Grid (5 cols vs 7 cols) */}
      <div className="grid grid-cols-12 gap-6">
        {/* Left Column: Hardware Showcase & Direct Telemetry (5 cols) */}
        <div className="col-span-12 xl:col-span-5 flex flex-col gap-6">
          {/* Smart Bottle Hardware Card */}
          <div className="relative bg-[#ffffff] rounded-2xl p-6 shadow-[0_4px_24px_rgba(0,101,141,0.06)] border border-[#ebeef1] overflow-hidden">
            <div className="absolute -right-16 -top-16 w-56 h-56 rounded-full bg-[#83cfff]/20 blur-3xl pointer-events-none"></div>
            <div className="absolute -left-12 bottom-0 w-44 h-44 rounded-full bg-[#00dbe9]/15 blur-2xl pointer-events-none"></div>

            <div className="relative z-10 flex flex-col">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#49607e]">
                    Model 2024 Flagship
                  </span>
                  <h2 className="text-[24px] font-bold text-[#181c1e]">HydroPulse Pro</h2>
                  <p className="text-[12px] text-[#49607e]">
                    Arctic Cyan • Thép không gỉ 316 chân không
                  </p>
                </div>
                <span className="px-3 py-1 rounded-full bg-[#7df4ff]/30 text-[#004f54] text-[11px] font-bold flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#006970]"></span>
                  <span>Đang ghép đôi</span>
                </span>
              </div>

              {/* Product Simulation Render Graphic */}
              <div className="relative my-4 py-4 flex items-center justify-center">
                <div className="relative w-48 h-64 flex items-center justify-center">
                  <div className="absolute inset-0 bg-gradient-to-t from-[#00a8e8]/20 to-transparent rounded-full blur-xl"></div>
                  <svg
                    className="w-full h-full drop-shadow-xl"
                    fill="none"
                    viewBox="0 0 160 280"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    {/* Smart Cap Assembly */}
                    <rect fill="#314865" height="12" rx="3" width="56" x="52" y="10"></rect>
                    <rect fill="#00658D" height="24" rx="4" width="76" x="42" y="22"></rect>
                    {/* LED Ring Indicator */}
                    <path
                      className="animate-pulse"
                      d="M44 42H116"
                      stroke="#00DBE9"
                      strokeLinecap="round"
                      strokeWidth="3"
                    ></path>
                    {/* Sensor Cap Module */}
                    <circle cx="80" cy="34" fill="#7DF4FF" r="5"></circle>
                    <circle
                      cx="80"
                      cy="34"
                      r="8"
                      stroke="#7DF4FF"
                      strokeDasharray="2 2"
                      strokeWidth="1"
                    ></circle>
                    {/* Neck Ring */}
                    <rect fill="#BDC8D1" height="6" width="64" x="48" y="46"></rect>
                    {/* Vacuum Insulated Bottle Body */}
                    <rect fill="url(#bottle_grad)" height="210" rx="14" width="88" x="36" y="52"></rect>
                    {/* Inner Window */}
                    <rect fill="#F1F4F7" fillOpacity="0.3" height="194" rx="8" width="76" x="42" y="60"></rect>
                    {/* Dynamic Liquid Layer */}
                    <path
                      d="M42 120 C 60 116, 100 124, 118 120 V 246 C 118 250, 114 254, 110 254 H 50 C 46 254, 42 250, 42 246 Z"
                      fill="url(#water_grad)"
                      fillOpacity="0.75"
                    ></path>
                    <path d="M42 120 Q 80 126 118 120" stroke="#7DF4FF" strokeWidth="2"></path>
                    {/* Engraved Logo */}
                    <text
                      fill="#FFFFFF"
                      fontFamily="Plus Jakarta Sans"
                      fontSize="10"
                      fontWeight="700"
                      letterSpacing="2"
                      opacity="0.65"
                      textAnchor="middle"
                      x="80"
                      y="195"
                    >
                      HYDROPULSE
                    </text>
                    {/* Base Grip Ring */}
                    <rect fill="#181C1E" fillOpacity="0.15" height="12" rx="4" width="84" x="38" y="254"></rect>
                    <defs>
                      <linearGradient id="bottle_grad" x1="36" x2="124" y1="52" y2="262" gradientUnits="userSpaceOnUse">
                        <stop stopColor="#00A8E8"></stop>
                        <stop offset="0.6" stopColor="#00658D"></stop>
                        <stop offset="1" stopColor="#004C6B"></stop>
                      </linearGradient>
                      <linearGradient id="water_grad" x1="42" x2="118" y1="120" y2="254" gradientUnits="userSpaceOnUse">
                        <stop stopColor="#00DBE9"></stop>
                        <stop offset="1" stopColor="#00658D"></stop>
                      </linearGradient>
                    </defs>
                  </svg>

                  {/* Floating Badges */}
                  <div className="absolute -right-2 top-8 bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-xl shadow-md flex items-center gap-1.5 border border-[#ebeef1]">
                    <span className="material-symbols-outlined text-[16px] text-[#00aeb9]">thermostat</span>
                    <span className="text-[11px] font-bold text-[#181c1e]">
                      {bottle.temperatureC}°C Chilled
                    </span>
                  </div>
                  <div className="absolute -left-2 bottom-12 bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-xl shadow-md flex items-center gap-1.5 border border-[#ebeef1]">
                    <span className="material-symbols-outlined text-[16px] text-[#00658d]">waves</span>
                    <span className="text-[11px] font-bold text-[#181c1e]">
                      {bottle.waterLevelMl}ml / {bottle.capacityMl}ml
                    </span>
                  </div>
                </div>
              </div>

              {/* 3 Quick Action Trigger Buttons */}
              <div className="grid grid-cols-3 gap-2.5 pt-1">
                <button
                  type="button"
                  onClick={handleFindBottle}
                  className="flex flex-col items-center justify-center p-3 rounded-xl bg-[#f1f4f7] hover:bg-[#c4dcff]/40 text-[#181c1e] transition-all group border border-[#ebeef1]"
                >
                  <span className="material-symbols-outlined text-[#00658d] mb-1 group-hover:scale-110 transition-transform">
                    notifications_active
                  </span>
                  <span className="text-[12px] font-bold text-center leading-tight">
                    Tìm bình của tôi
                  </span>
                  <span className="text-[10px] text-[#49607e] mt-0.5">Chuông & LED</span>
                </button>

                <button
                  type="button"
                  onClick={handleCalibrate}
                  className="flex flex-col items-center justify-center p-3 rounded-xl bg-[#f1f4f7] hover:bg-[#c4dcff]/40 text-[#181c1e] transition-all group border border-[#ebeef1]"
                >
                  <span className={`material-symbols-outlined text-[#00658d] mb-1 group-hover:rotate-45 transition-transform ${calibrating ? 'animate-spin' : ''}`}>
                    square_foot
                  </span>
                  <span className="text-[12px] font-bold text-center leading-tight">
                    Cân chỉnh 0ml
                  </span>
                  <span className="text-[10px] text-[#49607e] mt-0.5">Đặt bình rỗng</span>
                </button>

                <button
                  type="button"
                  onClick={handleRestart}
                  className="flex flex-col items-center justify-center p-3 rounded-xl bg-[#f1f4f7] hover:bg-[#ffdad6]/40 text-[#181c1e] transition-all group border border-[#ebeef1]"
                >
                  <span className="material-symbols-outlined text-[#49607e] group-hover:text-[#ba1a1a] mb-1 group-hover:rotate-180 transition-transform duration-500">
                    restart_alt
                  </span>
                  <span className="text-[12px] font-bold text-center leading-tight">
                    Khởi động lại
                  </span>
                  <span className="text-[10px] text-[#49607e] mt-0.5">Soft Reset</span>
                </button>
              </div>
            </div>
          </div>

          {/* Live Hardware Specifications Grid */}
          <div className="grid grid-cols-2 gap-4">
            {/* Battery Spec */}
            <div className="bg-[#ffffff] rounded-2xl p-4 shadow-sm border border-[#ebeef1] flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-[#49607e] uppercase">
                  Nguồn pin Li-Po
                </span>
                <span className="material-symbols-outlined text-[#006970] text-[20px]">
                  battery_charging_80
                </span>
              </div>
              <div className="my-2">
                <div className="flex items-baseline gap-1">
                  <span className="text-[36px] font-extrabold text-[#181c1e] leading-tight">
                    {bottle.batteryPercent}
                  </span>
                  <span className="text-[18px] font-bold text-[#00658d]">%</span>
                </div>
                <p className="text-[12px] text-[#49607e]">Còn ~{bottle.batteryDaysEstimate} ngày sử dụng</p>
              </div>
              <div className="flex items-center justify-between pt-2 border-t border-[#ebeef1]">
                <span className="text-[11px] font-semibold text-[#181c1e]">Tiết kiệm pin</span>
                <input
                  type="checkbox"
                  checked={bottle.powerSaveMode}
                  onChange={(e) => onUpdateBottle({ powerSaveMode: e.target.checked })}
                  className="w-4 h-4 rounded text-[#00658d] accent-[#00658d] cursor-pointer"
                />
              </div>
            </div>

            {/* Connectivity Spec */}
            <div className="bg-[#ffffff] rounded-2xl p-4 shadow-sm border border-[#ebeef1] flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-[#49607e] uppercase">
                  Tín hiệu đồng bộ
                </span>
                <span className="material-symbols-outlined text-[#00658d] text-[20px]">
                  wifi
                </span>
              </div>
              <div className="my-2">
                <div className="flex items-center gap-1.5">
                  <span className="text-[14px] font-bold text-[#181c1e]">
                    BLE {bottle.bleRssi} dBm
                  </span>
                  <span className="text-[10px] text-[#006970] bg-[#7df4ff]/30 px-1.5 py-0.5 rounded font-bold">
                    Tốt
                  </span>
                </div>
                <p className="text-[12px] text-[#49607e] truncate mt-0.5">Wi-Fi: Home_Office_2.4G</p>
              </div>
              <div className="text-right pt-2 border-t border-[#ebeef1]">
                <span
                  onClick={() => showToast('Kết nối BLE ổn định', 'Tốc độ phản hồi 18ms, không ghi nhận mất gói tin.', 'wifi')}
                  className="text-[11px] font-bold text-[#00658d] cursor-pointer hover:underline"
                >
                  Kiểm tra kết nối
                </span>
              </div>
            </div>

            {/* Volume & Material */}
            <div className="bg-[#ffffff] rounded-2xl p-4 shadow-sm border border-[#ebeef1] flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-[#49607e] uppercase">
                  Thể tích bình
                </span>
                <span className="material-symbols-outlined text-[#49607e] text-[20px]">
                  local_drink
                </span>
              </div>
              <div className="my-2">
                <div className="text-[22px] font-bold text-[#181c1e]">{bottle.capacityMl} ml</div>
                <p className="text-[12px] text-[#49607e]">Trọng lượng rỗng: 340g</p>
              </div>
              <div className="text-[11px] font-medium text-[#49607e] pt-2 border-t border-[#ebeef1]">
                Thép y tế SS316 không gỉ
              </div>
            </div>

            {/* Cap Sensors */}
            <div className="bg-[#ffffff] rounded-2xl p-4 shadow-sm border border-[#ebeef1] flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-[#49607e] uppercase">
                  Cảm biến nắp
                </span>
                <span className="material-symbols-outlined text-[#49607e] text-[20px]">
                  stream_apps
                </span>
              </div>
              <div className="my-2 flex flex-col gap-0.5 text-[12px]">
                <div className="flex items-center justify-between">
                  <span className="text-[#181c1e]">Siêu âm đo mức</span>
                  <span className="text-[#006970] font-bold">Chuẩn xác</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#181c1e]">Hồng ngoại nhiệt</span>
                  <span className="text-[#006970] font-bold">±0.2°C</span>
                </div>
              </div>
              <div className="text-[11px] font-bold text-[#00658d] pt-2 border-t border-[#ebeef1]">
                Thời gian phản hồi: 200ms
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Calibration, Bio Profile & Integrations (7 cols) */}
        <div className="col-span-12 xl:col-span-7 flex flex-col gap-6">
          {/* Section: Cài đặt Cảm biến & Tính năng thông minh */}
          <div className="bg-[#ffffff] rounded-2xl p-6 shadow-[0_4px_24px_rgba(0,101,141,0.06)] border border-[#ebeef1] flex flex-col gap-4">
            <div className="flex items-center justify-between pb-2 border-b border-[#ebeef1]">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#00658d] text-[22px]">tune</span>
                <h3 className="text-[18px] font-bold text-[#181c1e]">
                  Cài đặt Cảm biến & Tính năng thông minh
                </h3>
              </div>
              <span className="text-[11px] font-bold text-[#49607e] bg-[#e5e8eb] px-2.5 py-1 rounded-md">
                HydroLogic OS v4.2
              </span>
            </div>

            {/* UV-C Cap Sterilization Block */}
            <div className="p-4 rounded-xl bg-gradient-to-r from-[#f1f4f7] to-[#c4dcff]/20 flex flex-col md:flex-row md:items-center justify-between gap-4 border border-[#ebeef1]">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#00a8e8] text-white flex items-center justify-center shrink-0 shadow-md">
                  <span className="material-symbols-outlined text-[24px]">wb_iridescent</span>
                </div>
                <div className="flex flex-col">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[14px] font-bold text-[#181c1e]">
                      Khử khuẩn UV-C tự làm sạch (Self-Cleaning Cap)
                    </span>
                    <span className="text-[10px] text-[#004f54] bg-[#7df4ff]/40 px-2 py-0.5 rounded-full font-extrabold">
                      99.9% Diệt khuẩn
                    </span>
                  </div>
                  <p className="text-[12px] text-[#49607e] mt-1 leading-relaxed">
                    Tự động kích hoạt tia cực tím 280nm khử trùng nước & thành bình mỗi 4 tiếng.
                  </p>
                  <div className="flex items-center gap-4 mt-2">
                    <span className="text-[11px] text-[#49607e] flex items-center gap-1">
                      <span className="material-symbols-outlined text-[15px]">schedule</span>
                      <span>Lần khử gần nhất: {bottle.lastUvMinutesAgo} phút trước</span>
                    </span>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={handleStartUv}
                disabled={uvTimer !== null}
                className="shrink-0 px-4 py-2.5 rounded-xl bg-[#00aeb9] hover:bg-[#006970] text-white font-bold text-[13px] transition-all shadow-md active:scale-95 flex items-center justify-center gap-2 disabled:opacity-75"
              >
                <span className="material-symbols-outlined text-[18px]">flare</span>
                <span>{uvTimer !== null ? `Đang khử trùng (${uvTimer}s)` : 'Khử khuẩn ngay (3 phút)'}</span>
              </button>
            </div>

            {/* Ultrasonic Calibration & Stale Water Alert Modules */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
              {/* Calibration */}
              <div className="p-4 rounded-xl bg-[#f1f4f7] border border-[#ebeef1] flex flex-col justify-between">
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[#00658d] text-[20px]">straighten</span>
                    <span className="text-[13px] font-bold text-[#181c1e]">
                      Cân chỉnh thước đo mức nước
                    </span>
                  </div>
                  <p className="text-[12px] text-[#49607e] mt-1">
                    Đặt bình hoàn toàn rỗng trên bề mặt nằm ngang tĩnh để nắp cân chỉnh ngưỡng 0ml chính xác nhất.
                  </p>
                </div>
                <div className="mt-3 pt-2 flex items-center justify-between border-t border-[#ebeef1]">
                  <span className="text-[11px] text-[#49607e]">Độ lệch hiện tại: ±2ml</span>
                  <button
                    type="button"
                    onClick={handleCalibrate}
                    className="px-3 py-1.5 rounded-lg bg-white hover:bg-[#e5e8eb] text-[#00658d] font-bold text-[11px] shadow-sm transition-colors"
                  >
                    Bắt đầu căn chỉnh
                  </button>
                </div>
              </div>

              {/* Stale Water Alert */}
              <div className="p-4 rounded-xl bg-[#f1f4f7] border border-[#ebeef1] flex flex-col justify-between">
                <div className="flex flex-col gap-1">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-[#ba1a1a] text-[20px]">warning</span>
                      <span className="text-[13px] font-bold text-[#181c1e]">
                        Cảnh báo nước để quá lâu
                      </span>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={bottle.staleAlertEnabled}
                        onChange={(e) => onUpdateBottle({ staleAlertEnabled: e.target.checked })}
                        className="sr-only peer"
                      />
                      <div className="w-9 h-5 bg-[#e0e3e6] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#00658d]"></div>
                    </label>
                  </div>
                  <p className="text-[12px] text-[#49607e] mt-1">
                    Phát tín hiệu âm thanh và rung đèn LED đỏ ở nắp khi nước đọng trong bình quá <strong className="text-[#181c1e]">16 tiếng</strong> chưa thay mới.
                  </p>
                </div>
                <div className="mt-3 pt-2 flex items-center justify-between text-[12px] border-t border-[#ebeef1]">
                  <span className="text-[#49607e]">Ngưỡng thời gian:</span>
                  <span className="text-[11px] font-bold text-[#00658d] bg-[#c6e7ff] px-2 py-0.5 rounded">
                    16 giờ (Khuyến nghị)
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Section: Hồ sơ sinh học & Cá nhân hóa mục tiêu */}
          <div className="bg-[#ffffff] rounded-2xl p-6 shadow-[0_4px_24px_rgba(0,101,141,0.06)] border border-[#ebeef1] flex flex-col gap-4">
            <div className="flex items-center justify-between pb-2 border-b border-[#ebeef1]">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#00658d] text-[22px]">
                  person_celebrate
                </span>
                <h3 className="text-[18px] font-bold text-[#181c1e]">
                  Hồ sơ sinh học & Cá nhân hóa mục tiêu
                </h3>
              </div>
              <span className="text-[11px] font-bold text-[#004f54] bg-[#7df4ff]/30 px-2.5 py-0.5 rounded-full">
                Thuật toán DynamicHydra™
              </span>
            </div>

            {/* Biometric Summary Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              <div className="p-3 rounded-xl bg-[#f1f4f7] border border-[#ebeef1] flex flex-col">
                <span className="text-[10px] font-bold text-[#49607e] uppercase">Giới tính / Tuổi</span>
                <span className="text-[14px] font-bold text-[#181c1e] mt-1">Nữ • 26 tuổi</span>
              </div>
              <div className="p-3 rounded-xl bg-[#f1f4f7] border border-[#ebeef1] flex flex-col">
                <span className="text-[10px] font-bold text-[#49607e] uppercase">Cân nặng</span>
                <span className="text-[14px] font-bold text-[#181c1e] mt-1">52.0 kg</span>
              </div>
              <div className="p-3 rounded-xl bg-[#f1f4f7] border border-[#ebeef1] flex flex-col">
                <span className="text-[10px] font-bold text-[#49607e] uppercase">Chiều cao</span>
                <span className="text-[14px] font-bold text-[#181c1e] mt-1">162 cm</span>
              </div>
              <div className="p-3 rounded-xl bg-[#f1f4f7] border border-[#ebeef1] flex flex-col">
                <span className="text-[10px] font-bold text-[#49607e] uppercase">Hoạt động</span>
                <span className="text-[14px] font-bold text-[#00658d] mt-1">Vừa phải (3-4b/tuần)</span>
              </div>
            </div>

            {/* Formula Breakdown Display */}
            <div className="p-4 rounded-xl bg-[#f1f4f7] border border-[#ebeef1] flex flex-col gap-2">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                <div>
                  <span className="text-[11px] font-bold text-[#49607e] uppercase tracking-wider">
                    Công thức tính mục tiêu thông minh hàng ngày
                  </span>
                  <div className="flex items-baseline gap-2 mt-0.5">
                    <span className="text-[36px] font-extrabold text-[#00658d] tracking-tight">
                      {hydration.dailyGoalMl.toLocaleString()}
                    </span>
                    <span className="text-[16px] font-bold text-[#49607e]">ml / ngày</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[13px] font-bold text-[#181c1e]">Chế độ thích ứng AI</span>
                  <input
                    type="checkbox"
                    defaultChecked
                    className="w-5 h-5 rounded text-[#00658d] accent-[#00658d] cursor-pointer"
                  />
                </div>
              </div>

              {/* Equation Visual */}
              <div className="flex flex-wrap items-center gap-2 text-[12px] pt-1">
                <span className="px-2.5 py-1 bg-white rounded-lg text-[#181c1e] font-bold shadow-sm border border-[#ebeef1]">
                  Cơ bản: 52kg × 35ml = 1.820ml
                </span>
                <span className="font-bold text-[#00658d]">+</span>
                <span className="px-2.5 py-1 bg-white rounded-lg text-[#181c1e] font-bold shadow-sm border border-[#ebeef1]">
                  Vận động thể chất: +680ml
                </span>
                <span className="font-bold text-[#006970]">+</span>
                <span className="px-2.5 py-1 bg-white rounded-lg text-[#006970] font-bold shadow-sm border border-[#ebeef1]">
                  Thời tiết Hà Nội (+300ml linh hoạt)
                </span>
              </div>

              <p className="text-[12px] text-[#49607e] mt-1 leading-relaxed">
                * Hệ thống tự động thu thập lượng calo tiêu hao và nhịp tim từ Apple Health để điều chỉnh lượng nước bù điện giải theo thời gian thực.
              </p>
            </div>
          </div>

          {/* Section: Đồng bộ Hệ sinh thái Ứng dụng & Thiết bị */}
          <div className="bg-[#ffffff] rounded-2xl p-6 shadow-[0_4px_24px_rgba(0,101,141,0.06)] border border-[#ebeef1] flex flex-col gap-4">
            <div className="flex items-center justify-between pb-2 border-b border-[#ebeef1]">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#00658d] text-[22px]">hub</span>
                <h3 className="text-[18px] font-bold text-[#181c1e]">
                  Đồng bộ Hệ sinh thái Ứng dụng & Thiết bị
                </h3>
              </div>
              <span className="text-[11px] font-bold text-[#49607e]">
                {googleFitConnected ? '3/3' : '2/3'} Đã kết nối
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Apple Health */}
              <div className="p-4 rounded-xl bg-[#f1f4f7] border border-[#ebeef1] flex flex-col justify-between gap-2 shadow-sm">
                <div className="flex items-start justify-between">
                  <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-sm text-[#ba1a1a]">
                    <span className="material-symbols-outlined text-[24px]">favorite</span>
                  </div>
                  <span className="text-[10px] text-[#004f54] bg-[#7df4ff]/40 px-2 py-0.5 rounded-full font-bold flex items-center gap-1">
                    <span className="w-1 h-1 rounded-full bg-[#006970]"></span> Đã kết nối
                  </span>
                </div>
                <div>
                  <span className="text-[14px] font-bold text-[#181c1e] block">Apple Health</span>
                  <p className="text-[12px] text-[#49607e] mt-0.5 leading-tight">
                    Đồng bộ 2 chiều Hydration, Calo & Nhịp tim
                  </p>
                </div>
                <div className="pt-2 text-right border-t border-[#ebeef1]">
                  <button
                    type="button"
                    onClick={() => showToast('Apple Health', 'Quyền đọc & ghi Hydration đang hoạt động bình thường.')}
                    className="text-[11px] font-bold text-[#00658d] hover:underline"
                  >
                    Quản lý quyền
                  </button>
                </div>
              </div>

              {/* Garmin Connect */}
              <div className="p-4 rounded-xl bg-[#f1f4f7] border border-[#ebeef1] flex flex-col justify-between gap-2 shadow-sm">
                <div className="flex items-start justify-between">
                  <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-sm text-[#00658d]">
                    <span className="material-symbols-outlined text-[24px]">watch</span>
                  </div>
                  <span className="text-[10px] text-[#004f54] bg-[#7df4ff]/40 px-2 py-0.5 rounded-full font-bold flex items-center gap-1">
                    <span className="w-1 h-1 rounded-full bg-[#006970]"></span> Đã kết nối
                  </span>
                </div>
                <div>
                  <span className="text-[14px] font-bold text-[#181c1e] block">Garmin Connect</span>
                  <p className="text-[12px] text-[#49607e] mt-0.5 leading-tight">
                    Tự động nhận diện bài tập Chạy bộ & Đạp xe
                  </p>
                </div>
                <div className="pt-2 text-right border-t border-[#ebeef1]">
                  <button
                    type="button"
                    onClick={() => showToast('Garmin Connect', 'Đã đồng bộ hoạt động chạy bộ 5.2km lúc 06:30 sáng nay.')}
                    className="text-[11px] font-bold text-[#00658d] hover:underline"
                  >
                    Quản lý quyền
                  </button>
                </div>
              </div>

              {/* Google Fit */}
              <div className="p-4 rounded-xl bg-[#f1f4f7] border border-[#ebeef1] flex flex-col justify-between gap-2 shadow-sm">
                <div className="flex items-start justify-between">
                  <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-sm text-[#49607e]">
                    <span className="material-symbols-outlined text-[24px]">fitness_center</span>
                  </div>
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                      googleFitConnected
                        ? 'text-[#004f54] bg-[#7df4ff]/40'
                        : 'text-[#49607e] bg-[#e5e8eb]'
                    }`}
                  >
                    {googleFitConnected ? 'Đã kết nối' : 'Chưa kết nối'}
                  </span>
                </div>
                <div>
                  <span className="text-[14px] font-bold text-[#181c1e] block">Google Fit</span>
                  <p className="text-[12px] text-[#49607e] mt-0.5 leading-tight">
                    Liên kết tài khoản Google để tự động nạp dữ liệu
                  </p>
                </div>
                <div className="pt-2 text-right border-t border-[#ebeef1]">
                  <button
                    type="button"
                    onClick={handleToggleGoogleFit}
                    className="text-[11px] font-bold text-[#00658d] hover:underline"
                  >
                    {googleFitConnected ? 'Quản lý quyền' : 'Kết nối ngay'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Toast Banner */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3.5 rounded-2xl bg-[#2d3133] text-white shadow-2xl animate-in slide-in-from-bottom-5 duration-300 max-w-md">
          <span className="material-symbols-outlined text-[#7df4ff] text-[26px]">
            {toast.icon}
          </span>
          <div className="flex flex-col">
            <span className="text-[13px] font-bold">{toast.title}</span>
            <span className="text-[12px] text-[#e0e3e6] mt-0.5">{toast.desc}</span>
          </div>
        </div>
      )}
    </div>
  );
};
