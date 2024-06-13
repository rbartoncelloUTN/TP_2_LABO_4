import { Component, OnInit } from '@angular/core';
import { User } from '../../Interfaces/user';
import { CommonModule } from '@angular/common';
import { BooleanToButtonPipe } from '../../pipes/boolean-to-button.pipe';
import { Router } from '@angular/router';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule, BooleanToButtonPipe],
  templateUrl: './users.component.html',
  styleUrl: './users.component.css',
})
export class UsersComponent implements OnInit {
  public users: User[] = [];

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.users = [];
    const userData = localStorage.getItem('users') || '';
    this.users = (JSON.parse(userData) as User[]) || [];
  }
  addAdmin(): void {
    console.log('click');
    this.router.navigate(['register'], { queryParams: { isAdmin: true } });
  }
}
