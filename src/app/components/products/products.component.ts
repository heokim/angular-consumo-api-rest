import { Component, OnInit } from '@angular/core';

import {
  CreateProductDTO,
  Product,
  UpdateProductDTO,
} from '../../models/product.model';

import { StoreService } from '../../services/store.service';
import { ProductsService } from '../../services/products.service';

import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss'],
})
export class ProductsComponent implements OnInit {
  myShoppingCart: Product[] = [];
  total = 0;
  products: Product[] = [];
  showProductDetail = false;
  productChosen: Product = {
    id: '',
    price: 0,
    images: [],
    title: '',
    category: {
      id: '',
      name: '',
    },
    description: '',
  };
  limit = 5;
  offset = 0;
  statusDetail: 'loading' | 'success' | 'error' | 'init' = 'init';

  constructor(
    private storeService: StoreService,
    private productsService: ProductsService
  ) {
    this.myShoppingCart = this.storeService.getShoppingCart();
  }

  ngOnInit(): void {
    // this.productsService.getAllProducts().subscribe((data) => {
    //   this.products = data;
    // });
    this.offset = 0;
    this.loadMore();
  }

  onAddToShoppingCart(product: Product) {
    this.storeService.addProduct(product);
    this.total = this.storeService.getTotal();
  }

  toggleProductDetail() {
    this.showProductDetail = !this.showProductDetail;
  }

  onShowDetail(id: string) {
    this.statusDetail = 'loading';
    this.toggleProductDetail();
    this.productsService.getProduct(id).subscribe(
      (data) => {
        this.productChosen = data;
        this.statusDetail = 'success';
      },
      (errorMessage) => {
        window.alert(errorMessage);
        this.statusDetail = 'error';
      }
    );
  }

  // Como evitar Callback Hell
  // si tiene dependencia usar .pipe(switchMap(() =>{})
  // si tiene distintas peticiones en paralelo usar zip(fetch1, fetch2)
  // se Recomienda escribir estas logicas en el Service porque puede ser reutilizable
  readAndUpdate(id: string) {
    this.productsService
      .getProduct(id)
      .pipe(
        switchMap((product) =>
          this.productsService.update(product.id, { title: 'changes' })
        )
      )
      .subscribe((data) => {
        console.log(data);
      });

    this.productsService
      .fetchReadAndUpdate(id, { title: 'Nuevo' })
      .subscribe((response) => {
        const readProducto = response[0];
        const updatedProduct = response[1];
        console.log(readProducto);
        console.log(updatedProduct);
      });
  }

  createNewProduct() {
    const product: CreateProductDTO = {
      title: 'Nuevo Producto',
      description: 'Bla bla bla',
      price: 1000,
      images: ['https://picsum.photos/640/640?r=8717'],
      categoryId: 2,
    };
    this.productsService.create(product).subscribe((data) => {
      console.log('created', data);
    });
  }

  updateProduct() {
    const changes: UpdateProductDTO = {
      title: 'Pistola de Agua',
      description:
        '¡Refresca tus días de verano con nuestra increíble pistola de agua! Diseñada para brindar diversión acuática sin límites, nuestra pistola de agua es el complemento perfecto para tus actividades al aire libre. Con un diseño ergonómico y un chorro de agua potente, estarás listo para emocionantes batallas acuáticas con familia y amigos. ¡Obtén la tuya y sumérgete en la diversión refrescante de nuestra pistola de agua!',
      categoryId: 4,
    };
    const id = this.productChosen.id;
    this.productsService.update(id, changes).subscribe((data) => {
      console.log('updated', data);
      const productIndex = this.products.findIndex((item) => item.id === id);
      this.products[productIndex] = data;
      this.productChosen = data;
    });
  }

  deleteProduct() {
    const id = this.productChosen.id;
    this.productsService.delete(id).subscribe((data) => {
      if (data) {
        console.log('is deleted', data);
        const productIndex = this.products.findIndex((item) => item.id === id);
        this.products.splice(productIndex, 1);
        this.showProductDetail = false;
      }
    });
  }

  loadMore() {
    this.productsService
      .getProdcductsByPage(this.limit, this.offset)
      .subscribe((data) => {
        this.products = this.products.concat(data);
        this.offset += this.limit;
      });
  }
}
