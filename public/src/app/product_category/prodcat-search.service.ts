import { Injectable } from '@angular/core';
import { Http, Response }       from '@angular/http';

import { Observable }     from 'rxjs/Observable';

import { ApiHelperService } from '../core/api-helper.service';

import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

import { ProdCat }           from './prodcat.class';

@Injectable()
export class ProdCatSearchService {

  constructor(
    private http: Http,
    private apiHelperService: ApiHelperService
  ) {}

  public search(searchTerm: string): Observable<ProdCat[]> {
    return this.http
     .get('api/categories/search/' + searchTerm)
     .map(this.apiHelperService.extractData)
     .catch(this.apiHelperService.handleError);
  }
}
