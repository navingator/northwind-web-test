import { Injectable } from '@angular/core';
import { Headers, Http, RequestOptions, Response }   from '@angular/http';

import { Observable }     from 'rxjs/Observable';

import { ApiHelperService } from '../core/api-helper.service';

import 'rxjs/add/operator/do';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

import { Category } from './category.class';

@Injectable()
export class CategorySearchService {

  private headers = new Headers({ 'Content-Type': 'application/json' });
  private options = new RequestOptions({ headers: this.headers });

  constructor(
    private http: Http,
    private apiHelperService: ApiHelperService
  ) {}

  public search(searchTerm: string): Observable<Category[]> {
    const search = {term: searchTerm};
    return this.http
      .post('api/categories/search/', JSON.stringify(search), this.options)
      .map(this.apiHelperService.extractData)
      .catch(this.apiHelperService.handleError);
  }
}
