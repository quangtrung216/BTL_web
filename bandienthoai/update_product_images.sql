-- Update product image URLs to use web-relative paths instead of absolute file paths
UPDATE products SET image_url = '/images/products/matcha.jpg' WHERE id = 9;

-- You can also update other products if needed
-- UPDATE products SET image_url = '/images/products/product1.jpg' WHERE id = 1;
-- UPDATE products SET image_url = '/images/products/product2.jpg' WHERE id = 2;
-- etc.
