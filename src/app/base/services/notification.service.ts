import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { StatusOrder } from '../../interfaces/status-order.interface';

@Injectable()
export class NotificationService {

    private BASE_API = 'https://onesignal.com/api/v1'
    private KEY_API = 'ba3888b5-8bf4-445c-be37-06f99e331ac4'

    constructor(private http: HttpClient) {
    }
    // "big_picture": "https://media1.britannica.com/eb-media/02/188002-004-58D1B5AE.jpg",
    notificationClient(idDevice, company, status, text?) {
        let message;
        if (status === StatusOrder.VISUALIZED) {
            message = `Opa, acabamos de visualizar seu pedido!`
        } else if (status === StatusOrder.SENT) {
            message = `Nosso entregador acabou de sair para realizar sua entrega.`
        } else if (status === StatusOrder.CANCELED) {
            message = text
        } else if (status === StatusOrder.FINISH) {
            message = `Obrigado pela preferencia :)`
        }
        let data = {
            include_player_ids: [idDevice],
            headings: {
                en: `${company} diz:`
            },
            contents: {
                en: message
            }
        }
        this.http.post(`${this.BASE_API}/notifications`, data, {
            params: {
                'app_id': this.KEY_API
            },
            headers: {
                'Authorization': 'Basic NjIwMzgxMDEtNzNlZi00NzQzLWI2NzQtNWRhZjkxOTFiMjA3'
            }
        }).subscribe(() => {})
    }

}
