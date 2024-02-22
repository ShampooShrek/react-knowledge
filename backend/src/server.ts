const origin =
  process.env.NODE_ENV === "development"
    ? "http://localhost:3000"
    : process.env.ORIGIN || "http://localhost:3000";

import express from "express";
import cors from "cors";

import categoriesRoute from "./routes/categories";
import articlesRoute from "./routes/articles";
import usersRoute from "./routes/users";
import statusRoute from "./routes/status";

export const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    optionsSuccessStatus: 200,
    origin,
  }),
);

console.log(process.env.NODE_ENV);

app.use(categoriesRoute, articlesRoute, usersRoute, statusRoute);
