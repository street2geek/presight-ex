const { workerData } = require("worker_threads");

setTimeout(() => {
  parentPort.postMessage({
    id: workerData.id,
    result: `Processed result for request sent at ${workerData.id} from ${workerData.request.connection.remoteAddress}`,
  });
}, 2000);
