import { Component, Input, Output } from '@angular/core';

@Component({
  templateUrl: './notice.component.html',
  styleUrls: ['./notice.component.css'],
  selector: 'notice'
})
export class NoticeComponent {
  /**
   * Severity should be one of the bootstrap alert severities:
   *  success
   *  info
   *  warning
   *  danger
   * Affects the display of the notice
   */
  @Input() public severity = 'warning';
  @Input() public message: string;

  public hidden: boolean = true;

  /**
   * Dismiss the notice by hiding it.
   */
  public dismiss(): void {
    this.hidden = true;
  }

  /**
   * Show the notice if there is a message
   */
  public show(): void {
    if (!this.message) { return; }
    this.hidden = false;
  }

  /**
   * Allows for programmatic setting of the message
   * @param {string} message message to be displayed
   */
  public setMessage(message: string): void {
    this.message = message;
  }

  /**
   * Allows for programmatic setting of the severity
   * @param {string} severity a Bootstrap severity (success, info, warning, danger)
   */
  public setSeverity(severity: string): void {
    this.severity = severity;
  }
}
