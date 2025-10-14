# Shopify Product Summary Microservice

This is a small Node.js + TypeScript project built for the Lucky Orange technical assessment.  
It connects to a Shopify store using the GraphQL Admin API and provides a few simple REST endpoints to view product data and stats.

---

## Setup

1. Unzip `main.db.zip` (password is in the email)  
   and put the extracted `main.db` in the root folder.

2. Create a `.env` file:
   ```env
   DB_PATH=./main.db
   PORT=3000
   CACHE_TTL_MS=60000
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

4. Start the server:
   ```bash
   npm run dev
   ```

You should see:
```
[shopify] host: luckyorange-interview-test.myshopify.com
API listening on http://localhost:3000
```

---

## API Endpoints

### GET /products
Returns all products sorted by title.

Example:
```json
[
  {
    "id": "gid://shopify/Product/9435036647654",
    "title": "\"404 Not Found\" Coffee Mug",
    "price": 14.99,
    "inventory": 20,
    "created_at": "2025-10-06T22:08:07Z"
  }
]
```

### GET /products/:id
Returns details of a single product.

```json
{
  "id": "gid://shopify/Product/9435036647654",
  "title": "\"404 Not Found\" Coffee Mug",
  "totalInventory": 20,
  "vendor": "LuckyOrange Interview Test",
  "priceRangeV2": { "minVariantPrice": { "amount": "14.99", "currencyCode": "USD" } }
}
```

### GET /stats
Returns overall store stats.
```json
{
  "total_products": 5,
  "total_inventory": 157,
  "average_price": 33.1
}
```

---

## SDK

I also added a small Node.js SDK that calls the same endpoints.

Example:
```ts
import { ShopifySummarySDK } from './src/sdk/index.js';

const sdk = new ShopifySummarySDK('http://localhost:3000');

const products = await sdk.getProducts();
const product = await sdk.getProductById(products[0].id);
const stats = await sdk.getStats();

console.log(products.length, product.title, stats);
```

To test:
```bash
npm run sdk:example
```

---

## Notes

- Uses **Shopify GraphQL Admin API**
- Reads credentials from **main.db**
- Has simple in-memory caching
- Written in **TypeScript** using **Express**
- Tested locally and returns correct JSON

---

## Scripts

| Command | Description |
|----------|-------------|
| `npm run dev` | Run the API in watch mode |
| `npm run build` | Build the TypeScript code |
| `npm start` | Run compiled server |
| `npm run sdk:example` | Run the SDK test |
| `npm run lint` | Check code style |

---

## Personal Notes

Had to fix an issue with store URL formatting (`https://http://` duplicate).  
After cleaning that up, all endpoints and SDK calls worked fine.
