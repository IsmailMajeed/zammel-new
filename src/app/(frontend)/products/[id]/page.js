'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Heart, ShoppingCart, Minus, Plus, ArrowLeft, Star, Truck, Shield, RotateCcw } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { addToCart } from '@/redux/slices/Cart';
import { addToWishlist, removeFromWishlist } from '@/redux/slices/Wishlist';
import { toast } from 'sonner';
import { BRAND } from '@/utils/brandConstants';

// Sample product data - in real app this would come from API
const productData = {
  'hoodie-pack-of-2': {
    id: 'hoodie-pack-of-2',
    title: 'Hoodie- Pack of 2',
    price: 299900,
    compareAtPrice: 500000,
    discountPercentage: 40,
    image: 'https://mettwear.com/cdn/shop/files/PO2_Hoodie.jpg?v=1730314234',
    hoverImage: 'https://mettwear.com/cdn/shop/files/mettwear-Hoodie-white.jpg?v=1696799478',
    images: [
      'https://mettwear.com/cdn/shop/files/PO2_Hoodie.jpg?v=1730314234',
      'https://mettwear.com/cdn/shop/files/mettwear-Hoodie-white.jpg?v=1696799478',
      'https://mettwear.com/cdn/shop/files/mettwear-Hoodie-Black.jpg?v=1696798486',
      'https://mettwear.com/cdn/shop/files/mettwear-Hoodie-CharcoalGrey.jpg?v=1696798670'
    ],
    sizes: ['M', 'L', 'XL'],
    colors: ['Black', 'White', 'Charcoal Gray', 'Navy Blue'],
    description: 'Premium quality hoodie pack of 2. Made with the finest materials for ultimate comfort and style. Perfect for casual wear and outdoor activities.',
    features: [
      'Premium cotton blend material',
      'Comfortable fit',
      'Durable construction',
      'Machine washable',
      'Available in multiple colors'
    ],
    badge: 'sale'
  },
  'hoodie-black': {
    id: 'hoodie-black',
    title: 'Hoodie-Black',
    price: 185000,
    compareAtPrice: 280000,
    discountPercentage: 34,
    image: 'https://mettwear.com/cdn/shop/files/mettwear-Hoodie-Black.jpg?v=1696798486',
    images: [
      'https://mettwear.com/cdn/shop/files/mettwear-Hoodie-Black.jpg?v=1696798486',
      'https://mettwear.com/cdn/shop/files/mettwear-Hoodie-white.jpg?v=1696799478'
    ],
    sizes: ['M', 'L', 'XL'],
    colors: ['Black'],
    description: 'Classic black hoodie with premium quality material. Perfect for everyday wear and casual outings.',
    features: [
      'Premium cotton blend',
      'Classic black color',
      'Comfortable hood',
      'Kangaroo pocket',
      'Ribbed cuffs and hem'
    ],
    badge: 'sale'
  }
};

export default function ProductPage({ params }) {
  const [selectedSize, setSelectedSize] = useState('M');
  const [selectedColor, setSelectedColor] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);

  const dispatch = useDispatch();
  const { items: wishlistItems } = useSelector(state => state.wishlist);

  const product = productData[params.id] || productData['hoodie-pack-of-2'];
  const isInWishlist = wishlistItems.some(item => item.id === product.id);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-PK', {
      style: 'currency',
      currency: 'PKR',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const handleAddToCart = () => {
    dispatch(addToCart({
      id: product.id,
      name: product.title,
      price: product.price,
      images: product.images,
      brand: BRAND.name,
      size: selectedSize,
      color: product.colors[selectedColor]
    }));
    toast.success('Added to cart', { description: product.title });
  };

  const handleWishlistToggle = () => {
    if (isInWishlist) {
      dispatch(removeFromWishlist(product.id));
      toast('Removed from wishlist', { description: product.title });
    } else {
      dispatch(addToWishlist(product));
      toast.success('Added to wishlist', { description: product.title });
    }
  };

  const handleQuantityChange = (newQuantity) => {
    if (newQuantity >= 1 && newQuantity <= 10) {
      setQuantity(newQuantity);
    }
  };

  return (
    <main className="min-h-screen bg-white py-5">
      <div className="container py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden">
              <Image
                src={product.images[selectedImage]}
                alt={product.title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />

              {/* Product Badge */}
              <div className="absolute top-4 left-4">
                {product.badge === 'sale' && (
                  <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                    -{product.discountPercentage}%
                  </span>
                )}
              </div>
            </div>

            {/* Thumbnail Images */}
            <div className="grid grid-cols-4 gap-2">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
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
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.title}</h1>
              <div className="flex items-center space-x-4 mb-4">
                <div className="flex items-center space-x-2">
                  {product.compareAtPrice && product.compareAtPrice > product.price ? (
                    <>
                      <span className="text-2xl font-bold text-gray-900">
                        {formatPrice(product.price)}
                      </span>
                      <span className="text-lg text-gray-500 line-through">
                        {formatPrice(product.compareAtPrice)}
                      </span>
                    </>
                  ) : (
                    <span className="text-2xl font-bold text-gray-900">
                      {formatPrice(product.price)}
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
            {product.colors && product.colors.length > 1 && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Colors</h3>
                <div className="flex space-x-2">
                  {product.colors.map((color, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedColor(index)}
                      className={`px-4 py-2 border rounded-lg transition-colors ${selectedColor === index
                        ? 'border-gray-900 bg-gray-900 text-white'
                        : 'border-gray-300 text-gray-700 hover:border-gray-400'
                        }`}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Sizes */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Size</h3>
              <div className="flex space-x-2">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`w-12 h-12 border rounded-lg transition-colors ${selectedSize === size
                      ? 'border-gray-900 bg-gray-900 text-white'
                      : 'border-gray-300 text-gray-700 hover:border-gray-400'
                      }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Quantity</h3>
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => handleQuantityChange(quantity - 1)}
                  disabled={quantity <= 1}
                  className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="text-lg font-semibold w-8 text-center">{quantity}</span>
                <button
                  onClick={() => handleQuantityChange(quantity + 1)}
                  disabled={quantity >= 10}
                  className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <button
                onClick={handleAddToCart}
                className="w-full bg-gray-900 text-white py-3 px-6 rounded-lg hover:bg-gray-800 transition-colors flex items-center justify-center space-x-2"
              >
                <ShoppingCart className="w-5 h-5" />
                <span>Add to Cart</span>
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
            </div>

            {/* Features */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Features</h3>
              <ul className="space-y-2">
                {product.features.map((feature, index) => (
                  <li key={index} className="flex items-center space-x-2 text-gray-600">
                    <div className="w-1.5 h-1.5 bg-gray-400 rounded-full" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
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
        <div className="mt-16 border-t py-10">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">You might also like</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {Object.values(productData).slice(0, 4).map((relatedProduct) => (
              <div key={relatedProduct.id} className="group">
                <Link href={`/products/${relatedProduct.id}`}>
                  <div className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden mb-3">
                    <Image
                      src={relatedProduct.image}
                      alt={relatedProduct.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                    />
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
      </div>
    </main>
  );
}
