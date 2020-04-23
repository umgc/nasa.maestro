import { async } from '@angular/core/testing';
import Common from './common';
import { uuid } from 'uuidv4';
import { UploadedFile } from 'express-fileupload';

describe('Common Tests', () => {
  let sut: Common;
  let sessionId: string;
  let files: UploadedFile[];
  let file1: any;
  let file2: any;

  beforeEach(() => {
    sut = new Common();

    sessionId = uuid();

    file1 = {
      mv: () => {},
      name: 'file2',
      mimetype: 'image/png',
      size: Math.round(Math.random() * 100),
    } as any;

    file2 = {
      mv: () => {},
      name: 'file2',
      mimetype: 'image/png',
      size: Math.round(Math.random() * 100),
    } as any;

    files = [file1, file2];
  });

  it('should be an array', async () => {
    const saveUploads = await sut.saveUploadedFiles(sessionId, files);
    expect(Array.isArray(saveUploads)).toBeTruthy();
  });

  it('should contain 2 items', async () => {
    const saveUploads = await sut.saveUploadedFiles(sessionId, files);
    expect(saveUploads.length === 2).toBeTruthy();
  });

  it('should contain ISaveUpload objects', async () => {
    const saveUploads = await sut.saveUploadedFiles(sessionId, files);
    delete file1.mv;
    delete file2.mv;
    const resultSet = [file1, file2];
    expect(saveUploads).toEqual(resultSet);
  });

  it('should reject promise with error', async () => {
    delete file1.mv;
    await expectAsync(sut.saveUploadedFiles(sessionId, files)).toBeRejected();
  });
});
