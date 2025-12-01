// 'use client';

// import Link from 'next/link';
// import { ArrowRight, CreditCard, Trash2, MessageCircle, Clock } from 'lucide-react';
// import { useDispatch, useSelector } from 'react-redux';
// import { clearCart } from '@/redux/slices/Cart';
// import CouponCode from './CouponCode';
// import { BRAND } from '@/utils/brandConstants';

// export default function OrderSummary() {
//     const dispatch = useDispatch();
//     const { items, couponCode, discount } = useSelector(state => state.cart);

//     const formatPrice = (price) => {
//         return new Intl.NumberFormat('en-PK', {
//             style: 'currency',
//             currency: 'PKR',
//             minimumFractionDigits: 0,
//         }).format(Math.round(price));
//     };

//     const handleClearCart = () => {
//         dispatch(clearCart());
//     };

//     const subtotal = items.reduce((runningTotal, item) => runningTotal + (item.price * item.quantity), 0);
//     const tax = settings?.tax?.value || 0;
//     const finalTotal = subtotal + tax - discount;
//     const estimatedDeliveryCopy = '1-2 working days in Lahore / 3-5 working days nationwide';

//     return (
//         <div className="lg:col-span-1">
//             <div className="bg-card border border-border rounded-lg p-6 sticky top-24">
//                 <h2 className="text-xl font-bold text-foreground mb-6">Order Summary</h2>

//                 {/* Coupon Code */}
//                 <CouponCode />

//                 {/* Order Details */}
//                 <div className="space-y-3 mb-6">
//                     <div className="flex justify-between">
//                         <span className="text-muted-foreground">Subtotal</span>
//                         <span className="text-foreground">{formatPrice(subtotal)}</span>
//                     </div>
//                     <div className="flex justify-between">
//                         <span className="text-muted-foreground">Tax</span>
//                         <span className="text-foreground">{formatPrice(tax)}</span>
//                     </div>
//                     {discount > 0 && (
//                         <div className="flex justify-between text-success">
//                             <span>Discount ({couponCode})</span>
//                             <span>-{formatPrice(discount)}</span>
//                         </div>
//                     )}
//                     <div className="border-t border-border pt-3">
//                         <div className="flex justify-between font-bold text-lg">
//                             <span className="text-foreground">Total</span>
//                             <span className="text-foreground">{formatPrice(finalTotal)}</span>
//                         </div>
//                         <p className="text-xs text-muted-foreground mt-1">
//                             Shipping is calculated at checkout.
//                         </p>
//                     </div>
//                 </div>

//                 {/* Estimated Delivery */}
//                 <div className="mb-4 flex items-start gap-3 rounded-lg border border-blue-100 bg-blue-50 p-4">
//                     <Clock className="w-4 h-4 text-blue-600 mt-0.5" />
//                     <div>
//                         <p className="text-sm font-semibold text-blue-900">Estimated delivery</p>
//                         <p className="text-xs text-blue-700">{estimatedDeliveryCopy}</p>
//                     </div>
//                 </div>

//                 {/* Checkout Button */}
//                 <Link
//                     href="/checkout"
//                     className="mb-4 flex w-full items-center justify-center space-x-2 rounded-lg bg-primary px-6 py-3 font-medium text-primary-foreground transition-colors hover:bg-primary/90"
//                 >
//                     <span>Proceed to Checkout</span>
//                     <ArrowRight className="w-5 h-5" />
//                 </Link>

//                 {/* Clear Cart Button */}
//                 <div className="mb-4 flex justify-center">
//                     <button
//                         onClick={handleClearCart}
//                         className="flex items-center space-x-1 text-sm text-destructive transition-colors hover:text-destructive/80"
//                     >
//                         <Trash2 className="w-4 h-4" />
//                         <span>Clear Cart</span>
//                     </button>
//                 </div>

//                 {/* Payment Methods */}
//                 <div className="text-center">
//                     <p className="mb-2 text-sm text-muted-foreground">We accept</p>
//                     <div className="flex items-center justify-center space-x-2">
//                         <CreditCard className="w-6 h-6 text-muted-foreground" />
//                         <span className="text-sm text-muted-foreground">All major cards</span>
//                     </div>
//                 </div>

//                 {/* WhatsApp Support */}
//                 <a
//                     href={BRAND.social.whatsapp}
//                     target="_blank"
//                     rel="noopener noreferrer"
//                     className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-lg border border-green-500 bg-green-50 px-4 py-2 text-sm font-medium text-green-700 transition-colors hover:bg-green-100"
//                 >
//                     <MessageCircle className="w-4 h-4" />
//                     Need sizing help? Chat on WhatsApp
//                 </a>
//             </div>
//         </div>
//     );
// }
