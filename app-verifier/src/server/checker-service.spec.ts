import Common from './common';
import { uuid } from 'uuidv4';
import { UploadedFile } from 'express-fileupload';
import CheckerService from './checker-service';

describe('Checker Service Test', () => {
  let sut: CheckerService;
  let sessionId: string;
  let files: UploadedFile[];
  let file1: any;
  let file2: any;
  let opts = {};

  beforeEach(() => {
    sut = new CheckerService(opts);

    sessionId = uuid();

    file1 = {
      name: 'file2',
      mimetype: 'image/png',
      size: Math.round(Math.random() * 100),
    } as any;

    file2 = {
      name: 'file2',
      mimetype: 'image/png',
      size: Math.round(Math.random() * 100),
    } as any;

    files = [file1, file2];
  });

  describe('Process Data Method', () => {
    it('should be an array', async () => {});

    it('should contain 2 items', async () => {});

    it('should contain ISaveUpload objects', async () => {});

    it('should contain ISaveUpload objects', async () => {});
  });
});
