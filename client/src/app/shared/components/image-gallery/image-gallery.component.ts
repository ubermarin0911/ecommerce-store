import { Component, Input, OnInit } from '@angular/core';
import { NgxGalleryAnimation, NgxGalleryImage, NgxGalleryOptions } from '@kolkov/ngx-gallery';
import { BehaviorSubject } from 'rxjs';
import { IProduct } from '../../models/product';

@Component({
  selector: 'app-image-gallery',
  templateUrl: './image-gallery.component.html',
  styleUrls: ['./image-gallery.component.scss']
})
export class ImageGalleryComponent implements OnInit {

  private _product = new BehaviorSubject<IProduct>(null);

  @Input() set product(value: IProduct) { 
    this._product.next(value); 
  }
  get product() {
    return this._product.getValue();
  }

  galleryOptions: NgxGalleryOptions[];
  galleryImages: NgxGalleryImage[];

  constructor() { }

  ngOnInit(): void {
    this.setGalleryImages();
    this.setGalleryOptions();
  }

  setGalleryOptions(){
    this.galleryOptions = [
      {
        previewCloseOnClick: true,
        previewCloseOnEsc: true,
        previewInfinityMove: true,
        previewRotate: true,
        previewBullets: true,
        previewZoom: true,
        previewKeyboardNavigation: true,
        imageSwipe: true,
        thumbnailsSwipe: true,
        previewSwipe: true,
        width: '500px',
        height: '550px',
        thumbnailsColumns: 4,
        thumbnailsPercent: 17,
        imageAnimation: NgxGalleryAnimation.Zoom
      },
      //max-width 800
      {
        breakpoint: 800,
        width: '100%',
        height: '600px',
        imagePercent: 80,
        thumbnailsPercent: 20,
        thumbnailsMargin: 20,
        thumbnailMargin: 20
      },
      //max-width 400
      {
        breakpoint: 400,
        preview: false
      }
    ];
  }

  setGalleryImages(){
   
    this._product.subscribe(product => {
      this.galleryImages = [
        {
          small: product.pictureUrl,
          medium: product.pictureUrl,
          big: product.pictureUrl
        }
      ];
    });
  }
}
