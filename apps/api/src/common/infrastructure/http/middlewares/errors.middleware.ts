import { NextFunction, Request, Response } from "express";
import { AppError } from "../../../domain/errors/app-error.js";

export const errorHandler = (err: Error, req: Request, res: Response, _: NextFunction) => {
  if (err instanceof AppError) {
    console.warn("[api] handled application error", {
      errorName: err.name,
      code: err.code,
      message: err.message,
      statusCode: err.statusCode,
    });

    return res.status(err.statusCode).json({
      code: err.code,
      message: err.message,
      ...(err.details ? { details: err.details } : {}),
    });
  }

  console.error("[api] unhandled error", {
    errorName: err.name,
    method: req.method,
    url: req.originalUrl.split("?")[0],
    route: req.route?.path ?? null,
  });

  return res.status(500).json({
    code: "internal_error",
    message: "Ocorreu um erro interno.",
  });
};
