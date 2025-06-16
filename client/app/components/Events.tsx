export function Events({
  events,
}: {
  events?: Array<{ id: string; status: string }>;
}) {
  return (
    <ul>
      {events?.map((event) => (
        <li className="text-slate-500" key={event.id}>
          request {"-->"} {event.status}
        </li>
      ))}
    </ul>
  );
}
