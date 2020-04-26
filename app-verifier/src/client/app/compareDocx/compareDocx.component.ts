import { Component, OnInit, OnDestroy, Sanitizer } from '@angular/core';
import { AppRepoService } from 'app/app-repository.service';
import { Subject, pipe } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Router } from '@angular/router';
import { SafeUrl, DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-compareDocx-component',
  templateUrl: './compareDocx.component.html',
  styleUrls: ['./compareDocx.component.css'],
})
export class CompareDocxComponent implements OnInit, OnDestroy {
  private unsubscribe: Subject<void> = new Subject();
  fileA: File;
  fileB: File;
  message;
  resultsPage: Text;

  constructor (
    private sanitizer: DomSanitizer,
    private repoService: AppRepoService,
    private router: Router
  ) {}

  ngOnInit(): void {}

  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  public onChangeFile(index, files: FileList) {
    if (index === 0) {
      this.fileA = files.item(0);
    } else {
      this.fileB = files.item(0);
    }
    console.log('loaded -->', files.item(0), this.fileA, this.fileB);
  }

  public submitForAnalysis($event): void {
    this.subscribeToUploadService();
  }

  private subscribeToUploadService(): void {
    this.repoService
      .uploadAndCompare(this.fileA, this.fileB)
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((results) => {
        if (!results) {
          this.repoService.nextMessage(
            '<h2>There was an error</h2>' + '<h2>The comparison failed</h>'
          );
        } else {
          console.log(results.imageLinks[0].url);
          console.log(results.imageLinks[1].url);
          console.log(results.diffLink);
          console.log(results.response.percentDiff.valueOf());

        const http =
          '<p>The first document is available as an image here: <a href="http://' + results.imageLinks[0].url + '">First Document</a></p>' +
          '<p>The second document is available as an image here: <a href="http://' + results.imageLinks[0].url + '">Second Document</a></p>' +
          '<p>Difference are highlighted in the image here: <a href="http://' + results.diffLink + '">Different Image</a></p>' +
          '<p>The difference ration between the two documents is: ' + results.response.percentDiff.valueOf() + '</p>';
        this.repoService.nextMessage(http);
       }
       this.repoService.setPreviousPage('/compareDocx');
       this.router.navigate(['/results']);
     });
  }
}
