insert into products (platform, external_id, title, url, image_url, category, price, original_price, rating, review_count, sold_count, stock_count, shop_name, shop_url, uploaded_at)
values
  ('shopee', 'ext-shopee-001', 'Serum Glass Skin Niacinamide viral Shopee 1', 'https://example.com/shopee/product/1', 'https://placehold.co/480x480/111827/67e8f9?text=Beauty', 'Beauty', 89000, 109000, 4.8, 1420, 2630, 118, 'Official Jakarta Beauty', 'https://example.com/shopee/shop/1', now() - interval '6 days'),
  ('tokopedia', 'ext-tokopedia-002', 'Holder Magnet Mobil 360 premium Tokopedia 2', 'https://example.com/tokopedia/product/2', 'https://placehold.co/480x480/111827/67e8f9?text=Aksesori%20HP', 'Aksesori HP', 45000, 59000, 4.7, 850, 1840, 286, 'Gudang Bandung AksesoriHP', 'https://example.com/tokopedia/shop/2', now() - interval '10 days'),
  ('tiktok_shop', 'ext-tiktok-003', 'Air Fryer Silicone Liner reseller TikTok Shop 3', 'https://example.com/tiktok_shop/product/3', 'https://placehold.co/480x480/111827/67e8f9?text=Kitchen%20Tools', 'Kitchen Tools', 39000, 49000, 4.9, 910, 3210, 402, 'Sentra Surabaya KitchenTools', 'https://example.com/tiktok_shop/shop/3', now() - interval '3 days');

insert into stores (platform, external_id, name, url, rating, follower_count, product_count)
values
  ('shopee', 'store-001', 'Official Jakarta Beauty', 'https://example.com/store/1', 4.8, 18320, 86),
  ('tokopedia', 'store-002', 'Gudang Bandung Aksesori', 'https://example.com/store/2', 4.7, 12110, 64);
