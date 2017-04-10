import { Injectable }                                  from '@angular/core';
import { Headers, Http, RequestOptions, Response }     from '@angular/http';

import { Observable }        from 'rxjs/Observable';

import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

import { Category } from './category.class';

import { ApiHelperService } from '../core/api-helper.service';

@Injectable()
export class CategoryService {

  public selectedCategory: Category;

  private categoryUrl = 'api/categories';
  private headers = new Headers({ 'Content-Type': 'application/json' });
  private options = new RequestOptions({ headers: this.headers });

  constructor(
    private http: Http,
    private apiHelperService: ApiHelperService
  ) {}

  public createCategory(category: Category): Observable<Category> {
    return this.http
      .post(this.categoryUrl, JSON.stringify(category), this.options)
      .map(this.apiHelperService.extractData)
      .catch(this.apiHelperService.handleError);
  }

  public listCategories(): Observable<Category[]> {
    return this.http
      .get(this.categoryUrl)
      .map(this.apiHelperService.extractData)
      .do(this.colorData)
      .catch(this.apiHelperService.handleError);
    }

  public getCategory(id: number): Observable<Category> {
    return this.http.get(this.categoryUrl + '/' + id)
      .map(this.apiHelperService.extractData)
      .catch(this.apiHelperService.handleError);
  }

  public updateCategory(category: Category): Observable<Category> {
    return this.http.put(this.categoryUrl + '/' + category.id,
      JSON.stringify(category), this.options)
      .map(this.apiHelperService.extractData)
      .catch(this.apiHelperService.handleError);
  }

  public deleteCategory(id: number): Observable<Category> {
    return this.http
      .delete(this.categoryUrl + '/' + id)
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
