import React, { useState } from 'react';
import { SensoryConfig, ScheduleItem } from '../types';
import { soundEffects } from '../utils/audio';

interface RemindersViewProps {
  sensoryConfig: SensoryConfig;
  onUpdateSensory: (updated: Partial<SensoryConfig>) => void;
  schedules: ScheduleItem[];
  onToggleSchedule: (id: string) => void;
  onOpenAddSchedule: () => void;
}

export const RemindersView: React.FC<RemindersViewProps> = ({
  sensoryConfig,
  onUpdateSensory,
  schedules,
  onToggleSchedule,
  onOpenAddSchedule,
}) => {
  const [isSimulating, setIsSimulating] = useState(false);
  const [showSimSuccess, setShowSimSuccess] = useState(false);
  const [dndActive, setDndActive] = useState(sensoryConfig.dndMode);
  const [historyModalOpen, setHistoryModalOpen] = useState(false);

  // Color options
  const colorOptions = [
    { color: '#00f0ff', label: 'Aqua Blue (Mặc định)' },
    { color: '#00dbe9', label: 'Cyan Electric' },
    { color: '#a855f7', label: 'Zen Violet' },
    { color: '#f97316', label: 'Energetic Orange' },
  ];

  // Play preview melody
  const handlePlayMelody = (melody: 'water_drop' | 'zen' | 'ocean' | 'digital') => {
    onUpdateSensory({ chimeMelody: melody });
    soundEffects.playMelody(melody);
  };

  // Trigger test signal on bottle
  const handleTriggerTest = () => {
    setIsSimulating(true);
    // Play selected melody
    soundEffects.playMelody(sensoryConfig.chimeMelody);

    // Vibration API if supported on mobile/tablet
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      navigator.vibrate([150, 80, 150]);
    }

    setTimeout(() => {
      setShowSimSuccess(true);
      setTimeout(() => {
        setShowSimSuccess(false);
        setIsSimulating(false);
      }, 2200);
    }, 400);
  };

  // Toggle DND
  const handleToggleDnd = () => {
    const nextDnd = !dndActive;
    setDndActive(nextDnd);
    onUpdateSensory({ dndMode: nextDnd });
  };

  const activeColorObj = colorOptions.find((c) => c.color === sensoryConfig.ledColor) || colorOptions[0];

  return (
    <div className="flex flex-col w-full gap-6">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-col">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#00658d] px-2.5 py-0.5 rounded-full bg-[#c6e7ff]">
              ĐỒNG BỘ BLE V5.2
            </span>
            <span className="flex h-2 w-2 rounded-full bg-[#00aeb9] animate-pulse"></span>
            <span className="text-[12px] font-semibold text-[#49607e]">
              HydroPulse Pro #091A
            </span>
          </div>
          <h1 className="text-[28px] md:text-[32px] font-bold text-[#181c1e] tracking-tight">
            Lịch & Hẹn giờ nhắc thông minh
          </h1>
          <p className="text-[14px] text-[#49607e] max-w-2xl">
            Tối ưu hóa nhịp sinh học và thiết lập phản hồi đa giác quan (Đèn LED, Rung, Âm thanh) trên thân bình.
          </p>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <button
            type="button"
            onClick={handleToggleDnd}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-[13px] transition-all shadow-sm ${
              dndActive
                ? 'bg-[#ffdad6] text-[#ba1a1a] border border-[#ba1a1a]/30'
                : 'bg-[#e5e8eb] hover:bg-[#e0e3e6] text-[#181c1e]'
            }`}
          >
            <span className="material-symbols-outlined text-[20px]">
              {dndActive ? 'do_not_disturb_on' : 'do_not_disturb_off'}
            </span>
            <span>{dndActive ? 'Đang bật DND (Tập trung)' : 'Chế độ Tập trung (DND)'}</span>
          </button>

          <button
            type="button"
            onClick={onOpenAddSchedule}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#00658d] hover:bg-[#004c6b] text-white font-bold text-[13px] transition-all shadow-[0_4px_16px_rgba(0,101,141,0.25)] active:scale-95"
          >
            <span className="material-symbols-outlined text-[20px]">add</span>
            <span>Thêm lịch nhắc mới</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Sensory Configurations (8 Cols) vs Test HUD & Intelligence (4 Cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (8 cols) */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          {/* Section: Cấu hình Đa giác quan trên Bình */}
          <section className="bg-[#ffffff] rounded-2xl p-6 shadow-[0_4px_20px_-2px_rgba(10,37,64,0.04)] border border-[#ebeef1] flex flex-col gap-4">
            <div className="flex items-center justify-between pb-2 border-b border-[#ebeef1]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#c6e7ff] flex items-center justify-center text-[#00658d]">
                  <span className="material-symbols-outlined">tune</span>
                </div>
                <div>
                  <h2 className="text-[18px] font-bold text-[#181c1e]">
                    Cấu hình Đa giác quan trên Bình
                  </h2>
                  <p className="text-[12px] text-[#49607e]">
                    Tùy biến trực quan tín hiệu quang học, haptic và âm thanh khi đến giờ uống
                  </p>
                </div>
              </div>
              <span className="text-[11px] px-3 py-1 rounded-full bg-[#c4dcff] text-[#003952] font-bold">
                Đang hoạt động
              </span>
            </div>

            {/* 1. Đèn LED RGB Halo trên nắp bình */}
            <div className="p-4 rounded-xl bg-[#f1f4f7] flex flex-col gap-4 border border-[#ebeef1]">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-[#00658d] text-[22px]">lightbulb</span>
                  <div>
                    <span className="text-[14px] font-bold text-[#181c1e] block">
                      Đèn LED RGB Halo trên nắp bình
                    </span>
                    <span className="text-[12px] text-[#49607e]">
                      Vòng hào quang 360° hiển thị khi nhắc nhở
                    </span>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={sensoryConfig.ledEnabled}
                    onChange={(e) => onUpdateSensory({ ledEnabled: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-[#e0e3e6] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#00a8e8]"></div>
                </label>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
                <div className="flex flex-col gap-1.5">
                  <span className="text-[12px] font-bold text-[#181c1e]">
                    Màu sắc ánh sáng quang phổ
                  </span>
                  <div className="flex items-center gap-2 pt-1 flex-wrap">
                    {colorOptions.map((c) => {
                      const isSelected = sensoryConfig.ledColor === c.color;
                      return (
                        <button
                          key={c.color}
                          type="button"
                          onClick={() => onUpdateSensory({ ledColor: c.color })}
                          className={`relative w-9 h-9 rounded-full shadow-sm flex items-center justify-center transition-all ${
                            isSelected ? 'ring-2 ring-offset-2 ring-[#00658d] scale-110' : 'hover:scale-105'
                          }`}
                          style={{ backgroundColor: c.color }}
                          title={c.label}
                        >
                          {isSelected && (
                            <span className="material-symbols-outlined text-[16px] text-[#181c1e] font-bold">
                              check
                            </span>
                          )}
                        </button>
                      );
                    })}
                    <span className="text-[11px] font-semibold text-[#49607e] pl-1">
                      {activeColorObj.label}
                    </span>
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <span className="text-[12px] font-bold text-[#181c1e]">
                    Kiểu hiệu ứng ánh sáng
                  </span>
                  <div className="grid grid-cols-3 gap-1.5 pt-1">
                    {[
                      { id: 'breathe' as const, label: 'Thở êm dịu' },
                      { id: 'blink' as const, label: 'Nhấp nháy 3x' },
                      { id: 'wave' as const, label: 'Sóng xoay tròn' },
                    ].map((eff) => (
                      <button
                        key={eff.id}
                        type="button"
                        onClick={() => onUpdateSensory({ ledEffect: eff.id })}
                        className={`py-2 px-1 rounded-xl text-[12px] font-bold text-center transition-all ${
                          sensoryConfig.ledEffect === eff.id
                            ? 'bg-[#ffffff] text-[#00658d] shadow-sm border border-[#00a8e8]/30'
                            : 'bg-[#ebeef1] text-[#49607e] hover:text-[#181c1e]'
                        }`}
                      >
                        {eff.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* 2. Rung Haptic phản hồi trên thân bình */}
            <div className="p-4 rounded-xl bg-[#f1f4f7] flex flex-col gap-4 border border-[#ebeef1]">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-[#00658d] text-[22px]">vibration</span>
                  <div>
                    <span className="text-[14px] font-bold text-[#181c1e] block">
                      Rung Haptic phản hồi trên thân bình
                    </span>
                    <span className="text-[12px] text-[#49607e]">
                      Động cơ tuyến tính mô phỏng nhịp đập sinh học
                    </span>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={sensoryConfig.hapticEnabled}
                    onChange={(e) => onUpdateSensory({ hapticEnabled: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-[#e0e3e6] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#00a8e8]"></div>
                </label>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <span className="text-[12px] font-bold text-[#181c1e] mb-2 block">
                    Cường độ xung lực
                  </span>
                  <div className="flex gap-2">
                    {(['light', 'medium', 'strong'] as const).map((intensity) => {
                      const labels = { light: 'Nhẹ', medium: 'Vừa', strong: 'Mạnh' };
                      const isSelected = sensoryConfig.hapticIntensity === intensity;
                      return (
                        <button
                          key={intensity}
                          type="button"
                          onClick={() => onUpdateSensory({ hapticIntensity: intensity })}
                          className={`flex-1 py-1.5 rounded-lg text-[12px] font-bold transition-all ${
                            isSelected
                              ? 'bg-[#00658d] text-white shadow-sm'
                              : 'bg-[#ebeef1] text-[#49607e] hover:bg-[#e0e3e6]'
                          }`}
                        >
                          {labels[intensity]}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <span className="text-[12px] font-bold text-[#181c1e] mb-2 block">
                    Kiểu nhịp Haptic
                  </span>
                  <div className="flex gap-2">
                    {[
                      { id: 'double' as const, label: 'Nhịp kép (Double)' },
                      { id: 'pulse' as const, label: 'Rung liên tục (Pulse)' },
                    ].map((pattern) => {
                      const isSelected = sensoryConfig.hapticPattern === pattern.id;
                      return (
                        <button
                          key={pattern.id}
                          type="button"
                          onClick={() => onUpdateSensory({ hapticPattern: pattern.id })}
                          className={`flex-1 py-1.5 rounded-lg text-[12px] font-bold transition-all ${
                            isSelected
                              ? 'bg-[#00658d] text-white shadow-sm'
                              : 'bg-[#ebeef1] text-[#49607e] hover:bg-[#e0e3e6]'
                          }`}
                        >
                          {pattern.label}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            {/* 3. Chuông âm thanh êm dịu (Soft Chime) */}
            <div className="p-4 rounded-xl bg-[#f1f4f7] flex flex-col gap-4 border border-[#ebeef1]">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-[#00658d] text-[22px]">volume_up</span>
                  <div>
                    <span className="text-[14px] font-bold text-[#181c1e] block">
                      Chuông âm thanh êm dịu (Soft Chime)
                    </span>
                    <span className="text-[12px] text-[#49607e]">
                      Loa áp điện vi mô tạo tần số hài âm thư giãn
                    </span>
                  </div>
                </div>
                <span className="text-[13px] font-bold text-[#00658d]">
                  {sensoryConfig.chimeVolume}%
                </span>
              </div>

              <div className="flex flex-col gap-1.5">
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={sensoryConfig.chimeVolume}
                  onChange={(e) => onUpdateSensory({ chimeVolume: Number(e.target.value) })}
                  className="w-full h-2 bg-[#e0e3e6] rounded-lg appearance-none cursor-pointer accent-[#00a8e8]"
                />
                <div className="flex justify-between text-[10px] font-semibold text-[#49607e] px-1">
                  <span>Tắt tiếng</span>
                  <span>Dịu nhẹ (40%)</span>
                  <span>Tiêu chuẩn (70%)</span>
                  <span>Tối đa</span>
                </div>
              </div>

              <div className="flex flex-col gap-1.5 pt-1">
                <span className="text-[12px] font-bold text-[#181c1e]">
                  Âm điệu được chọn (Bấm để nghe thử ngay)
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { id: 'water_drop' as const, label: 'Giọt nước rơi' },
                    { id: 'zen' as const, label: 'Chuông Zen' },
                    { id: 'ocean' as const, label: 'Sóng biển' },
                    { id: 'digital' as const, label: 'Kỹ thuật số' },
                  ].map((m) => {
                    const isSelected = sensoryConfig.chimeMelody === m.id;
                    return (
                      <button
                        key={m.id}
                        type="button"
                        onClick={() => handlePlayMelody(m.id)}
                        className={`p-2.5 rounded-xl text-left text-[12px] font-bold flex items-center justify-between transition-all ${
                          isSelected
                            ? 'bg-[#ffffff] text-[#00658d] shadow-sm border border-[#00a8e8]/30'
                            : 'bg-[#ebeef1] text-[#49607e] hover:text-[#181c1e]'
                        }`}
                      >
                        <span>{m.label}</span>
                        <span className="material-symbols-outlined text-[18px]">
                          play_circle
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* 4. Đồng bộ Thông báo Desktop & Điện thoại */}
            <div className="flex items-center justify-between p-4 rounded-xl bg-[#e5e8eb]/40 border border-[#ebeef1]">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-[#49607e] text-[22px]">devices</span>
                <div className="flex flex-col">
                  <span className="text-[14px] font-bold text-[#181c1e]">
                    Đồng bộ Thông báo Desktop & Điện thoại
                  </span>
                  <span className="text-[12px] text-[#49607e]">
                    Nhận thông báo nhẹ dạng popup banner khi bạn đang rời xa bình nước
                  </span>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={sensoryConfig.desktopSync}
                  onChange={(e) => onUpdateSensory({ desktopSync: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-[#e0e3e6] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#00a8e8]"></div>
              </label>
            </div>
          </section>

          {/* Section: Danh sách Lịch nhắc nhở hoạt động */}
          <section className="bg-[#ffffff] rounded-2xl p-6 shadow-[0_4px_20px_-2px_rgba(10,37,64,0.04)] border border-[#ebeef1] flex flex-col gap-4">
            <div className="flex items-center justify-between pb-2 border-b border-[#ebeef1]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#c4dcff] flex items-center justify-center text-[#00658d]">
                  <span className="material-symbols-outlined">calendar_today</span>
                </div>
                <div>
                  <h2 className="text-[18px] font-bold text-[#181c1e]">
                    Danh sách Lịch nhắc nhở hoạt động
                  </h2>
                  <p className="text-[12px] text-[#49607e]">
                    Lập trình theo đồng hồ sinh học và thói quen hoạt động trong ngày
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setHistoryModalOpen(true)}
                className="text-[12px] font-bold text-[#00658d] hover:underline flex items-center gap-1"
              >
                <span className="material-symbols-outlined text-[16px]">history</span>
                <span>Xem lịch sử kích hoạt</span>
              </button>
            </div>

            <div className="flex flex-col gap-3">
              {schedules.map((sch) => (
                <div
                  key={sch.id}
                  className="p-4 rounded-xl bg-[#f1f4f7] flex flex-col sm:flex-row sm:items-center justify-between gap-3 border border-[#ebeef1]"
                >
                  <div className="flex items-start gap-3">
                    <div className="p-2.5 rounded-xl bg-[#c6e7ff] text-[#00658d] mt-0.5">
                      <span className="material-symbols-outlined">{sch.icon}</span>
                    </div>
                    <div className="flex flex-col">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-[14px] font-bold text-[#181c1e]">
                          {sch.title}
                        </span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#e0e3e6] text-[#3e4850]">
                          {sch.days}
                        </span>
                        <span className="text-[11px] font-bold text-[#00658d]">
                          {sch.amountPerSip}ml / lần
                        </span>
                      </div>
                      <span className="text-[12px] text-[#49607e] pt-0.5">
                        {sch.timeRange} • Nhắc lặp lại mỗi {sch.repeatMinutes} phút
                        {sch.targetSessionMl && ` • Mục tiêu phiên: ${sch.targetSessionMl}ml`}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 self-end sm:self-center">
                    <span className="text-[11px] font-bold text-[#006970] flex items-center gap-1.5">
                      {sch.enabled && (
                        <span className="h-2 w-2 rounded-full bg-[#00aeb9] animate-ping"></span>
                      )}
                      {sch.nextTrigger.includes(':') ? `Kế tiếp: ${sch.nextTrigger}` : sch.nextTrigger}
                    </span>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={sch.enabled}
                        onChange={() => onToggleSchedule(sch.id)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-[#e0e3e6] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#00a8e8]"></div>
                    </label>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Right Column (4 cols) */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          {/* Card: Interactive Test HUD */}
          <div className="relative overflow-hidden bg-gradient-to-br from-[#00658d] via-[#00a8e8] to-[#00aeb9] rounded-2xl p-6 text-white shadow-[0_10px_30px_rgba(0,101,141,0.25)] flex flex-col justify-between">
            <div className="relative z-10 flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-extrabold uppercase tracking-widest bg-white/20 backdrop-blur-md px-2.5 py-1 rounded-full text-white">
                  Interactive Test HUD
                </span>
                <span className="material-symbols-outlined text-[20px] text-[#7df4ff]">
                  sensors
                </span>
              </div>

              <div className="my-2 flex flex-col items-center justify-center text-center">
                <div
                  className={`w-24 h-24 rounded-full border-4 flex items-center justify-center transition-all duration-500 shadow-[0_0_24px_rgba(125,244,255,0.7)] ${
                    isSimulating ? 'scale-110 ring-8 ring-white/40' : ''
                  }`}
                  style={{
                    borderColor: sensoryConfig.ledColor,
                    boxShadow: isSimulating
                      ? `0 0 35px ${sensoryConfig.ledColor}`
                      : `0 0 20px ${sensoryConfig.ledColor}80`,
                  }}
                >
                  <span className="material-symbols-outlined text-[36px] text-white">
                    water_bottle
                  </span>
                </div>
                <h3 className="text-[18px] font-bold mt-3 text-white">Mô phỏng tức thì</h3>
                <p className="text-[12px] text-[#c6e7ff] text-center max-w-xs mt-0.5">
                  Gửi xung tín hiệu Bluetooth để kiểm tra màu sắc nắp bình, motor rung và âm chuông hiện tại.
                </p>
              </div>

              <button
                type="button"
                disabled={isSimulating}
                onClick={handleTriggerTest}
                className="w-full py-3 px-4 rounded-xl bg-white text-[#00658d] font-bold text-[14px] flex items-center justify-center gap-2 hover:bg-[#f1f4f7] transition-all shadow-md active:scale-95 disabled:opacity-75"
              >
                <span className="material-symbols-outlined text-[20px]">send_to_mobile</span>
                <span>Thử phát tín hiệu trên bình</span>
              </button>

              {showSimSuccess && (
                <div className="flex items-center justify-center gap-1.5 text-[11px] font-bold text-[#7df4ff] text-center animate-bounce pt-1">
                  <span className="material-symbols-outlined text-[16px]">check_circle</span>
                  <span>Đã phát lệnh kích hoạt tới phần cứng!</span>
                </div>
              )}
            </div>
            <div className="absolute -right-12 -bottom-12 w-48 h-48 rounded-full bg-white/10 blur-2xl pointer-events-none"></div>
          </div>

          {/* Section: Thuật toán Thích ứng thông minh */}
          <section className="bg-[#ffffff] rounded-2xl p-6 shadow-[0_4px_20px_-2px_rgba(10,37,64,0.04)] border border-[#ebeef1] flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-[#c6e7ff] flex items-center justify-center text-[#00658d]">
                <span className="material-symbols-outlined text-[20px]">auto_awesome</span>
              </div>
              <div>
                <h3 className="text-[16px] font-bold text-[#181c1e]">
                  Thuật toán Thích ứng thông minh
                </h3>
                <span className="text-[11px] text-[#49607e]">Adaptive Hardware Intelligence</span>
              </div>
            </div>

            <div className="flex flex-col gap-3 divide-y divide-[#ebeef1]">
              <div className="flex items-start gap-3 pt-1">
                <div className="mt-0.5 text-[#00658d]">
                  <span className="material-symbols-outlined text-[20px]">invert_colors_off</span>
                </div>
                <div className="flex-1 flex flex-col">
                  <div className="flex items-center justify-between">
                    <span className="text-[13px] font-bold text-[#181c1e]">
                      Tự tạm ngưng khi bình rỗng
                    </span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#7df4ff] text-[#002022] font-bold">
                      Bật
                    </span>
                  </div>
                  <p className="text-[12px] text-[#49607e] mt-0.5">
                    Cảm biến siêu âm đáy bình nhận diện &lt;20ml nước sẽ tự hoãn nhắc để tránh làm phiền bạn.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 pt-3">
                <div className="mt-0.5 text-[#00658d]">
                  <span className="material-symbols-outlined text-[20px]">screen_rotation</span>
                </div>
                <div className="flex-1 flex flex-col">
                  <div className="flex items-center justify-between">
                    <span className="text-[13px] font-bold text-[#181c1e]">
                      Cảm biến tư thế & Nhấc bình
                    </span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#7df4ff] text-[#002022] font-bold">
                      Bật
                    </span>
                  </div>
                  <p className="text-[12px] text-[#49607e] mt-0.5">
                    Con quay hồi chuyển 6 trục ghi nhận thao tác nghiêng uống -&gt; Tự động reset bộ đếm giờ nhắc lại từ đầu.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 pt-3">
                <div className="mt-0.5 text-[#00658d]">
                  <span className="material-symbols-outlined text-[20px]">bedtime</span>
                </div>
                <div className="flex-1 flex flex-col">
                  <div className="flex items-center justify-between">
                    <span className="text-[13px] font-bold text-[#181c1e]">
                      Khung giờ Ngủ & Nghỉ trưa
                    </span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#c4dcff] text-[#003952] font-bold">
                      Tự động
                    </span>
                  </div>
                  <p className="text-[12px] text-[#49607e] mt-0.5">
                    Tự động tắt rung và âm báo chuông trong khoảng:
                  </p>
                  <div className="flex items-center gap-2 mt-1.5 text-[11px] font-semibold text-[#181c1e]">
                    <span className="px-2 py-0.5 rounded-full bg-[#f1f4f7] border border-[#ebeef1]">
                      22:30 – 07:00
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-[#f1f4f7] border border-[#ebeef1]">
                      12:30 – 13:30
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Card: Tuổi thọ pin với cấu hình này */}
          <div className="p-4 rounded-2xl bg-[#f1f4f7] border border-[#ebeef1] flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center text-[#00658d] shadow-sm shrink-0">
              <span className="material-symbols-outlined text-[28px]">
                battery_charging_full
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-[13px] font-bold text-[#181c1e]">
                Tuổi thọ pin với cấu hình này
              </span>
              <span className="text-[12px] text-[#49607e]">
                Dự kiến ~24 ngày cho một lần sạc từ tính MagSafe
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* History Modal */}
      {historyModalOpen && (
        <div className="fixed inset-0 bg-[#2d3133]/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-[#ffffff] w-full max-w-md rounded-2xl p-6 shadow-2xl border border-[#bdc8d1]/30 flex flex-col gap-4">
            <div className="flex items-center justify-between pb-2 border-b border-[#ebeef1]">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#00658d]">history</span>
                <h3 className="text-[16px] font-bold text-[#181c1e]">
                  Lịch sử Kích hoạt Nhắc nhở hôm nay
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setHistoryModalOpen(false)}
                className="p-1 rounded-full text-[#49607e] hover:bg-[#ebeef1]"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <div className="flex flex-col gap-2 text-[12px]">
              <div className="p-2.5 rounded-xl bg-[#f1f4f7] flex justify-between items-center">
                <div>
                  <span className="font-bold text-[#181c1e]">Giờ làm việc văn phòng #4</span>
                  <p className="text-[#49607e]">Phát tín hiệu LED Halo Cyan + Chime giọt nước</p>
                </div>
                <span className="text-[#00658d] font-bold">14:15 • Đã uống 200ml</span>
              </div>
              <div className="p-2.5 rounded-xl bg-[#f1f4f7] flex justify-between items-center">
                <div>
                  <span className="font-bold text-[#181c1e]">Sau bữa trưa #1</span>
                  <p className="text-[#49607e]">Cố định 12:45 • Khuyến khích tiêu hóa</p>
                </div>
                <span className="text-[#00658d] font-bold">12:45 • Đã uống 300ml</span>
              </div>
              <div className="p-2.5 rounded-xl bg-[#f1f4f7] flex justify-between items-center">
                <div>
                  <span className="font-bold text-[#181c1e]">Giờ làm việc văn phòng #3</span>
                  <p className="text-[#49607e]">Phát tín hiệu chuông nhẹ</p>
                </div>
                <span className="text-[#00658d] font-bold">11:30 • Đã uống 150ml</span>
              </div>
            </div>
            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={() => setHistoryModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-[#00658d] text-white font-bold text-[13px]"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
