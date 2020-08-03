import Container from "@/components/Container";

export default {
  path: "/user",
  name: "user",
  component: Container,
  children: [
    {
      path: "test",
      name: "test",
      component: () =>
        import(/* webpackChunkName: "user" */ "@/views/user/children/test")
    },
    //问诊管理
    {
      path: "interrogation-manage",
      name: "interrogation-manage",
      component: () =>
        import(
          /* webpackChunkName: "user" */ "@/views/interrogation/interrogation-manage"
        )
    },
    //问诊咨询
    {
      path: "interrogation-consult",
      name: "interrogation-consult",
      component: () =>
        import(
          /* webpackChunkName: "user" */ "@/views/interrogation/interrogation-consult"
        )
    },
    //病情描述
    {
      path: "description_disease",
      name: "description_disease",
      component: () =>
        import(
          /* webpackChunkName: "user" */ "@/views/interrogation/description_disease"
        )
    },
    //我的收入
    {
      path: "income",
      name: "income",
      component: () => import(/* webpackChunkName: "user" */ "@/views/income")
    },
    //收入明细
    {
      path: "income-detailed",
      name: "income-detailed",
      component: () =>
        import(/* webpackChunkName: "user" */ "@/views/income-detailed")
    },
    //收入详情
    {
      path: "income-info",
      name: "income-info",
      component: () =>
        import(/* webpackChunkName: "user" */ "@/views/income-info")
    },
    //设置
    {
      path: "setting",
      name: "setting",
      component: () => import(/* webpackChunkName: "user" */ "@/views/setting")
    },
    //修改密码
    {
      path: "set-password",
      name: "set-password",
      component: () =>
        import(/* webpackChunkName: "user" */ "@/views/set-password")
    },
    //提现
    {
      path: "cash-withdrawal-index",
      name: "cash-withdrawal-index",
      component: () =>
        import(
          /* webpackChunkName: "user" */ "@/views/cash-withdrawal/cash-withdrawal-index"
        )
    },
    //提现明细
    {
      path: "detailed",
      name: "detailed",
      component: () =>
        import(
          /* webpackChunkName: "user" */ "@/views/cash-withdrawal/detailed"
        )
    },
    //提现详情
    {
      path: "cash-withdrawal-info",
      name: "cash-withdrawal-info",
      component: () =>
        import(
          /* webpackChunkName: "user" */ "@/views/cash-withdrawal/cash-withdrawal-info"
        )
    },
    //微信绑定
    {
      path: "binding-weixin",
      name: "binding-weixin",
      component: () =>
        import(
          /* webpackChunkName: "user" */ "@/views/cash-withdrawal/binding-weixin"
        )
    },
    //输入提现金额
    {
      path: "input-cash",
      name: "input-cash",
      component: () =>
        import(
          /* webpackChunkName: "user" */ "@/views/cash-withdrawal/input-cash"
        )
    }
  ]
};
