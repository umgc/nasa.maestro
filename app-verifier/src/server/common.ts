'use strict';
/* eslint-disable max-len */
import _ from 'lodash';
import { UploadedFile } from 'express-fileupload';
import { ISaveUpload } from './server';

export default class Common {
  constructor() {
    console.log('Common has initd');
  }

  /**
   * saveUploadedFiles
   * Loops throught the uploaded files array,
   * extraxts basic metadata
   * and saves them to a temporary directory
   * @param {uuid} session The current session
   * @param {any} files The files from the request upload
   * @return {[any]} an array of doc metadata
   */
  async saveUploadedFiles( session: string, files: UploadedFile[] ): Promise<ISaveUpload[]> {
    const savedUploads: Array<ISaveUpload> = [];

    return new Promise((resolve, reject) => {
      try {
        console.log('Saving uploaded files to session folder', files);
        // loop through all files
        _.forEach(_.keysIn(files), (key) => {
          const docx: UploadedFile = files[key];
          savedUploads.push({
            name: docx.name,
            mimetype: docx.mimetype,
            size: docx.size,
          });
          docx.mv(`./uploads/${session}/${docx.name}`);
          console.log(`${docx.name} saved!`);
        });
        resolve(savedUploads);
      } catch (err) {
        console.log(err);
        reject(err);
      }
    });
  }
}
