import { $t, transformI18n } from "@/plugins/i18n";

export default {
  path: "/test",
  meta: {
    icon: "twemoji:face-with-monocle",
    title: transformI18n($t("menus.hstest")),
    rank: 10
  },
  children: [
    {
      path: "/test",
      name: "Test",
      component: () => import("@/views/test.vue"),
      meta: {
        title: transformI18n($t("menus.hstest"))
      }
    }
  ]
};
