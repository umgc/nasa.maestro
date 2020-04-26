import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { ConversionResponse, LinksResponse } from './model/conversionResponse';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap, map } from 'rxjs/operators';

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

  public uploadAndCompare(fileA: File, fileB: File): Observable<ConversionResponse> {
    const formData = new FormData();
    console.log(fileA, fileB);
    formData.append('docs', fileA);
    formData.append('docs', fileB);

    return this.httpClient
      .post<ConversionResponse>('/api/docx/checkDifference', formData)
        .pipe(
          tap( (res) => console.log('this is whayt i get: ', res) ),
          map( (res) => res as ConversionResponse)
        );

  }

  public uploadAndConvert(file: File): Observable<LinksResponse> {
    const formData = new FormData();
    console.log(file);
    formData.append('docs', file);

    return this.httpClient
      .post<LinksResponse>('/api/docx/convertDocX', formData)
        .pipe(
          tap( (res) => {
            console.log('Im getting/got: ', res) ;
          }),
          map( (res) => {
            return res as LinksResponse;
           } )
        );
  }

  public uploadAndValidate(file: File): Observable<ConversionResponse> {
    const formData = new FormData();
    console.log(file);
    formData.append('docs', file);

    return this.httpClient
      .post<ConversionResponse>('/api/docx/validate', formData)
        .pipe(
          tap( (res) => console.log('Im getting/got: ', res) ),
          map( (res) => res as ConversionResponse)
        );
  }

  private message = new BehaviorSubject('<h2>There was an error</h2>');
  sharedMessage = this.message.asObservable();

  private previousPage = new BehaviorSubject('/home');
  sharedPreviousPage = this.previousPage.asObservable();

  nextMessage(message) {
    this.message.next(message)
  }

  setPreviousPage(previousPage) {
    this.previousPage.next(previousPage);
  }
}
