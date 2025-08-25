import express from "express";
import {
  createEvent,
  deleteEvent,
  getAllEvents,
  updateEvent,
} from "../controllers/adminEvents.controller.js";

const router = express.Router();

router.get("/", getAllEvents);
router.post("/", createEvent);
router.put("/:id", updateEvent);
router.delete("/:id", deleteEvent);

export default router;