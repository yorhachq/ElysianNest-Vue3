import { $t, transformI18n } from "@/plugins/i18n";
import Home from "@iconify-icons/ic/baseline-home";

const { VITE_HIDE_HOME } = import.meta.env;
const Layout = () => import("@/layout/index.vue");

export default {
  path: "/",
  name: "Home",
  component: Layout,
  redirect: "/home",
  meta: {
    icon: Home,
    title: transformI18n($t("menus.hshome")),
    rank: 0
  },
  children: [
    {
      path: "/home",
      name: "Welcome",
      component: () => import("@/views/home/index.vue"),
      meta: {
        title: transformI18n($t("menus.hshome")),
        showLink: VITE_HIDE_HOME === "true" ? false : true
      }
    }
  ]
} satisfies RouteConfigsTable;
