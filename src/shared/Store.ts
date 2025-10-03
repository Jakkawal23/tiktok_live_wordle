// src/store/index.ts
/**
 * Store สำหรับจัดการสถานะของเกม Thwordle ใน Vue
 * ทำหน้าที่เก็บสถานะ modalViewed, data (attempts), และ settings
 */

import { ref, watch } from "vue";
import { CharState } from "@/shared/Wordle"; // ต้องแก้ path ให้ตรงกับโปรเจกต์ของคุณ

// 🔹 Type Definitions
interface IStore {
  modalViewed: boolean;
  data: Record<string, Day>;
  settings?: ISettings;
}

export interface ISettings {
  layout: "ก-ฮ" | "Kedmanee";
  darkMode: boolean;
  hideTrainingCode: boolean;
  [key: string]: any;
}

interface Day {
  attempts: any[];
  win?: boolean;
  lose?: boolean;
}

// 🔹 Default Settings
const defaultSettings: ISettings = {
  layout: "Kedmanee",
  darkMode: false,
  hideTrainingCode: false,
};

const DEFAULT: IStore = {
  modalViewed: false,
  data: {},
  settings: defaultSettings,
};

// 🔹 LocalStorage Key
const LOCALSTORAGE_KEY = "thwordle-attempts";

// 🔹 โหลดข้อมูลจาก LocalStorage หรือใช้ Default
const storage: IStore = JSON.parse(
  window.localStorage.getItem(LOCALSTORAGE_KEY) || JSON.stringify(DEFAULT)
);

// 🔹 Reactive States
export const modalViewed = ref<IStore["modalViewed"]>(storage.modalViewed || DEFAULT.modalViewed);
export const data = ref<IStore["data"]>(storage.data || DEFAULT.data);
export const settings = ref<IStore["settings"]>(storage.settings || DEFAULT.settings);

// 🔹 เก็บค่าใน LocalStorage ทุกครั้งเมื่อ state เปลี่ยน
watch(modalViewed, (value) => {
  storage.modalViewed = value;
  storeSettings();
});

watch(data, (value) => {
  storage.data = value;
  storeSettings();
});

watch(settings, (value) => {
  storage.settings = value;
  storeSettings();
});

// 🔹 Function เก็บค่าใน LocalStorage
function storeSettings() {
  window.localStorage.setItem(LOCALSTORAGE_KEY, JSON.stringify(storage));
}

// 🔹 Export Store
export default {
  modalViewed,
  data,
  settings,
};
