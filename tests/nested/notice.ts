import { Component, Input, Output, EventEmitter } from '@angular/core';

interface ChangeEvent {
  type: string;
}

interface MessageType {
  name: string;
}

/**
 * A fancy notice
 */
@Component({
  selector: 'app-notice',
  template: `
    <h1>Hi {{warning}}.</h1>
    <ng-content></ng-content>
    <button (click)="changed.emit({ type: 'click' })">Click</button>
  `
})
export class NoticeComponent {

  /**
   * Text for the warning
   */
  @Input() warning: string = 'Foo';

  @Input() warning2 = 'Foo';

  @Input() bar = 2;

  @Input() moo = [];

  @Input() boo: any[];

  @Input() status;

  @Input() stats = { moo: true };

  /**
   * Text for the message.
   * This can be fun.
   */
  @Input() message: MessageType = { name: 'Austin' };

  /**
   * Notice button was clicked.
   */
  @Output() changed: EventEmitter<ChangeEvent> = new EventEmitter<ChangeEvent>();

  @Output() happened: EventEmitter<void> = new EventEmitter<void>();

  @Output() happener = new EventEmitter<ChangeEvent>();

}
