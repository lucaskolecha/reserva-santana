import { Component, OnInit } from '@angular/core';
import '@mobiage/homescreen';
import { firestore } from 'firebase';
import _ from 'underscore'

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  public dashConfig: any
  private db: any
  private tenant: string
  private typeUser: string

  constructor() {
    this.db = firestore();
    this.db.settings({ timestampsInSnapshots: true });
    this.tenant = sessionStorage.getItem('tokenUid')
    this.typeUser = sessionStorage.getItem('typeUser')
  }

  ngOnInit() {
    this.dashConfig = {
      tabs: [
        {
          name: 'Geral',
          chart: {
            format: 'money',
            series: [
              {
                name: 'Realizado',
                sync: (context) => {
                  this.getChart((value) => {
                    context.setValue(value)
                  })
                }
              }
            ]
          },
          cards: [
            {
              icon: 'far fa-smile',
              text: 'Só hoje, sua loja vendeu:',
              color: '#d3e000',
              sync: (context) => {
                this.getTotal((value) => {
                  context.setValue(value)
                })
              }
            },
            {
              icon: 'far fa-calendar-alt',
              text: 'Quantidade de vendas hoje:',
              color: '#7e39c5',
              sync: (context) => {
                this.getCountSales((value) => {
                  context.setValue(value);
                })
              }
            },
            {
              icon: 'fas fa-chart-bar',
              text: 'Ticket médio do dia:',
              color: '#00c7c4',
              sync: (context) => {
                this.getTicketMedio((value) => {
                  context.setValue(value);
                })
              }
            },
            {
              icon: 'far fa-money-bill-alt',
              text: 'Quantidade de itens vendidos:',
              color: '#ff1057',
              dark: true,
              sync: (context) => {
                this.getTotalItens((value) => {
                  context.setValue(value);
                })
              }
            }
          ]
        }
      ]
    }
  }

  flatten(arr) {
    return [].concat.apply([], arr);
  }

  getDateFirstHour() {
    const date = new Date();
    date.setHours(0, 0, 0, 0)
    return date.getTime();
  }

  getDateLastHour() {
    const date = new Date();
    date.setHours(23, 59, 59, 59)
    return date.getTime();
  }
  //pensar uma forma melhor de observar os valores, da para fazer em uma so chamada.
  getTotal(homeScreenCallback) {
    this.db.collection('orders')
      .where('companyId', '==', this.tenant)
      .where('dateFinish', '>', this.getDateFirstHour())
      .where('dateFinish', '<', this.getDateLastHour())
      .onSnapshot((response) => {
        const orders = this.flatten(response.docs.map((data) => data.data().orders))
        const total = orders.reduce((value, data) => value + Number(data.total), 0)
        homeScreenCallback('R$' + (total).toLocaleString('pt-BR'))
      })
  }


  getTotalItens(homeScreenCallback) {
    this.db.collection('orders')
      .where('companyId', '==', this.tenant)
      .where('dateFinish', '>', this.getDateFirstHour())
      .where('dateFinish', '<', this.getDateLastHour())
      .onSnapshot((response) => {
        const orders = this.flatten(response.docs.map((data) => data.data().orders))
        homeScreenCallback(orders.length)
      })
  }

  getCountSales(homeScreenCallback) {
    this.db.collection('orders')
      .where('companyId', '==', this.tenant)
      .where('dateFinish', '>', this.getDateFirstHour())
      .where('dateFinish', '<', this.getDateLastHour())
      .onSnapshot((response) => {
        homeScreenCallback(response.size)
      })
  }

  getTicketMedio(homeScreenCallback) {
    this.db.collection('orders')
      .where('companyId', '==', this.tenant)
      .where('dateFinish', '>', this.getDateFirstHour())
      .where('dateFinish', '<', this.getDateLastHour())
      .onSnapshot((response) => {
        const orders = this.flatten(response.docs.map((data) => data.data().orders))
        const total = orders.reduce((value, data) => value + Number(data.total), 0) / response.size
        homeScreenCallback('R$' + (isNaN(total) ? 0 : total).toLocaleString('pt-BR'))
      })
  }

  getChart(homeScreenCallback) {
    this.db.collection('orders')
      .where('companyId', '==', this.tenant)
      .where('dateFinish', '>', this.getDateFromChart())
      .where('dateFinish', '<', this.getDateLastHour())
      .onSnapshot((response) => {
        const toReturn = []
        const group = this.groupOrders(response.docs.map((doc) => doc.data()))
        Object.keys(group)
          .forEach(date => {
            const orders = group[date]
            const total = orders.reduce((value, data) => value + Number(data.totalOrder), 0)
            toReturn.push(total)
          })
        console.log(toReturn)
        homeScreenCallback(toReturn)
      })
  }

  groupOrders(arrayOfDates) {
    return _.groupBy(arrayOfDates, function (el) {
      const date = new Date(el.dateFinish)
      date.setHours(0, 0, 0, 0)
      return date.getTime()
    });
  }

  getDateFromChart() {
    const date = new Date()
    date.setDate(date.getDate() - 7)
    return date.getTime()
  }

}
