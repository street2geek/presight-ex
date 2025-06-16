import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/users.tsx"),
  route("users", "routes/users.tsx"),
  route("stream", "routes/stream.tsx"),
  route("socket", "routes/socket.tsx"),
] satisfies RouteConfig;
