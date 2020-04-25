import { Component, OnInit } from '@angular/core';
import { AppRepoService } from 'app/app-repository.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-results-component',
  templateUrl: './results.component.html',
  styleUrls: ['./results.component.css'],
})
export class resultsComponent implements OnInit {
  results: JSON;
  sendingPageType: Text;
  constructor(
    private repoService: AppRepoService,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {
    /* TODO
      Display the JSON file
    */
  }

  submitToReturn(): void {
    /* TODO
      Send the user back to the last page
    */
  }
}
