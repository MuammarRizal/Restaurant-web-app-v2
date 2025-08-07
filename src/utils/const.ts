export const API_URL =
  process.env.NODE_ENV === "development"
    ? "http://localhost:3000/api"
    : "https://collaboration-day-ppkd-js.vercel.app/api";

export const URL =
  process.env.NODE_ENV === "development"
    ? "http://localhost:3000"
    : "https://collaboration-day-ppkd-js.vercel.app";
