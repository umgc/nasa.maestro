import { Component, OnInit } from '@angular/core';
import { AppRepoService } from 'app/app-repository.service';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-validateDocx-component',
  templateUrl: './validateDocx.component.html',
  styleUrls: ['./validateDocx.component.css'],
})

export class ValidateDocxComponent implements OnInit {
  private unsubscribe: Subject<void> = new Subject();
  file: File;
  message;
  resultsPage: Text;

  constructor(
    private repoService: AppRepoService,
    private router: Router,
  ) {}

  ngOnInit(): void {}

  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  public onChangeFile(index, files: FileList){
    this.file = files.item(0);
    console.log('loaded -->', files.item(0), this.file);
  }

  public submitForValidation($event): void {
    this.subscribeToUploadService();
  }

  private subscribeToUploadService(): void {
    this.repoService.uploadAndValidate(this.file)
      .pipe(takeUntil(this.unsubscribe))
      .subscribe( results => {
        if(!results) {
          this.repoService.nextMessage('<h2>There was an error</h2>' +
          '<h2>The conversion failed</h>');
        } else {
          this.repoService.nextMessage(results);
        }
        this.repoService.setPreviousPage('/validateDocx');
        this.router.navigate(['/results']);
      });
  }
}
