import type { Request, Response } from "express";
import WorkerQueue from "../utils/workerQueue.ts";

export function socketHandler(req: Request, res: Response, io: any) {
  const wq = new WorkerQueue(io);
  const id = String(Date.now() + Math.random());
  wq.enqueue(req, id);
  res.json({ id, status: "pending" });
  try {
    wq.processQueue();
  } catch (e) {
    console.error(e);
  }
}
