import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { ApiService } from '../../../services/api/api.service';
import { IResponseStatus } from '../../../interfaces/response.interface';
import { SnackBarService } from '../../../services/snack-bar/snack-bar.service';
import { MatDialog } from '@angular/material/dialog';
import { EditFileDialogComponent } from '../../../shared/dialogs/edit-file-dialog/edit-file-dialog.component';
import { UploadFileDialogComponent } from '../../../shared/dialogs/upload-file-dialog/upload-file-dialog.component';
import { TranslateService } from '@ngx-translate/core';

export interface FileData {
  _id: string;
  id: string;
  name: string;
  size: string;
  date: string;
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  /** Displayed Columns */
  displayedColumns: string[] = ['id', '_id', 'name', 'size', 'date', 'actions'];

  /** Datasource for Table */
  dataSource: MatTableDataSource<FileData>;

  /** MatPaginator ViewChild */
  @ViewChild(MatPaginator) paginator: MatPaginator;

  /** MatSort ViewChild */
  @ViewChild(MatSort) sort: MatSort;

  /** Filter form group */
  filterFormGroup: FormGroup;

  /** Constructor */
  constructor(
    private apiService: ApiService,
    private formBuilder: FormBuilder,
    private dialog: MatDialog,
    private snackBarService: SnackBarService,
    private translateService: TranslateService
  ) {
    this.initData();
  }

  /** Initialize */
  ngOnInit() {
    this.filterFormGroup = this.formBuilder.group({
      filter: [null, [Validators.max(1000)]],
    });
  }

  /** Initialize data */
  async initData() {
    const res = await this.apiService.get('file');
    if (res.status === IResponseStatus.success) {
      this.dataSource = new MatTableDataSource(res.data);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    }
  }

  /** Apply filter to datasource */
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  /** Clear filter */
  clearFilter() {
    this.filterFormGroup.patchValue({ filter: null });
    this.dataSource.filter = '';
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  /** Upload file */
  async uploadFile() {
    const dialogRef = this.dialog.open(UploadFileDialogComponent, {
      width: '500px',
    });
    dialogRef.afterClosed().subscribe((res) => {
      if (res) {
        let temp = this.dataSource.data;
        temp.push(res);
        this.dataSource.data = temp;
      }
    });
  }

  /** Create file */
  async createFile() {
    const dialogRef = this.dialog.open(EditFileDialogComponent, {
      width: '90vw',
    });
    dialogRef.afterClosed().subscribe((res) => {
      if (res) {
        let temp = this.dataSource.data;
        temp.push(res);
        this.dataSource.data = temp;
      }
    });
  }

  /** Edit file */
  editFile(id: string) {
    const dialogRef = this.dialog.open(EditFileDialogComponent, {
      width: '90vw',
      data: { id },
    });
    dialogRef.afterClosed().subscribe((res) => {
      if (res) {
        for (let data of this.dataSource.data) {
          if (data._id === res._id) {
            data.id = res.id;
            data.name = res.name;
            data.size = res.size;
            data.date = res.date;
          }
        }
      }
    });
  }

  /** Delete file */
  async deleteFile(id: string) {
    if (confirm(this.translateService.instant('file-delete-confirm'))) {
      const res = await this.apiService.delete(`file/${id}`);
      if (res.status === IResponseStatus.success) {
        this.snackBarService.openSnackbarSuccess('success.file-deleted');
        this.dataSource.data = this.dataSource.data.filter((e) => e._id != id);
      }
    }
  }

  /* Download file */
  async downloadFile(id: string) {
    const res = await this.apiService.get(`file/${id}/download`);
    if (res.status === IResponseStatus.success) {
      const file = res.data;
      const a = document.createElement('a');
      a.setAttribute('download', file.name);
      a.setAttribute(
        'href',
        window.URL.createObjectURL(new Blob([atob(file.base64)], { type: 'text/plain' }))
      );
      a.click();
    }
  }
}
