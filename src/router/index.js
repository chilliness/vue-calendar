import { createRouter, createWebHashHistory } from "vue-router";

let routes = [
  {
    path: "/",
    name: "calendar",
    component: () => import("@/components/tag-calendar/index.vue"),
  },
  {
    path: "/todo",
    name: "todo",
    component: () => import("@/components/tag-todo/index.vue"),
  },
  {
    path: "/:pathMatch(.*)",
    redirect: "/",
  },
];

let router = createRouter({
  history: createWebHashHistory(),
  routes,
  scrollBehavior: (to, from, savedPosition) => savedPosition ?? { top: 0 },
});

export default router;
