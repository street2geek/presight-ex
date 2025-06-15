import { useEffect, useState } from "react";
import { getTextResponse } from "~/lib/api";

export default function Stream() {
  const [characters, setCharacters] = useState("");
  const [entireResponse, setEntireResponse] = useState("");

  const handleStreamOutput = async () => {
    const response = await getTextResponse();

    if (!response.body) {
      return;
    }

    const reader = response.body
      .pipeThrough(new TextDecoderStream())
      .getReader();

    let completeText = "";

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      completeText += value;

      for (const char of value) {
        setCharacters((prev) => prev + char);
        await new Promise((resolve) => setTimeout(resolve, 5));
      }
    }

    setEntireResponse(completeText);
  };

  return (
    <div className=" bg-slate-50 h-screen">
      <div className="container px-6 py-7 m-auto">
        <div className=" flex flex-col items-center  gap-4">
          <div className="flex gap-4">
            <button
              disabled={!!characters}
              onClick={handleStreamOutput}
              className="cursor-pointer inline-flex items-center justify-center h-12 gap-2 px-6 text-sm font-medium tracking-wide transition duration-300 border rounded shadow-lg focus-visible:outline-none whitespace-nowrap border-emerald-500 text-emerald-500 shadow-emerald-200 hover:border-emerald-600 hover:text-emerald-600 focus:border-emerald-700 focus:text-emerald-700 hover:shadow-md hover:shadow-emerald-200 focus:shadow-md focus:shadow-emerald-200 disabled:cursor-not-allowed disabled:border-emerald-300 disabled:text-emerald-300 disabled:shadow-none"
            >
              <span>Start Stream</span>
            </button>
            <button
              onClick={() => {
                setCharacters("");
                setEntireResponse("");
              }}
              disabled={!entireResponse}
              className="cursor-pointer  inline-flex items-center justify-center h-12 gap-2 px-6 text-sm font-medium tracking-wide transition duration-300 rounded shadow-lg focus-visible:outline-none justify-self-center whitespace-nowrap bg-emerald-50 text-emerald-500 shadow-emerald-100 hover:bg-emerald-100 hover:text-emerald-600 hover:shadow-md hover:shadow-emerald-100 focus:bg-emerald-200 focus:text-emerald-700 focus:shadow-md focus:shadow-emerald-100 disabled:cursor-not-allowed disabled:border-emerald-300 disabled:bg-emerald-100 disabled:text-emerald-400 disabled:shadow-none"
            >
              <span>Clear Stream</span>
            </button>
          </div>
        </div>
        <div>
          <p className="text-purple-500 mt-[30px]">{characters}</p>
          <p className="text-purple-500 mt-[30px]">{entireResponse}</p>
        </div>
      </div>
    </div>
  );
}
