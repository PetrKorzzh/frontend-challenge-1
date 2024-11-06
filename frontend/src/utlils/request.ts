import { BASE_URL } from "~/config/api";

export const request = async (url: string, options?: RequestInit) => {
  const reqOptions = {
    method: options?.method || "GET",
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
    ...options,
  };

  const response = await fetch(BASE_URL + url, reqOptions);
  let error;
  const isContentTypeJson = response.headers.get("content-type")?.includes("application/json");

  const responseData = isContentTypeJson ? await response.json() : (error = "Not a JSON!");

  if (!response.ok) {
    throw new Error(responseData);
  }

  if (error) {
    throw new Error(error);
  }

  return responseData;
};
