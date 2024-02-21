import { Router } from "express";
import { getStatus } from "../controllers/statusController";


const route = Router()

route.get("/status", getStatus)

export default route
