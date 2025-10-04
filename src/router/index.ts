import { createRouter, createWebHistory } from "vue-router";

import MainLayout from "@/layouts/MainLayout.vue";
import HomeView from "@/views/HomeView.vue";
import AboutView from "@/views/AboutView.vue";
import GameView from "@/views/GameView.vue";

const routes = [
  {
    path: "/",
    component: MainLayout,
    redirect: "/game",
    children: [
      { path: "home", name: "home", component: HomeView },
      { path: "about", name: "about", component: AboutView },
      { path: "game", name: "game", component: GameView },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

export default router;
