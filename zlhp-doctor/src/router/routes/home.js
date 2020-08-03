import Container from "@/components/Container";

export default {
  path: "/home",
  name: "home",
  component: Container,
  children: [
    //设置工作时间
    {
      path: "set-worktime",
      name: "set-worktime",
      component: () =>
        import(/* webpackChunkName: "user" */ "@/views/set-worktime")
    },
    //课程列表
    {
      path: "course-list",
      name: "course-list",
      component: () =>
        import(
          /* webpackChunkName: "user" */ "@/views/mother-school/course-list"
        )
    },
    //课程详情
    {
      path: "course-info",
      name: "course-info",
      component: () =>
        import(
          /* webpackChunkName: "user" */ "@/views/mother-school/course-info"
        )
    },
    //报名情况
    {
      path: "sign-up",
      name: "sign-up",
      component: () =>
        import(/* webpackChunkName: "user" */ "@/views/mother-school/sign-up")
    },
    //签到情况
    {
      path: "sign-in",
      name: "sign-in",
      component: () =>
        import(/* webpackChunkName: "user" */ "@/views/mother-school/sign-in")
    }
  ]
};
