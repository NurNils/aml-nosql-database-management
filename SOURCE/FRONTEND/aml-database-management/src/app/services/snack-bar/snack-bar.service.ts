import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { environment as env } from '../../../environments/environment';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root',
})
export class SnackBarService {
  /** Constructor */
  constructor(private snackBar: MatSnackBar, private translate: TranslateService) {}

  /** Open a snack bar with default style and settings */
  openDefaultSnackBar(translationKey: string, withoutDuration?: boolean, pannelClass?: string) {
    this.openSnackBar(
      this.translate.instant(translationKey),
      withoutDuration ? 0 : env.snackBar.duration,
      pannelClass
    );
  }

  /** Open a full editable snackbar */
  openSnackBar(translation: string, duration: number, pannelClass?: string) {
    this.translate.get('general.ok').subscribe((ok: string) => {
      this.snackBar.open(translation, ok, {
        duration,
        panelClass: [pannelClass],
      });
    });
  }
}
