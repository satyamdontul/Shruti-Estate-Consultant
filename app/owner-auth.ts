import { getChatGPTUser } from "./chatgpt-auth";

export const OWNER_EMAIL = "satyamdontul@gmail.com";

export async function isSiteOwner() {
  const user = await getChatGPTUser();
  return user?.email.trim().toLowerCase() === OWNER_EMAIL;
}
