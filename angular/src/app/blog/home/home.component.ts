import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  isMenuOpen = false;
  currentSlide = 0;
  trackingNumber = '';
  
  slides = [
    {
      title: 'Express Delivery',
      description: 'Same day delivery for urgent packages',
      buttonText: 'Learn More'
    },
    {
      title: 'Global Shipping',
      description: 'Reliable worldwide shipping services',
      buttonText: 'Get Started'
    },
    {
      title: 'Track & Trace',
      description: 'Real-time package tracking',
      buttonText: 'Track Now'
    }
  ];

  constructor() {
    this.startSlideShow();
  }

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  prevSlide() {
    this.currentSlide = this.currentSlide === 0 ? this.slides.length - 1 : this.currentSlide - 1;
  }

  nextSlide() {
    this.currentSlide = this.currentSlide === this.slides.length - 1 ? 0 : this.currentSlide + 1;
  }

  private startSlideShow() {
    setInterval(() => {
      this.nextSlide();
    }, 5000);
  }

  trackShipment() {
    if (this.trackingNumber) {
      // Implement tracking logic
      console.log('Tracking number:', this.trackingNumber);
    }
  }
}
