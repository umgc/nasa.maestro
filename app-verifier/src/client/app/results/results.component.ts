import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { AppRepoService } from 'app/app-repository.service';

@Component({
  selector: 'app-results-component',
  templateUrl: './results.component.html',
  styleUrls: ['./results.component.css'],
})

export class ResultsComponent implements OnInit {
  message;
  returnPage;
  resultsHTML: string = '<p>An error has occured</p>';

  public message$ = new BehaviorSubject<string>('');

  constructor(
    private router: Router,
    private repoService : AppRepoService
  ) {}

  ngOnInit(): void {
    this.repoService.sharedMessage
      .subscribe( message => this.message = message);

    this.resultsHTML = this.message;

    this.repoService.sharedPreviousPage
      .subscribe(previousPage => this.returnPage = previousPage);
  }

  goBack(): void {
    this.router.navigate([this.returnPage]);
  }
}
