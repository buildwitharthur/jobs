import { Router } from "express";
import { getBoardController } from "../controller/board.controller.js";

export const boardRoutes = Router();

boardRoutes.get("/board", getBoardController);
