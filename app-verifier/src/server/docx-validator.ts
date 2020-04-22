/* eslint-disable max-len */
import uuid from 'uuidv4';
import fs from 'fs';
import Common from './common';
import { UploadedFile } from 'express-fileupload';
import { IConversionResult } from './server';

export default class DocXValidatorService {
  private common: Common;
  private unoconv: any;

  constructor(opts) {
    this.common = opts.common;
    this.unoconv = opts.unoconv;
    console.log('DocXValidator has initd');
  }

  /**
   * The function expects a docx file. We try opening it with open office
   * and if it's a valid docx it will not report an error.
   * Alternatively we could open the file and parse the content (docx is a zipped up archive)
   * but is more labor intensive and unless we need to look for specific failure its faster
   * this way.
   * N/B. this just makes sure the document is a valid docx. it does not verify the content
   * formatting
   * @param {*} files the docxfiles to validate.
   */
  async validate(files: UploadedFile[]): Promise<IConversionResult[]> {
    try {
      if (!Array.isArray(files) || !files.length) {
        throw new Error('Empty file array passed');
      }
      const results: IConversionResult[] = [];
      const session = uuid.uuid();
      const uploads = await this.common.saveUploadedFiles(session, files);

      // console.log('done saving', uploads);
      for (const docx of uploads) {
        try {
          // console.log(`Converting ${docx.name}`);
          await this.unoconv.run({
            file: `./uploads/${session}/${docx.name}`,
            output: `./uploads/${session}/${docx.name}.pdf`,
          });
          results.push({ file: docx.name, isValid: true });
        } catch (err) {
          // console.log('[openFile]', err, docx.name);
          results.push({ file: docx.name, isValid: false });
        }
      }
      fs.rmdirSync(`./uploads/${session}`, { recursive: true });
      return results;
    } catch (err) {
      // console.log(err.message);
      return err;
    }
  }

  /**
   * Uses unoconv to convert the fie to a pdf.
   * If the file id not valid returns false
   * @param {*} fileName
   */
  async openFile2(fileName: string): Promise<boolean> {
    return new Promise((resolve) => {
      return this.unoconv
        .run({ file: `./uploads/${fileName}` })
        .then(() => resolve(true))
        .catch((err) => {
          console.log('[openFile]', err, fileName);
          resolve(false);
        });
    });
  }

  async openFile(fileName: string): Promise<boolean> {
    try {
      await this.unoconv.run({ file: `./uploads/${fileName}` });
      return true;
    } catch (err) {
      // console.log(err.message);
      return false;
    }
  }
}
