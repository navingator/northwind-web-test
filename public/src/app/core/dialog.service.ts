import { Injectable } from '@angular/core';

/**
 * Async modal dialog service
 */
@Injectable()
export class DialogService {
  /**
   * Ask user to confirm an action. `message` explains the action and choices.
   * Returns promise resolving to `true`=confirm or `false`=cancel
   */
  public confirm(message?: string): Promise<boolean> {
    return new Promise<boolean>(resolve => {
      return resolve(window.confirm(message || 'Is it OK?'));
    });
  };
}
