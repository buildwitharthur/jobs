import type { IncomingMessage } from "node:http";
import type { Request, Response } from "express";
import multer from "multer";
import { AppError } from "../../../../common/domain/errors/app-error.js";
import type {
  FileUploadProvider,
  ParsedUpload,
} from "../../domain/providers/file-upload.provider.js";

const upload = multer({ storage: multer.memoryStorage() }).single("file");

export class MulterFileUploadProvider implements FileUploadProvider {
  parse(request: IncomingMessage): Promise<ParsedUpload> {
    // O multer só usa a requisição (não escreve na resposta), então `res` pode ser vazio.
    const req = request as unknown as Request;

    return new Promise((resolve, reject) => {
      upload(req, {} as Response, (error: unknown) => {
        if (error) {
          return reject(new AppError("Envio de arquivo inválido.", 400, "validation_error"));
        }

        resolve({
          fields: { ...req.body },
          file: req.file
            ? {
                content: req.file.buffer,
                // O multer entrega o nome do arquivo como latin1; os navegadores enviam UTF-8.
                original_name: Buffer.from(req.file.originalname, "latin1").toString("utf8"),
              }
            : null,
        });
      });
    });
  }
}
