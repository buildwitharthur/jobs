import { Router } from "express";
import { getBoardController } from "../controller/get-board.controller.js";

export const boardRoutes = Router();

boardRoutes.get("/board", getBoardController);
