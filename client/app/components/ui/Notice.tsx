export function Notice({ connected }: { connected: boolean }) {
  return (
    <>
      <div className="inline-flex items-center gap-4 rounded-full border border-slate-800 bg-slate-900 p-0.5 pr-4">
        <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-slate-700 text-slate-100 transition duration-100">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-4 h-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            stroke-width="1.5"
            aria-labelledby="title-03 desc-03"
            role="graphics-symbol"
          >
            <title id="title-03">Alert Icon</title>
            <desc id="desc-03">Alert icon associated with a connection</desc>
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
            />
          </svg>
        </span>
        <div className="flex items-center gap-1 text-slate-200">
          <span className="flex gap-1">
            <span className="hidden md:block">Server connection</span> status:
          </span>
          <a
            href="javascript:void(0)"
            className="inline-flex items-center justify-center gap-2 justify-self-center whitespace-nowrap tracking-wide text-emerald-500 transition duration-300 hover:text-emerald-600 focus:text-emerald-700 focus-visible:outline-none disabled:cursor-not-allowed disabled:text-emerald-300 disabled:shadow-none"
          >
            <span>
              {connected ? (
                <span>Connected</span>
              ) : (
                <span className="text-pink-500">Disconnected</span>
              )}
            </span>
          </a>
        </div>
      </div>
    </>
  );
}
