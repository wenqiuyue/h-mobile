import home from "@/router/routes/home";
import message from "@/router/routes/message";
import consult from "@/router/routes/consult";
import user from "@/router/routes/user";
import login from "@/router/routes/login";
import test from "@/router/routes/test";
export default [
  {
    path: "/",
    redirect: "/home",
    component: () => import(/* webpackChunkName: "root" */ "@/views/main"),
    children: [
      {
        path: "home",
        name: "home-index",
        component: () => import(/* webpackChunkName: "root" */ "@/views/home")
      },
      {
        path: "message",
        name: "message-index",
        component: () =>
          import(/* webpackChunkName: "root" */ "@/views/message")
      },
      {
        path: "consult",
        name: "consult-index",
        component: () =>
          import(/* webpackChunkName: "root" */ "@/views/consult")
      },
      {
        path: "user",
        name: "user-index",
        component: () => import(/* webpackChunkName: "root" */ "@/views/user")
      }
    ]
  },
  home,
  message,
  consult,
  user,
  login,
  test
];
