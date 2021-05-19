/**
 * Copyright (c) 2021
 *
 * This component is for the navbar.
 *
 * @author NurNils <inf19161@lehre.dhbw-stuttgart.de>
 * @author NamidM <inf19054@lehre.dhbw-stuttgart.de>
 *
 * Last modified  : 14.05.2021
 */
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { IResponseStatus } from 'src/app/interfaces/response.interface';
import { AuthService } from 'src/app/services/auth/auth.service';
import { SnackBarService } from 'src/app/services/snack-bar/snack-bar.service';
import { environment as env } from 'src/environments/environment.default';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent {
  /** App version */
  appVersion = env.appVersion;

  /** Constructor */
  constructor(private router: Router, public authService: AuthService, private snackBarService: SnackBarService) {}

  /** Logout */
  async logout() {
    const res = await this.authService.logout();
    if(res.status === IResponseStatus.success) {
      this.authService.usernameOrEmail = null;
      this.router.navigateByUrl('/login').then();
      this.snackBarService.openSnackbarSuccess('success.logout');
    } else {
      this.snackBarService.openSnackbarError('error.logout');
    }
  }
}
