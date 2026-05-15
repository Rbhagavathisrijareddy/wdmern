import { Router } from "express";
import { protect } from "../middlewares/authMiddleware.js";
import createShortUrl, { redirectToLongUrl } from "../controllers/shortUrlController.js"


const shortURLRouter = Router();


shortURLRouter.post("/", protect, createShortUrl);
shortURLRouter.get("/:shortCode", redirectToLongUrl);


export default shortURLRouter;
