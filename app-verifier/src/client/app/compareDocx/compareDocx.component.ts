import { Component, OnInit, OnDestroy } from '@angular/core';
import { AppRepoService } from 'app/app-repository.service';
import { SharedService } from '../shared.service';
import { Location } from '@angular/common';
import { Subject, pipe } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Router } from '@angular/router';

@Component({
  selector: 'app-compareDocx-component',
  templateUrl: './compareDocx.component.html',
  styleUrls: ['./compareDocx.component.css'],
})

export class CompareDocxComponent implements OnInit, OnDestroy {
  private unsubscribe: Subject<void> = new Subject();
  fileA: File;
  fileB: File;
  message: JSON;
  resultsPage;

  constructor (
    private repoService: AppRepoService,
    private sharedService: SharedService,
    private router: Router
  ) {}

  ngOnInit(): void {}

  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  public onChangeFile(index, files: FileList ){
    if (index === 0 ) {
      this.fileA = files.item(0);
    } else {
      this.fileB = files.item(0);
    }
    console.log('loaded -->', files.item(0), this.fileA, this.fileB);

  }
  public submitForAnalysis($event): void {
    this.subscribeToUploadService();
  }

  private subscribeToUploadService(): void{
    this.repoService.uploadAndCompare2( this.fileA, this.fileB)
     .pipe(takeUntil(this.unsubscribe))
     .subscribe( results => {
       if (!results) {
         this.sharedService.nextMessage('<h2>There was an error</h2>' +
           '<h2>The comparison failed</h>');
       } else {
         this.sharedService.nextMessage(results);
       }
       this.sharedService.setPreviousPage('/compareDocx');
       this.router.navigate(['/results']);
     });

  }
}
