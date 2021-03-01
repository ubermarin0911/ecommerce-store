import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  imageObject: Array<object> = [{
        image: 'assets/images/inicio3.jpg',
        thumbImage: 'assets/images/inicio3.jpg',
        alt: 'alt of image',
        title: 'NOMBRE DE LA PLANTA'
    },
    {
      image: 'assets/images/inicio3.jpg',
      thumbImage: 'assets/images/inicio3.jpg',
      alt: 'alt of image',
      title: 'NOMBRE DE LA PLANTA'
    },
    {
      image: 'assets/images/inicio3.jpg',
      thumbImage: 'assets/images/inicio3.jpg',
      alt: 'alt of image',
      title: 'NOMBRE DE LA PLANTA'
    },
    {
      image: 'assets/images/inicio3.jpg',
      thumbImage: 'assets/images/inicio3.jpg',
      alt: 'alt of image',
      title: 'NOMBRE DE LA PLANTA'
    },
    {
      image: 'assets/images/inicio3.jpg',
      thumbImage: 'assets/images/inicio3.jpg',
      alt: 'alt of image',
      title: 'NOMBRE DE LA PLANTA'
    },
    {
      image: 'assets/images/inicio3.jpg',
      thumbImage: 'assets/images/inicio3.jpg',
      alt: 'alt of image',
      title: 'NOMBRE DE LA PLANTA'
    },
    {
      image: 'assets/images/inicio3.jpg',
      thumbImage: 'assets/images/inicio3.jpg',
      alt: 'alt of image',
      title: 'NOMBRE DE LA PLANTA'
    },
    {
      image: 'assets/images/inicio3.jpg',
      thumbImage: 'assets/images/inicio3.jpg',
      alt: 'alt of image',
      title: 'NOMBRE DE LA PLANTA'
    },
    {
      image: 'assets/images/inicio3.jpg',
      thumbImage: 'assets/images/inicio3.jpg',
      alt: 'alt of image',
      title: 'NOMBRE DE LA PLANTA'
    },
    {
      image: 'assets/images/inicio3.jpg',
      thumbImage: 'assets/images/inicio3.jpg',
      alt: 'alt of image',
      title: 'NOMBRE DE LA PLANTA'
    },
    {
      image: 'assets/images/inicio3.jpg',
      thumbImage: 'assets/images/inicio3.jpg',
      alt: 'alt of image',
      title: 'NOMBRE DE LA PLANTA'
    },
    {
      image: 'assets/images/inicio3.jpg',
      thumbImage: 'assets/images/inicio3.jpg',
      alt: 'alt of image',
      title: 'NOMBRE DE LA PLANTA'
    },
    {
      image: 'assets/images/inicio3.jpg',
      thumbImage: 'assets/images/inicio3.jpg',
      alt: 'alt of image',
      title: 'NOMBRE DE LA PLANTA'
    },
  ];

  constructor(private router: Router) { }

  ngOnInit() {
  }

  openProduct(index: number){
    this.router.navigateByUrl("shop");
  }

}
