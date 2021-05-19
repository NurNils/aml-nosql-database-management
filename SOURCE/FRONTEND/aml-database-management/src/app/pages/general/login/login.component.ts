import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../../../services/auth/auth.service';
import { SnackBarService } from '../../../services/snack-bar/snack-bar.service';
import { ActivatedRoute, Router } from '@angular/router';
import { IResponseStatus } from 'src/app/interfaces/response.interface';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  /** Return url */
  returnUrl: string;

  /** Login form group */
  loginFormGroup: FormGroup;

  /** Verification */
  needVerification: boolean;

  /** Constructor */
  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private snackBarService: SnackBarService
  ) {}

  /** Initialize form */
  ngOnInit() {
    this.returnUrl = this.route.snapshot.queryParams.returnUrl || '/';

    this.loginFormGroup = this.formBuilder.group({
      usernameOrEmail: [
        null,
        [Validators.required, Validators.minLength(3), Validators.maxLength(100)],
      ],
      password: [null, Validators.required],
    });
  }

  /** Login */
  async login() {
    if (this.loginFormGroup.valid) {
      const res = await this.authService.login(
        this.loginFormGroup.get('usernameOrEmail').value,
        this.loginFormGroup.get('password').value
      );
      if (res.status === IResponseStatus.success) {
        if (res.data?.usernameOrEmail) {
          this.authService.usernameOrEmail = res.data.usernameOrEmail;
          this.snackBarService.openSnackbarSuccess('success.login');
          this.loginFormGroup.reset();
          this.router.navigateByUrl(this.returnUrl).then();
        }        
      } else {        
        this.snackBarService.openSnackbarError('error.login');
      }
    }
  }
}
