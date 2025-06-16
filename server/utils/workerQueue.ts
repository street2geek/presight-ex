import type { Request } from "express";
import type { Server } from "socket.io";
import { Worker, isMainThread } from "worker_threads";

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

  processQueue() {
    if (isMainThread) {
      const worker = new Worker("./utils/worker.js", {
        workerData: this.#queue,
      });
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
}
