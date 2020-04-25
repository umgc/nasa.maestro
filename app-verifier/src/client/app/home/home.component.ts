import { Component, OnInit } from '@angular/core';
import { AppRepoService } from 'app/app-repository.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-home-component',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class homeComponent implements OnInit {
  selection: Text
  
  constructor(
    private repoService: AppRepoService,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {}

  onSelect(selection): void {
    if(selection == 'compare') {
      this.router.navigate(['/compareDocx']);
    }
    else if(selection == 'convert'){
      this.router.navigate(['/convertDocx']);
    }
    else {
      this.router.navigate(['/validateDocx']);
    }
  }
}
