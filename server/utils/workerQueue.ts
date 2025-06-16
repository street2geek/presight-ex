import type { Request } from "express";
import type { Server } from "socket.io";
import { Worker, isMainThread, parentPort, workerData } from "worker_threads";

type QueueItem = {
  id: string;
  date: string;
};

export default class WorkerQueue {
  #io: Server;
  #queue: Array<QueueItem> = [];

  constructor(io: any) {
    this.#io = io;
  }

  #processRequests(item: QueueItem) {
    if (isMainThread) {
      console.log(item);
      const worker = new Worker("./utils/worker.js", { workerData: item });
      worker.on("message", (res) => {
        this.#io.emit("result", JSON.stringify(res));
      });
    }
  }

  enqueue(request: Request, id: string) {
    const timeElapsed = Date.now();
    const today = new Date(timeElapsed);
    this.#queue.push({
      date: today.toUTCString(),
      id,
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
