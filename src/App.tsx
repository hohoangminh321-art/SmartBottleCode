/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { OverviewView } from './views/OverviewView';
import { RemindersView } from './views/RemindersView';
import { AnalyticsView } from './views/AnalyticsView';
import { DeviceView } from './views/DeviceView';
import { BackendDocsView } from './views/BackendDocsView';
import { ManualLogModal } from './components/modals/ManualLogModal';
import { SensorDetailsModal } from './components/modals/SensorDetailsModal';
import { AddScheduleModal } from './components/modals/AddScheduleModal';
import { FirmwareModal } from './components/modals/FirmwareModal';
import { BleScanModal } from './components/modals/BleScanModal';
import { PdfReportModal } from './components/modals/PdfReportModal';
import {
  NavigationTab,
  BottleState,
  UserHydration,
  IntakeLog,
  SensoryConfig,
  ScheduleItem,
} from './types';
import { soundEffects } from './utils/audio';

export default function App() {
  const [currentTab, setCurrentTab] = useState<NavigationTab>('overview');
  const [isSyncing, setIsSyncing] = useState<boolean>(false);

  // Modal states
  const [manualLogOpen, setManualLogOpen] = useState(false);
  const [sensorDetailsOpen, setSensorDetailsOpen] = useState(false);
  const [addScheduleOpen, setAddScheduleOpen] = useState(false);
  const [firmwareOpen, setFirmwareOpen] = useState(false);
  const [bleScanOpen, setBleScanOpen] = useState(false);
  const [pdfReportOpen, setPdfReportOpen] = useState(false);

  // Smart Bottle State
  const [bottle, setBottle] = useState<BottleState>({
    waterLevelMl: 510,
    capacityMl: 750,
    temperatureC: 22.0,
    batteryPercent: 84,
    batteryDaysEstimate: 14,
    isSterilizing: false,
    uvSecondsLeft: 0,
    nextUvHours: 2,
    bleConnected: true,
    bleRssi: -52,
    firmwareVersion: 'v2.4.1',
    powerSaveMode: false,
    staleAlertEnabled: true,
    staleThresholdHours: 16,
    lastUvMinutesAgo: 80,
    waterStoredHours: 6.3,
  });

  // User Hydration Metrics
  const [hydration, setHydration] = useState<UserHydration>({
    currentIntakeMl: 1850,
    dailyGoalMl: 2500,
    countdownSeconds: 1080, // 18:00 minutes
    streakDays: 12,
    avgFrequencyMinutes: 48,
    preferredTempC: 21.5,
    bioSyncRate: 92,
    activeHoursLeft: 5,
    activeMinutesLeft: 30,
  });

  // Intake Logs History
  const [logs, setLogs] = useState<IntakeLog[]>([
    {
      id: '1',
      time: '15:30',
      amountMl: 300,
      type: 'auto',
      note: '21.8°C • Bình HydroPulse',
      tempC: 21.8,
    },
    {
      id: '2',
      time: '14:00',
      amountMl: 500,
      type: 'manual',
      note: 'Nước dừa tươi tại phòng gym',
    },
    {
      id: '3',
      time: '11:45',
      amountMl: 300,
      type: 'auto',
      note: '22.2°C • Bình HydroPulse',
      tempC: 22.2,
    },
    {
      id: '4',
      time: '10:15',
      amountMl: 400,
      type: 'auto',
      note: '20.5°C • Bình HydroPulse',
      tempC: 20.5,
    },
  ]);

  // Sensory Configuration for Bottle Cap
  const [sensoryConfig, setSensoryConfig] = useState<SensoryConfig>({
    ledEnabled: true,
    ledColor: '#00f0ff',
    ledEffect: 'breathe',
    hapticEnabled: true,
    hapticIntensity: 'medium',
    hapticPattern: 'double',
    chimeEnabled: true,
    chimeVolume: 60,
    chimeMelody: 'water_drop',
    desktopSync: true,
    dndMode: false,
  });

  // Active Schedules
  const [schedules, setSchedules] = useState<ScheduleItem[]>([
    {
      id: '1',
      title: 'Giờ làm việc văn phòng',
      days: 'T2 - T6',
      amountPerSip: 150,
      timeRange: '08:30 – 17:30',
      repeatMinutes: 45,
      targetSessionMl: 1200,
      nextTrigger: '14:15',
      icon: 'work',
      enabled: true,
    },
    {
      id: '2',
      title: 'Sau bữa ăn chính',
      days: 'Hàng ngày',
      amountPerSip: 200,
      timeRange: 'Cố định vào 12:45 & 19:30',
      repeatMinutes: 0,
      nextTrigger: 'Đã xong lúc 12:45',
      icon: 'restaurant',
      enabled: true,
    },
    {
      id: '3',
      title: 'Buổi tối thư giãn',
      days: 'Hàng ngày',
      amountPerSip: 100,
      timeRange: '20:00 – 22:00',
      repeatMinutes: 60,
      nextTrigger: 'Bắt đầu sau 5 giờ',
      icon: 'nightlight',
      enabled: true,
    },
  ]);

  // Tick the countdown timer every second
  useEffect(() => {
    const timer = setInterval(() => {
      setHydration((prev) => {
        if (prev.countdownSeconds <= 0) {
          return { ...prev, countdownSeconds: 2700 }; // reset to 45 mins
        }
        return { ...prev, countdownSeconds: prev.countdownSeconds - 1 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Handler for quick sync button
  const handleQuickSync = () => {
    setIsSyncing(true);
    soundEffects.playDigitalCue();
    setTimeout(() => {
      setIsSyncing(false);
      setBottle((b) => ({
        ...b,
        temperatureC: Number((21.8 + Math.random() * 0.4).toFixed(1)),
        batteryPercent: Math.max(70, b.batteryPercent),
      }));
    }, 800);
  };

  // Drink now action
  const handleDrinkNow = () => {
    const addedMl = 200;
    setHydration((h) => ({
      ...h,
      currentIntakeMl: h.currentIntakeMl + addedMl,
      countdownSeconds: 2700, // reset to 45 mins
    }));
    setBottle((b) => ({
      ...b,
      waterLevelMl: Math.max(50, b.waterLevelMl - addedMl),
    }));

    const now = new Date();
    const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now
      .getMinutes()
      .toString()
      .padStart(2, '0')}`;

    setLogs((prev) => [
      {
        id: Date.now().toString(),
        time: timeStr,
        amountMl: addedMl,
        type: 'auto',
        note: `${bottle.temperatureC}°C • Bình HydroPulse`,
        tempC: bottle.temperatureC,
      },
      ...prev,
    ]);
  };

  // Snooze action (+15 minutes)
  const handleSnooze = () => {
    setHydration((h) => ({
      ...h,
      countdownSeconds: h.countdownSeconds + 15 * 60,
    }));
  };

  // Save manual intake log
  const handleSaveManualLog = (amountMl: number, note: string) => {
    soundEffects.playWaterDrop();
    setHydration((h) => ({
      ...h,
      currentIntakeMl: h.currentIntakeMl + amountMl,
    }));

    const now = new Date();
    const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now
      .getMinutes()
      .toString()
      .padStart(2, '0')}`;

    setLogs((prev) => [
      {
        id: Date.now().toString(),
        time: timeStr,
        amountMl,
        type: 'manual',
        note,
      },
      ...prev,
    ]);
  };

  // Toggle Schedule
  const handleToggleSchedule = (id: string) => {
    soundEffects.playDigitalCue();
    setSchedules((prev) =>
      prev.map((sch) => (sch.id === id ? { ...sch, enabled: !sch.enabled } : sch))
    );
  };

  // Add new schedule
  const handleAddSchedule = (newSch: ScheduleItem) => {
    soundEffects.playDigitalCue();
    setSchedules((prev) => [newSch, ...prev]);
  };

  // Apply AI Suggestions (increases daily goal by 300ml)
  const handleApplyAiSuggestions = () => {
    setHydration((h) => ({
      ...h,
      dailyGoalMl: 2800,
    }));
    setSchedules((prev) =>
      prev.map((sch) =>
        sch.id === '1' ? { ...sch, repeatMinutes: 35, amountPerSip: 180 } : sch
      )
    );
  };

  return (
    <div className="bg-[#f7fafd] font-sans text-[#181c1e] min-h-screen flex">
      {/* Sidebar Navigation */}
      <Sidebar
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        bleConnected={bottle.bleConnected}
        batteryPercent={bottle.batteryPercent}
        onQuickSync={handleQuickSync}
        isSyncing={isSyncing}
      />

      {/* Main Content Area */}
      <div className="pl-72 flex-1 flex flex-col min-w-0">
        {/* Global Fixed Header */}
        <Header
          hydration={hydration}
          onViewApiDocs={() => setCurrentTab('api-docs')}
        />

        {/* Content Body */}
        <main className="pt-20 px-6 py-6 pb-16 min-h-screen">
          {currentTab === 'overview' && (
            <OverviewView
              bottle={bottle}
              hydration={hydration}
              logs={logs}
              onOpenManualLog={() => setManualLogOpen(true)}
              onOpenSensorDetails={() => setSensorDetailsOpen(true)}
              onQuickSync={handleQuickSync}
              onDrinkNow={handleDrinkNow}
              onSnooze={handleSnooze}
              onOpenPdfReport={() => setPdfReportOpen(true)}
              isSyncing={isSyncing}
            />
          )}

          {currentTab === 'reminders' && (
            <RemindersView
              sensoryConfig={sensoryConfig}
              onUpdateSensory={(updated) => setSensoryConfig((s) => ({ ...s, ...updated }))}
              schedules={schedules}
              onToggleSchedule={handleToggleSchedule}
              onOpenAddSchedule={() => setAddScheduleOpen(true)}
            />
          )}

          {currentTab === 'analytics' && (
            <AnalyticsView
              hydration={hydration}
              onOpenPdfReport={() => setPdfReportOpen(true)}
              onQuickLog={(amount, note) => handleSaveManualLog(amount, note)}
              onApplyAiSuggestions={handleApplyAiSuggestions}
            />
          )}

          {currentTab === 'device' && (
            <DeviceView
              bottle={bottle}
              hydration={hydration}
              onUpdateBottle={(updated) => setBottle((b) => ({ ...b, ...updated }))}
              onOpenBleScan={() => setBleScanOpen(true)}
              onOpenFirmware={() => setFirmwareOpen(true)}
            />
          )}

          {currentTab === 'api-docs' && <BackendDocsView />}
        </main>
      </div>

      {/* Modals Container */}
      <ManualLogModal
        isOpen={manualLogOpen}
        onClose={() => setManualLogOpen(false)}
        onSave={handleSaveManualLog}
      />

      <SensorDetailsModal
        isOpen={sensorDetailsOpen}
        onClose={() => setSensorDetailsOpen(false)}
        bottle={bottle}
      />

      <AddScheduleModal
        isOpen={addScheduleOpen}
        onClose={() => setAddScheduleOpen(false)}
        onAdd={handleAddSchedule}
      />

      <FirmwareModal
        isOpen={firmwareOpen}
        onClose={() => setFirmwareOpen(false)}
        currentVersion={bottle.firmwareVersion}
      />

      <BleScanModal
        isOpen={bleScanOpen}
        onClose={() => setBleScanOpen(false)}
        onSelectDevice={(devName) => {
          setBottle((b) => ({ ...b, bleConnected: true }));
        }}
      />

      <PdfReportModal
        isOpen={pdfReportOpen}
        onClose={() => setPdfReportOpen(false)}
        hydration={hydration}
        logs={logs}
      />
    </div>
  );
}
