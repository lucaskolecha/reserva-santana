import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { MatPaginator, MatTableDataSource } from '@angular/material';
import { ApartmentsService } from './apartments.service';
import swal from 'sweetalert2';
import { LoaderService } from '../loader.service';

@Component({
  selector: 'app-apartments',
  templateUrl: './apartments.component.html',
  styleUrls: ['./apartments.component.scss']
})
export class ApartmentsComponent implements OnInit {
  displayedColumns: any[] = ['number', 'person', 'email', 'action'];
  public dataSource: MatTableDataSource<ApartmentElement>;

  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(private router: Router, private ap: ApartmentsService, private ls: LoaderService) {
  }

  ngOnInit() {
    this.getAllRecords();
  }

  getAllRecords() {
    this.ls.activeLoader();
    this.ap.getAll().then((resp: Array<ApartmentElement>) => {
      this.dataSource = new MatTableDataSource(resp);
      this.dataSource.paginator = this.paginator;
      this.ls.removeLoader();
    });
  }

  goNew() {
    this.router.navigate(['/app/apartments/new']);
  }

  goEdit(uid) {
    this.router.navigate(['/app/apartments/edit/' + uid]);
  }

  removeRecord(entity) {
    swal({
      title: 'Atenção',
      type: 'warning',
      html: 'Você está prestes a remover este registro. <br>Deseja Continuar?',
      showCloseButton: true,
      showCancelButton: true,
      focusConfirm: true,
      confirmButtonText: 'SIM',
      cancelButtonText: 'Não',
      preConfirm: () => {
        this.ap.deleteUser(entity.uid).then(() => {
          this.getAllRecords();
        });
      }
    })
  }
}

export interface ApartmentElement {
  number: string;
  person: string;
  email: string;
  password: string;
  paginator: MatPaginator;
}