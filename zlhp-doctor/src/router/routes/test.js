import Container from "@/components/Container";

export default {
  path: "/test",
  name: "test",
  component: Container,
  children: [
    {
      path: "scroll",
      name: "scroll",
      component: () =>
        import(/* webpackChunkName: "user" */ "@/views/test/scroll")
    }
  ]
};
