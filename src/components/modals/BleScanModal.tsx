import React, { useState } from 'react';

interface BleScanModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectDevice: (deviceName: string) => void;
}

export const BleScanModal: React.FC<BleScanModalProps> = ({
  isOpen,
  onClose,
  onSelectDevice,
}) => {
  const [scanning, setScanning] = useState(true);

  if (!isOpen) return null;

  const devices = [
    {
      name: 'HydroPulse Pro #091A',
      mac: 'E4:5F:01:8C:3A:90',
      rssi: '-52 dBm',
      connected: true,
    },
    {
      name: 'HydroPulse Mini #102B',
      mac: 'F0:23:44:91:AA:12',
      rssi: '-78 dBm',
      connected: false,
    },
  ];

  return (
    <div className="fixed inset-0 bg-[#2d3133]/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-[#ffffff] w-full max-w-md rounded-2xl p-6 shadow-2xl border border-[#bdc8d1]/30 flex flex-col gap-4">
        <div className="flex items-center justify-between pb-2 border-b border-[#ebeef1]">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#00658d] text-[24px]">
              bluetooth_searching
            </span>
            <h3 className="text-[18px] font-bold text-[#181c1e]">
              Quét thiết bị Bluetooth BLE
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

        {/* Radar Scanning animation */}
        <div className="relative py-6 flex flex-col items-center justify-center">
          <div className="relative w-20 h-20 rounded-full bg-[#c6e7ff]/40 flex items-center justify-center">
            <div className="absolute inset-0 rounded-full border border-[#00a8e8] animate-ping opacity-50"></div>
            <span className="material-symbols-outlined text-[#00658d] text-[32px]">
              bluetooth
            </span>
          </div>
          <span className="text-[13px] text-[#49607e] mt-3 font-medium">
            {scanning ? 'Đang tìm kiếm bình HydroPulse xung quanh...' : 'Đã hoàn tất tìm kiếm'}
          </span>
        </div>

        {/* Found Devices List */}
        <div className="flex flex-col gap-2">
          {devices.map((dev) => (
            <div
              key={dev.mac}
              className="p-3 rounded-xl bg-[#f1f4f7] border border-[#e0e3e6] flex items-center justify-between hover:border-[#00a8e8] transition-all"
            >
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-[#00658d]">water_bottle</span>
                <div className="flex flex-col">
                  <span className="text-[14px] font-bold text-[#181c1e]">{dev.name}</span>
                  <span className="text-[11px] text-[#49607e]">
                    {dev.mac} • {dev.rssi}
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  onSelectDevice(dev.name);
                  onClose();
                }}
                className={`px-3 py-1.5 rounded-lg text-[12px] font-bold transition-all ${
                  dev.connected
                    ? 'bg-[#c6e7ff] text-[#003952]'
                    : 'bg-[#00658d] text-white hover:bg-[#004c6b]'
                }`}
              >
                {dev.connected ? 'Đang ghép đôi' : 'Kết nối'}
              </button>
            </div>
          ))}
        </div>

        <div className="flex justify-between items-center pt-2 border-t border-[#ebeef1]">
          <button
            type="button"
            onClick={() => setScanning(!scanning)}
            className="text-[12px] text-[#00658d] font-bold hover:underline"
          >
            Quét lại
          </button>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-[#49607e] font-semibold text-[13px]"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};
