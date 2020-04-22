import { Component, OnInit } from '@angular/core';
import { AppRepoService } from 'app/app-repository.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-home-component',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  fileA: File;
  fileB: File;
  imageA: SafeResourceUrl;
  imageB: SafeResourceUrl;
  diff: SafeResourceUrl;
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
      return;
    }
    this.imageA = this.sanitizer.bypassSecurityTrustResourceUrl(
      `http://${results.imageLinks[0].url}`
    );
    this.imageB = this.sanitizer.bypassSecurityTrustResourceUrl(
      `http://${results.imageLinks[1].url}`
    );
    this.diff = this.sanitizer.bypassSecurityTrustResourceUrl(
      `http://${results.diffLink}`
    );
  }
}
