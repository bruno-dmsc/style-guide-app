import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ScrollspyItem } from './scrollspy-item.interface';

@Component({
  selector: 'app-scrollspy',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './scrollspy.component.html'
})
export class ScrollspyComponent {
  @Input() items: ScrollspyItem[] = [];
  @Input() activeItemId: string = '';

  scrollTo(id: string, event: Event): void {
    event.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }
}