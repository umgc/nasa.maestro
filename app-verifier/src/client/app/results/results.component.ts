import { Component, OnInit } from '@angular/core';
import { SharedService } from '../shared.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-results-component',
  templateUrl: './results.component.html',
  styleUrls: ['./results.component.css'],
})

export class ResultsComponent implements OnInit {
  message;
  returnPage;

  constructor(
    private sharedService: SharedService,
    private location: Location
  ) {}

  ngOnInit(): void {
    this.sharedService.sharedMessage.subscribe(message => this.message = message);
    this.sharedService.sharedPreviousPage.subscribe(previousPage => this.returnPage = previousPage);

    var divElement = angular.element(document.querySelector('.results'));
    var htmlElement = angular.element(this.message);
    divElement.append(htmlElement);
  }

  goBack(): void {
    this.location.navigate(this.returnPage);
  }
}
