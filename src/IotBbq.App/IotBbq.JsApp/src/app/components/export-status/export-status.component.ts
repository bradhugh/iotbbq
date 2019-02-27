import { Component, OnInit, Input, Inject } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { IBbqItem } from '../../model/BbqItem';
import { MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-export-status',
  templateUrl: './export-status.component.html',
  styleUrls: [ './export-status.component.scss' ]
})
export class ExportStatusComponent implements OnInit {
  @Input() public title: string = null;

  public inProgress = true;

  public percentComplete = 0;

  constructor(
    public dialogRef: MatDialogRef<ExportStatusComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {

    this.title = data.title;
  }

  ngOnInit() {
  }
}
