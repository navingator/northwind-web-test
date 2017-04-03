import { Component, OnInit } from '@angular/core';
import { Router }            from '@angular/router';

import { Observable }        from 'rxjs/Observable';
import { Subject }           from 'rxjs/Subject';

// Observable class extensions
import 'rxjs/add/observable/of';

// Observable operators
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';

import { ProdCatSearchService } from '../prodcat-search.service';

import { ProdCat } from '../prodcat.class';

@Component({
  moduleId: module.id,
  selector: 'category-name-search',
  templateUrl: './prodCat-search.component.html',
  providers: [ProdCatSearchService]
})
export class ProdCatSearchComponent implements OnInit {
  public prodCats: Observable<ProdCat[]>;
  private searchTerms = new Subject<string>();

  constructor(
    private prodCatSearchService: ProdCatSearchService,
    private router: Router) {}

  // Push a search term into the observable stream.
  public search(searchTerm: string): void {
    this.searchTerms.next(searchTerm);
  }

  public ngOnInit(): void {
    this.prodCats = this.searchTerms
      .debounceTime(300)        // wait 300ms after each keystroke before considering the term
      .distinctUntilChanged()   // ignore if next search term is same as previous
      .switchMap(searchTerm => searchTerm   // switch to new observable each time the term changes
        // return the http search observable
        ? this.prodCatSearchService.search(searchTerm)
        // or the observable of empty product categories if there was no search term
        : Observable.of<ProdCat[]>([]))
      .catch(error => {
        // TODO Error handling
        return Observable.of<ProdCat[]>([]);
      });
  }
}
