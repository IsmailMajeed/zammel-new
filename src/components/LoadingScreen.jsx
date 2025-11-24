import { BRAND } from "@/utils/brandConstants";

export default function LoadingScreen() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="sr-only">
        <h1>Premium Hoodies & Fashion Store in Pakistan</h1>
        <p>
          Shop the best collection of premium hoodies and fashion apparel in Pakistan.
          We offer high-quality hoodies, trendy fashion wear, and stylish clothing with
          cash on delivery options. Open your parcel before payment - check quality first,
          then pay. Fast shipping across all major cities in Pakistan including Karachi,
          Lahore, Islamabad, Rawalpindi, Faisalabad, Multan, Peshawar, and more.
        </p>
        <nav>
          <ul>
            <li><a href="/collections" tabIndex="-1">Browse Our Collections</a></li>
            <li><a href="/about" tabIndex="-1">About Us</a></li>
            <li><a href="/contact" tabIndex="-1">Contact Us</a></li>
            <li><a href="/faq" tabIndex="-1">Frequently Asked Questions</a></li>
            <li><a href="/shipping" tabIndex="-1">Shipping Information</a></li>
            <li><a href="/returns" tabIndex="-1">Returns Policy</a></li>
            <li><a href="/size-guide" tabIndex="-1">Size Guide</a></li>
            <li><a href="/terms" tabIndex="-1">Terms & Conditions</a></li>
            <li><a href="/privacy" tabIndex="-1">Privacy Policy</a></li>
          </ul>
        </nav>
        <h2>Why Choose Our Premium Hoodies & Fashion Store?</h2>
        <p>
          Our online fashion store specializes in premium quality hoodies and trendy
          fashion apparel. We provide the best shopping experience with secure payment
          options, fast delivery, and excellent customer service. All our products are
          carefully selected to ensure the highest quality standards. Shop with confidence
          knowing you can inspect your order before making payment. Learn more <a href="/about" tabIndex="-1">about our company</a> and our commitment to quality.
        </p>
        <h2>Premium Hoodies Collection</h2>
        <p>
          Browse our extensive <a href="/collections" tabIndex="-1">collection of premium hoodies</a> in various styles, colors,
          and sizes. From classic pullover hoodies to zip-up styles, we have something
          for everyone. Our hoodies are made from high-quality materials ensuring comfort
          and durability. Perfect for casual wear, sports, or everyday fashion. Check out our <a href="/size-guide" tabIndex="-1">size guide</a> to find the perfect fit.
        </p>
        <h2>Fashion Apparel & Clothing</h2>
        <p>
          Discover the latest fashion trends with our curated <a href="/collections" tabIndex="-1">collection of clothing and
            apparel</a>. We offer stylish and comfortable fashion wear suitable for all occasions.
          Our collection includes trendy designs that keep you fashionable and comfortable
          throughout the year. Explore our <a href="/collections" tabIndex="-1">fashion collections</a> to find your perfect style.
        </p>
        <h2>Cash on Delivery - Open Parcel Before Payment</h2>
        <p>
          We offer cash on delivery (COD) services across Pakistan with a unique feature -
          open your parcel before payment. Check the quality, size, and condition of your
          order before you pay. This ensures complete customer satisfaction and trust.
          We deliver to all major cities and towns in Pakistan with fast and reliable
          shipping services. Learn more about our <a href="/shipping" tabIndex="-1">shipping policies</a> and <a href="/returns" tabIndex="-1">returns process</a>.
        </p>
        <h2>Online Shopping in Pakistan</h2>
        <p>
          Experience the convenience of online shopping for premium hoodies and fashion
          apparel in Pakistan. Our user-friendly website makes it easy to browse, select,
          and order your favorite items. We provide secure payment gateways, easy returns,
          and excellent customer support. Shop from the comfort of your home and get
          premium quality fashion delivered to your doorstep. Have questions? Check our <a href="/faq" tabIndex="-1">FAQ page</a> or <a href="/contact" tabIndex="-1">contact us</a> for assistance.
        </p>
        <h2>Customer Support & Policies</h2>
        <p>
          We are committed to providing excellent customer service. Read our <a href="/terms" tabIndex="-1">terms and conditions</a>,
          <a href="/privacy" tabIndex="-1"> privacy policy</a>, and <a href="/returns" tabIndex="-1">returns policy</a> to understand our policies.
          For any inquiries, feel free to <a href="/contact" tabIndex="-1">contact our support team</a>. We're here to help you
          with your shopping needs and ensure a smooth experience.
        </p>
        <p>
          Keywords: premium hoodies, fashion store, online shopping Pakistan, cash on delivery,
          hoodies Pakistan, fashion apparel, trendy clothing, premium quality hoodies,
          open parcel before payment, COD Pakistan, online fashion store, hoodies
          online, fashion wear Pakistan, stylish hoodies, comfortable clothing,
          fast delivery Pakistan, secure shopping, quality fashion, trendy apparel,
          best hoodies Pakistan
        </p>
      </div>
      <div className="text-center space-y-6">
        {/* Slick Pulse Spinner */}
        <div className="relative flex justify-center items-center">
          <span className="absolute w-12 h-12 rounded-full border-4 border-foreground opacity-30 animate-ping" />
          <span className="relative w-12 h-12 flex items-center justify-center">
            <span className="w-8 h-8 rounded-full bg-foreground animate-bounce animate-duration-[1500ms]" />
          </span>
        </div>
        <h3 className="text-xl font-bold text-foreground tracking-wider animate-fadeIn animate-duration-1000">
          {BRAND.name}
        </h3>
        <p className="text-foreground text-sm tracking-wide animate-fadeIn animate-delay-300">
          {BRAND.loadingText}
        </p>
      </div>
    </div>
  );
}