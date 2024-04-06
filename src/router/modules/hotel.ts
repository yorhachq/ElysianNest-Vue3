import { $t, transformI18n } from "@/plugins/i18n";
import Hotel from "@iconify-icons/ri/hotel-line";
import RoomStatus from "@iconify-icons/ri/calendar-2-line";
import Room from "@iconify-icons/ic/baseline-hotel"
import RoomType from "@iconify-icons/ic/baseline-meeting-room"

export default {
  path: "/hotel",
  redirect: "/hotel/roomStatus",
  meta: {
    icon: Hotel,
    title: $t("menus.hotelManagement"),
    rank: 3
  },
  children: [
    {
      path: "/hotel/roomStatus",
      name: "RoomStatus",
      component: () => import("@/views/hotel/roomStatus.vue"),
      meta: {
        icon: RoomStatus,
        title: transformI18n($t("menus.roomStatus"))
      }
    },
    {
      path: "/hotel/checkin",
      name: "Checkin",
      component: () => import("@/views/hotel/checkin.vue"),
      meta: {
        icon: "icon-park-outline:check-in",
        title: transformI18n($t("menus.checkIn"))
      }
    },
    {
      path: "/hotel/order",
      name: "Order",
      component: () => import("@/views/hotel/order.vue"),
      meta: {
        icon: "icon-park-outline:order",
        title: transformI18n($t("menus.order"))
      }
    },
    {
      path: "/hotel/room",
      name: "Room",
      component: () => import("@/views/hotel/room.vue"),
      meta: {
        icon: Room,
        title: transformI18n($t("menus.room"))
      }
    },
    {
      path: "/hotel/roomType",
      name: "RoomType",
      component: () => import("@/views/hotel/roomType.vue"),
      meta: {
        icon: RoomType,
        title: transformI18n($t("menus.roomType")),
        roles: ["admin"]
      }
    }
  ]
} satisfies RouteConfigsTable;
