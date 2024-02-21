import express from "express"
import cors from "cors"

import categoriesRoute from "./routes/categories"
import articlesRoute from "./routes/articles"
import usersRoute from "./routes/users"
import statusRoute from "./routes/status"

export const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cors())

app.use(categoriesRoute, articlesRoute, usersRoute, statusRoute)

app.get("/", (req, res) => res.send({ status: "success", response: "OK!!" }))

