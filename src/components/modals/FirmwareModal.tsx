import React, { useState } from 'react';

interface FirmwareModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentVersion: string;
}

export const FirmwareModal: React.FC<FirmwareModalProps> = ({
  isOpen,
  onClose,
  currentVersion,
}) => {
  const [isUpdating, setIsUpdating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);

  if (!isOpen) return null;

  const startUpdate = () => {
    setIsUpdating(true);
    setProgress(5);
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsUpdating(false);
          setIsCompleted(true);
          return 100;
        }
        return prev + 15;
      });
    }, 400);
  };

  return (
    <div className="fixed inset-0 bg-[#2d3133]/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-[#ffffff] w-full max-w-md rounded-2xl p-6 shadow-2xl border border-[#bdc8d1]/30 flex flex-col gap-4">
        <div className="flex items-center justify-between pb-2 border-b border-[#ebeef1]">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#00658d] text-[24px]">
              system_update
            </span>
            <h3 className="text-[18px] font-bold text-[#181c1e]">
              Cập nhật Firmware Thiết bị
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

        <div className="p-4 rounded-xl bg-[#f1f4f7] flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-[11px] font-bold text-[#49607e] uppercase">Phiên bản hiện tại</span>
            <span className="text-[16px] font-bold text-[#181c1e]">{currentVersion}</span>
          </div>
          <span className="px-2.5 py-1 rounded-full bg-[#c6e7ff] text-[#003952] text-[12px] font-bold">
            v2.4.1 Mới nhất
          </span>
        </div>

        <div className="flex flex-col gap-2 text-[13px] text-[#3e4850]">
          <span className="font-bold text-[#181c1e]">Điểm mới trong bản cập nhật HydroLogic OS v2.4.1:</span>
          <ul className="list-disc pl-4 space-y-1">
            <li>Nâng cấp thuật toán lọc nhiễu sóng siêu âm khi bình rung lắc lúc di chuyển.</li>
            <li>Tối ưu xung PWM của vòng LED Halo 360° giảm 12% mức tiêu hao năng lượng.</li>
            <li>Bổ sung chế độ tự động ngắt UV-C khi người dùng vô tình mở nắp trong lúc khử trùng.</li>
          </ul>
        </div>

        {isUpdating && (
          <div className="flex flex-col gap-1.5 p-3 rounded-xl bg-[#f1f4f7]">
            <div className="flex justify-between text-[12px] font-bold text-[#00658d]">
              <span>Đang truyền file OTA qua BLE...</span>
              <span>{progress}%</span>
            </div>
            <div className="w-full bg-[#e5e8eb] h-2 rounded-full overflow-hidden">
              <div
                className="bg-[#00a8e8] h-full transition-all duration-300 rounded-full"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>
        )}

        {isCompleted && (
          <div className="p-3 rounded-xl bg-[#c6e7ff]/60 border border-[#00aeb9] flex items-center gap-2 text-[13px] text-[#003b3f] font-semibold">
            <span className="material-symbols-outlined text-[#00aeb9]">check_circle</span>
            <span>Firmware đã được nạp thành công! Thiết bị đã tự khởi động lại.</span>
          </div>
        )}

        <div className="flex justify-end gap-2 pt-2 border-t border-[#ebeef1]">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-[#49607e] font-semibold text-[13px]"
          >
            Đóng
          </button>
          {!isCompleted && !isUpdating && (
            <button
              type="button"
              onClick={startUpdate}
              className="px-5 py-2 rounded-xl bg-[#00658d] text-white font-bold text-[13px] shadow-md shadow-[#00658d]/25"
            >
              Cập nhật OTA ngay
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
