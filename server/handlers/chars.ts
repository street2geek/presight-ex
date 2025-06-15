import { faker } from "@faker-js/faker";

import type { Request, Response } from "express";
export function charsHandler(req: Request, res: Response) {
  res.send(faker.lorem.paragraphs(32));
}
