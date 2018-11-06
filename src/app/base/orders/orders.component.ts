import { Component, OnInit, ViewChild } from '@angular/core'
import { OrdersService } from './orders.service'
import swal from 'sweetalert2'
import { NotifierService } from 'angular-notifier'
import { MatPaginator, MatTableDataSource } from '@angular/material'
import { NotificationService } from '../services/notification.service'
import { StatusOrder } from '../../interfaces/status-order.interface'

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss']
})
export class OrdersComponent implements OnInit {
  displayedColumns: any[] = ['number', 'person', 'phone', 'qtd', 'view', 'action']
  displayedColumnsC: any[] = ['number', 'person', 'phone', 'qtd', 'view']

  @ViewChild(MatPaginator) paginator: MatPaginator;
  private orders: MatTableDataSource<OrdersElement>
  private ordersCompleted: MatTableDataSource<OrdersElement>
  private labelTitle: string
  private finishB: boolean
  private btLabel: string

  private htmlTeste: string
  public statusOrders: Array<any>
  private unsnapshotsOpen: Array<any>
  private unsnapshotsClose: Array<any>

  constructor(private ordersService: OrdersService,
    private notif: NotifierService,
    private notificationService: NotificationService) {
    this.statusOrders = [
      {
        key: StatusOrder.PENDING,
        value: 'Pendente'
      },
      {
        key: StatusOrder.VISUALIZED,
        value: 'Visualizado'
      },
      {
        key: StatusOrder.SENT,
        value: 'Enviado'
      },
      {
        key: StatusOrder.FINISH,
        value: 'Finalizado'
      },
      {
        key: StatusOrder.CANCELED,
        value: 'Cancelar'
      },
    ]
    this.unsnapshotsOpen = this.ordersService.searchOrders(['PENDING', 'SENT', 'VISUALIZED'], (response) => {
      response.forEach(element => element['selectStatus'] = this.lastUpdateStatus(element))
      this.orders = new MatTableDataSource(response)
      this.orders.paginator = this.paginator
    })
    this.unsnapshotsClose = this.ordersService.searchOrders(['FINISH', 'CANCELED'], (response) => {
      response.forEach(element => element['selectStatus'] = this.lastUpdateStatus(element))
      this.ordersCompleted = new MatTableDataSource(response)
      this.ordersCompleted.paginator = this.paginator
    })
  }

  ngOnInit() {
    this.labelTitle = 'Abertos'
    this.finishB = false
    this.btLabel = 'Finalizados'
  }

  ngOnDestroy() {
    this.unsnapshotsOpen.forEach((un) => un())
    this.unsnapshotsClose.forEach((un) => un())
  }

  toggleList() {
    this.finishB = !this.finishB
    if (this.finishB) {
      this.labelTitle = 'Finalizados / Cancelados'
      this.btLabel = 'Voltar'
    } else {
      this.btLabel = 'Finalizados'
      this.labelTitle = 'Abertos'
    }
  }

  lastUpdateStatus(element) {
    if (element.status === StatusOrder.FINISH) {
      return StatusOrder.FINISH
    }
    if (element.status === StatusOrder.SENT) {
      return StatusOrder.SENT
    }
    if (element.status === StatusOrder.VISUALIZED) {
      return StatusOrder.VISUALIZED
    }
    if (element.status === StatusOrder.PENDING) {
      return StatusOrder.PENDING
    }
  }

  formatMoney(amount, decimalCount = 2, decimal = ",", thousands = ".") {
    try {
      decimalCount = Math.abs(decimalCount);
      decimalCount = isNaN(decimalCount) ? 2 : decimalCount;

      const negativeSign = amount < 0 ? "-" : "";

      let i: any = parseInt(amount = Math.abs(Number(amount) || 0).toFixed(decimalCount)).toString();
      let j = (i.length > 3) ? i.length % 3 : 0;

      return negativeSign + (j ? i.substr(0, j) + thousands : '') + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + thousands) + (decimalCount ? decimal + Math.abs(amount - i).toFixed(decimalCount).slice(2) : "");
    } catch (e) {
      console.log(e)
    }
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

  viewOrder(element) {
    let total = 0
    this.htmlTeste = `
    <div class="box-modal box-dest">
        <span>Dados do destinatário</span>
        <h5><strong>Apartamento: </strong>${element.apartment.number}</h5>
        <h5><strong>Responsável: </strong>${element.apartment.person}</h5>
          <h5><strong>Celular: </strong>${this.formatPhone(element.apartment.phone)}</h5>
      </div>
      <div class="box-modal box-order">
      <span>Dados do pedido</span>
    `
    element.orders.forEach(item => {
      this.htmlTeste = this.htmlTeste + `
     
        <h5>
          <strong>Produto:</strong> ${item.product.name},
          <strong>Qtd:</strong> ${item.qtd},
          <strong>SubTotal:</strong> R$ ${this.formatMoney(item.total)}
        </h5>
      `

      total += item.total
    });
    this.htmlTeste = this.htmlTeste + `</div>`

    this.htmlTeste = this.htmlTeste + `<h4>Total: R$ ${this.formatMoney(total)}</h4>`
    swal({
      title: `Informações sobre o pedido`,
      html: `
        ${this.htmlTeste}
      `,
      confirmButtonText: 'Ok',
    })
  }

  updateStatus(status, order) {
    let data = {}
    if (status === StatusOrder.PENDING) {
      return
    }
    if (status === StatusOrder.VISUALIZED) {
      data = {
        status: StatusOrder.VISUALIZED,
        dateVisualized: new Date().getTime()
      }
    }
    if (status === StatusOrder.SENT) {
      data = {
        status: StatusOrder.SENT,
        dateSent: new Date().getTime()
      }
    }
    if (status === StatusOrder.FINISH) {
      data = {
        status: StatusOrder.FINISH,
        dateFinish: new Date().getTime()
      }
    }

    if (status === StatusOrder.CANCELED) {
      swal({
        title: 'Cancelando pedido',
        confirmButtonText: 'Enviar',
        input: 'textarea',
        inputPlaceholder: 'Qual o motivo do cancelamento?',
        preConfirm: (value) => {
          if (value === '') {
            this.notif.notify('error', 'Informe o motivo do cancelamento.');
            return false;
          }
          if (value.length < 10) {
            this.notif.notify('error', 'Informe uma mensagem melhor para seu cliente.');
            return false;
          }
        }
      }).then((input) => {
        if (!input['dismiss']) {
          this.updateStatusOrder(data, order, status, input.value)
        }
      })
    } else {
      this.updateStatusOrder(data, order, status)
    }
  }

  updateStatusOrder(data, order, status, text?) {
    order.status = status
    data['reasonCancellation'] = text
    this.ordersService.updateRecord(data, order.id).then(() => {
      const info = JSON.parse(sessionStorage.getItem('userInfo'))
      this.notificationService.notificationClient(order.apartment.device.userId, info.name, status, text)
    })
  }

}

export interface OrdersElement {
  apartment: Array<any>,
  apartmentId: string,
  companyId: string,
  date: number,
  dateFinish: number,
  dateSent: number,
  dateVisualized: number,
  status: string,
  totalOrder: number,
  paginator: MatPaginator
}