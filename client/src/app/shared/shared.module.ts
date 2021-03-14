import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { CarouselModule } from 'ngx-bootstrap/carousel';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { CollapseModule } from 'ngx-bootstrap/collapse';
import { PagingHeaderComponent } from './components/paging-header/paging-header.component';
import { PagerComponent } from './components/pager/pager.component';
import { OrderTotalsComponent } from './components/order-totals/order-totals.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TextInputComponent } from './components/text-input/text-input.component';
import { CdkStepperModule } from '@angular/cdk/stepper';
import { StepperComponent } from './components/stepper/stepper.component';
import { BasketSummaryComponent } from './components/basket-summary/basket-summary.component';
import { RouterModule } from '@angular/router';
import { NgxGalleryModule } from '@kolkov/ngx-gallery';
import { ImageGalleryComponent } from './components/image-gallery/image-gallery.component';
import { NgImageSliderModule } from 'ng-image-slider';
import { SelectInputComponent } from './components/select-input/select-input.component';

@NgModule({
  declarations: [PagingHeaderComponent, 
    PagerComponent, 
    OrderTotalsComponent, 
    TextInputComponent, 
    StepperComponent, 
    BasketSummaryComponent, 
    ImageGalleryComponent, 
    SelectInputComponent
  ],
  imports: [
    CommonModule,
    PaginationModule.forRoot(),
    CarouselModule.forRoot(),
    BsDropdownModule.forRoot(),
    CollapseModule.forRoot(),
    ReactiveFormsModule,
    FormsModule,
    CdkStepperModule,
    RouterModule,
    NgxGalleryModule,
    NgImageSliderModule
  ],
  exports:[
    PaginationModule,
    PagingHeaderComponent,
    PagerComponent,
    CarouselModule,
    OrderTotalsComponent,
    ReactiveFormsModule,
    FormsModule,
    BsDropdownModule,
    CollapseModule,
    TextInputComponent,
    SelectInputComponent,
    CdkStepperModule,
    StepperComponent,
    BasketSummaryComponent,
    NgxGalleryModule,
    ImageGalleryComponent,
    NgImageSliderModule
  ],
})
export class SharedModule { }
