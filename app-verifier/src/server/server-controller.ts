import { Request, Response } from 'express';
import { UploadedFile } from 'express-fileupload';
import IOC from './ioc.js';
import CheckerService from './checker-service.js';
import DocXValidatorService from './docx-validator.js';
import fs from 'fs';
import path from 'path';
import stream from 'stream';

export default class ServerController {
  constructor() {
    console.log('Controller has initd');
  }

  testCall(request: Request, response: Response): void {
    response.status(200).send('pong');
  }
  /**
   * Receives two docx and compares them
   * POST
   * req.files.docs can be either single or multiple files
   * returns a status code with a json result object including
   * a percent difference, and formed links to the images produced
   */
  async checkFiles(request: Request, response: Response): Promise<void> {
    console.log(
      request.body,
      'Calculating difference between document outputs.'
    );
    if (!request.files) {
      response.status(400).send({ status: false, message: 'No file uploaded' });
      return;
    }

    if ((request.files.docs as UploadedFile[]).length !== 2) {
      response.status(400).send({
        status: false,
        message: 'Maximum 2 files can be compared at a time',
      });
      return;
    }
    const chkSvc = IOC.container.resolve<CheckerService>('checkService');
    try {
      const result = await chkSvc.processData(
        request.files.docs as UploadedFile[],
        true
      );
      const returnVal = {
        response: result.data,
        diffLink: `${request.headers.host}/api/docx/getDiffImage?sessionId=${result.sessionId}`,
        imageLinks: [
          {
            url: `${request.headers.host}/api/docx/getImage?sessionId=${result.sessionId}&index=1`,
          },
          {
            url: `${request.headers.host}/api/docx/getImage?sessionId=${result.sessionId}&index=2`,
          },
        ],
      };
      response.send(returnVal);
    } catch (error) {
      response.status(500).send(error);
    }
  }

  async validate(request: Request, response: Response): Promise<void> {
    if (!request.files) {
      response.status(400).send({
        status: false,
        message: 'No file uploaded',
      });
      return;
    }

    const docSvc = IOC.container.resolve<DocXValidatorService>('docXService');

    const files: UploadedFile[] = Array.isArray(request.files.docs)
      ? request.files.docs
      : [request.files.docs];

    try {
      const result = await docSvc.validate(files);
      response.status(200).send(result);
    } catch (error) {
      response.status(500).send(error);
    }
  }

  async convertDocx(request: Request, response: Response): Promise<void> {
    if (!request.files) {
      response.status(400).send({
        status: false,
        message: 'No file uploaded',
      });
      return;
    }

    const chkSvc = IOC.container.resolve<CheckerService>('checkService');

    const files: UploadedFile[] = Array.isArray(request.files.docs)
      ? request.files.docs
      : [request.files.docs];

    try {
      const result = await chkSvc.processData(files, false );
      response.status(200).send(result);
    } catch (error) {
      response.status(500).send(error);
    }
  }

  async getDiffImage(request: Request, response: Response): Promise<void> {
    const sessionId = request.query.sessionId;
    const imagePath = `./uploads/${sessionId}/diff.png`;

    if (!fs.existsSync(imagePath)) {
      console.log(`${imagePath} not found`);
      response.status(400).send({ error: `${imagePath} not found` });
      return;
    }

    response.sendFile(imagePath, { root: path.resolve() });
  }

  async getImage(request: Request, response: Response): Promise<void> {
    const sessionId = request.query.sessionId;
    const index = request.query.index;
    const imagePath = `./uploads/${sessionId}/image-${index}.png`;

    if (!fs.existsSync(imagePath)) {
      console.log(`${imagePath} not found`);
      response.status(400).send({ error: `${imagePath} not found` });
      return;
    }

    response.sendFile(imagePath, { root: path.resolve() });
  }

  async getDiffImageStream(
    request: Request,
    response: Response
  ): Promise<void> {
    const sessionId = request.query.sessionId;
    const imagePath = `./uploads/${sessionId}/diff.png`;

    if (!fs.existsSync(imagePath)) {
      console.log(`${imagePath} not found`);
      response.status(400).send({ error: `${imagePath} not found` });
      return;
    }

    const r = fs.createReadStream(imagePath); // or any other way to get a readable stream
    const ps = new stream.PassThrough();
    stream.pipeline(r, ps, (error) => {
      if (error) {
        console.log(error);
        return response.sendStatus(500);
      }
    });
    ps.pipe(response);

    response.sendFile(imagePath, { root: path.resolve() });
  }

  getIndexPage(request: Request, response: Response): void {
    response
      .status(200)
      .sendFile(`${path.resolve('dist/public', 'index.html')}`);
  }

  getHelpPage(request: Request, response: Response): void {}
}
