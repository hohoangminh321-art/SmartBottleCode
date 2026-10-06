export type NavigationTab = 'overview' | 'reminders' | 'analytics' | 'device' | 'api-docs';

export interface IntakeLog {
  id: string;
  time: string;
  amountMl: number;
  type: 'auto' | 'manual';
  note: string;
  tempC?: number;
}

export interface ScheduleItem {
  id: string;
  title: string;
  days: string;
  amountPerSip: number;
  timeRange: string;
  repeatMinutes: number;
  targetSessionMl?: number;
  nextTrigger: string;
  icon: string;
  enabled: boolean;
  statusText?: string;
}

export interface SensoryConfig {
  ledEnabled: boolean;
  ledColor: string;
  ledEffect: 'breathe' | 'blink' | 'wave';
  hapticEnabled: boolean;
  hapticIntensity: 'light' | 'medium' | 'strong';
  hapticPattern: 'double' | 'pulse';
  chimeEnabled: boolean;
  chimeVolume: number;
  chimeMelody: 'water_drop' | 'zen' | 'ocean' | 'digital';
  desktopSync: boolean;
  dndMode: boolean;
}

export interface BottleState {
  waterLevelMl: number;
  capacityMl: number;
  temperatureC: number;
  batteryPercent: number;
  batteryDaysEstimate: number;
  isSterilizing: boolean;
  uvSecondsLeft: number;
  nextUvHours: number;
  bleConnected: boolean;
  bleRssi: number;
  firmwareVersion: string;
  powerSaveMode: boolean;
  staleAlertEnabled: boolean;
  staleThresholdHours: number;
  lastUvMinutesAgo: number;
  waterStoredHours: number;
}

export interface UserHydration {
  currentIntakeMl: number;
  dailyGoalMl: number;
  countdownSeconds: number;
  streakDays: number;
  avgFrequencyMinutes: number;
  preferredTempC: number;
  bioSyncRate: number;
  activeHoursLeft: number;
  activeMinutesLeft: number;
}
