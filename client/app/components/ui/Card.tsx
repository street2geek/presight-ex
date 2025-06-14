import type { UserEntity } from "~/lib/api";

type CardProps = {
  user: UserEntity;
  observerRef?: React.Ref<HTMLDivElement>;
};

export function Card({ user, observerRef }: CardProps) {
  return (
    <>
      <div
        ref={observerRef}
        className="flex flex-col overflow-hidden bg-white rounded shadow-md text-slate-500 shadow-slate-200 sm:flex-row w-[556px]"
      >
        <figure className="flex-1">
          <img
            src={user.avatarUrl}
            alt="card image"
            className="object-cover min-h-full aspect-auto"
          />
        </figure>
        {/*  <!-- Body--> */}
        <div className="flex-1 p-6 sm:mx-6 sm:px-0">
          <header className="flex gap-4 mb-4">
            <div>
              <h3 className="text-xl font-medium text-slate-700">
                {user.firstName} {user.lastName}
              </h3>
              <p className="text-sm text-slate-400 flex gap-2">
                <span>{user.nationality}</span> <span>{user.age}</span>
              </p>
            </div>
          </header>
          <div className="flex text-sm text-slate-400  gap-4">
            <p>
              {user.hobbies.slice(0, 2).map((hobby) => (
                <span className="px-1">{hobby}</span>
              ))}
            </p>
            <p>
              {user.hobbies.length > 2 ? (
                <span>+{user.hobbies.length - 2}</span>
              ) : (
                ""
              )}
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
