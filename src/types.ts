export type Product = {
  id: string;        // Shopify GID
  title: string;
  price: number;     // minVariantPrice.amount
  inventory: number; // totalInventory
  created_at: string;
};

export type ProductStats = {
  total_products: number;
  total_inventory: number;
  average_price: number;
};
