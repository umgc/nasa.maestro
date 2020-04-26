import { Component, OnInit } from '@angular/core';
import { AppRepoService } from 'app/app-repository.service';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-convertDocx-component',
  templateUrl: './convertDocx.component.html',
  styleUrls: ['./convertDocx.component.css'],
})

export class ConvertDocxComponent implements OnInit {
  private unsubscribe: Subject<void> = new Subject();
  file: File;
  message;
  resultsPage: Text;

  constructor(
    private repoService: AppRepoService,
    private router: Router
  ) {}

  ngOnInit(): void {}

  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  public onChangeFile(index, files: FileList){
    this.file = files.item(0);
  }

  public submitForConversion($event): void {
    this.subscribeToUploadService();
  }

  private subscribeToUploadService(): void {
    this.repoService.uploadAndConvert( this.file)
      .pipe(takeUntil(this.unsubscribe))
      .subscribe( results => {
        console.log('subscribeToUploadService --> ', results );
        if (!results) {
          this.repoService.nextMessage('<h2>There was an error</h2>' +
            '<h2>The conversion failed</h>');
        } else {
          console.log(results.data[0].link);

          const http = '<p>The converted document can be found here: <a href="http://' + results.data[0].link + '">Document</a></p>';
          this.repoService.nextMessage(http);
        }
        this.repoService.setPreviousPage('/convertDocx');
        this.router.navigate(['/results']);
      });
  }
}
