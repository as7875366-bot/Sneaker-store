import { Component, inject, OnInit } from '@angular/core'; // 1. OnInit import karein
import { ActivatedRoute } from '@angular/router';
import { ProductService } from '../product.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-productdata',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './productdata.component.html',
  styleUrl: './productdata.component.css'
})
export class ProductdataComponent implements OnInit { // 2. implements OnInit likhein
  product: any;
  selectedSize: number | null = null;
  sizes = [7, 8, 9, 10, 11];

  private route = inject(ActivatedRoute);
  private productservice = inject(ProductService);

ngOnInit() {
  // 1. URL se ID lo
  const id = Number(this.route.snapshot.paramMap.get('id'));
  
  // 2. Service ke direct method ka use karo (Observable ki jhanjhat khatam)
  this.product = this.productservice.getProductById(id);

  console.log("Selected Product:", this.product);

  if (!this.product) {
    console.error("Bhai, product nahi mila ID:", id);
  }
}

  selectSize(size: number) {
    this.selectedSize = size;
  }
}