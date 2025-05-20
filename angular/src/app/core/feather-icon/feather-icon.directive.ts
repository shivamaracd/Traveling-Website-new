import { Directive, ElementRef, Input, OnInit } from '@angular/core';
import * as feather from 'feather-icons';

@Directive({
  selector: '[featherIcon]'
})
export class FeatherIconDirective implements OnInit {
  @Input() featherIcon: string = '';

  constructor(private el: ElementRef) {}

  ngOnInit() {
    if (this.featherIcon && feather.icons[this.featherIcon as keyof typeof feather.icons]) {
      feather.replace();
      this.el.nativeElement.innerHTML = feather.icons[this.featherIcon as keyof typeof feather.icons].toSvg();
    }
  }
} 