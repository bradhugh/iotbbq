import { Directive, ElementRef, Input, HostListener } from '@angular/core';
import { Utility } from '../services/Utility';

@Directive({
  selector: '[scrollIntoView]'
})
export class ScrollIntoViewDirective {
  constructor(private element: ElementRef) {
  }

  @Input('scrollIntoView') offset: number;

  @HostListener('focus') onfocus() {
    this.element.nativeElement.scrollIntoView();
    const parent = Utility.getScrollParent(this.element.nativeElement);
    parent.scrollTop += this.offset;
  }
}
