import { Injectable } from '@angular/core';

import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class ProductChangeService {
  /* Observables for notifying product changes */
  private prodChangeSource = new Subject<null>();
  public prodChange$ = this.prodChangeSource.asObservable(); // tslint:disable-line

  /**
   * Function to call when a product has changed
   */
  public notifyProductChange(): void {
    this.prodChangeSource.next();
  }
}
