import React, { useState } from 'react';

interface ManualLogModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (amountMl: number, note: string) => void;
}

export const ManualLogModal: React.FC<ManualLogModalProps> = ({
  isOpen,
  onClose,
  onSave,
}) => {
  const [customAmount, setCustomAmount] = useState<number>(200);
  const [beverage, setBeverage] = useState<string>('Nước lọc');
  const [customNote, setCustomNote] = useState<string>('');

  if (!isOpen) return null;

  const presets = [150, 250, 350, 500];
  const beverageOptions = ['Nước lọc', 'Nước dừa tươi', 'Trà thảo mộc', 'Cà phê', 'Nước ép trái cây'];

  const handleConfirm = () => {
    if (customAmount > 0) {
      const note = customNote.trim() ? `${beverage} - ${customNote.trim()}` : beverage;
      onSave(customAmount, note);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-[#2d3133]/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-[#ffffff] w-full max-w-md rounded-2xl p-6 shadow-2xl border border-[#bdc8d1]/30 flex flex-col gap-4">
        <div className="flex items-center justify-between pb-1 border-b border-[#ebeef1]">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#00658d] text-[24px]">
              local_drink
            </span>
            <span className="text-[18px] font-bold text-[#181c1e]">
              Ghi nhận lượng nước
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-[#49607e] hover:bg-[#ebeef1] transition-colors"
            type="button"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <p className="text-[14px] text-[#49607e]">
          Ghi lại nước uống bổ sung ngoài bình HydroPulse (nước trái cây, cà phê, trà hoặc ly ngoài):
        </p>

        {/* Quick Presets */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[11px] font-bold text-[#49607e] uppercase tracking-wider">
            Mức nạp nhanh
          </label>
          <div className="grid grid-cols-4 gap-2">
            {presets.map((ml) => (
              <button
                key={ml}
                type="button"
                onClick={() => setCustomAmount(ml)}
                className={`py-2 rounded-xl text-[13px] font-bold transition-all ${
                  customAmount === ml
                    ? 'bg-[#00a8e8] text-white shadow-md shadow-[#00a8e8]/25'
                    : 'bg-[#f1f4f7] hover:bg-[#ebeef1] text-[#181c1e]'
                }`}
              >
                +{ml} ml
              </button>
            ))}
          </div>
        </div>

        {/* Custom ml input */}
        <div className="flex flex-col gap-1">
          <label className="text-[11px] font-bold text-[#49607e] uppercase tracking-wider">
            Thể tích tuỳ chỉnh (ml)
          </label>
          <div className="relative">
            <input
              type="number"
              min={10}
              max={2000}
              step={10}
              value={customAmount}
              onChange={(e) => setCustomAmount(Number(e.target.value))}
              className="w-full px-4 py-2.5 rounded-xl bg-[#f1f4f7] text-[#181c1e] text-[16px] font-bold focus:outline-none focus:ring-2 focus:ring-[#00a8e8] border border-transparent focus:border-transparent"
            />
            <span className="absolute right-4 top-3 text-[13px] font-bold text-[#49607e]">
              ml
            </span>
          </div>
        </div>

        {/* Beverage Type Selection */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[11px] font-bold text-[#49607e] uppercase tracking-wider">
            Loại đồ uống
          </label>
          <div className="flex flex-wrap gap-1.5">
            {beverageOptions.map((bev) => (
              <button
                key={bev}
                type="button"
                onClick={() => setBeverage(bev)}
                className={`px-3 py-1.5 rounded-lg text-[12px] font-semibold transition-all ${
                  beverage === bev
                    ? 'bg-[#c6e7ff] text-[#003952] border border-[#00a8e8]'
                    : 'bg-[#f1f4f7] text-[#3e4850] hover:bg-[#ebeef1]'
                }`}
              >
                {bev}
              </button>
            ))}
          </div>
        </div>

        {/* Optional Note */}
        <div className="flex flex-col gap-1">
          <label className="text-[11px] font-bold text-[#49607e] uppercase tracking-wider">
            Ghi chú (tuỳ chọn)
          </label>
          <input
            type="text"
            placeholder="Ví dụ: Tại phòng tập gym, Sau bữa trưa..."
            value={customNote}
            onChange={(e) => setCustomNote(e.target.value)}
            className="w-full px-4 py-2 rounded-xl bg-[#f1f4f7] text-[#181c1e] text-[13px] focus:outline-none focus:ring-2 focus:ring-[#00a8e8]"
          />
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-2 pt-2 border-t border-[#ebeef1]">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-[#49607e] font-semibold text-[14px] hover:bg-[#ebeef1] transition-colors"
          >
            Hủy
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            className="px-5 py-2 rounded-xl bg-[#00658d] hover:bg-[#004c6b] text-white font-bold text-[14px] shadow-md shadow-[#00658d]/25 transition-all"
          >
            Xác nhận
          </button>
        </div>
      </div>
    </div>
  );
};
