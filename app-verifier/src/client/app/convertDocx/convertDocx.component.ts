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

  public onChangeFile(index, files:FileList){
    this.file = files.item(0);
    console.log('loaded -->', files.item(0), this.file);
  }

  public submitForConversion($event): void {
    this.subscribeToUploadService();
  }

  private subscribeToUploadService(): void {
    this.repoService.uploadAndConvert( this.file)
      .pipe(takeUntil(this.unsubscribe))
      .subscribe( results => {
        if (!results) {
          this.repoService.nextMessage('<h2>There was an error</h2>' +
            '<h2>The conversion failed</h>');
        }else {
          //needs to get the single image and save it as the message in HTML
          const img = results.imageLinks;
          this.repoService.nextMessage(img);
        }
        this.repoService.setPreviousPage('/convertDocx');
        this.router.navigate(['/results']);
      });
  }
}