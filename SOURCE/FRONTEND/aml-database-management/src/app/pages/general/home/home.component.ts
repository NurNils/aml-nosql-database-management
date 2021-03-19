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
import { ifError } from 'assert';

export interface FileData {
  id: string;
  name: string;
  size: string;
  date: string;
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  maxFileSize = 1;
  acceptedFiles = {}; 
  /** Displayed Columns */
  displayedColumns: string[] = ['id', '_id', 'name', 'size', 'date', 'actions'];

  /** Datasource for Table */
  dataSource: MatTableDataSource<FileData>;

  /** MatPaginator ViewChild */
  @ViewChild(MatPaginator) paginator: MatPaginator;

  /** MatSort ViewChild */
  @ViewChild(MatSort) sort: MatSort;

  /** Constructor */
  constructor(private apiService: ApiService, 
    private formBuilder: FormBuilder, 
    private dialog: MatDialog,
    private snackBarService: SnackBarService) {
    this.initData();
  }

  /** Initialize */
  ngOnInit() {
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

  /** Upload file */
  async uploadFile() {
    const dialogRef = this.dialog.open(UploadFileDialogComponent, {
      height: '90vh',
      width: '90vw'
    }); 
    dialogRef.afterClosed().subscribe(res=>{
      if(res) {
        location.reload();
      }
    });
  }
  
  /** Edit file */
  editFile(id: string) {
    const dialogRef = this.dialog.open(EditFileDialogComponent, {
      height: '90vh',
      width: '90vw',
      data: { id }
    }); 
    dialogRef.afterClosed().subscribe(res=>{
      if(res) {
        location.reload();
      }
    });
  }

  /** Delete file */
  async deleteFile(id: string) {
    const res = await this.apiService.delete(`file/${id}`);
    if (res.status === IResponseStatus.success) {
      this.snackBarService.openDefaultSnackBar('success.file-deleted');
      location.reload();
    }
  }

  /** Download file */
  async downloadFile(id: string) {
    const res = await this.apiService.get(`file/${id}/download`);
    if (res.status === IResponseStatus.success) {
      const file = res.data;
      const a = document.createElement('a');
      a.setAttribute('download', file.name);
      console.log(file);
      a.setAttribute('href', window.URL.createObjectURL(new Blob([atob(file.base64)], { type: 'text/plain' })));
      a.click()
    }
  }
}
