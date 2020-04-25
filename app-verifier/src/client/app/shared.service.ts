import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable()
export class SharedService {

  private message = new BehaviorSubject('<h2>There was an error</h2>');
  sharedMessage = this.message.asObservable();

  private previousPage = new BehaviorSubject('/home');
  sharedPreviousPage = this.previousPage.asObservable();

  constructor() { }

  nextMessage(message) {
    this.message.next(message)
  }

  setPreviousPage(previousPage) {
    this.previousPage.next(previousPage);
  }
}