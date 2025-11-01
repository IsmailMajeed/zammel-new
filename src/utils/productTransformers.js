/**
 * Transform backend product data to frontend format
 */
export function transformProductForFrontend(product) {
  if (!product) return null;

  // Get first available variant for pricing and images
  const firstVariant = product.variants?.[0] || {};

  // Get all sizes and colors from variants
  const sizes = [...new Set(product.variants?.map(v => v.size).filter(Boolean) || [])];
  const colors = [...new Set(product.variants?.map(v => v.color).filter(Boolean) || [])];

  // Calculate prices (backend stores price in PKR, frontend expects paisa)
  const basePrice = firstVariant.price || 0;
  const priceInPaisa = Math.round(basePrice * 100); // Convert PKR to paisa

  // Calculate compareAtPrice (original price before discount)
  const discount = firstVariant.discount || 0;
  const compareAtPriceInPaisa = discount > 0
    ? Math.round(priceInPaisa / (1 - discount / 100))
    : priceInPaisa;

  // Get images - use first variant's images or fallback
  const images = firstVariant.images || [];
  const image = images[0] || '/placeholder-product.jpg';
  const hoverImage = images[1] || image;

  // Determine badge
  let badge = 'new';
  if (product.tags?.includes('sale')) {
    badge = 'sale';
  } else if (product.featured) {
    badge = 'featured';
  }

  return {
    id: product._id || product.id,
    title: product.name,
    price: priceInPaisa,
    compareAtPrice: discount > 0 ? compareAtPriceInPaisa : null,
    discountPercentage: discount,
    image,
    hoverImage,
    images,
    sizes,
    colors,
    description: product.description || '',
    badge,
    // Store full product data for detail page
    _fullData: product
  };
}

/**
 * Transform product for detail page (includes all variants)
 */
export function transformProductForDetail(product) {
  if (!product) return null;

  const transformed = transformProductForFrontend(product);

  // Add variant-specific data
  transformed.variants = product.variants?.map(variant => ({
    color: variant.color,
    colorCode: variant.colorCode,
    size: variant.size,
    price: Math.round((variant.price || 0) * 100), // Convert to paisa
    compareAtPrice: variant.discount > 0
      ? Math.round((variant.price || 0) * 100 / (1 - variant.discount / 100))
      : null,
    discount: variant.discount || 0,
    quantity: variant.quantity || 0,
    sku: variant.sku,
    images: variant.images || [],
    available: (variant.quantity || 0) > 0
  })) || [];

  // Add features/tags
  transformed.features = product.tags || [];

  return transformed;
}

/**
 * Get product variant by color and size
 */
export function getVariantByColorAndSize(product, color, size) {
  if (!product?.variants) return null;

  return product.variants.find(
    v => v.color?.toLowerCase() === color?.toLowerCase() &&
      v.size === size
  ) || product.variants[0];
}

