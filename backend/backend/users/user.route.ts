import { Router } from "express";
import { signin, signup, signout } from "./user.controller";
import { refreshToken } from "./user.controller";
import multer from "multer";

const router = Router();
const upload = multer({ dest: "uploads/" });

router.post("/signin", signin);
router.post("/signup", upload.single("profile_picture"), signup);

// Add refresh token route
router.post("/refresh-token", refreshToken);
router.post("/signout", signout);

export default router;
