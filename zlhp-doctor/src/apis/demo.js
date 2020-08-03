import { fetchGet } from "../fetch";

export function test() {
  return fetchGet("https://jsonplaceholder.typicode.com/todos/1");
}

export default {
  test
}