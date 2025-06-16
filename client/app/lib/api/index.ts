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

type GetUsersResponse = {
  users: Array<UserEntity>;
  filters: { nationalities: string[]; topHobbies: string[] };
  nextPage: number;
};

type sendSocketRequestResponse = {
  id: string;
  status: string;
};

export async function getUsers(request: Request) {
  const url = new URL(request.url);
  const params = new URLSearchParams(url.search);

  console.log(params);

  const res = await fetch(`${API_URL}/users?${params}`);
  const users = await res.json();
  return users as GetUsersResponse;
}

export async function getTextResponse() {
  const res = await fetch(`${API_URL}/chars`);
  return res;
}

export async function sendSocketRequest() {
  const res = await fetch(`${API_URL}/socket`, {
    method: "POST",
  });
  const status = await res.json();
  return status as sendSocketRequestResponse;
}
