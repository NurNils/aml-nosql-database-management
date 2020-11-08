import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-edit-file-dialog',
  templateUrl: './edit-file-dialog.component.html',
  styleUrls: ['./edit-file-dialog.component.scss']
})
export class EditFileDialogComponent implements OnInit {
  /** Edit file form group */
  editFileFormGroup: FormGroup;

  /** Constructor */
  constructor(
    public dialogRef: MatDialogRef<EditFileDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public id: string,
    private formBuilder: FormBuilder
  ) {}

  /** Initialize Edit form */
  ngOnInit() {
    //TODO: Load File by id
    this.editFileFormGroup = this.formBuilder.group({
      name: [null, Validators.required],
      content: [null, Validators.required]
    });
  }

  /** Close dialog on no click */
  onNoClick() {
    this.dialogRef.close();
  }

  /** Edit file */
  async editFile() {
    
  }
}
