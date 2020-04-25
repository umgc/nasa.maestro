import { Component, OnInit } from '@angular/core';
import { AppRepoService } from 'app/app-repository.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-validateDocx-component',
  templateUrl: './validateDocx.component.html',
  styleUrls: ['./validateDocx.component.css'],
})
export class validateDocxComponent implements OnInit {
  fileA: File;
  constructor(
    private repoService: AppRepoService,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {}

  async submitForValidation(): Promise<void> {
    console.log(this.fileA);
    const results = await this.repoService.uploadAndValidateDOCX(
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
