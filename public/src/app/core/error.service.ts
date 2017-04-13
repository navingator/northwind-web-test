import { Injectable } from '@angular/core';

import { NoticeComponent } from '../shared/notice/notice.component';

@Injectable()
export class ErrorService {

  /**
   * Handles errors
   * @param {Error}           error  [description]
   * @param {NoticeComponent} notice [description]
   */
  public handleError(error: Error, notice: NoticeComponent): void {
    console.error(error);
    if (notice) { this.showNotice(notice, error.message); }
  }

  private showNotice(notice: NoticeComponent, message: string): void {
    notice.setMessage(message);
    notice.show();
  }
}
