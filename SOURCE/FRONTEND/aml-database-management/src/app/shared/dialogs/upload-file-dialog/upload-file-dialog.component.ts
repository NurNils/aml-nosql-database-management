/**
 * Copyright (c) 2021
 *
 * This dialog shows the upload file dialog.
 *
 * @author NurNils <inf19161@lehre.dhbw-stuttgart.de>
 * @author NamidM <inf19054@lehre.dhbw-stuttgart.de>
 *
 * Last modified  : 14.05.2021
 */
import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ApiService } from '../../../services/api/api.service';
import { IResponseStatus } from '../../../interfaces/response.interface';
import { SnackBarService } from '../../../services/snack-bar/snack-bar.service';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-upload-file-dialog',
  templateUrl: './upload-file-dialog.component.html',
  styleUrls: ['./upload-file-dialog.component.scss'],
})
export class UploadFileDialogComponent implements OnInit {
  /** Max file size */
  maxFileSize = environment.form.maxSize;

  /** Accept files */
  acceptedFiles = environment.form.acceptedFiles;

  /** Upload file form group */
  uploadFileFormGroup: FormGroup;

  /** Constructor */
  constructor(
    public dialogRef: MatDialogRef<UploadFileDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private formBuilder: FormBuilder,
    private apiService: ApiService,
    private snackBarService: SnackBarService
  ) {}

  /** Initialize Upload form */
  ngOnInit() {
    this.uploadFileFormGroup = this.formBuilder.group({
      base64: [null, Validators.required],
      name: [null, Validators.required],
      size: [null, [Validators.required, Validators.max(this.maxFileSize)]],
      type: [null],
    });
  }

  /** Close dialog on no click */
  onNoClick() {
    this.dialogRef.close();
  }

  /** Handle file change */
  handleFileChange(event: any) {
    if (event.target.files && event.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (onLoad: any) => {
        this.uploadFileFormGroup.patchValue({ base64: onLoad.target.result });
      };
      this.uploadFileFormGroup.patchValue({
        name: event.target.files[0].name,
        size: event.target.files[0].size,
        type: event.target.files[0].type,
      });
      reader.readAsDataURL(event.target.files[0]);
    }
  }

  /** Upload file */
  async uploadFile() {
    if (this.uploadFileFormGroup.valid) {
      const file = {
        base64: this.uploadFileFormGroup.get('base64').value,
        name: this.uploadFileFormGroup.get('name').value,
        size: this.uploadFileFormGroup.get('size').value,
        type: this.uploadFileFormGroup.get('type').value,
      };
      const res = await this.apiService.post('file', { file });
      if (res.status === IResponseStatus.success) {
        const savedFile = res.data;
        this.snackBarService.openSnackbarSuccess('success.file-uploaded');
        this.uploadFileFormGroup.reset();
        this.dialogRef.close(savedFile);
      }
    }
  }
}
