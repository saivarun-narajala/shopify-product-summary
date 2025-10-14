import { ShopifySummarySDK } from './index.js';

async function main() {
  const sdk = new ShopifySummarySDK('http://localhost:3000');

  const products = await sdk.getProducts();
  console.log('Total products:', products.length);

  if (products.length > 0) {
    const first = products[0];
    console.log('First product title:', first.title);
    const details = await sdk.getProductById(first.id);
    console.log('Vendor:', details.vendor);
  }

  const stats = await sdk.getStats();
  console.log('Stats:', stats);
}

main().catch(err => console.error('SDK Error:', err));
