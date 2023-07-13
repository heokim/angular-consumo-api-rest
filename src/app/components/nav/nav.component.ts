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
    this.authService.login('maria@mail.com', '12345').subscribe((rta) => {
      // console.log(rta.access_token);
      this.token = rta.access_token;
      this.getProfile();
    });
  }

  getProfile() {
    this.authService.profile(this.token).subscribe((profile) => {
      // console.log(profile);
      this.user = profile;
    });
  }
}
