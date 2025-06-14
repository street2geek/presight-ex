import express from "express";
import cors from "cors";
import { usersHandler } from "./handlers/users.handler.ts";

const app = express();
const port = 3001;

app.use(cors());

app.get("/users", usersHandler);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
