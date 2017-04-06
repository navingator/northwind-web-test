import { Injectable }        from '@angular/core';
import { Headers, Http,
  RequestOptions, Response } from '@angular/http';

import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import { Observable }       from 'rxjs/Observable';

import { ApiHelperService } from '../core/api-helper.service';

import { Product } from './product.class';

@Injectable()
export class ProductService {
  private productUrl = 'api/products';
  private headers = new Headers({ 'Content-Type': 'application/json' });
  private options = new RequestOptions({ headers: this.headers });

  constructor(
    private http: Http,
    private apiHelperService: ApiHelperService
  ) {}

  public createProduct(product: Product): Observable<Product> {
    return this.http
      .post(this.productUrl, JSON.stringify(product), this.options)
      .do(() => console.log(product))
      .map(this.apiHelperService.extractData)
      .catch(this.apiHelperService.handleError);
  }

  public listAllProducts(): Observable<Product[]> {
    return this.http
      .get(this.productUrl)
      .map(this.apiHelperService.extractData)
      .do(this.colorData)
      .catch(this.apiHelperService.handleError);
    }

  public listProductsByCat(categoryId: number): Observable<Product[]> {
    return this.http
      .get('api/categories/' + categoryId + '/products')
      .map(this.apiHelperService.extractData)
      .do(this.colorData)
      .catch(this.apiHelperService.handleError);
  }

  public deleteProduct(productId: number): Observable<Product> {
    return this.http
      .delete(this.productUrl + '/' + productId)
      .map(this.apiHelperService.extractData)
      .catch(this.apiHelperService.handleError);
    }

  public getProduct(productId: number): Observable<Product> {
    return this.http
      .get(this.productUrl + '/' + productId)
      .map(this.apiHelperService.extractData)
      .catch(this.apiHelperService.handleError);
  }

  public updateProduct(product: Product): Observable<Product> {
    return this.http
      .put(this.productUrl + '/' + product.id, JSON.stringify(product), this.options)
      .map(this.apiHelperService.extractData)
      .catch(this.apiHelperService.handleError);
  }

  private colorData(body: any): Observable<any> {
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
