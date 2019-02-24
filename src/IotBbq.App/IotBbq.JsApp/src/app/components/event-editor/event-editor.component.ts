import { Component, Input, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { IBbqEvent } from '../../model/BbqEvent';
import { Utility } from '../../services/Utility';

@Component({
  selector: 'app-event-editor',
  templateUrl: './event-editor.component.html',
  styleUrls: ['./event-editor.component.scss']
})
export class EventEditorComponent implements OnInit {
  @Input() public title: string;

  @Input() public event: IBbqEvent = null;

  constructor(
    public dialogRef: MatDialogRef<EventEditorComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    }

  ngOnInit() {
  }

  public onTextBoxFocus(event: FocusEvent, offset: number = -30) {
    const target = event.target as Element;
    if (target) {
      target.scrollIntoView();
      const parent = Utility.getScrollParent(target);
      parent.scrollTop += offset;
    }
  }
}
