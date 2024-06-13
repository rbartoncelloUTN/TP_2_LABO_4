import { Component, OnInit } from '@angular/core';
import { GithubService } from '../../services/github/github.service';
import { IGitHub } from '../../Interfaces/github';

@Component({
  selector: 'app-welcome',
  standalone: true,
  imports: [],
  templateUrl: './welcome.component.html',
  styleUrl: './welcome.component.css',
})
export class WelcomeComponent implements OnInit {
  public userData!: IGitHub;
  constructor(private githubService: GithubService) {}
  ngOnInit(): void {
    this.githubService.getData().subscribe((data) => {
      //console.log(data);
      this.userData = data;
    });
  }
}
