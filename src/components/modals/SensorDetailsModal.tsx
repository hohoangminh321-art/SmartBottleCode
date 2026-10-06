import React from 'react';
import { BottleState } from '../../types';

interface SensorDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  bottle: BottleState;
}

export const SensorDetailsModal: React.FC<SensorDetailsModalProps> = ({
  isOpen,
  onClose,
  bottle,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-[#2d3133]/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-[#ffffff] w-full max-w-lg rounded-2xl p-6 shadow-2xl border border-[#bdc8d1]/30 flex flex-col gap-4">
        <div className="flex items-center justify-between pb-2 border-b border-[#ebeef1]">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#00658d] text-[24px]">
              sensors
            </span>
            <div>
              <h3 className="text-[18px] font-bold text-[#181c1e]">
                Chi tiết Telemetry & Cảm biến
              </h3>
              <p className="text-[12px] text-[#49607e]">HydroPulse Core Hardware Architecture</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-[#49607e] hover:bg-[#ebeef1]"
            type="button"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <div className="grid grid-cols-2 gap-3 text-[13px]">
          <div className="p-3 rounded-xl bg-[#f1f4f7] flex flex-col gap-1">
            <span className="text-[11px] font-bold text-[#49607e] uppercase">
              Cảm biến siêu âm (Mực nước)
            </span>
            <span className="text-[16px] font-bold text-[#00658d]">
              {bottle.waterLevelMl} ml (độ sâu 142mm)
            </span>
            <span className="text-[11px] text-[#006970]">Độ phân giải: 1.0mm • Độ trễ: 200ms</span>
          </div>

          <div className="p-3 rounded-xl bg-[#f1f4f7] flex flex-col gap-1">
            <span className="text-[11px] font-bold text-[#49607e] uppercase">
              Hồng ngoại đo nhiệt
            </span>
            <span className="text-[16px] font-bold text-[#00658d]">
              {bottle.temperatureC}°C (±0.2°C)
            </span>
            <span className="text-[11px] text-[#006970]">Cảm biến tiếp xúc vi sai lòng nắp</span>
          </div>

          <div className="p-3 rounded-xl bg-[#f1f4f7] flex flex-col gap-1">
            <span className="text-[11px] font-bold text-[#49607e] uppercase">
              Pin & Nguồn điện
            </span>
            <span className="text-[16px] font-bold text-[#00658d]">
              {bottle.batteryPercent}% (4.12V Li-Po)
            </span>
            <span className="text-[11px] text-[#49607e]">IC sạc MagSafe 5W • Tiêu thụ 1.2mA</span>
          </div>

          <div className="p-3 rounded-xl bg-[#f1f4f7] flex flex-col gap-1">
            <span className="text-[11px] font-bold text-[#49607e] uppercase">
              Diode Diệt khuẩn UV-C
            </span>
            <span className="text-[16px] font-bold text-[#00658d]">
              Bước sóng 280nm
            </span>
            <span className="text-[11px] text-[#006970]">Hiệu suất diệt khuẩn 99.9%</span>
          </div>

          <div className="p-3 rounded-xl bg-[#f1f4f7] flex flex-col gap-1">
            <span className="text-[11px] font-bold text-[#49607e] uppercase">
              Gia tốc & Con quay 6-trục
            </span>
            <span className="text-[16px] font-bold text-[#181c1e]">
              Roll: +2.4° • Pitch: -1.1°
            </span>
            <span className="text-[11px] text-[#49607e]">Nhận diện góc nghiêng & nhấc uống</span>
          </div>

          <div className="p-3 rounded-xl bg-[#f1f4f7] flex flex-col gap-1">
            <span className="text-[11px] font-bold text-[#49607e] uppercase">
              Module Bluetooth 5.3 BLE
            </span>
            <span className="text-[16px] font-bold text-[#181c1e]">
              RSSI: {bottle.bleRssi} dBm
            </span>
            <span className="text-[11px] text-[#006970]">Giao thức GATT 128-bit Encrypted</span>
          </div>
        </div>

        <div className="p-3 rounded-xl bg-[#c6e7ff]/40 border border-[#83cfff]/40 text-[12px] text-[#003952] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#00658d]">check_circle</span>
            <span>Tất cả cảm biến vận hành bình thường (Self-test OK)</span>
          </div>
          <span className="font-bold text-[#00658d]">{bottle.firmwareVersion}</span>
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-[#00658d] text-white font-bold text-[14px]"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};
