import express from "express"
import { studentRegister as registerStudent, getAllStudents, getStudentById,getStudentByEventId } from "../controllers/student.controller.js";
const router = express.Router();

router.post("/register", registerStudent);
router.get("/", getAllStudents);
router.get("/:id", getStudentById);
router.get("/event/:eventId", getStudentByEventId);

export default router;
