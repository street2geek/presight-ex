import { workerData } from "worker_threads";

setTimeout(() => {
  parentPort.postMessage({
    id: workerData.id,
    result: `Processed result for request sent at ${workerData.date}}`,
  });
}, 2000);
