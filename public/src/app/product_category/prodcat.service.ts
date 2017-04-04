import { Injectable }                                  from '@angular/core';
import { Headers, Http, RequestOptions, Response }     from '@angular/http';

import { Observable }        from 'rxjs/Observable';

import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

import { ProdCat } from './prodcat.class';

import { ApiHelperService } from '../core/api-helper.service';

@Injectable()
export class ProdCatService {

  public selectedProdCat: ProdCat;

  private prodCatUrl = 'api/categories';
  private headers = new Headers({ 'Content-Type': 'application/json' });
  private options = new RequestOptions({ headers: this.headers });

  constructor(
    private http: Http,
    private apiHelperService: ApiHelperService
  ) {}

  public createCategory(prodCat: ProdCat): Observable<ProdCat> {
    return this.http
      .post(this.prodCatUrl, JSON.stringify(prodCat), this.options)
      .map(this.apiHelperService.extractData)
      .catch(this.apiHelperService.handleError);
  }

  public listCategories(): Observable<ProdCat[]> {
    return this.http
      .get(this.prodCatUrl)
      .map(this.apiHelperService.extractData)
      .do(this.colorData)
      .catch(this.apiHelperService.handleError);
    }

  public deleteCategory(id: number): Observable<ProdCat> {
    return this.http
      .delete(this.prodCatUrl + '/' + id)
      .map(this.apiHelperService.extractData)
      .catch(this.apiHelperService.handleError);
    }

  private colorData(body: any): any {
    const colors = ['lightblue', 'lightgreen', 'lightpink', '#DDBDF1'];
    let count = 0;
    for (const object of body) {
      if (!object.color) {
        object.color = colors[count % colors.length];
        count++;
      }
    }
    return body || { };
  }

}
