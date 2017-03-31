import { Injectable } from '@angular/core';
import { Headers, Response, RequestOptions, Http } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

import { Product } from './product.class';

@Injectable()
export class ProductService {
  private productUrl = 'api/products';
  private headers = new Headers({ 'Content-Type': 'application/json' });
  private options = new RequestOptions({ headers: this.headers });

  constructor(
    private http: Http,
  ){}

  createProduct(prodCat: Product): Observable<Product> {
    return this.http
      .post(this.productUrl, JSON.stringify(prodCat), this.options)
      .map(this.extractData)
      .catch(this.handleError)
  }

  listProducts(): Observable<Product[]> {
    return this.http
      .get(this.productUrl)
      .map(this.extractData)
      .do(this.colorData)
      .catch(this.handleError)
    }

  deleteProduct(id: number): Observable<Product> {
    return this.http
      .delete(this.productUrl + '/' + id)
      .map(this.extractData)
      .catch(this.handleError)
    }

  private extractData(res: Response) {
    let body = res.json();
    return body || { };
  }

  private colorData(body: any) {
    let colors = ["lightblue","lightgreen","lightpink","#DDBDF1"]
    let count = 0
    for (let object of body) {
      if (!object.color) {
        object.color = colors[count % colors.length];
        count++;
      }
    }
    return body || { };
  }

  private handleError (error: Response | any) {
    let errMsg: string;
    if (error instanceof Response) {
      const body = error.json() || '';
      const err = body.error || JSON.stringify(body);
      errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
    } else {
      errMsg = error.message ? error.message : error.toString();
    }
    console.error(errMsg);
    return Observable.throw(errMsg);
  }

}
