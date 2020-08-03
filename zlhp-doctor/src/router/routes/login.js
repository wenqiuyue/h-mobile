import Container from "@/components/Container";

export default {
  path: "/",
  name: "/",
  component: Container,
  children: [
    //登录
    {
      path: "login",
      name: "login",
      component: () => import(/* webpackChunkName: "user" */ "@/views/login")
    },
    {
      path: "register",
      name: "register",
      component: () => import(/* webpackChunkName: "root" */ "@/views/register")
    }
  ]
};
