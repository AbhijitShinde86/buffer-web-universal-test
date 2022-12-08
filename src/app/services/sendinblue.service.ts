import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";

import { environment } from '../../environments/environment';

@Injectable({providedIn:'root'})
export class SendInBlueService{
    
    constructor(private http : HttpClient){}

    addSubscribeEmail(subscribe :any){
        const listId = environment.sendinblueListId;
        return this.http
        .post(`${environment.sendinblueApiUrl}/v3/contacts`,
            {
                "listIds": [
                    listId
                ],
                "updateEnabled": false,
                "email": subscribe.email
            },
            {
                headers: new HttpHeaders({
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'api-key': `${environment.sendinblueApiKey}`
                })
            }
        );   
    }

    addNewUserEmail(email :any){
        const listId = environment.sendinblueAllusersListId;
        return this.http
        .post(`${environment.sendinblueApiUrl}/v3/contacts`,
            {
                "listIds": [
                    listId
                ],
                "updateEnabled": false,
                "email": email
            },
            {
                headers: new HttpHeaders({
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'api-key': `${environment.sendinblueApiKey}`
                })
            }
        );   
    }

    addVendorEmail(email :any){
        const listId = environment.sendinblueVendorsListId;
        return this.http
        .post(`${environment.sendinblueApiUrl}/v3/contacts`,
            {
                "listIds": [
                    listId
                ],
                "updateEnabled": false,
                "email": email
            },
            {
                headers: new HttpHeaders({
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'api-key': `${environment.sendinblueApiKey}`
                })
            }
        );   
    }
    
    
}