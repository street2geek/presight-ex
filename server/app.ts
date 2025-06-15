import express from "express";
import cors from "cors";
import { JSONFilePreset } from "lowdb/node";

import { usersHandler } from "./handlers/users.ts";
import { charsHandler } from "./handlers/chars.ts";
import { generateUserData } from "./utils/data.ts";

const app = express();
const port = 3001;
const db = await JSONFilePreset("db.json", { users: generateUserData() });

app.use(cors());

app.get("/users", (req, res) => usersHandler(req, res, db));

app.get("/chars", charsHandler);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
