import { Directive, HostBinding, HostListener } from '@angular/core';

@Directive({
  selector: '[appDropdown]'
})
export class DropdownDirective {
  @HostBinding('class.open')
  private isOpened = false;

  @HostListener('click')
  private toggle() {
    this.isOpened = !this.isOpened;
  }
}
