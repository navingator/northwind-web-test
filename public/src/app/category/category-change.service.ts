import { Injectable } from '@angular/core';

import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class CategoryChangeService {
  /* Observables for notifying category changes */
  private categoryChangeSource = new Subject<null>();
  public categoryChange$ = this.categoryChangeSource.asObservable(); // tslint:disable-line

  /**
   * Function to call when a category has changed
   */
  public notifyCategoryChange(): void {
    this.categoryChangeSource.next();
  }
}
