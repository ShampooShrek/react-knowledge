import express from "express"
import { getUsers, postUser, updateUser, removeUser, getUser } from "../controllers/userController"
import { signIn, getUserByToken } from "../controllers/userController/auth"
import TokenVerify from "../middlewares/TokenVerify"
import Admin from "../config/admin"

const route = express.Router()

route.post("/signIn", signIn)
route.post("/signUp", postUser)
route.get("/authenticate", TokenVerify, getUserByToken)

route.post("/admin", TokenVerify, Admin, postUser)

route.route("/users")
  .get(TokenVerify, Admin, getUsers)
  .post(postUser)

route.route("/users/:id")
  .get(getUser)
  .put(updateUser)
  .delete(TokenVerify, Admin, removeUser)


export default route
