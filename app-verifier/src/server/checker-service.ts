/* eslint-disable max-len */
import uuid from 'uuidv4';
import fs from 'fs';
import Common from './common';
import spawn from 'child_process';
import Unoconv from 'unoconv-promise';
import { UploadedFile } from 'express-fileupload';

import {
  ISaveUpload,
  IDocMetadata,
  IComparisonResult,
  IGeneratedLink,
} from './server';

// NB for some reason seems to hang if there are spaces
// or parenthesis in the file names....

export default class CheckerService {
  private common: Common;
  private spawn: typeof spawn;
  private unoconv: Unoconv;

  constructor(opts: any) {
    this.common = opts.common;
    this.unoconv = opts.unoconv;
    this.spawn = opts.spawn;
    console.log('Checker has initd');
  }

  async processData(files: UploadedFile[], analyze = false): Promise<any> {
    try {
      const session = uuid.uuid();
      const pdfs = await this.common.saveUploadedFiles(session, files);
      await this.convertFiles(session, pdfs);
      if (analyze) {
        return {
          sessionId: session,
          data: await this.performIMAnalisys(session),
        };
      } else {
        const ret = {
          sessionId: session,
          data: await this.generateLinks(session, pdfs),
        };
        return ret;
      }
    } catch (err) {
      console.log(err);
    }
  }

  async convertFiles(session: string, files: ISaveUpload[]): Promise<any> {
    // loop through all files
    console.log('converting uploaded files to pdf and then images (png)');
    let i = 1;
    for (const f of files) {
      console.log(`Processing uploaded file # ${i}`);
      const docx = f;
      await this.convertDocxToPdf(session, docx);
      await this.convertPdfToImg(session, docx);
      fs.renameSync(
        `./uploads/${session}/${docx.name}.png`,
        `./uploads/${session}/image-${i}.png`
      );
      console.log(`Renamed ${docx.name} to image-${i}!`);
      console.log(`${docx.name} [image ${i}] converted to pdf and png!`);
      i++;
    }
  }

  /**
   * convertDocxToPdf
   * @param {uuid} session The current session
   * @param {Object} docx The document metadata to convert
   * @return {Promise<any>} a promise
   */
  async convertDocxToPdf(session: string, docx: IDocMetadata): Promise<any> {
    return await this.unoconv.run({
      file: `./uploads/${session}/${docx.name}`,
      output: `./uploads/${session}/${docx.name}.pdf`,
    });
  }

  /**
   * convertPdfToImg.
   * @param {uuid} session The current session
   * @param {Object} doc The document metadata to convert
   * @param {number} index The document index to rename the image
   * @return {Promise<any>} a promise
   */
  async convertPdfToImg(session: string, doc: IDocMetadata): Promise<string | void> {
    console.log(`Attempting conversion of: ./uploads/${session}/${doc.name}.pdf`);

    const file = `./uploads/${session}/${doc.name}.pdf`;
    const output = `./uploads/${session}/${doc.name}.png`;
    const args = ['+profile', '"icc"', '-density', '200', // careful here or may get out of cache memory
      '-alpha', 'off', file, '-quality', '100', '-sharpen', '0x1.0', '-append',
      output];
    const opts = { env: process.env, killSignal: 'SIGKILL', stdio: ['inherit'] };
    return new Promise<string | void>((resolve, reject) => {
      const process = this.spawn.spawnSync('convert', args, opts as any);
      if (process.status === 0) {
        resolve(output);
      } else {
        console.log('Error converting PDF');
        reject();
      }
    });
  }

  /**
   * performIMAnalisys.
   * @param {uuid} session The current session
   * @param {[]} files The image metadata to convert
   * @return {Promise<any>} a promise
   */
  async performIMAnalisys(session: string): Promise<IComparisonResult> {
    const output = `./uploads/${session}/diff.png`;
    const file0 = `./uploads/${session}/image-1.png`;
    const file1 = `./uploads/${session}/image-2.png`;
    const args = [
      '-metric', 'AE', '-fuzz', '5%',
      file0, file1,
      '-compose', 'src',
      output,
    ];

    try {
      const opts = {
        env: process.env,
        killSignal: 'SIGKILL',
        stdio: ['inherit'],
      };
      const proc = this.spawn.spawnSync('compare', args, opts as any);
      const retVal: IComparisonResult = {} as any;

      if (proc.stderr) {
        // we use the stderr as for dissimilar images imagemagik quirkly returns 1
        // and a non zero return code usually indicates an error
        const difference = +(proc.stderr as any).toString('utf8', 0, proc.stderr.length);
        const diffImageSize = this.getImageSize(output);
        retVal.status = proc.status;
        retVal.isIdentical = proc.status === 0;
        retVal.imageASize = this.getImageSize(file0);
        retVal.imageBSize = this.getImageSize(file1);
        retVal.diffSize = diffImageSize;
        retVal.pixelDiff = difference;
        retVal.percentDiff = parseFloat(`${difference / diffImageSize}`).toFixed(4);
      }
      return retVal;
    } catch (err) {
      console.error(err);
    }
  }
  getImageSize(file: string): number {
    const args = ['-format', '%w %h', file];
    const retVal = {
      height: 0, // success
      width: 0,
      status: null,
    };

    const NUMERIC_REGEXP = /[-]{0,1}[\d]*[.]{0,1}[\d]+/g;

    try {
      const opts = {
        env: process.env,
        killSignal: 'SIGKILL',
        stdio: ['inherit'],
      };
      const proc = this.spawn.spawnSync('identify', args as any, opts as any);

      retVal.status = proc.status;
      if (proc.status === 0 && proc.stdout) {
        const data = (proc.stdout as any).toString(
          'utf8',
          0,
          proc.stdout.length
        );
        retVal.width = data.match(NUMERIC_REGEXP)[0];
        retVal.height = data.match(NUMERIC_REGEXP)[1];
      }
      return retVal.height * retVal.width;
    } catch (err) {
      console.error(err);
    }
  }

  async generateLinks(session: string, files: ISaveUpload[]): Promise<IGeneratedLink[]> {
    // loop through all files
    const linksArray = [];
    let i = 1;
    for (const f of files) {
      const value = {
        docx: f.name,
        link: `/api/docx/getImage?sessionId=${session}&index=${i}`,
      };
      console.log(`Link created for Doc ${value.docx}: ${value.link}`);
      linksArray.push(value);
      i++;
    }

    return new Promise<IGeneratedLink[]>((resolve) => resolve(linksArray));
  }
}
