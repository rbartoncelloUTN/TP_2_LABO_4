import {
  Directive,
  ElementRef,
  HostBinding,
  Input,
  OnChanges,
  OnInit,
} from '@angular/core';

@Directive({
  selector: '[hiddenComponent]',
  standalone: true,
})
export class HideComponentDirective implements OnInit, OnChanges {
  @Input() hiddenComponent: boolean = false;

  @HostBinding('style.display') display!: string;

  constructor(private el: ElementRef) {}

  ngOnInit() {
    this.hideComponent();
  }

  ngOnChanges() {
    this.hideComponent();
  }

  private hideComponent() {
    this.display = this.hiddenComponent ? 'none' : '';
  }
}
