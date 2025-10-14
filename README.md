# Shopify Product Summary Microservice

A small Node.js + TypeScript microservice that connects to a Shopify store and provides simple REST endpoints to fetch product data, product details, and store stats.  
Built this as part of the Lucky Orange technical assessment.  

---

## 🧰 Setup & Installation

> ⚠️ Don’t commit the database file. It contains credentials.

1. Unzip the `main.db.zip` file (password is in the email they sent).  
   Place the extracted `main.db` in the root folder of this project.

2. Create a `.env` file in the root with this line:
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
```bash
[shopify] host: luckyorange-interview-test.myshopify.com
API listening on http://localhost:3000
```

---

## 🚀 API Endpoints

### 1️⃣ GET /products
Returns a list of all products (sorted by title).  
Each item has `id`, `title`, `price`, `inventory`, and `created_at`.

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

---

### 2️⃣ GET /products/:id
Returns full details for a single product.

Example:
```json
{
  "id": "gid://shopify/Product/9435036647654",
  "title": "\"404 Not Found\" Coffee Mug",
  "totalInventory": 20,
  "vendor": "LuckyOrange Interview Test",
  "priceRangeV2": { "minVariantPrice": { "amount": "14.99", "currencyCode": "USD" } }
}
```

---

### 3️⃣ GET /stats
Aggregated product summary.

Example:
```json
{
  "total_products": 5,
  "total_inventory": 157,
  "average_price": 33.1
}
```

---

## 🧠 Notes

- Uses **Shopify GraphQL Admin API** (not REST).  
- Credentials are read from `main.db` (table: `shopify_credentials`, `id=1`).  
- Basic in-memory caching added for `/products`, `/stats`, and `/products/:id`.  
- Entire service is written in **TypeScript** for type safety.  
- Framework: **Express.js**  

---

## 🧩 SDK

The SDK wraps the REST endpoints to make them easier to use in Node.js.

```ts
import { ShopifySummarySDK } from './src/sdk/index.js';

const sdk = new ShopifySummarySDK('http://localhost:3000');

const products = await sdk.getProducts();
const oneProduct = await sdk.getProductById(products[0].id);
const stats = await sdk.getStats();

console.log(products.length, oneProduct.title, stats);
```

---

## 🧪 Quick SDK Test

To test it directly:
```bash
npm run sdk:example
```

Expected output:
```yaml
Total products: 5
First product title: "404 Not Found" Coffee Mug
Vendor: LuckyOrange Interview Test
Stats: { total_products: 5, total_inventory: 157, average_price: 33.1 }
```

---

## ⚙️ Scripts

| Command | Description |
|----------|-------------|
| `npm run dev` | Run the API with tsx in watch mode |
| `npm run build` | Compile TypeScript to dist |
| `npm start` | Run compiled server |
| `npm run sdk:example` | Test SDK locally |
| `npm run lint` | Run eslint |

---

## 💡 Personal Notes

- The main hiccup was the **URL normalization** (`https://http://...`), fixed by stripping `http://` or `https://` before calling the Shopify API.  
- Added simple caching to avoid multiple Shopify calls.  
- All endpoints and the SDK were tested locally and return valid JSON responses.
