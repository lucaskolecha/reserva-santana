import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { MatPaginator, MatTableDataSource } from '@angular/material';
import { ProductsService } from './products.service';
import swal from 'sweetalert2';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent implements OnInit {
  displayedColumns: any[] = ['name', 'category', 'unit', 'price', 'action'];
  public dataSource: MatTableDataSource<ProductsElement>;

  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(private router: Router,  private pr: ProductsService) { }

  ngOnInit() {
    this.getAllRecords();
  }

  goNew() {
    this.router.navigate(['/app/products/new']);
  }

  goEdit(uid) {
    this.router.navigate(['/app/products/edit/' + uid]);
  }

  getAllRecords() {
    this.pr.getAll().then((resp: Array<ProductsElement>) => {
      this.dataSource = new MatTableDataSource(resp);
      this.dataSource.paginator = this.paginator;
    });
  }

  removeRecord(uid) {
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
        this.pr.removeProducts(uid).then(() => {
          this.getAllRecords();
        });
      }
    })
  }

}

export interface ProductsElement {
  name: string;
  phone: string;
  email: string;
  password: string;
  paginator: MatPaginator;
}
