import React, { useState } from 'react';
import { ScheduleItem } from '../../types';

interface AddScheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (schedule: ScheduleItem) => void;
}

export const AddScheduleModal: React.FC<AddScheduleModalProps> = ({
  isOpen,
  onClose,
  onAdd,
}) => {
  const [title, setTitle] = useState('');
  const [days, setDays] = useState('T2 - T6');
  const [amountPerSip, setAmountPerSip] = useState(150);
  const [timeRange, setTimeRange] = useState('08:30 – 17:30');
  const [repeatMinutes, setRepeatMinutes] = useState(45);
  const [icon, setIcon] = useState('work');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const newSchedule: ScheduleItem = {
      id: Date.now().toString(),
      title: title.trim(),
      days,
      amountPerSip,
      timeRange,
      repeatMinutes,
      nextTrigger: '14:30',
      icon,
      enabled: true,
      statusText: `Lặp lại mỗi ${repeatMinutes} phút • Khuyến nghị ${amountPerSip}ml/lần`,
    };

    onAdd(newSchedule);
    onClose();
  };

  const iconsList = [
    { id: 'work', label: 'Công việc' },
    { id: 'fitness_center', label: 'Tập gym' },
    { id: 'restaurant', label: 'Bữa ăn' },
    { id: 'nightlight', label: 'Buổi tối' },
    { id: 'menu_book', label: 'Học tập' },
  ];

  return (
    <div className="fixed inset-0 bg-[#2d3133]/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-[#ffffff] w-full max-w-md rounded-2xl p-6 shadow-2xl border border-[#bdc8d1]/30 flex flex-col gap-4">
        <div className="flex items-center justify-between pb-2 border-b border-[#ebeef1]">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#00658d] text-[24px]">
              alarm_add
            </span>
            <h3 className="text-[18px] font-bold text-[#181c1e]">
              Thêm lịch nhắc mới
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-[#49607e] hover:bg-[#ebeef1]"
            type="button"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <div>
            <label className="text-[11px] font-bold text-[#49607e] uppercase">
              Tên phiên nhắc nhở
            </label>
            <input
              type="text"
              required
              placeholder="VD: Tập thể thao buổi sáng, Học ca tối..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full mt-1 px-3.5 py-2.5 rounded-xl bg-[#f1f4f7] text-[#181c1e] text-[14px] focus:outline-none focus:ring-2 focus:ring-[#00a8e8]"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] font-bold text-[#49607e] uppercase">
                Khung ngày áp dụng
              </label>
              <select
                value={days}
                onChange={(e) => setDays(e.target.value)}
                className="w-full mt-1 px-3 py-2.5 rounded-xl bg-[#f1f4f7] text-[#181c1e] text-[13px] font-medium"
              >
                <option value="T2 - T6">T2 - T6 (Ngày làm việc)</option>
                <option value="Hàng ngày">Hàng ngày (Cả tuần)</option>
                <option value="T7 - CN">Cuối tuần (T7 - CN)</option>
              </select>
            </div>

            <div>
              <label className="text-[11px] font-bold text-[#49607e] uppercase">
                Lượng nước mỗi lần
              </label>
              <div className="relative mt-1">
                <input
                  type="number"
                  min={50}
                  max={600}
                  step={50}
                  value={amountPerSip}
                  onChange={(e) => setAmountPerSip(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl bg-[#f1f4f7] text-[#181c1e] text-[14px] font-bold"
                />
                <span className="absolute right-3 top-2.5 text-[12px] text-[#49607e]">ml</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] font-bold text-[#49607e] uppercase">
                Khung giờ hoạt động
              </label>
              <input
                type="text"
                placeholder="08:30 – 17:30"
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="w-full mt-1 px-3 py-2 rounded-xl bg-[#f1f4f7] text-[#181c1e] text-[13px]"
              />
            </div>

            <div>
              <label className="text-[11px] font-bold text-[#49607e] uppercase">
                Chu kỳ lặp lại
              </label>
              <select
                value={repeatMinutes}
                onChange={(e) => setRepeatMinutes(Number(e.target.value))}
                className="w-full mt-1 px-3 py-2 rounded-xl bg-[#f1f4f7] text-[#181c1e] text-[13px]"
              >
                <option value={30}>Mỗi 30 phút</option>
                <option value={45}>Mỗi 45 phút</option>
                <option value={60}>Mỗi 60 phút</option>
                <option value={90}>Mỗi 90 phút</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-[11px] font-bold text-[#49607e] uppercase">
              Biểu tượng đại diện
            </label>
            <div className="flex gap-2 mt-1">
              {iconsList.map((ic) => (
                <button
                  key={ic.id}
                  type="button"
                  onClick={() => setIcon(ic.id)}
                  className={`flex-1 p-2 rounded-xl flex flex-col items-center justify-center transition-all ${
                    icon === ic.id
                      ? 'bg-[#00a8e8] text-white shadow-sm'
                      : 'bg-[#f1f4f7] text-[#49607e] hover:bg-[#ebeef1]'
                  }`}
                >
                  <span className="material-symbols-outlined text-[20px]">{ic.id}</span>
                  <span className="text-[10px] mt-0.5">{ic.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-[#ebeef1] mt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-[#49607e] font-semibold text-[13px]"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-[#00658d] text-white font-bold text-[13px] shadow-md shadow-[#00658d]/20"
            >
              Lưu lịch nhắc
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
