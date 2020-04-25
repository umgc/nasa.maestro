import { Component, OnInit } from '@angular/core';
import { AppRepoService } from 'app/app-repository.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-convertDocx-component',
  templateUrl: './convertDocx.component.html',
  styleUrls: ['./convertDocx.component.css'],
})
export class convertDocxComponent implements OnInit {
  fileA: File;
  constructor(
    private repoService: AppRepoService,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {}

  async submitForConversion(): Promise<void> {
    console.log(this.fileA);
    const results = await this.repoService.uploadAndConvertDOCX(
      this.fileA
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
