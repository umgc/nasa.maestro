import { Component, OnInit } from '@angular/core';
import { AppRepoService } from 'app/app-repository.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-compareDocx-component',
  templateUrl: './compareDocx.component.html',
  styleUrls: ['./compareDocx.component.css'],
})
export class compareDocxComponent implements OnInit {
  fileA: File;
  fileB: File;
  constructor(
    private repoService: AppRepoService,
    private sanitizer: DomSanitizer
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
      /* TODO
        Send the user to the result page with a results failed message
      */
    }
    else {
      /* TODO
        Send the user to the results page to display the JSON
      */
    }
  }
}
