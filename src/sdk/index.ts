import axios from 'axios';
import type { AxiosInstance } from 'axios';
import type { Product, ProductStats } from '../types.js';

export class ShopifySummarySDK {
  private http: AxiosInstance;

  constructor(baseURL: string) {
    this.http = axios.create({ baseURL, timeout: 15_000 });
  }

  async getProducts(): Promise<Product[]> {
    const { data } = await this.http.get<Product[]>('/products');
    return data;
  }

  async getProductById(id: string): Promise<any> {
    const encoded = encodeURIComponent(id);
    const { data } = await this.http.get<any>(`/products/${encoded}`);
    return data;
  }

  async getStats(): Promise<ProductStats> {
    const { data } = await this.http.get<ProductStats>('/stats');
    return data;
  }
}
