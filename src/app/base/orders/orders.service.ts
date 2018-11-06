import { Injectable } from '@angular/core';
import { firestore } from 'firebase';
import { Constants } from '../../constants';

@Injectable()
export class OrdersService {

    private db;

    constructor() {
        this.db = firestore();
        this.db.settings({ timestampsInSnapshots: true });
    }

    createObserveByStatus(companyId, status, callback): Function {
        return this.db.collection(Constants.COLLECTION_ORDERS)
            .where('companyId', '==', companyId)
            .where('status', '==', status)
            .onSnapshot((snapshot) => callback(snapshot))
    }

    searchOrders(status, callback: Function) {
        const companyId = sessionStorage.getItem('tokenUid')
        const responses = {},
            onUpdate = (key, snapshot) => {
                responses[key] = snapshot.docs.map((doc) => Object.assign({ id: doc.id }, doc.data()))
                handleResponse()
            },
            handleResponse = () => {
                const toReturn = []
                Promise.all(Object.keys(responses)
                    .map((key) => {
                        return Promise.all(responses[key].map((order) => this.db.collection(Constants.COLLECTION_APARTMENTS).doc(order.apartmentId).get()))
                            .then((apartmentResponse) => apartmentResponse.forEach((apartment: any, index) => {
                                responses[key][index].apartment = apartment.data()
                                toReturn.push(responses[key][index])
                            }))
                    }))
                    .then(() => callback(toReturn.sort((a, b) => a.date - b.date)))
            }
        return status.map((key) => this.createObserveByStatus(companyId, key, (snapshot) => onUpdate(key, snapshot)))
    }

    updateRecord(data, id) {
        console.log(data)
        return new Promise((response, reject) => {
            this.db.collection(Constants.COLLECTION_ORDERS).doc(id).update(JSON.parse(JSON.stringify(data))).then(() => {
                response(true)
            }).catch(err => {
                reject(err)
            })
        })
    }

}
