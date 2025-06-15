import type { Request } from "express";
import { Worker, isMainThread, parentPort, workerData } from "worker_threads";
import type { IOServer } from "./types.ts";

type QueueItem = {
  request: Request;
  id: string;
};

export default class WorkerQueue {
  #io: IOServer;
  #queue: Array<QueueItem> = [];

  constructor(io: any) {
    this.#io = io;
  }

  #processRequests(item: QueueItem) {
    if (isMainThread) {
      const worker = new Worker("./worker.js", { workerData: item });
      worker.on("message", (res) => {
        this.#io.emit(res);
      });
    }
  }

  enqueue(request: Request) {
    this.#queue.push({
      request,
      id: request.headers.date ?? String(Date.now()),
    });
  }

  processQueuedRequests() {
    setInterval(() => {
      if (this.#queue.length > 0) {
        const item = this.#queue.shift() as QueueItem;
        this.#processRequests(item);
      }
    }, 500);
  }
}
