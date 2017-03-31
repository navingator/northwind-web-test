import { Injectable }        from '@angular/core';
import { Headers, Response,
  RequestOptions, Http }     from '@angular/http';
import { Observable }        from 'rxjs/Observable';

import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

import { ProdCat } from './prodcat.class';

@Injectable()
export class ProdCatService {
  private prodCatUrl = 'api/categories';
  private headers = new Headers({ 'Content-Type': 'application/json' });
  private options = new RequestOptions({ headers: this.headers });

  selectedProdCat: ProdCat;

  constructor(
    private http: Http,
  ){}

  createCategory(prodCat: ProdCat): Observable<ProdCat> {
    return this.http
      .post(this.prodCatUrl, JSON.stringify(prodCat), this.options)
      .map(this.extractData)
      .catch(this.handleError)
  }

  listCategories(): Observable<ProdCat[]> {
    return this.http
      .get(this.prodCatUrl)
      .map(this.extractData)
      .do(this.colorData)
      .catch(this.handleError)
    }

  deleteCategory(id: number): Observable<ProdCat> {
    return this.http
      .delete(this.prodCatUrl + '/' + id)
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
