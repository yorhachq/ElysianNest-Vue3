import { $t } from "@/plugins/i18n";

export default {
  path: "/",
  redirect: "/test",
  meta: {
    icon: "twemoji:face-with-monocle",
    title: $t("menus.hstest"),
    rank: 10
  },
  children: [
    {
      path: "/test",
      name: "Test",
      component: () => import("@/views/test.vue"),
      meta: {
        title: $t("menus.hstest")
      }
    }
  ]
};
