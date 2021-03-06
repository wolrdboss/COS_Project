import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Api } from './api';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';

/**
 * Most apps have the concept of a User. This is a simple provider
 * with stubs for login/signup/etc.
 *
 * This User provider makes calls to our API at the `login` and `signup` endpoints.
 *
 * By default, it expects `login` and `signup` to return a JSON object of the shape:
 *
 * ```json
 * {
 *   status: 'success',
 *   user: {
 *     // User fields your app needs, like "id", "name", "email", etc.
 *   }
 * }
 * ```
 *
 * If the `status` field is not `success`, then an error is detected and returned.
 */

export class SessionInfo{
  sessionId:string;
  status:string;
  userDepartment:string;
  userFullName:string;
  userName:string;
  userWarehouse:string;
}

export class OrderModel{
  orderBarcode:string;
  warehouse:string;
  zone:string;
  binLocations:string[];
  countProductScaned:number;
  countTotalProducts:number;
  toteNumber:string;

  public clear():void{
    this.orderBarcode = '';
    this.warehouse = '';
    this.zone = '';
    this.binLocations = [];
    this.countProductScaned = 0;
    this.countTotalProducts = 0;
    this.toteNumber = '';
  }

  public isCompleted():boolean{
    if(this.countProductScaned == this.countTotalProducts)
      return true;
    return false;
  }
}


@Injectable()
export class User {
  _user: any;


  public workingRegion:String = '';  
  public sessionInfo: SessionInfo;

  //for convey region
  public hasTotes:string='';
  public allowableProductsNotInTote:number;
  public orderInfo : OrderModel

  //for P2l region
  public p2lJobID:number = 0;

  constructor(public http: Http, public api: Api) {
    this.sessionInfo = new SessionInfo();
    this.orderInfo = new OrderModel();
    this.allowableProductsNotInTote = 0;
  }

  /**
   * Send a POST request to our login endpoint with the data
   * the user entered on the form.
   */
  login(accountInfo: any) {
    let seq = this.api.post('login', accountInfo).share();

    seq
      .map(res => res.json())
      .subscribe(res => {
        // If the API returned a successful response, mark the user as logged in
        if (res.status == 'success') {
          this._loggedIn(res);
        } else {
        }
      }, err => {
        console.error('ERROR', err);
      });

    return seq;
  }

  /**
   * Send a POST request to our signup endpoint with the data
   * the user entered on the form.
   */
  signup(accountInfo: any) {
    let seq = this.api.post('signup', accountInfo).share();

    seq
      .map(res => res.json())
      .subscribe(res => {
        // If the API returned a successful response, mark the user as logged in
        if (res.status == 'success') {
          this._loggedIn(res);
        }
      }, err => {
        console.error('ERROR', err);
      });

    return seq;
  }

  /**
   * Log the user out, which forgets the session
   */
  logout() {
    this._user = null;
  }

  /**
   * Process a login/signup response to store user data
   */
  _loggedIn(resp) {
    this._user = resp.user;
  }
}
