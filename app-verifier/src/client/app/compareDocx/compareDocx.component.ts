import { Component, OnInit } from '@angular/core';
import { AppRepoService } from 'app/app-repository.service';
import { SharedService } from '../shared.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-compareDocx-component',
  templateUrl: './compareDocx.component.html',
  styleUrls: ['./compareDocx.component.css'],
})

export class CompareDocxComponent implements OnInit {
  fileA: File;
  fileB: File;
  message: JSON;
  resultsPage;

  constructor(
    private repoService: AppRepoService,
    private sharedService: SharedService,
    private location: Location,
  ) {}

  ngOnInit(): void {}

  async submitForAnalysis(): Promise<void> {
    console.log(this.fileA);
    console.log(this.fileB);
    const results = await this.repoService.uploadAndCompare(
      this.fileA,
      this.fileB
    );

    if (!results) {
      this.sharedService.nextMessage('<h2>There was an error</h2>' +
        '<h2>The comparison failed</h>');
    }
    else {
      this.sharedService.nextMessage(results);
    }

    this.sharedService.setPreviousPage('/compareDocx');
    this.location.navigate('/results');
  }
}
