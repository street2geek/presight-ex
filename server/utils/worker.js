import { workerData, parentPort } from "worker_threads";
import { setInterval } from "node:timers/promises";

for await (const _ of setInterval(2000)) {
  if (workerData.length === 0) break;

  const item = workerData.shift();

  parentPort.postMessage({
    id: item.id,
    result: `Processed result for request sent at ${item.date}`,
  });
}
