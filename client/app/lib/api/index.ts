// TODO: get url from env variable
export const API_URL = "http://localhost:3001";

export type UserEntity = {
  firstName: string;
  lastName: string;
  age: number;
  avatarUrl: string;
  nationality: string;
  hobbies: string[];
};

export type GetUsersResponse = {
  users: Array<UserEntity>;
  filters: { nationalities: string[]; topHobbies: string[] };
};

export async function getUsers(request: Request) {
  const url = new URL(request.url);
  const params = new URLSearchParams(url.search);

  console.log("hit");

  const res = await fetch(`${API_URL}/users?${params}`);
  const users = await res.json();
  return users as GetUsersResponse;
}
