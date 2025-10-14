import axios from 'axios';
import { getShopifyCreds } from './db.js';

// Read creds once from SQLite
const { store, access_token } = getShopifyCreds();

// Normalize store: strip protocol and trailing slashes
const raw = (store || '').trim();
const host = raw.replace(/^https?:\/\//i, '').replace(/\/+$/g, '');

// Final Admin GraphQL endpoint
const adminUrl = `https://${host}/admin/api/2024-10/graphql.json`;

// Quick sanity log
console.log('[shopify] host:', host);
console.log('[shopify] adminUrl:', adminUrl);

const http = axios.create({
  baseURL: adminUrl,
  headers: {
    'X-Shopify-Access-Token': access_token,
    'Content-Type': 'application/json',
  },
  timeout: 20_000,
});

type ProductNode = {
  id: string;
  title: string;
  createdAt: string;
  totalInventory: number | null;
  priceRangeV2: { minVariantPrice: { amount: string; currencyCode: string } };
};

type ProductsResp = {
  data: {
    products: {
      edges: { cursor: string; node: ProductNode }[];
      pageInfo: { hasNextPage: boolean; endCursor: string | null };
    };
  };
  errors?: unknown;
};

const PRODUCTS_QUERY = `
  query Products($first: Int!, $after: String) {
    products(first: $first, after: $after, sortKey: TITLE) {
      edges {
        cursor
        node {
          id
          title
          createdAt
          totalInventory
          priceRangeV2 { minVariantPrice { amount currencyCode } }
        }
      }
      pageInfo { hasNextPage endCursor }
    }
  }
`;

export async function fetchAllProducts(): Promise<ProductNode[]> {
  const all: ProductNode[] = [];
  let after: string | null = null;

  // paginate until done
  while (true) {
    const resp = await http.post<ProductsResp>('', {
      query: PRODUCTS_QUERY,
      variables: { first: 100, after },
    });

    if ((resp.data as any).errors) {
      throw new Error(`Shopify GraphQL errors: ${JSON.stringify((resp.data as any).errors)}`);
    }

    const { edges, pageInfo } = resp.data.data.products;
    for (const e of edges) all.push(e.node);

    if (!pageInfo.hasNextPage || !pageInfo.endCursor) break;
    after = pageInfo.endCursor;
  }

  // enforce case-insensitive title sort just in case
  all.sort((a, b) => a.title.localeCompare(b.title, undefined, { sensitivity: 'base' }));
  return all;
}

const PRODUCT_BY_ID_QUERY = `
  query Product($id: ID!) {
    product(id: $id) {
      id
      title
      createdAt
      totalInventory
      description
      status
      vendor
      productType
      tags
      priceRangeV2 {
        minVariantPrice { amount currencyCode }
        maxVariantPrice { amount currencyCode }
      }
      variants(first: 50) {
        edges {
          node {
            id
            title
            sku
            price
            inventoryQuantity
            createdAt
          }
        }
      }
      images(first: 10) {
        edges { node { id altText originalSrc: url } }
      }
    }
  }
`;

type ProductByIdResp = {
  data: { product: any | null };
  errors?: unknown;
};

export async function fetchProductById(id: string) {
  const resp = await http.post<ProductByIdResp>('', {
    query: PRODUCT_BY_ID_QUERY,
    variables: { id },
  });

  if ((resp.data as any).errors) {
    throw new Error(`Shopify GraphQL errors: ${JSON.stringify((resp.data as any).errors)}`);
  }

  return resp.data.data.product;
}
