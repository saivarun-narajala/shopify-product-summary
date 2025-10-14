import { Router } from 'express';
import { fetchAllProducts, fetchProductById } from '../shopify.js';
import { Cache } from '../cache.js';
import { CACHE_TTL_MS } from '../env.js';
import type { Product, ProductStats } from '../types.js';

const router = Router();
const cache = new Cache(CACHE_TTL_MS);

function mapNodeToProduct(n: any): Product {
  const price = Number(n?.priceRangeV2?.minVariantPrice?.amount ?? '0');
  const inventory = typeof n?.totalInventory === 'number' ? n.totalInventory : 0;
  return {
    id: n.id,
    title: n.title,
    price,
    inventory,
    created_at: n.createdAt
  };
}

// GET /products
router.get('/products', async (_req, res, next) => {
  try {
    const cached = cache.get<Product[]>('products');
    if (cached) return res.json(cached);

    const nodes = await fetchAllProducts();
    const products = nodes.map(mapNodeToProduct);

    cache.set('products', products);
    res.json(products);
  } catch (err) {
    next(err);
  }
});

// GET /products/:id
router.get('/products/:id', async (req, res, next) => {
  try {
    const gid = decodeURIComponent(req.params.id); // expect a full Shopify GID
    const key = `product:${gid}`;

    const cached = cache.get<any>(key);
    if (cached) return res.json(cached);

    const product = await fetchProductById(gid);
    if (!product) return res.status(404).json({ error: 'Not found' });

    cache.set(key, product);
    res.json(product);
  } catch (err) {
    next(err);
  }
});

// GET /stats
router.get('/stats', async (_req, res, next) => {
  try {
    const cached = cache.get<ProductStats>('stats');
    if (cached) return res.json(cached);

    const nodes = await fetchAllProducts();
    const products = nodes.map(mapNodeToProduct);

    const total_products = products.length;
    const total_inventory = products.reduce((sum, p) => sum + (p.inventory ?? 0), 0);
    const average_price = total_products
      ? Number((products.reduce((s, p) => s + (p.price ?? 0), 0) / total_products).toFixed(2))
      : 0;

    const stats: ProductStats = { total_products, total_inventory, average_price };

    cache.set('stats', stats);
    res.json(stats);
  } catch (err) {
    next(err);
  }
});

export default router;
