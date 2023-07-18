import { Component, Input, OnInit } from '@angular/core';

import { StoreService } from '../../services/store.service';
import { User } from 'src/app/models/user.model';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss'],
})
export class NavComponent implements OnInit {
  activeMenu = false;
  counter = 0;
  token = '';
  user: User = {
    name: '',
    email: '',
    id: '',
    password: '',
  };

  constructor(
    private storeService: StoreService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.storeService.myCart$.subscribe((products) => {
      this.counter = products.length;
    });
  }

  toggleMenu() {
    this.activeMenu = !this.activeMenu;
  }

  login() {
    this.authService
      .loginAndGetProfile('maria@mail.com', '12345')
      .subscribe((user) => {
        this.user = user;
        console.log(user);

      });
  }
}
