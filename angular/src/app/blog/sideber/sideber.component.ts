import { Component, OnInit } from '@angular/core';
import { NgbCarouselConfig } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-slider',
  templateUrl: './sideber.component.html',
  styleUrls: ['./sideber.component.scss']
})
export class SliderComponent implements OnInit {
  images = [
    { src: 'assets/images/slider/slide1.jpg', title: 'First Slide', description: 'Welcome to our blog' },
    { src: 'assets/images/slider/slide2.jpg', title: 'Second Slide', description: 'Discover amazing content' },
    { src: 'assets/images/slider/slide3.jpg', title: 'Third Slide', description: 'Stay updated with latest news' },
    { src: 'assets/images/slider/slide4.jpg', title: 'Fourth Slide', description: 'Join our community' },
    { src: 'assets/images/slider/slide5.jpg', title: 'Fifth Slide', description: 'Connect with us' }
  ];

  constructor(config: NgbCarouselConfig) {
    config.interval = 3000;
    config.wrap = true;
    config.keyboard = false;
    config.pauseOnHover = false;
  }

  ngOnInit(): void {
  }
} 