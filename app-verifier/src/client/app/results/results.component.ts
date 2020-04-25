import { Component, OnInit } from '@angular/core';
import { SharedService } from '../shared.service';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-results-component',
  templateUrl: './results.component.html',
  styleUrls: ['./results.component.css'],
})

export class ResultsComponent implements OnInit {
  message;
  returnPage;

  public message$ = new BehaviorSubject<string>('');

  constructor(
    private sharedService: SharedService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.sharedService.sharedMessage
      .subscribe( message => this.message$.next(message)
          //this.message = message
        );

    this.sharedService.sharedPreviousPage.subscribe(previousPage => this.returnPage = previousPage);


    //var divElement = angular.element(document.querySelector('.results'));
    //var htmlElement = angular.element(this.message);
    //divElement.append(htmlElement);
  }

  goBack(): void {
    this.router.navigate([this.returnPage]);
  }
}
