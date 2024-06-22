import { Component, OnInit, inject } from '@angular/core';
import { GithubService } from '../../services/github/github.service';
import { IGitHub } from '../../Interfaces/github';
import { Roles, User } from '../../Interfaces/user';
import { AuthService } from '../../services/Auth/auth.service';

@Component({
  selector: 'app-welcome',
  standalone: true,
  imports: [],
  templateUrl: './welcome.component.html',
  styleUrl: './welcome.component.css',
})
export class WelcomeComponent implements OnInit {
  auth = inject(AuthService);

  userData!: User;
  constructor(private githubService: GithubService) {}
  ngOnInit(): void {
    const userData = localStorage.getItem('users') || '';
    const users = (JSON.parse(userData) as User[]) || [];
    this.userData = this.auth.getUser() as User;
  }
}
