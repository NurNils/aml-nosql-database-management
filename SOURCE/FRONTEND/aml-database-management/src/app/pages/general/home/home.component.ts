import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { ApiService } from '../../../services/api/api.service';
import { IResponseStatus } from '../../../interfaces/response.interface';
import { SnackBarService } from '../../../services/snack-bar/snack-bar.service';

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
export class HomeComponent implements OnInit, AfterViewInit {

  /** Displayed Columns */
  displayedColumns: string[] = ['id', 'name', 'size', 'date', 'actions'];

  /** Datasource for Table */
  dataSource: MatTableDataSource<FileData>;

  /** Upload file form group */
  uploadFileFormGroup: FormGroup;

  /** File to upload */
  fileToUpload = {
    base64: null,
    name: null,
    size: null,
    type: null,
  };

  /** MatPaginator ViewChild */
  @ViewChild(MatPaginator) paginator: MatPaginator;

  /** MatSort ViewChild */
  @ViewChild(MatSort) sort: MatSort;

  /** Constructor */
  constructor(private apiService: ApiService, private formBuilder: FormBuilder, private snackBarService: SnackBarService) {
    this.dataSource = new MatTableDataSource(
      [
        {
          id: '1',
          name: 'AMLFile.aml',
          size: '241414',
          date: '01-11-2020'
        },
        {
          id: '2',
          name: 'AMLFile1.aml',
          size: '1231233',
          date: '02-11-2020'
        },
        {
          id: '3',
          name: 'AMLFile2.aml',
          size: '4441112',
          date: '03-11-2020'
        },
      ]
    );
  }

  /** Initialize file form group */
  ngOnInit() {
    this.uploadFileFormGroup = this.formBuilder.group({
      file: [null, Validators.required],
    });
  }

  /** Initialize view childs */
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  /** Handle file change */
  handleFileChange(event: any) {
    if (event.target.files && event.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (onLoad: any) => {
        this.fileToUpload.base64 = onLoad.target.result;
      };
      this.fileToUpload.name = event.target.files[0].name;
      this.fileToUpload.size = event.target.files[0].size;
      this.fileToUpload.type = event.target.files[0].type;
      reader.readAsDataURL(event.target.files[0]);
    }
  }

  /** Upload file */
  async uploadFile() {
    if (this.uploadFileFormGroup.valid) {
      const res = await this.apiService.post(`image`, { file: this.fileToUpload });
      if (res.status === IResponseStatus.success) {
        const savedFile = res.data;
        this.snackBarService.openDefaultSnackBar('success.file-uploaded');
        this.uploadFileFormGroup.reset();
      }
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

  /** Edit file */
  editFile(id: string) {
    // TODO: Add functionality
  }

  /** Download file */
  downloadFile(d: string) {
    // TODO: Add functionality
  }

  /** Delete file */
  deleteFile(d: string) {
    // TODO: Add functionality
  }
}
