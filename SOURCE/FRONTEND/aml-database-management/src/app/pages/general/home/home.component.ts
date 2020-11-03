import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';

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
export class HomeComponent implements AfterViewInit {

  displayedColumns: string[] = ['id', 'name', 'size', 'date', 'actions'];
  dataSource: MatTableDataSource<FileData>;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor() {
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

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  editFile(id: string) {
    // TODO: Add functionality
  }

  downloadFile(d: string) {
    // TODO: Add functionality
  }

  deleteFile(d: string) {
    // TODO: Add functionality
  }
}
