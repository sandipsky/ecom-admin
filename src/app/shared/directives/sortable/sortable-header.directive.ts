import { Directive, ElementRef, EventEmitter, HostListener, Input, Output, Renderer2 } from '@angular/core';

export interface SortEvent {
  column: string;
  direction: 'asc' | 'desc' | '';
}

@Directive({
  selector: 'th[sortValue]',
  standalone: true
})

export class SortableHeaderDirective {
  @Input() sortValue: string = '';
  @Input() direction: 'asc' | 'desc' | '' = '';
  @Output() sort = new EventEmitter<SortEvent>();
  static prevSortable: string = '';

  constructor(private el: ElementRef, private renderer: Renderer2) { }

  @HostListener('click') onClick() {
    if (SortableHeaderDirective.prevSortable == this.sortValue) {
      this.toggleSortDirection();
    }
    else {
      SortableHeaderDirective.prevSortable = this.sortValue;
      this.direction = 'asc';
    }
    this.sortChange();
    this.updateStatus();
  }

  updateStatus() {

    const siblings = this.el.nativeElement.parentElement.querySelectorAll('th[sortValue]');
    siblings.forEach((sibling: any) => {
      if (sibling !== this.el.nativeElement) {
        const caretElement = sibling.querySelector('a');
        if (caretElement) {
          ['asc', 'desc', 'none'].forEach(className => {
            this.renderer.removeClass(caretElement, className);
          });
        }
      }
    });

    const caretElement = this.el.nativeElement.querySelector('a');

    if (caretElement) {
      ['asc', 'desc', 'none'].forEach(className => {
        this.renderer.removeClass(caretElement, className);
      });

      const directionClass = this.direction === 'asc' ? 'asc' :
        this.direction === 'desc' ? 'desc' : 'none';
      this.renderer.addClass(caretElement, directionClass);
    }
  }

  private toggleSortDirection() {
    this.direction = this.direction === 'desc' ? '' : (this.direction === 'asc' ? 'desc' : 'asc');
  }

  private sortChange() {
    this.sort.emit({
      column: this.direction != '' ? this.sortValue : '',
      direction: this.direction
    });
  }

}

