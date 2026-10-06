import React, { useState } from 'react';
import { downloadSourceCodeZip } from '../utils/exportSource';

export const BackendDocsView: React.FC = () => {
  const [activeSection, setActiveSection] = useState<'overview' | 'endpoints' | 'schema' | 'iot'>('endpoints');
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [downloading, setDownloading] = useState(false);

  const handleDownload = async () => {
    try {
      setDownloading(true);
      await downloadSourceCodeZip();
    } finally {
      setTimeout(() => setDownloading(false), 1000);
    }
  };

  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const endpoints = [
    {
      group: '1. Quản lý Thể tích & Nhật ký Nạp nước (Hydration Intake)',
      items: [
        {
          method: 'GET',
          path: '/api/v1/hydration/today',
          desc: 'Lấy tổng hợp tiến độ hydrat hoá trong ngày của user (ml đã nạp, mục tiêu, remaining, mốc nạp, countdown).',
          response: `{
  "userId": "usr_091a",
  "date": "2026-10-06",
  "currentIntakeMl": 1850,
  "dailyGoalMl": 2500,
  "completionRate": 74.0,
  "remainingMl": 650,
  "activeHoursLeft": 5.5,
  "milestones": [
    { "time": "08:30", "amountMl": 350 },
    { "time": "10:15", "amountMl": 400 },
    { "time": "11:45", "amountMl": 300 },
    { "time": "14:00", "amountMl": 500 },
    { "time": "15:30", "amountMl": 300 }
  ],
  "nextReminder": {
    "targetTime": "16:15",
    "recommendedMl": 200,
    "secondsLeft": 1080
  }
}`
        },
        {
          method: 'POST',
          path: '/api/v1/hydration/intake',
          desc: 'Ghi nhận một lần uống nước (cả Tự động từ cảm biến bình BLE hoặc Nhập tay thủ công).',
          body: `{
  "amountMl": 250,
  "type": "manual", // "auto" | "manual"
  "beverage": "Nước dừa tươi",
  "temperatureC": 21.8,
  "deviceId": "dev_hydro_091a",
  "note": "Nước dừa tươi tại phòng gym"
}`,
          response: `{
  "success": true,
  "logId": "log_892348",
  "updatedTotalMl": 2100,
  "streakDays": 12,
  "message": "Đã ghi nhận +250ml thành công"
}`
        },
        {
          method: 'GET',
          path: '/api/v1/hydration/hourly?date=2026-10-06',
          desc: 'Lấy dữ liệu lượng nước tiêu thụ theo từng khung giờ (07h - 22h) và đường khuyến nghị nhịp sinh học.',
          response: `{
  "date": "2026-10-06",
  "hourlyBreakdown": [
    { "hour": "07h", "actualMl": 150, "bioRecommendedMl": 120 },
    { "hour": "08h", "actualMl": 200, "bioRecommendedMl": 180 },
    { "hour": "14h", "actualMl": 450, "bioRecommendedMl": 250, "isPeak": true }
  ],
  "circadianScore": 92
}`
        },
        {
          method: 'GET',
          path: '/api/v1/hydration/history?period=week',
          desc: 'Lấy lịch sử tuần/tháng/năm cho màn hình Phân tích & Báo cáo (biểu đồ spline, heatmap, tỉ lệ nhiệt độ).',
          response: `{
  "period": "week",
  "totalMl": 16850,
  "goalMetDays": 6,
  "totalDays": 7,
  "avgFrequencyMinutes": 48,
  "preferredTempC": 21.5,
  "tempDistribution": { "cool": 62, "warm": 28, "cold": 10 },
  "heatmapBlocks": [
    { "range": "06:00-09:00", "volumeMl": 380, "level": "medium" },
    { "range": "09:00-11:00", "volumeMl": 820, "level": "peak" }
  ]
}`
        }
      ]
    },
    {
      group: '2. Lịch Nhắc Nhở & Cấu Hình Đa Giác Quan (Sensory & Schedules)',
      items: [
        {
          method: 'GET',
          path: '/api/v1/reminders/config',
          desc: 'Lấy cấu hình đa giác quan nắp bình (LED Halo RGB, Haptic Motor, Soft Chime, DND, Desktop Sync).',
          response: `{
  "led": { "enabled": true, "colorHex": "#00f0ff", "effect": "breathe" },
  "haptic": { "enabled": true, "intensity": "medium", "pattern": "double" },
  "chime": { "enabled": true, "volume": 60, "melody": "water_drop" },
  "desktopSync": true,
  "dndMode": false,
  "quietHours": { "night": "22:30-07:00", "noon": "12:30-13:30" }
}`
        },
        {
          method: 'PUT',
          path: '/api/v1/reminders/config',
          desc: 'Cập nhật cấu hình đa giác quan trên bình.',
          body: `{
  "ledColorHex": "#00dbe9",
  "ledEffect": "breathe",
  "hapticIntensity": "strong",
  "chimeVolume": 70,
  "chimeMelody": "zen",
  "dndMode": false
}`
        },
        {
          method: 'GET',
          path: '/api/v1/reminders/schedules',
          desc: 'Lấy danh sách các phiên lịch nhắc nhở đang hoạt động (Giờ hành chính, Sau bữa ăn, Buổi tối thư giãn).',
          response: `[
  {
    "id": "sch_1",
    "title": "Giờ làm việc văn phòng",
    "days": "T2 - T6",
    "timeRange": "08:30 – 17:30",
    "amountPerSip": 150,
    "repeatMinutes": 45,
    "enabled": true,
    "nextTrigger": "14:15"
  }
]`
        },
        {
          method: 'POST',
          path: '/api/v1/reminders/schedules',
          desc: 'Thêm mới lịch nhắc nhở cá nhân hoá.',
          body: `{
  "title": "Tập thể thao buổi sáng",
  "days": "Hàng ngày",
  "timeRange": "06:00 – 07:30",
  "amountPerSip": 200,
  "repeatMinutes": 30,
  "icon": "fitness_center"
}`
        },
        {
          method: 'PATCH',
          path: '/api/v1/reminders/schedules/:id/toggle',
          desc: 'Bật/Tắt một lịch nhắc nhở.'
        }
      ]
    },
    {
      group: '3. Quản Lý Thiết Bị IoT & Cảm Biến (Device & Hardware Telemetry)',
      items: [
        {
          method: 'GET',
          path: '/api/v1/device/status',
          desc: 'Lấy thông tin trạng thái phần cứng bình (Pin Li-Po, BLE RSSI, Thể tích, Nhiệt độ nước, UV-C).',
          response: `{
  "deviceId": "HydroPulse-Pro-091A",
  "model": "Arctic Cyan SS316",
  "batteryPercent": 84,
  "batteryDaysEstimate": 14,
  "powerSaveMode": false,
  "bleRssi": -52,
  "firmwareVersion": "v2.4.1",
  "waterLevelMl": 510,
  "capacityMl": 750,
  "temperatureC": 22.0,
  "lastUvMinutesAgo": 80,
  "waterStoredHours": 6.3,
  "staleAlert": { "enabled": true, "thresholdHours": 16 }
}`
        },
        {
          method: 'POST',
          path: '/api/v1/device/command',
          desc: 'Gửi lệnh điều khiển phần cứng xuống bình (Tìm bình, Cân chỉnh 0ml, Kích hoạt UV-C, Khởi động lại).',
          body: `{
  "command": "TRIGGER_UVC", // "FIND_BOTTLE" | "CALIBRATE_ZERO" | "SOFT_RESET" | "TRIGGER_UVC"
  "durationSeconds": 180
}`,
          response: `{
  "status": "ACK",
  "command": "TRIGGER_UVC",
  "executionTimeMs": 24,
  "message": "Lệnh đã được dispatch tới vi điều khiển bình qua BLE GATT."
}`
        },
        {
          method: 'GET',
          path: '/api/v1/device/ota/check',
          desc: 'Kiểm tra phiên bản Firmware mới nhất qua OTA.',
          response: `{
  "currentVersion": "v2.4.1",
  "latestVersion": "v2.4.1",
  "hasUpdate": false,
  "changelog": [
    "Nâng cấp thuật toán lọc nhiễu cảm biến siêu âm",
    "Tối ưu PWM LED Halo giảm 12% pin"
  ]
}`
        }
      ]
    },
    {
      group: '4. Hồ Sơ Sinh Học & Đồng Bộ Hệ Sinh Thái (Bio Profile & Sync)',
      items: [
        {
          method: 'GET',
          path: '/api/v1/user/bio-profile',
          desc: 'Lấy thông tin sinh trắc học cá nhân và công thức tính lượng nước DynamicHydra™.',
          response: `{
  "gender": "female",
  "age": 26,
  "weightKg": 52.0,
  "heightCm": 162,
  "activityLevel": "moderate",
  "calculatedDailyGoalMl": 2500,
  "breakdown": {
    "baseMl": 1820,
    "workoutMl": 680,
    "weatherBonusMl": 300
  },
  "aiAdaptiveMode": true
}`
        },
        {
          method: 'POST',
          path: '/api/v1/integrations/sync',
          desc: 'Đồng bộ dữ liệu calo, bước chân, nhịp tim từ Apple Health / Garmin / Google Fit để AI tự tính bù nước.',
          body: `{
  "provider": "apple_health", // "garmin" | "google_fit"
  "caloriesBurned": 420,
  "workoutDurationMinutes": 45,
  "outdoorTempC": 32.0
}`,
          response: `{
  "success": true,
  "adjustedTargetMl": 2800,
  "recommendedIntervalMinutes": 35
}`
        }
      ]
    }
  ];

  const dbTables = [
    {
      name: 'users',
      desc: 'Thông tin tài khoản, hồ sơ sinh học & thể trạng',
      fields: 'id (PK), name, email, gender, age, weight_kg, height_cm, activity_level, daily_goal_ml, ai_adaptive_enabled, created_at'
    },
    {
      name: 'devices',
      desc: 'Thiết bị bình thông minh ghép đôi với tài khoản',
      fields: 'id (PK), user_id (FK), mac_address, model, firmware_version, battery_percent, capacity_ml, last_synced_at'
    },
    {
      name: 'intake_logs',
      desc: 'Nhật ký từng lần uống nước (cảm biến tự động & nhập tay)',
      fields: 'id (PK), user_id (FK), device_id (FK nullable), amount_ml, intake_type (auto/manual), temperature_c, beverage_type, note, logged_at'
    },
    {
      name: 'reminder_schedules',
      desc: 'Lịch nhắc nhở hoạt động theo khung giờ',
      fields: 'id (PK), user_id (FK), title, days_of_week, start_time, end_time, repeat_interval_min, sip_amount_ml, icon, is_enabled'
    },
    {
      name: 'sensory_settings',
      desc: 'Cấu hình đa giác quan trên thân bình',
      fields: 'id (PK), device_id (FK), led_enabled, led_color_hex, led_effect, haptic_intensity, haptic_pattern, chime_volume, chime_melody, dnd_enabled'
    },
    {
      name: 'device_telemetry_history',
      desc: 'Lưu trữ mẫu cảm biến thô theo thời gian (Timeseries)',
      fields: 'id (PK), device_id (FK), ultrasonic_depth_mm, ir_temp_c, battery_mv, roll_angle, pitch_angle, rssi_dbm, recorded_at'
    }
  ];

  const iotProtocols = [
    {
      channel: 'BLE GATT Services & Characteristics',
      items: [
        { uuid: '0x181A (Environmental Sensing)', desc: 'Chứa nhiệt độ nước (IR temperature characteristic) dạng IEEE-11073 16-bit Float.' },
        { uuid: '0x180F (Battery Service)', desc: 'Chứa phần trăm pin Li-Po (0 - 100%) và trạng thái sạc nam châm MagSafe.' },
        { uuid: '0xFFE0 (Custom HydroPulse Flow)', desc: 'Thông báo sự kiện uống nước (Timestamp, Volume Ml, Sip Duration ms, Tilt Angle).' },
        { uuid: '0xFFE1 (Sensory Control Command)', desc: 'Nhận lệnh từ app: Set LED RGB Hex, Run Haptic Pattern, Trigger Piezo Chime ID, Start UV-C 180s.' }
      ]
    },
    {
      channel: 'MQTT / WebSocket Cloud Sync (Khi bình kết nối qua Wi-Fi Gateway)',
      items: [
        { topic: 'devices/{deviceId}/telemetry', desc: 'Payload JSON gửi mỗi 60s: { water_level_ml, temp_c, battery_pct, uvc_status }' },
        { topic: 'devices/{deviceId}/events/sip', desc: 'Payload gửi tức thời khi nghiêng uống: { amount_ml, duration_ms, initial_ml, final_ml }' },
        { topic: 'devices/{deviceId}/commands', desc: 'Cloud gửi xuống: { action: "FIND_BOTTLE" | "TRIGGER_UVC" | "CALIBRATE" }' }
      ]
    }
  ];

  return (
    <div className="flex flex-col gap-6 w-full max-w-[1360px] mx-auto pb-12">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-[#ebeef1] flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <span className="p-1 rounded-lg bg-[#c6e7ff] text-[#00658d]">
              <span className="material-symbols-outlined text-[20px]">integration_instructions</span>
            </span>
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#00658d]">
              Tài Liệu Kỹ Thuật Cho Kỹ Sư Backend
            </span>
          </div>
          <h1 className="text-[26px] md:text-[30px] font-bold text-[#181c1e]">
            Đặc tả Kiến trúc & Danh sách API Backend (BE Specification)
          </h1>
          <p className="text-[14px] text-[#49607e]">
            Toàn bộ REST Endpoints, Cấu trúc Cơ sở dữ liệu và Giao thức IoT BLE/MQTT được thiết kế chuẩn xác để bạn tự xây dựng BE (Node.js, Go, Python, Spring Boot).
          </p>
        </div>

        {/* Section switchers & Download */}
        <div className="flex items-center gap-3 flex-wrap">
          <button
            type="button"
            onClick={handleDownload}
            disabled={downloading}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#00658d] hover:bg-[#004c6b] text-white text-[13px] font-bold shadow-sm transition-all active:scale-95 disabled:opacity-75"
          >
            <span className={`material-symbols-outlined text-[18px] ${downloading ? 'animate-spin' : ''}`}>
              {downloading ? 'sync' : 'download'}
            </span>
            <span>{downloading ? 'Đang nén zip...' : 'Tải Trọn Bộ Code (.zip)'}</span>
          </button>

          <div className="inline-flex p-1 bg-[#f1f4f7] rounded-xl border border-[#ebeef1] shrink-0">
            <button
              type="button"
              onClick={() => setActiveSection('endpoints')}
              className={`px-3.5 py-1.5 rounded-lg text-[13px] font-bold transition-all ${
                activeSection === 'endpoints' ? 'bg-white text-[#00658d] shadow-sm' : 'text-[#49607e]'
              }`}
            >
              REST Endpoints
            </button>
            <button
              type="button"
              onClick={() => setActiveSection('schema')}
              className={`px-3.5 py-1.5 rounded-lg text-[13px] font-bold transition-all ${
                activeSection === 'schema' ? 'bg-white text-[#00658d] shadow-sm' : 'text-[#49607e]'
              }`}
            >
              Database Schema
            </button>
            <button
              type="button"
              onClick={() => setActiveSection('iot')}
              className={`px-3.5 py-1.5 rounded-lg text-[13px] font-bold transition-all ${
                activeSection === 'iot' ? 'bg-white text-[#00658d] shadow-sm' : 'text-[#49607e]'
              }`}
            >
              Giao thức IoT (BLE/MQTT)
            </button>
          </div>
        </div>
      </div>

      {/* REST Endpoints Section */}
      {activeSection === 'endpoints' && (
        <div className="flex flex-col gap-6">
          {endpoints.map((group, gIdx) => (
            <div key={gIdx} className="bg-white rounded-2xl p-6 shadow-sm border border-[#ebeef1] flex flex-col gap-4">
              <h2 className="text-[18px] font-bold text-[#00658d] border-b border-[#ebeef1] pb-2">
                {group.group}
              </h2>

              <div className="flex flex-col gap-4">
                {group.items.map((item, idx) => {
                  const uniqueId = gIdx * 10 + idx;
                  return (
                    <div
                      key={idx}
                      className="p-4 rounded-xl bg-[#f1f4f7] border border-[#ebeef1] flex flex-col gap-2.5"
                    >
                      <div className="flex items-center justify-between flex-wrap gap-2">
                        <div className="flex items-center gap-2">
                          <span
                            className={`px-2.5 py-1 rounded-lg text-[11px] font-extrabold ${
                              item.method === 'GET'
                                ? 'bg-[#c6e7ff] text-[#003952]'
                                : item.method === 'POST'
                                ? 'bg-[#c4dcff] text-[#001c37]'
                                : item.method === 'PUT'
                                ? 'bg-[#7df4ff] text-[#002022]'
                                : 'bg-[#e0e3e6] text-[#181c1e]'
                            }`}
                          >
                            {item.method}
                          </span>
                          <code className="text-[14px] font-bold text-[#181c1e] bg-white px-2.5 py-0.5 rounded-md border border-[#ebeef1]">
                            {item.path}
                          </code>
                        </div>
                        <span className="text-[13px] text-[#49607e] font-medium">{item.desc}</span>
                      </div>

                      {item.body && (
                        <div className="mt-1">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-[#49607e]">
                            Request Payload (JSON)
                          </span>
                          <pre className="p-3 bg-[#181c1e] text-[#00dbe9] rounded-xl text-[12px] font-mono overflow-x-auto mt-1">
                            {item.body}
                          </pre>
                        </div>
                      )}

                      {item.response && (
                        <div className="mt-1 relative">
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-[#49607e]">
                              Response 200 OK (JSON)
                            </span>
                            <button
                              type="button"
                              onClick={() => copyToClipboard(item.response!, uniqueId)}
                              className="text-[11px] text-[#00658d] font-bold hover:underline flex items-center gap-1"
                            >
                              <span className="material-symbols-outlined text-[14px]">content_copy</span>
                              <span>{copiedIndex === uniqueId ? 'Đã sao chép!' : 'Sao chép JSON'}</span>
                            </button>
                          </div>
                          <pre className="p-3 bg-[#181c1e] text-[#c6e7ff] rounded-xl text-[12px] font-mono overflow-x-auto">
                            {item.response}
                          </pre>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Database Schema Section */}
      {activeSection === 'schema' && (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#ebeef1] flex flex-col gap-6">
          <div className="flex flex-col gap-1">
            <h2 className="text-[20px] font-bold text-[#181c1e]">
              Lược Đồ Cơ Sở Dữ Liệu Quan Hệ Khuyến Nghị (PostgreSQL / MySQL)
            </h2>
            <p className="text-[13px] text-[#49607e]">
              Thiết kế chuẩn hóa 3NF tối ưu cho việc truy vấn thói quen nạp nước, đồng bộ cảm biến và nhịp sinh học theo thời gian thực.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {dbTables.map((tbl, i) => (
              <div key={i} className="p-4 rounded-xl bg-[#f1f4f7] border border-[#ebeef1] flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[#00658d]">table_chart</span>
                    <span className="text-[15px] font-extrabold text-[#181c1e] font-mono">
                      {tbl.name}
                    </span>
                  </div>
                  <span className="text-[11px] px-2 py-0.5 rounded bg-white text-[#49607e] font-semibold border border-[#ebeef1]">
                    Table
                  </span>
                </div>
                <p className="text-[12px] text-[#49607e]">{tbl.desc}</p>
                <div className="p-2.5 bg-white rounded-lg border border-[#ebeef1] text-[12px] font-mono text-[#003952]">
                  <strong>Cột: </strong>{tbl.fields}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* IoT Protocol Section */}
      {activeSection === 'iot' && (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#ebeef1] flex flex-col gap-6">
          <div className="flex flex-col gap-1">
            <h2 className="text-[20px] font-bold text-[#181c1e]">
              Giao Thức Giao Tiếp Phần Cứng IoT (BLE GATT & MQTT/WebSocket)
            </h2>
            <p className="text-[13px] text-[#49607e]">
              Giao thức hai chiều giữa vi điều khiển nắp bình HydroPulse Core v2.4 (Nordic nRF52840 / ESP32-S3) và máy chủ Backend.
            </p>
          </div>

          <div className="flex flex-col gap-6">
            {iotProtocols.map((proto, i) => (
              <div key={i} className="p-5 rounded-xl bg-[#f1f4f7] border border-[#ebeef1] flex flex-col gap-3">
                <h3 className="text-[16px] font-bold text-[#00658d] flex items-center gap-2">
                  <span className="material-symbols-outlined">sensors</span>
                  <span>{proto.channel}</span>
                </h3>

                <div className="flex flex-col gap-2.5">
                  {proto.items.map((item, idx) => (
                    <div key={idx} className="p-3 bg-white rounded-xl border border-[#ebeef1] flex flex-col gap-1">
                      <code className="text-[13px] font-bold text-[#00658d]">
                        {'uuid' in item ? item.uuid : item.topic}
                      </code>
                      <p className="text-[12px] text-[#49607e]">{item.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
