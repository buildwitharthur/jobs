import { Router } from "express";
import { createEventController } from "../controller/create-event.controller.js";
import { deleteEventController } from "../controller/delete-event.controller.js";
import { listEventsController } from "../controller/list-events.controller.js";
import { updateEventController } from "../controller/update-event.controller.js";

export const eventRoutes = Router();

eventRoutes.get("/applications/:id/events", listEventsController);
eventRoutes.post("/applications/:id/events", createEventController);
eventRoutes.patch("/applications/:id/events/:eventId", updateEventController);
eventRoutes.delete("/applications/:id/events/:eventId", deleteEventController);
