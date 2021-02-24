import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { BasketService } from '../../basket/basket.service';
import { Observable } from 'rxjs';
import { IBasket } from '../../shared/models/basket';
import { IUser } from '../../shared/models/user';
import { AccountService } from '../../account/account.service';


@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.scss']
})
export class NavBarComponent implements OnInit{
  basket$: Observable<IBasket>; 
  currentUser$: Observable<IUser>;
  menuActive = false;

  @ViewChild('toggle') toggle: ElementRef;

  constructor(private basketService: BasketService,
     private accountService: AccountService) { }

  ngOnInit() {
    this.basket$ = this.basketService.basket$;
    this.currentUser$ = this.accountService.currentUser$;
  }

  logout(){
    this.accountService.logout();
  }

  toggleMenu() {
    this.menuActive = !this.menuActive ?? this.menuActive;
  }

  closeMenu(){
    this.menuActive = false;
  }

}