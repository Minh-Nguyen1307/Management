import express from "express";
import { createOrUpdateOrder } from "../controllers/orderController.js";
const router = express.Router();

router.post("/api/:userId/orders", createOrUpdateOrder);



export default router;
