import { createRouter, createWebHashHistory } from "vue-router";

const routes = [
  {
    path: "/",
    name: "calendar",
    component: () => import("@/components/tag-calendar"),
  },
  {
    path: "/todo",
    name: "todo",
    component: () => import("@/components/tag-todo"),
  },
  {
    path: "/:pathMatch(.*)*",
    redirect: "/",
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
