import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ApiService } from '../../../services/api/api.service';
import { IResponseStatus } from 'src/app/interfaces/response.interface';
import { SnackBarService } from 'src/app/services/snack-bar/snack-bar.service';
import { CodemirrorComponent } from '@ctrl/ngx-codemirror';

@Component({
  selector: 'app-edit-file-dialog',
  templateUrl: './edit-file-dialog.component.html',
  styleUrls: ['./edit-file-dialog.component.scss'],
})
export class EditFileDialogComponent implements OnInit {
  
  /** Edit file form group */
  editFileFormGroup: FormGroup;

  /** Code mirror component */
  @ViewChild('codeMirror') private codeEditorCmp: CodemirrorComponent;
  
  /** Code mirror options */
  codeMirrorOptions: any = {
    mode: 'application/xml',
    lineNumbers: true,
    lineWrapping: true,
    foldGutter: true,
    gutters: ['CodeMirror-linenumbers', 'CodeMirror-foldgutter', 'CodeMirror-lint-markers'],
    autoCloseBrackets: true,
    matchBrackets: true,
    lint: true
  };

  /** Content for code mirror */
  content: string;

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
    if(this.data?.id) {
      /** Load existing data */
      const res = await this.apiService.get(`file/${this.data.id}`);
      if (res.status === IResponseStatus.success) {
        this.editFileFormGroup = this.formBuilder.group({
          name: [res.data.name, Validators.required],
        });
        this.content = res.data.content;
        setTimeout(() => { this.codeEditorCmp.codeMirror.refresh() }, 100);
      } else {
        this.dialogRef.close();
        this.snackBarService.openDefaultSnackBar('error.file-not-found');
      }
    } else {
      /** Create empty form group */
      this.editFileFormGroup = this.formBuilder.group({
        name: [null, Validators.required],
      });
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
        name: this.editFileFormGroup.get('name').value,
        content: this.content,
      };
      if(this.data?.id) {
        const res = await this.apiService.put(`file/${this.data.id}`, { file });
        if (res.status === IResponseStatus.success) {
          const savedFile = res.data;
          this.snackBarService.openDefaultSnackBar('success.file-uploaded');
          this.editFileFormGroup.reset();
          this.dialogRef.close(savedFile);
        }
      } else {
        const res = await this.apiService.post(`file`, { file });
        if (res.status === IResponseStatus.success) {
          const savedFile = res.data;
          this.snackBarService.openDefaultSnackBar('success.file-uploaded');
          this.editFileFormGroup.reset();
          this.dialogRef.close(savedFile);
        }
      }
    }
  }
}
