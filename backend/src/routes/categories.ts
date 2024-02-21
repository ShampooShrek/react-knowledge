import { Router } from "express"
import { getTree, getCategory, getCategories, postCategory, removeCategory, updateCategory } from "../controllers/categoryController"
import TokenVerify from "../middlewares/TokenVerify"
import Admin from "../config/admin"


const route = Router()

route.route("/categories")
  .get(TokenVerify, getCategories)
  .post(TokenVerify, Admin, postCategory)

route.get("/categories/tree", TokenVerify, getTree)

route.route("/categories/:id")
  .get(TokenVerify, getCategory)
  .put(TokenVerify, Admin, updateCategory)
  .delete(TokenVerify, Admin, removeCategory)

export default route
