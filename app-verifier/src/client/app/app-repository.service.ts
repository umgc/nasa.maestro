import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { ConversionResponse } from './model/conversionResponse';

@Injectable({ providedIn: 'root' })
export class AppRepoService implements Resolve<string[]> {
  private projectNames = [];

  constructor(private httpClient: HttpClient) {}
  resolve(): Promise<string[]> {
    return this.getProjectNames();
  }

  async getProjectNames(force = false): Promise<string[]> {
    if (!force && this.projectNames.length) {
      return this.projectNames;
    }
    this.projectNames = ['compareDocx', 'convertDocx', 'validateDocx', 'results', 'home'];
    return await Promise.resolve(this.projectNames);
  }

  async saveProjectName(projectName: string): Promise<void> {
    this.projectNames.push(projectName);
  }

  async uploadAndCompare(
    fileA: File,
    fileB: File
  ): Promise<ConversionResponse> {
    var formData = new FormData();
    // Memorize the filenames so we can change them out for safe names for
    // the server to process.

    const memorizeFileNames = {
      fileA: fileA.name,
      fileB: fileB.name,
    };

    // Edge-case, if files are actual named 'FileA' and 'FileB' random will
    // prevent any name collision on the server.
    formData.append('docs', fileA, `fileA-${Math.round(Math.random() * 100)}`);
    formData.append('docs', fileB, `fileB-${Math.round(Math.random() * 100)}`);
    try {
      const result = (await this.httpClient
        .post('/api/docx/checkDifference', formData)
        .toPromise()) as ConversionResponse;
      console.log(result);
      return result;
    } catch (e) {
      // do something with error or rethrow.
      console.log(e);
    }
  }

  async uploadAndConvertDOCX(
    fileA
  ): Promise<ConversionResponse> {
    var formData = new FormData();

    const memorizeFileName = {
      fileA : fileA.name
    }

    formData.append('doc', fileA, `fileA-${Math.round(Math.random() * 100)}`);

    try {
      const result = (await this.httpClient
        .post('/api/docx/convertDocX', formData)
        .toPromise()) as ConversionResponse;
      console.log(result);
      return result;
    } catch(e) {
      console.log(e);
    }
  }

  async uploadAndValidateDOCX(
    fileA
  ): Promise<ConversionResponse> {
    var formData = new FormData();

    const memorizeFileName = {
      fileA : fileA.name
    }

    formData.append('doc', fileA, `fileA-${Math.round(Math.random() * 100)}`);

    try {
      const result = (await this.httpClient
        .post('/api/docx/validate', formData)
        .toPromise()) as ConversionResponse;
      console.log(result);
      return result;
    } catch(e) {
      console.log(e);
    }
  }

}
