import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BlogRoutingModule } from './blog-routing.module';

// import { SliderComponent } from './components/slider/slider.component';
import { NgbCarouselModule } from '@ng-bootstrap/ng-bootstrap';
import { NavbarComponent } from './navbar/navbar.component';
import { HomeComponent } from './home/home.component';
import { SliderComponent } from './sideber/sideber.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
    declarations: [
        NavbarComponent,
        HomeComponent,
        SliderComponent
    ],
    imports: [
        CommonModule,
        BlogRoutingModule,
        NgbCarouselModule,  
        FormsModule,
        ReactiveFormsModule
    ]
})
export class BlogModule { } 