import express from "express";
import { createServer } from "node:http";
import cors from "cors";
import { JSONFilePreset } from "lowdb/node";
import { Server } from "socket.io";

import { usersHandler } from "./handlers/users.handler.ts";
import { charsHandler } from "./handlers/chars.handler.ts";
import { socketHandler } from "./handlers/socket.handler.ts";
import { generateUserData } from "./utils/data.ts";
import type { IOServer } from "./utils/types.ts";

const app = express();
const server = createServer(app);
const port = 3001;
const db = await JSONFilePreset("db.json", { users: generateUserData() });
const io = new Server<IOServer>(server, {
  cors: {
    origin: "*",
  },
});

app.use(cors());
app.use(express.json());

app.get("/users", (req, res) => usersHandler(req, res, db));

app.get("/chars", charsHandler);

app.post("/socket", (req, res) => socketHandler(req, res, io));

io.on("connection", (socket) => {
  console.log("a client is connected");
});

server.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
