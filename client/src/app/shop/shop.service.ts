import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { IPagination, Pagination } from '../shared/models/pagination';
import { IBrand } from '../shared/models/brand';
import { IType } from '../shared/models/productType';
import {map} from 'rxjs/operators'; 
import { ShopParams } from '../shared/models/shopParams';
import { IProduct } from '../shared/models/product';
import { environment } from 'src/environments/environment';
import { of } from 'rxjs'; 

@Injectable({
  providedIn: 'root'
})
export class ShopService {
  baseUrl = environment.apiUrl;;
  products: IProduct[] = [];
  brands: IBrand[] = [];
  types: IType[] = [];
  pagination = new Pagination();
  shopParams = new ShopParams();
  productCache = new Map();

  constructor(private http: HttpClient) { }

  getProducts(useCache: boolean){

    if(!useCache){
      this.productCache = new Map();
    }

    if(this.productCache.size > 0 && useCache){
      if (this.productCache.has(Object.values(this.shopParams).join('-'))) {
        this.pagination.data = this.productCache.get(Object.values(this.shopParams).join('-'));
   
        return of(this.pagination);
      }
    }

    let params = new HttpParams();

    if(this.shopParams.brandId){
      params = params.append('brandId', this.shopParams.brandId.toString());
    }

    if(this.shopParams.typeId){
      params = params.append('typeId', this.shopParams.typeId.toString());
    }

    if(this.shopParams.search){
      params = params.append('search', this.shopParams.search);
    }

    params = params.append('sort', this.shopParams.sort);
    params = params.append('pageIndex', this.shopParams.pageNumber.toString());
    params = params.append('pageSize', this.shopParams.pageSize.toString());

    return this.http.get<IPagination>(this.baseUrl + 'products', {observe: 'response', params})
      .pipe(
        map(response => {
          this.productCache.set(Object.values(this.shopParams).join('-'), response.body.data);
          this.pagination = response.body;
 
          return this.pagination;
        })
      );
  }

  setShopParams(params: ShopParams){
    this.shopParams = params;
  }

  getShopParams(){
    return this.shopParams;
  }

  getProduct(id: number){
    const product = this.products.find(p => p.id === id);

    if(product){
      return of(product);
    }
 
    return this.http.get<IProduct>(`${this.baseUrl}products/${id}`);
  }

  getBrands(){
    if(this.brands.length > 0){
      return of(this.brands);
    }

    return this.http.get<IBrand[]>(`${this.baseUrl}products/brands`).pipe(
      map(response => {
        this.brands = response;
        return response;
      })
    );
  }

  getTypes(){
    if(this.types.length > 0){
      return of(this.types);
    }
    return this.http.get<IType[]>(`${this.baseUrl}products/types`).pipe(
      map(response => {
        this.types = response;
        return response;
      })
    );
  }

}
