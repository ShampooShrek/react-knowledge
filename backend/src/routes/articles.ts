import { Router } from "express";
import { getArticleByCategory, getArticles, getArticle, postArticle, removeArticle, updateArticle } from "../controllers/articleController"
import TokenVerify from "../middlewares/TokenVerify";
import Admin from "../config/admin";

const route = Router()

route.route("/articles")
  .get(TokenVerify, getArticles)
  .post(TokenVerify, Admin, postArticle)

route.route("/articles/:id")
  .get(getArticle)
  .put(TokenVerify, Admin, updateArticle)
  .delete(TokenVerify, Admin, removeArticle)

route.get("/category/:categoryId/articles", getArticleByCategory)

export default route
