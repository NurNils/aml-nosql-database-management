import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ApiService } from '../../../services/api/api.service';
import { IResponseStatus } from 'src/app/interfaces/response.interface';
import { SnackBarService } from 'src/app/services/snack-bar/snack-bar.service';

@Component({
  selector: 'app-edit-file-dialog',
  templateUrl: './edit-file-dialog.component.html',
  styleUrls: ['./edit-file-dialog.component.scss'],
})
export class EditFileDialogComponent implements OnInit {
  /** Edit file form group */
  editFileFormGroup: FormGroup;

  /** Constructor */
  constructor(
    public dialogRef: MatDialogRef<EditFileDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { id: string },
    private formBuilder: FormBuilder,
    private apiService: ApiService,
    private snackBarService: SnackBarService
  ) {}

  /** Initialize Edit form */
  async ngOnInit() {
    const res = await this.apiService.get(`file/${this.data.id}`);
    if (res.status === IResponseStatus.success) {
      this.editFileFormGroup = this.formBuilder.group({
        name: [res.data.name, Validators.required],
        content: [res.data.content, Validators.required],
      });
    } else {
      this.dialogRef.close();
      this.snackBarService.openDefaultSnackBar('error.file-not-found');
    }
  }

  /** Close dialog on no click */
  onNoClick() {
    this.dialogRef.close();
  }

  /** Edit file */
  async editFile() {
    if (this.editFileFormGroup.valid) {
      const file = {
        content: this.editFileFormGroup.get('content').value,
        name: this.editFileFormGroup.get('name').value,
      };
      const res = await this.apiService.put(`file/${this.data.id}`, { file });
      if (res.status === IResponseStatus.success) {
        const savedFile = res.data;
        this.snackBarService.openDefaultSnackBar('success.file-uploaded');
        this.editFileFormGroup.reset();
        this.dialogRef.close(savedFile);
      }
    }
  }
}
