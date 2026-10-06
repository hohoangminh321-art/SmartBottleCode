import React from 'react';
import { UserHydration, IntakeLog } from '../../types';

interface PdfReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  hydration: UserHydration;
  logs: IntakeLog[];
}

export const PdfReportModal: React.FC<PdfReportModalProps> = ({
  isOpen,
  onClose,
  hydration,
  logs,
}) => {
  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 bg-[#2d3133]/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-[#ffffff] w-full max-w-xl rounded-2xl p-6 shadow-2xl border border-[#bdc8d1]/30 flex flex-col gap-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-2 border-b border-[#ebeef1]">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#00658d] text-[24px]">
              picture_as_pdf
            </span>
            <h3 className="text-[18px] font-bold text-[#181c1e]">
              Bản xem trước Báo cáo Sinh trắc học Hydrat hóa
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

        {/* Mock Printable Page Paper */}
        <div className="p-6 rounded-xl border border-[#bdc8d1]/50 bg-[#f7fafd] flex flex-col gap-4 text-[#181c1e]">
          <div className="flex justify-between items-start border-b border-[#bdc8d1]/40 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#00658d] text-[22px]">water_drop</span>
                <span className="text-[18px] font-extrabold text-[#00658d]">HYDROPULSE REPORT</span>
              </div>
              <p className="text-[12px] text-[#49607e] mt-1">
                Báo cáo thói quen nạp nước cá nhân hóa • Hệ thống IoT HydroPulse Pro
              </p>
            </div>
            <div className="text-right text-[12px] text-[#49607e]">
              <span className="font-bold text-[#181c1e]">Ngày: 06/10/2026</span>
              <p>Khách hàng: Minh Anh (26t)</p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="p-3 rounded-lg bg-white shadow-sm border border-[#ebeef1]">
              <span className="text-[11px] text-[#49607e] font-semibold uppercase">Tổng lượng nạp</span>
              <div className="text-[20px] font-bold text-[#00658d] mt-1">
                {hydration.currentIntakeMl.toLocaleString()} ml
              </div>
              <span className="text-[11px] text-[#006970]">Mục tiêu: {hydration.dailyGoalMl} ml</span>
            </div>
            <div className="p-3 rounded-lg bg-white shadow-sm border border-[#ebeef1]">
              <span className="text-[11px] text-[#49607e] font-semibold uppercase">Chuỗi ngày (Streak)</span>
              <div className="text-[20px] font-bold text-[#00658d] mt-1">
                {hydration.streakDays} ngày 🔥
              </div>
              <span className="text-[11px] text-[#006970]">Top 5% người dùng</span>
            </div>
            <div className="p-3 rounded-lg bg-white shadow-sm border border-[#ebeef1]">
              <span className="text-[11px] text-[#49607e] font-semibold uppercase">Nhiệt độ trung bình</span>
              <div className="text-[20px] font-bold text-[#00658d] mt-1">
                {hydration.preferredTempC}°C
              </div>
              <span className="text-[11px] text-[#006970]">Mát lành, hấp thu tối ưu</span>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <span className="text-[13px] font-bold text-[#181c1e]">Nhật ký các lần nạp nước trong ngày</span>
            <div className="divide-y divide-[#ebeef1] bg-white rounded-lg border border-[#ebeef1]">
              {logs.map((log) => (
                <div key={log.id} className="p-2.5 flex justify-between items-center text-[12px]">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-[#00658d]">+{log.amountMl}ml</span>
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-[#f1f4f7] text-[#49607e]">
                      {log.type === 'auto' ? 'Tự động cảm biến' : 'Ghi tay'}
                    </span>
                    <span className="text-[#49607e]">{log.note}</span>
                  </div>
                  <span className="font-medium text-[#6e7881]">{log.time}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="p-3 rounded-lg bg-[#c6e7ff]/30 text-[11px] text-[#003952] border border-[#83cfff]/40">
            <strong>Đánh giá y khoa sơ bộ:</strong> Thói quen phân bổ lượng nước đều đặn, nhịp sinh học thận đạt 92%. Khuyến nghị duy trì uống nước nhiệt độ 20-24°C để hấp thu tốt nhất.
          </div>
        </div>

        <div className="flex justify-between items-center pt-2 border-t border-[#ebeef1]">
          <span className="text-[12px] text-[#6e7881]">Sẵn sàng định dạng in PDF A4</span>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-[#49607e] font-semibold text-[13px]"
            >
              Hủy
            </button>
            <button
              type="button"
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-[#00658d] text-white font-bold text-[13px] shadow-md shadow-[#00658d]/20"
            >
              <span className="material-symbols-outlined text-[18px]">print</span>
              <span>In / Tải PDF</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
