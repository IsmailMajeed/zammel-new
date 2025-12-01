'use client';

import { useState, useMemo, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams, usePathname } from 'next/navigation';
import { Heart, ShoppingCart, Minus, Plus, ArrowLeft, Star, Truck, Shield, RotateCcw, MessageCircle, Ruler, ChevronLeft, ChevronRight } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { addToCart } from '@/redux/slices/Cart';
import { addToWishlist, removeFromWishlist } from '@/redux/slices/Wishlist';
import { useGetProductByIdQuery, useGetProductsQuery } from '@/redux/api/Products';
import { toast } from 'sonner';
import { BRAND } from '@/utils/brandConstants';
import { transformProductForDetail, getVariantByColorAndSize } from '@/utils/productTransformers';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

const DEFAULT_PRODUCT_META = {
  fabric: 'Premium fleece (80% cotton / 20% polyester)',
  weight: '320 GSM brushed interior',
  fit: 'Relaxed, true-to-size silhouette',
  care: [
    'Machine wash cold, inside out',
    'Use mild detergent & similar colours',
    'Do not bleach or tumble dry',
    'Steam/iron on low from inside',
  ],
};

const SIZE_CHART_REFERENCE = {
  XS: { chest: '19"', length: '26"', sleeve: '23"' },
  S: { chest: '20"', length: '27"', sleeve: '24"' },
  M: { chest: '21"', length: '28"', sleeve: '24.5"' },
  L: { chest: '22"', length: '29"', sleeve: '25"' },
  XL: { chest: '23.5"', length: '30"', sleeve: '25.5"' },
  XXL: { chest: '25"', length: '31"', sleeve: '26"' },
  '3XL': { chest: '26.5"', length: '32"', sleeve: '26.5"' },
};

const CarouselArrow = ({ direction, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    aria-label={direction === 'prev' ? 'Previous image' : 'Next image'}
    className={`absolute top-1/2 -translate-y-1/2 z-20 bg-white/90 hover:bg-white shadow-lg rounded-full p-2 sm:p-3 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-900/60 ${direction === 'prev' ? 'left-3 sm:left-4' : 'right-3 sm:right-4'}`}
  >
    {direction === 'prev' ? <ChevronLeft className="w-5 h-5 text-gray-900" /> : <ChevronRight className="w-5 h-5 text-gray-900" />}
  </button>
);

export default function ProductPage() {
  const params = useParams();
  const pathname = usePathname();
  const productId = params?.id;

  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [isSizeChartOpen, setIsSizeChartOpen] = useState(false);
  const sliderRef = useRef(null);

  const dispatch = useDispatch();
  const { items: wishlistItems } = useSelector(state => state.wishlist);

  const { data: productData, isLoading, isError } = useGetProductByIdQuery(productId);
  const { data: relatedProductsData } = useGetProductsQuery({
    status: 'active',
    limit: 4,
    page: 1
  });

  const product = useMemo(() => {
    if (!productData?.data) return null;
    return transformProductForDetail(productData.data);
  }, [productData]);

  // Get available sizes for selected color
  const availableSizesForColor = useMemo(() => {
    if (!product?._fullData || !selectedColor) return product?.sizes || [];
    const colorVariants = product._fullData.variants?.filter(v =>
      v.color?.toLowerCase() === selectedColor?.toLowerCase()
    ) || [];
    const sizes = [...new Set(colorVariants.map(v => v.size).filter(Boolean))];
    return sizes;
  }, [product, selectedColor]);

  // Set default size and color
  useEffect(() => {
    if (product && !selectedColor && product.colors.length > 0) {
      setSelectedColor(product.colors[0]);
    }
  }, [product]);

  // Auto-adjust size when color changes
  useEffect(() => {
    if (selectedColor && product?._fullData) {
      // If current size is not available for selected color, switch to first available
      if (selectedSize && !availableSizesForColor.includes(selectedSize)) {
        if (availableSizesForColor.length > 0) {
          setSelectedSize(availableSizesForColor[0]);
        }
      } else if (!selectedSize && availableSizesForColor.length > 0) {
        setSelectedSize(availableSizesForColor[0]);
      }
    }
  }, [selectedColor, availableSizesForColor, product]);

  const isInWishlist = product ? wishlistItems.some(item => item.id === product.id) : false;

  // Get current variant based on selected color and size
  const currentVariant = useMemo(() => {
    if (!product?._fullData) return null;
    return getVariantByColorAndSize(product._fullData, selectedColor, selectedSize);
  }, [product, selectedColor, selectedSize]);

  // Get images for current variant
  const currentImages = useMemo(() => {
    if (currentVariant?.images?.length > 0) {
      return currentVariant.images;
    }
    return product?.images || [];
  }, [currentVariant, product]);

  useEffect(() => {
    if (currentImages.length === 0) {
      setSelectedImage(0);
      return;
    }
    if (selectedImage >= currentImages.length) {
      setSelectedImage(0);
      sliderRef.current?.slickGoTo(0);
    }
  }, [currentImages, selectedImage]);

  const sliderSettings = useMemo(() => ({
    dots: false,
    arrows: currentImages.length > 1,
    infinite: currentImages.length > 1,
    autoplay: currentImages.length > 1,
    autoplaySpeed: 4000,
    pauseOnHover: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    adaptiveHeight: true,
    swipe: true,
    prevArrow: currentImages.length > 1 ? <CarouselArrow direction="prev" /> : null,
    nextArrow: currentImages.length > 1 ? <CarouselArrow direction="next" /> : null,
  }), [currentImages.length]);

  // Get price for current variant
  const currentPrice = useMemo(() => {
    if (currentVariant) {
      // currentVariant.price is already in PKR (from raw backend data)
      const originalPrice = currentVariant.price || 0;
      const discount = currentVariant.discount || 0;

      // Apply discount: final price = original * (1 - discount/100)
      const finalPrice = discount > 0
        ? Math.round(originalPrice * (1 - discount / 100))
        : Math.round(originalPrice);

      return finalPrice;
    }
    return product?.price || 0; // product.price is already in PKR from transformer
  }, [currentVariant, product]);

  // Get compare at price for current variant (original price before discount)
  const currentCompareAtPrice = useMemo(() => {
    if (currentVariant && currentVariant.discount > 0) {
      const originalPrice = currentVariant.price || 0;
      return Math.round(originalPrice);
    }
    return product?.compareAtPrice || null;
  }, [currentVariant, product]);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-PK', {
      style: 'currency',
      currency: 'PKR',
      minimumFractionDigits: 0,
    }).format(Math.round(price));
  };

  const { items: cartItems } = useSelector(state => state.cart);

  // Check cart quantity for this variant
  const cartItemId = `${product?.id}-${selectedColor}-${selectedSize}`;
  const cartQuantity = product ? cartItems.find(item => item.id === cartItemId)?.quantity || 0 : 0;
  const availableStock = currentVariant ? (currentVariant.quantity || 0) - cartQuantity : 0;
  const maxQuantityAllowed = Math.min(quantity, availableStock);

  const fabricBlend = product?.fabric || DEFAULT_PRODUCT_META.fabric;
  const garmentWeight = product?.gsm ? `${product?.gsm} GSM brushed fleece`
    : DEFAULT_PRODUCT_META.weight;
  const fitNote = product?.fit || DEFAULT_PRODUCT_META.fit;
  const careInstructionsList = useMemo(() => {
    if (Array.isArray(product?.careInstructions) && product.careInstructions.length > 0) {
      return product.careInstructions;
    }
    return DEFAULT_PRODUCT_META.care;
  }, [product]);

  const sizeChartRows = useMemo(() => {
    const normalizeSizeChart = (chart) => chart
      .filter(row => row?.size)
      .map(row => ({
        size: row.size,
        metrics: {
          chest: `${row.chest}"` || '-',
          length: `${row.length}"` || '-',
          sleeve: `${row.sleeve}"` || '-',
        }
      }));

    if (Array.isArray(product?.sizeChart) && product.sizeChart.length > 0) {
      return normalizeSizeChart(product.sizeChart);
    }

    const uniqueSizes = Array.from(new Set(product?.sizes || []));
    const sizesToUse = uniqueSizes.length > 0 ? uniqueSizes : Object.keys(SIZE_CHART_REFERENCE);
    return sizesToUse
      .map(size => ({ size, metrics: SIZE_CHART_REFERENCE[size] }))
      .filter(row => row.metrics);
  }, [product?.sizeChart, product?.sizes]);

  const handleAddToCart = () => {
    if (!product || !currentVariant) return;

    if (!selectedSize || !selectedColor) {
      toast.error('Please select size and color');
      return;
    }

    if (currentVariant.quantity <= 0) {
      toast.error('Out of Stock', { description: 'This product variant is currently out of stock' });
      return;
    }

    if (availableStock <= 0) {
      toast.error('Stock Limit Reached', {
        description: `Only ${currentVariant.quantity} item(s) available. Please reduce quantity in cart or select a different variant.`
      });
      return;
    }

    if (quantity > availableStock) {
      toast.error('Insufficient Stock', {
        description: `Only ${availableStock} item(s) available. Please adjust quantity.`
      });
      return;
    }

    dispatch(addToCart({
      id: cartItemId,
      productId: product.id,
      name: product.title,
      price: currentPrice,
      images: currentImages,
      brand: BRAND.name,
      size: selectedSize,
      color: selectedColor,
      quantity,
      maxQuantity: currentVariant.quantity,
      variant: currentVariant
    }));
    toast.success('Added to cart', { description: `${product.title} (${selectedSize}, ${selectedColor})` });
  };

  const handleWishlistToggle = () => {
    if (!product) return;

    if (isInWishlist) {
      dispatch(removeFromWishlist(product.id));
      toast('Removed from wishlist', { description: product.title });
    } else {
      dispatch(addToWishlist(product));
      toast.success('Added to wishlist', { description: product.title });
    }
  };

  const handleQuantityChange = (newQuantity) => {
    const maxQuantity = Math.min(availableStock, currentVariant?.quantity || 0);
    if (newQuantity >= 1 && newQuantity <= maxQuantity) {
      setQuantity(newQuantity);
    } else if (newQuantity > maxQuantity) {
      toast.error('Insufficient Stock', {
        description: `Only ${availableStock} item(s) available.`
      });
    }
  };

  // 🟢 WhatsApp Message Generation
  // To get the full URL of the product page:
  let productPageUrl = '';
  if (typeof window !== 'undefined') {
    productPageUrl = window.location.origin + pathname;
  }
  // Fallback (for SSR/SSG, fallback to a best guess, Next.js version agnostic)
  if (!productPageUrl && typeof window === 'undefined' && process.env.NEXT_PUBLIC_SITE_URL) {
    productPageUrl = process.env.NEXT_PUBLIC_SITE_URL + pathname;
  }

  // WhatsApp message content
  const whatsappDefaultMessage = useMemo(() => {
    const parts = [
      "Hi, I'm interested in this product.",
      product?.title ? `Product: ${product.title}` : "",
      productPageUrl ? productPageUrl : "",
      "",
      "I have a question about size, delivery, or fabric."
    ].filter(Boolean).join('\n');
    return encodeURIComponent(parts);
  }, [product?.title, productPageUrl]);

  const whatsappLink = useMemo(() => {
    // Remove trailing slash if present in phone
    let phone = BRAND.social.whatsapp.replace(/[^0-9]/g, '');
    if (phone.startsWith('92') || phone.startsWith('03')) {
      // Already formatted
    } else if (phone.length === 11 && phone.startsWith('3')) {
      phone = '92' + phone;
    }
    return `https://wa.me/${phone}?text=${whatsappDefaultMessage}`;
  }, [whatsappDefaultMessage]);

  if (isLoading) {
    return (
      <main className="min-h-screen bg-white py-5">
        <div className="container py-8">
          <div className="flex justify-center items-center min-h-[60vh]">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
          </div>
        </div>
      </main>
    );
  }

  if (isError || !product) {
    return (
      <main className="min-h-screen bg-white py-5">
        <div className="container py-8">
          <div className="text-center py-12">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Product Not Found</h1>
            <p className="text-gray-600 mb-6">The product you're looking for doesn't exist or has been removed.</p>
            <Link href="/" className="text-blue-600 hover:text-blue-800">
              <ArrowLeft className="inline w-4 h-4 mr-2" />
              Back to Home
            </Link>
          </div>
        </div>
      </main>
    );
  }

  const relatedProducts = relatedProductsData?.data?.products
    ?.map(p => transformProductForDetail(p))
    .filter(p => p && p.id !== product.id)
    .slice(0, 4) || [];

  return (
    <main className="min-h-screen bg-white py-5">
      <div className="container py-8">
        <Link href="/" className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Products
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="sticky top-[80px] z-30">
              <div className="relative bg-gray-100 rounded-2xl overflow-hidden">
                {currentImages.length > 0 ? (
                  <Slider
                    {...sliderSettings}
                    ref={sliderRef}
                    beforeChange={(_, next) => setSelectedImage(next)}
                  >
                    {currentImages.map((imgSrc, index) => (
                      <div key={`${imgSrc}-${index}`}>
                        <div className="relative w-full h-[70vw] min-h-[320px] sm:h-[500px] lg:h-[640px]">
                          <Image
                            src={imgSrc}
                            alt={`${product.title} view ${index + 1}`}
                            fill
                            className="object-cover"
                            sizes="(max-width: 768px) 100vw, 50vw"
                            priority={index === 0}
                          />
                        </div>
                      </div>
                    ))}
                  </Slider>
                ) : (
                  <div className="aspect-square bg-gray-100 rounded-2xl" />
                )}

                {/* Product Badge */}
                <div className="absolute top-4 left-4 z-10">
                  {product.badge === 'sale' && currentVariant?.discount > 0 && (
                    <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                      -{currentVariant.discount}%
                    </span>
                  )}
                  {product.badge === 'new' && (
                    <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                      NEW
                    </span>
                  )}
                </div>
              </div>

              {/* Thumbnail Images */}
              {currentImages.length > 1 && (
                <div className="grid grid-cols-4 gap-2">
                  {currentImages.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        setSelectedImage(index);
                        sliderRef.current?.slickGoTo(index);
                      }}
                      className={`relative aspect-square bg-gray-100 rounded-lg overflow-hidden border-2 transition-colors ${selectedImage === index ? 'border-gray-900' : 'border-transparent'
                        }`}
                    >
                      <Image
                        src={image}
                        alt={`${product.title} ${index + 1}`}
                        fill
                        className="object-cover"
                        sizes="100px"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.title}</h1>
              <div className="flex items-center space-x-4 mb-4">
                <div className="flex items-center space-x-2">
                  {currentCompareAtPrice && currentCompareAtPrice > currentPrice ? (
                    <>
                      <span className="text-2xl font-bold text-gray-900">
                        {formatPrice(currentPrice)}
                      </span>
                      <span className="text-lg text-gray-500 line-through">
                        {formatPrice(currentCompareAtPrice)}
                      </span>
                    </>
                  ) : (
                    <span className="text-2xl font-bold text-gray-900">
                      {formatPrice(currentPrice)}
                    </span>
                  )}
                </div>
                <div className="flex items-center space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                  ))}
                  <span className="text-sm text-gray-500 ml-1">(4.8)</span>
                </div>
              </div>
            </div>

            {/* Description */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Description</h3>
              <p className="text-gray-600 leading-relaxed">{product.description}</p>
            </div>

            {/* Colors */}
            {product.colors && product.colors.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  Colors ({product.colors.length} {product.colors.length === 1 ? 'option' : 'options'})
                </h3>
                <div className="flex flex-wrap gap-3">
                  {product.colors.map((color, index) => {
                    // Find any variant with this color to get colorCode
                    const colorVariant = product._fullData?.variants?.find(v =>
                      v.color?.toLowerCase() === color?.toLowerCase()
                    );

                    // Check if this color has any available stock across all sizes
                    const colorVariants = product._fullData?.variants?.filter(v =>
                      v.color?.toLowerCase() === color?.toLowerCase()
                    ) || [];
                    const hasAvailableStock = colorVariants.some(v => (v.quantity || 0) > 0);
                    const colorCode = colorVariant?.colorCode;

                    return (
                      <button
                        key={index}
                        onClick={() => {
                          setSelectedColor(color);
                          setSelectedImage(0);
                          sliderRef.current?.slickGoTo(0);
                        }}
                        className={`relative group flex items-center space-x-2 px-4 py-2 border-2 rounded-lg transition-all ${selectedColor === color
                          ? 'border-gray-900 bg-gray-50 shadow-md scale-105'
                          : 'border-gray-300 hover:border-gray-500 hover:shadow-sm'
                          } ${!hasAvailableStock ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                        disabled={!hasAvailableStock}
                        title={!hasAvailableStock ? 'Out of stock' : `Select ${color}`}
                      >
                        {/* Color Swatch */}
                        <div
                          className={`w-6 h-6 rounded-full border-2 ${selectedColor === color ? 'border-gray-900' : 'border-gray-300'
                            }`}
                          style={{
                            backgroundColor: colorCode || 'transparent',
                            backgroundImage: !colorCode ? 'linear-gradient(45deg, #ccc 25%, transparent 25%), linear-gradient(-45deg, #ccc 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #ccc 75%), linear-gradient(-45deg, transparent 75%, #ccc 75%)' : 'none',
                            backgroundSize: '8px 8px',
                            backgroundPosition: '0 0, 0 4px, 4px -4px, -4px 0px'
                          }}
                        />
                        {/* Color Name */}
                        <span className={`font-medium ${selectedColor === color ? 'text-gray-900' : 'text-gray-700'
                          }`}>
                          {color}
                        </span>
                        {/* Selected Indicator */}
                        {selectedColor === color && (
                          <svg className="w-4 h-4 text-gray-900" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        )}
                        {/* Out of Stock Badge */}
                        {!hasAvailableStock && (
                          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full">
                            Out
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Sizes */}
            {selectedColor && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  Size {availableSizesForColor.length > 0 && (
                    <span className="text-sm font-normal text-gray-500">
                      ({availableSizesForColor.length} {availableSizesForColor.length === 1 ? 'option' : 'options'})
                    </span>
                  )}
                </h3>
                {availableSizesForColor.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {availableSizesForColor.map((size) => {
                      // Get variant for this color and size to check stock
                      const sizeVariant = product._fullData?.variants?.find(v =>
                        v.color?.toLowerCase() === selectedColor?.toLowerCase() &&
                        v.size === size
                      );
                      const hasStock = (sizeVariant?.quantity || 0) > 0;

                      return (
                        <button
                          key={size}
                          onClick={() => setSelectedSize(size)}
                          disabled={!hasStock}
                          className={`w-12 h-12 border-2 rounded-lg transition-all font-medium ${selectedSize === size
                            ? 'border-gray-900 bg-gray-900 text-white shadow-md scale-105'
                            : 'border-gray-300 text-gray-700 hover:border-gray-500 hover:shadow-sm'
                            } ${!hasStock ? 'opacity-50 cursor-not-allowed line-through' : 'cursor-pointer'}`}
                          title={!hasStock ? 'Out of stock' : `Select ${size}`}
                        >
                          {size}
                        </button>
                      );
                    })}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">No sizes available for this color</p>
                )}
                <div className="mt-4 flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setIsSizeChartOpen(prev => !prev)}
                    className="inline-flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-800"
                  >
                    <Ruler className="w-4 h-4" />
                    {isSizeChartOpen ? 'Hide size chart' : 'View in-product size chart'}
                  </button>
                  <Link href="/size-guide" className="text-xs text-gray-500 hover:text-gray-800 underline">
                    Full size guide
                  </Link>
                </div>
                {isSizeChartOpen && (
                  <div className="mt-4 overflow-x-auto rounded-lg border border-gray-200">
                    <table className="min-w-full text-sm text-left">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-2 font-semibold text-gray-600">Size</th>
                          <th className="px-4 py-2 font-semibold text-gray-600">Chest</th>
                          <th className="px-4 py-2 font-semibold text-gray-600">Length</th>
                          <th className="px-4 py-2 font-semibold text-gray-600">Sleeve</th>
                        </tr>
                      </thead>
                      <tbody>
                        {sizeChartRows.map(({ size, metrics }) => (
                          <tr key={size} className="border-t border-gray-100">
                            <td className="px-4 py-2 font-medium text-gray-900">{size}</td>
                            <td className="px-4 py-2 text-gray-700">{metrics.chest}</td>
                            <td className="px-4 py-2 text-gray-700">{metrics.length}</td>
                            <td className="px-4 py-2 text-gray-700">{metrics.sleeve}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {/* Quantity */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Quantity</h3>
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => handleQuantityChange(quantity - 1)}
                  disabled={quantity <= 1}
                  aria-label="Decrease quantity"
                  className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="text-lg font-semibold w-8 text-center">{quantity}</span>
                <button
                  onClick={() => handleQuantityChange(quantity + 1)}
                  disabled={quantity >= availableStock || availableStock <= 0}
                  aria-label="Increase quantity"
                  className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              {/* {currentVariant && (
                <p className={`text-sm mt-2 ${availableStock > 0 ? 'text-gray-500' : 'text-red-600 font-medium'}`}>
                  {availableStock > 0
                    ? `${availableStock} ${availableStock === 1 ? 'item' : 'items'} available in inventory`
                    : 'Out of stock'}
                  {cartQuantity > 0 && availableStock > 0 && (
                    <span className="block text-xs text-gray-400 mt-1">
                      ({cartQuantity} already in cart)
                    </span>
                  )}
                </p>
              )} */}
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <button
                onClick={handleAddToCart}
                disabled={!currentVariant || availableStock <= 0 || currentVariant.quantity <= 0}
                className={`w-full bg-gray-900 text-white py-3 px-6 rounded-lg hover:bg-gray-800 transition-colors flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed ${!currentVariant || availableStock <= 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <ShoppingCart className="w-5 h-5" />
                <span>
                  {!currentVariant || currentVariant.quantity <= 0
                    ? 'Out of Stock'
                    : availableStock <= 0
                      ? 'Stock Limit Reached'
                      : 'Add to Cart'}
                </span>
              </button>

              <button
                onClick={handleWishlistToggle}
                className={`w-full py-3 px-6 rounded-lg border transition-colors flex items-center justify-center space-x-2 ${isInWishlist
                  ? 'border-red-500 text-red-500 bg-red-50'
                  : 'border-gray-300 text-gray-700 hover:border-gray-400'
                  }`}
              >
                <Heart className={`w-5 h-5 ${isInWishlist ? 'fill-current' : ''}`} />
                <span>{isInWishlist ? 'Remove from Wishlist' : 'Add to Wishlist'}</span>
              </button>

              {/* WhatsApp Button with Default Message and Product Link */}
              <a
                href={whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex w-full items-center justify-center gap-2 rounded-lg border border-green-500 bg-green-50 px-6 py-3 text-sm font-medium text-green-700 hover:bg-green-100 transition-colors"
              >
                <MessageCircle className="w-5 h-5" />
                Ask on WhatsApp (size, delivery, fabric)
              </a>
            </div>

            <div className="rounded-xl border border-blue-100 bg-blue-50 p-4 flex items-start gap-3">
              <Truck className="w-5 h-5 text-blue-600 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-blue-900">Estimated delivery & returns</p>
                <p className="text-xs text-blue-700">
                  1-2 working days in Lahore, 3-5 nationwide. Open parcel + cash on delivery. Easy 7-day exchanges.
                </p>
              </div>
            </div>

            {/* Features */}
            {product.features && product.features.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Features</h3>
                <ul className="space-y-2">
                  {product.features.map((feature, index) => (
                    <li key={index} className="flex items-center space-x-2 text-gray-600">
                      <div className="w-1.5 h-1.5 bg-gray-400 rounded-full" />
                      <span className="capitalize">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Product Details */}
            <div className="rounded-2xl border border-gray-200 p-5 space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Product details</h3>
              <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4 text-sm">
                <div>
                  <dt className="text-xs uppercase tracking-wide text-gray-500">Fabric</dt>
                  <dd className="text-gray-800">{fabricBlend}</dd>
                </div>
                <div>
                  <dt className="text-xs uppercase tracking-wide text-gray-500">Weight</dt>
                  <dd className="text-gray-800">{garmentWeight}</dd>
                </div>
                <div>
                  <dt className="text-xs uppercase tracking-wide text-gray-500">Fit</dt>
                  <dd className="text-gray-800">{fitNote}</dd>
                </div>
                <div>
                  <dt className="text-xs uppercase tracking-wide text-gray-500">Open parcel</dt>
                  <dd className="text-gray-800">Check before you pay on delivery</dd>
                </div>
              </dl>
              <div>
                <h4 className="text-sm font-semibold text-gray-900 mb-2">Care instructions</h4>
                <ul className="list-disc pl-5 space-y-1 text-sm text-gray-600">
                  {careInstructionsList.map((instruction, index) => (
                    <li key={index}>{instruction}</li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-gray-200">
              <div className="text-center">
                <Truck className="w-6 h-6 text-gray-600 mx-auto mb-2" />
                <p className="text-sm text-gray-600">Free Shipping</p>
              </div>
              <div className="text-center">
                <Shield className="w-6 h-6 text-gray-600 mx-auto mb-2" />
                <p className="text-sm text-gray-600">Secure Payment</p>
              </div>
              <div className="text-center">
                <RotateCcw className="w-6 h-6 text-gray-600 mx-auto mb-2" />
                <p className="text-sm text-gray-600">Easy Returns</p>
              </div>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-16 border-t py-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">You might also like</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((relatedProduct) => (
                <div key={relatedProduct.id} className="group">
                  <Link href={`/products/${relatedProduct.id}`}>
                    <div className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden mb-3">
                      {relatedProduct.image && (
                        <Image
                          src={relatedProduct.image}
                          alt={relatedProduct.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                        />
                      )}
                    </div>
                    <h3 className="font-medium text-gray-900 group-hover:text-gray-600 transition-colors">
                      {relatedProduct.title}
                    </h3>
                    <div className="flex items-center space-x-2 mt-1">
                      <span className="font-semibold text-gray-900">
                        {formatPrice(relatedProduct.price)}
                      </span>
                      {relatedProduct.compareAtPrice && (
                        <span className="text-sm text-gray-500 line-through">
                          {formatPrice(relatedProduct.compareAtPrice)}
                        </span>
                      )}
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
