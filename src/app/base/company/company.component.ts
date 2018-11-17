import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { MatPaginator, MatTableDataSource } from '@angular/material';
import { CompanyService } from './company.service';
import swal from 'sweetalert2';
import { LoaderService } from '../loader.service';

@Component({
  selector: 'app-company',
  templateUrl: './company.component.html',
  styleUrls: ['./company.component.scss']
})
export class CompanyComponent implements OnInit {
  displayedColumns: any[] = ['name', 'phone', 'email', 'action'];
  private dataSource: MatTableDataSource<CompanyElement>;

  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(private router: Router, private cs: CompanyService, private ls: LoaderService) { }

  ngOnInit() {
    this.getAllRecords();
  }

  goNew() {
    this.router.navigate(['/app/company/new']);
  }

  goEdit(uid) {
    this.router.navigate(['/app/company/edit/' + uid]);
  }

  formatPhone(phone) {
    var numbers = phone.replace(/\D/g, ''),
      char = { 0: '(', 2: ') ', 3: ' ', 7: '-' };
    phone = '';
    for (var i = 0; i < numbers.length; i++) {
      phone += (char[i] || '') + numbers[i];
    }
    return phone
  }

  getAllRecords() {
    this.ls.activeLoader();
    this.cs.getAll().then((resp: Array<CompanyElement>) => {
      this.dataSource = new MatTableDataSource(resp);
      this.dataSource.paginator = this.paginator;
      this.ls.removeLoader();
    });
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
        // this.co.removeCompany(entity).then(() => {
        //   this.getAllRecords();
        // });
        this.cs.deleteUser(entity.uid).then(() => {
          this.getAllRecords();
        });
      }
    })
  }

}

export interface CompanyElement {
  name: string;
  phone: string;
  email: string;
  password: string;
  paginator: MatPaginator;
}