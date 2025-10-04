import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import "./assets/base.css"; // ใส่ไฟล์ CSS ธีมก่อน Tailwind
import "./assets/main.css";

const app = createApp(App);
app.use(router);
app.mount("#app");

const savedTheme = localStorage.getItem("theme");
if (savedTheme === "dark") {
  document.documentElement.classList.add("dark");
} else {
  document.documentElement.classList.remove("dark");
}
