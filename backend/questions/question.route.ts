import { Router } from "express";
import { get_question } from "./question.controller";

const router = Router();

router.get("/:job_id", get_question);

export default router;
