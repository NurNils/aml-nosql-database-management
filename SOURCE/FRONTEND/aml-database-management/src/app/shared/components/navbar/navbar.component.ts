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
  constructor() {}
}
