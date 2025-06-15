import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/users.tsx"),
  route("stream", "routes/stream.tsx"),
] satisfies RouteConfig;
