/**
 * Copyright (c) 2021
 *
 * This component is for the about us page.
 *
 * @author NurNils <inf19161@lehre.dhbw-stuttgart.de>
 * @author NamidM <inf19054@lehre.dhbw-stuttgart.de>
 *
 * Last modified  : 14.05.2021
 */
import { Component } from '@angular/core';
import { environment as env } from 'src/environments/environment.default';

@Component({
  selector: 'app-about-us',
  templateUrl: './about-us.component.html',
  styleUrls: ['./about-us.component.scss'],
})
export class AboutUsComponent {
  /** Github */
  github = env.github;

  /** Constructor */
  constructor() {}
}
