import { Component, OnInit } from '@angular/core';
import { AppRepoService } from 'app/app-repository.service';
import { SharedService } from '../shared.service';
import { Location } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-validateDocx-component',
  templateUrl: './validateDocx.component.html',
  styleUrls: ['./validateDocx.component.css'],
})

export class ValidateDocxComponent implements OnInit {
  fileA: File;

  constructor(
    private repoService: AppRepoService,
    private sharedService: SharedService,
    private router: Router,
  ) {}

  ngOnInit(): void {}

  async submitForValidation()  {
    console.log(this.fileA);
    const results = await this.repoService.uploadAndValidateDOCX(
      this.fileA
    );

    if (!results) {
      this.sharedService.nextMessage('<h2>There was an error</h2>' +
        '<h2>The conversion failed</h>');
    }
    else {
      this.sharedService.nextMessage(results);
    }

    this.sharedService.setPreviousPage('/validateDocx');
    this.router.navigate(['/results']);
  }
}
