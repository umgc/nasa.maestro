import { Component, OnInit } from '@angular/core';
import { AppRepoService } from 'app/app-repository.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home-component',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  selection: Text;

  constructor(
    private repoService: AppRepoService,
    private sanitizer: DomSanitizer,
    private router: Router
  ) {}

  ngOnInit(): void {}

  onSelect(selection): void {
    if (selection === 'compare') {
      this.router.navigate(['/compareDocx']);
    }
    else if (selection === 'convert'){
      this.router.navigate(['/convertDocx']);
    }
    else {
      this.router.navigate(['/validateDocx']);
    }
  }
}
