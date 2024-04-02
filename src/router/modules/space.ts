import { $t, transformI18n } from "@/plugins/i18n";

export default {
  path: "/space",
  meta: {
    icon: "bi:person-workspace",
    title: transformI18n($t("menus.space")),
    rank: 2
  },
  children: [
    {
      path: "/space",
      name: "Space",
      component: () => import("@/views/space/index.vue"),
      meta: {
        title: transformI18n($t("menus.space"))
      }
    }
  ]
} satisfies RouteConfigsTable;
