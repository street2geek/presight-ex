import { faker } from "@faker-js/faker";

import type { Request, Response } from "express";

function createChunks(str: string, bytes: number) {
  let d = Buffer.from(str);
  const chunks = [];
  for (let _ of [...Array(d.length).keys()]) {
    let idx = d.lastIndexOf(32, bytes + 1);
    if (idx < 0) idx = d.indexOf(32, bytes);
    if (idx < 0) idx = d.length;
    chunks.push(d.subarray(0, idx).toString());
    d = d.subarray(idx + 1);
  }
  return chunks;
}

export function charsHandler(req: Request, res: Response) {
  createChunks(faker.lorem.paragraphs(32), 8).forEach((chunk) => {
    res.write(chunk);
  });
}
