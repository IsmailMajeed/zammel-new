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

  // Calculate prices (backend stores price in PKR)
  const basePrice = firstVariant.price || 0; // Original price from backend
  const discount = firstVariant.discount || 0;

  // Apply discount to get final price: original * (1 - discount/100)
  const finalPrice = discount > 0
    ? Math.round(basePrice * (1 - discount / 100))
    : Math.round(basePrice);

  // CompareAtPrice is the original price (before discount)
  const compareAtPrice = Math.round(basePrice);

  // Get images - use first variant's images or fallback
  const images = firstVariant.images || [];
  const image = images[0] || '/placeholder-product.jpg';
  const hoverImage = images[1] ? images[1] : image;
  const badge = product.tags?.includes('sale') ? 'sale' : 'new';

  return {
    id: product._id || product.id,
    title: product.name,
    price: finalPrice,
    compareAtPrice: discount > 0 ? compareAtPrice : null,
    discountPercentage: discount,
    image,
    hoverImage,
    images,
    sizes,
    colors,
    description: product.description || '',
    badge,
    tags: Array.isArray(product.tags) ? product.tags : [],
    fabric: product.fabric || null,
    gsm: product.gsm || null,
    fit: product.fit || null,
    careInstructions: Array.isArray(product.careInstructions) ? product.careInstructions : [],
    sizeChart: Array.isArray(product.sizeChart) ? product.sizeChart : [],
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
  transformed.variants = product.variants?.map(variant => {
    const originalPrice = variant.price || 0;
    const discount = variant.discount || 0;

    // Apply discount: final price = original * (1 - discount/100)
    const finalPrice = discount > 0
      ? Math.round(originalPrice * (1 - discount / 100))
      : Math.round(originalPrice);

    return {
      color: variant.color,
      colorCode: variant.colorCode,
      size: variant.size,
      price: finalPrice, // Final price after discount in PKR
      compareAtPrice: discount > 0 ? Math.round(originalPrice) : null, // Original price in PKR
      discount: discount,
      quantity: variant.quantity || 0,
      sku: variant.sku,
      images: variant.images || [],
      available: (variant.quantity || 0) > 0,
      fabric: product.fabric || null,
      gsm: product.gsm || null,
      fit: product.fit || null,
      careInstructions: Array.isArray(product.careInstructions) ? product.careInstructions : [],
      sizeChart: Array.isArray(product.sizeChart) ? product.sizeChart : [],
    };
  }) || [];

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

