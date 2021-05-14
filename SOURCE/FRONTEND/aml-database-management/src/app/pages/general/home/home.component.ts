/**
 * Copyright (c) 2021
 *
 * This component is for the home page.
 *
 * @author NurNils <inf19161@lehre.dhbw-stuttgart.de>
 * @author NamidM <inf19054@lehre.dhbw-stuttgart.de>
 *
 * Last modified  : 14.05.2021
 */
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

  /**
   * Initializes the filterFormGroup
   * @returns {undefined}
   */
  ngOnInit() {
    this.filterFormGroup = this.formBuilder.group({
      filter: [null, [Validators.max(1000)]],
    });
  }

  /**
   * Initializes data with a GET request to the REST API
   * @returns {undefined}
   */
  async initData() {
    const res = await this.apiService.get('file');
    if (res.status === IResponseStatus.success) {
      this.dataSource = new MatTableDataSource(res.data);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    }
  }

  /**
   * Applies filter to the dataSource
   * @param event Event
   * @returns {undefined}
   */
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  /**
   * Clears the filter and resets the paginator of the dataSource
   * @returns {undefined}
   */
  clearFilter() {
    this.filterFormGroup.patchValue({ filter: null });
    this.dataSource.filter = '';
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  /**
   * Opens a MatDialog to upload an existing file
   * @returns {undefined}
   */
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

  /**
   * Opens a MatDialog to create a new file
   * @returns {undefined}
   */
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

  /**
   * Opens a MatDialog to edit a file by _id
   * @param id _id of the file
   * @returns {undefined}
   */
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

  /**
   * Deletes a file by _id with a DELETE request to the REST API
   * @param id _id of the file
   * @returns {undefined}
   */
  async deleteFile(id: string) {
    if (confirm(this.translateService.instant('file-delete-confirm'))) {
      const res = await this.apiService.delete(`file/${id}`);
      if (res.status === IResponseStatus.success) {
        this.snackBarService.openSnackbarSuccess('success.file-deleted');
        this.dataSource.data = this.dataSource.data.filter((e) => e._id != id);
      }
    }
  }

  /**
   * Downloads a file by _id with a GET request to the REST API
   * @param id _id of the file
   * @returns {undefined}
   */
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
