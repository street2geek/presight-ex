import type { Request, Response } from "express";
import WorkerQueue from "../utils/workerQueue.ts";

export function socketHandler(req: Request, res: Response, io: any) {
  const wq = new WorkerQueue(io);
  wq.enqueue(req);
  res.json({ status: "pending" });
  wq.processQueuedRequests();
}
