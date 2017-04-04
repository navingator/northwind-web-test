import { Component, OnInit } from '@angular/core';

import { Observable }        from 'rxjs/Observable';
import { Subject }           from 'rxjs/Subject';

// Observable class extensions
import 'rxjs/add/observable/of';

// Observable operators
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/switchMap';

import { ProdCatSearchService } from '../prodcat-search.service';

import { ProdCat } from '../prodcat.class';

@Component({
  moduleId: module.id,
  selector: 'prodcat-name-search',
  templateUrl: './prodcat-name-search.component.html'
})
export class ProdCatSearchComponent implements OnInit {
  public selectedProdCat = new ProdCat();
  public prodCats: Observable<ProdCat[]>;
  private searchTerms = new Subject<string>();

  constructor(
    private prodCatSearchService: ProdCatSearchService
  ) {}

  public ngOnInit(): void {
    this.prodCats = this.searchTerms
      .debounceTime(100)        // wait 100ms after each keystroke before considering the term
      .distinctUntilChanged()   // ignore if next search term is same as previous
      .switchMap(searchTerm => {   // switch to new observable each time the term changes
        if (searchTerm) {
          return this.prodCatSearchService.search(searchTerm);
        } else {
          return Observable.of<ProdCat[]>([]);
        }
      })
      .catch(error => {
        // TODO: add real error handling
        return Observable.of<ProdCat[]>([]);
      });
  }

  public prodCatSearch(searchTerm: string): void {
    this.searchTerms.next(searchTerm);
  }

  public setValue(prodCat: ProdCat): void {
    this.selectedProdCat = prodCat;
    this.prodCatSearch('');
  }
}
