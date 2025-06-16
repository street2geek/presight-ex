import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { Events } from "~/components/Events";
import { Notice } from "~/components/ui/Notice";
import { API_URL, sendSocketRequest } from "~/lib/api";

const socket = io(API_URL, {
  autoConnect: false,
});

export default function Socket() {
  const [results, setResults] = useState<{ id: string; status: string }[]>();
  const [isConnected, setIsConneected] = useState(false);
  const [requestN, setRequestN] = useState(20);

  function handleSocketConnect() {
    socket.connect();
    socket.on("connect", () => {
      setIsConneected(true);
      console.log("connected to socket server");
    });
    socket.on("result", (msg) => {
      const message = JSON.parse(msg);
      setResults((prev) =>
        prev?.map((result) =>
          result.id === message.id
            ? { ...result, status: message.result }
            : result
        )
      );
    });
  }

  async function handleSendRequests() {
    const tempResults = [];
    for (let n of Array.from({ length: requestN })) {
      const res = await sendSocketRequest();
      tempResults.push(res);
    }
    setResults(tempResults);
  }

  useEffect(() => {
    return () => {
      socket.off("result", () => console.log("no longer listening to result"));
      socket.off("connect", () => {
        setIsConneected(false);
        console.log("disconnected from socket server");
      });
    };
  }, []);

  return (
    <div className=" bg-slate-50 h-screen">
      <div className="container px-6 py-7 m-auto">
        <div className=" flex flex-col items-center  gap-4">
          <Notice connected={isConnected} />
          <div className="flex gap-4">
            <button
              onClick={handleSocketConnect}
              className="cursor-pointer inline-flex items-center justify-center h-12 gap-2 px-6 text-sm font-medium tracking-wide transition duration-300 border rounded shadow-lg focus-visible:outline-none whitespace-nowrap border-emerald-500 text-emerald-500 shadow-emerald-200 hover:border-emerald-600 hover:text-emerald-600 focus:border-emerald-700 focus:text-emerald-700 hover:shadow-md hover:shadow-emerald-200 focus:shadow-md focus:shadow-emerald-200 disabled:cursor-not-allowed disabled:border-emerald-300 disabled:text-emerald-300 disabled:shadow-none"
            >
              <span>Subcribe to Server</span>
            </button>
            <button
              onClick={handleSendRequests}
              className="cursor-pointer  inline-flex items-center justify-center h-12 gap-2 px-6 text-sm font-medium tracking-wide transition duration-300 rounded shadow-lg focus-visible:outline-none justify-self-center whitespace-nowrap bg-emerald-50 text-emerald-500 shadow-emerald-100 hover:bg-emerald-100 hover:text-emerald-600 hover:shadow-md hover:shadow-emerald-100 focus:bg-emerald-200 focus:text-emerald-700 focus:shadow-md focus:shadow-emerald-100 disabled:cursor-not-allowed disabled:border-emerald-300 disabled:bg-emerald-100 disabled:text-emerald-400 disabled:shadow-none"
            >
              <span>Send Requests</span>
            </button>
          </div>
        </div>
        <div className="flex flex-col items-center">
          <h1 className="mt-8 mb-2 text-2xl inline-block">Results:</h1>
          <p className="text-pink-500">
            <Events events={results} />
          </p>
        </div>
      </div>
    </div>
  );
}
