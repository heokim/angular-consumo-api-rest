import { Component, OnInit } from '@angular/core';

import {
  CreateProductDTO,
  Product,
  UpdateProductDTO,
} from '../../models/product.model';

import { StoreService } from '../../services/store.service';
import { ProductsService } from '../../services/products.service';

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

  constructor(
    private storeService: StoreService,
    private productsService: ProductsService
  ) {
    this.myShoppingCart = this.storeService.getShoppingCart();
  }

  ngOnInit(): void {
    this.productsService.getAllProducts().subscribe((data) => {
      this.products = data;
    });
  }

  onAddToShoppingCart(product: Product) {
    this.storeService.addProduct(product);
    this.total = this.storeService.getTotal();
  }

  toggleProductDetail() {
    this.showProductDetail = !this.showProductDetail;
  }

  onShowDetail(id: string) {
    console.log(id);
    this.productsService.getProduct(id).subscribe((data) => {
      // console.log(data);
      this.toggleProductDetail();
      this.productChosen = data;
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
}
