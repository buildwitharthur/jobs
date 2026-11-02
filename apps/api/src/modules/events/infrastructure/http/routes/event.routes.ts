import { Router } from "express";
import {
  createEventController,
  deleteEventController,
  listEventsController,
  updateEventController,
} from "../controller/event.controller.js";

export const eventRoutes = Router();

eventRoutes.get("/applications/:id/events", listEventsController);
eventRoutes.post("/applications/:id/events", createEventController);
eventRoutes.patch("/applications/:id/events/:eventId", updateEventController);
eventRoutes.delete("/applications/:id/events/:eventId", deleteEventController);
