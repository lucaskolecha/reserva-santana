import { Component, OnInit } from '@angular/core';
import '@mobiage/homescreen';
import { firestore } from 'firebase';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  public dashConfig: any;
  private db: any;
  private tenant: string;

  constructor() {
    this.db = firestore();
    this.db.settings({ timestampsInSnapshots: true });
    this.tenant = sessionStorage.getItem('tokenUid');
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
                  context.setValue(5);
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
                  context.setValue(value);
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
    date.setHours(0,0,0,0)
    return date.getTime();
  }

  getDateLastHour() {
    const date = new Date();
    date.setHours(23,59,59,59)
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
    // this.db.collection('metadata')
    //   .doc(this.organizationCode)
    //   .collection('dashboard')
    //   .orderBy('createdAt', 'desc')
    //   .limit(7)
    //   .onSnapshot((response) => {
    //     Promise.all(response.docs.map((doc) => doc.ref.collection('sales').get()))
    //       .then((docsSnapshot) => {
    //         let data = [];
    //         docsSnapshot.reverse().forEach((docSnapshot: any, i) => {
    //           const total = docSnapshot.docs.reduce((value, doc) => {
    //             const data = doc.data();
    //             return value + Number(data.value)
    //           }, 0);
    //           data[i] = total
    //         })
    //         homeScreenCallback(data)
    //       })
    //   })
  }

}
