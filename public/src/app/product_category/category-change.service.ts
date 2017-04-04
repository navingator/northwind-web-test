import { Injectable } from '@angular/core';

import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class CategoryChangeService {
  /* Observables for notifying category changes */
  private catChangeSource = new Subject<null>();
  public catChange$ = this.catChangeSource.asObservable(); // tslint:disable-line

  /**
   * Function to call when a category has changed
   */
  public notifyCategoryChange(): void {
    this.catChangeSource.next();
  }
}
