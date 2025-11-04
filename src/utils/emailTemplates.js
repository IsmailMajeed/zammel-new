import BRAND from './brandConstants.js';

/**
 * Generate order confirmation email HTML
 */
export const getOrderConfirmationEmail = (order) => {
  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-PK', {
      style: 'currency',
      currency: 'PKR',
      minimumFractionDigits: 0,
    }).format(Math.round(price || 0));
  };

  const customerName = `${order.shippingAddress?.firstName || ''} ${order.shippingAddress?.lastName || ''}`.trim() || 'Customer';

  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            margin: 0;
            padding: 0;
            background-color: #f4f4f4;
          }
          .container {
            max-width: 600px;
            margin: 0 auto;
            background-color: white;
          }
          .header {
            background-color: #1f2937;
            color: white;
            padding: 30px;
            text-align: center;
          }
          .header h1 {
            margin: 0;
            font-size: 24px;
          }
          .content {
            padding: 30px;
          }
          .order-info {
            background-color: #f9fafb;
            border-radius: 8px;
            padding: 20px;
            margin-bottom: 20px;
          }
          .order-info h2 {
            margin-top: 0;
            color: #1f2937;
            font-size: 20px;
          }
          .info-row {
            display: flex;
            justify-content: space-between;
            padding: 8px 0;
            border-bottom: 1px solid #e5e7eb;
          }
          .info-row:last-child {
            border-bottom: none;
          }
          .info-label {
            font-weight: bold;
            color: #4b5563;
          }
          .info-value {
            color: #1f2937;
          }
          .items-section {
            margin: 30px 0;
          }
          .items-section h3 {
            color: #1f2937;
            margin-bottom: 15px;
          }
          .order-item {
            display: flex;
            padding: 15px;
            border: 1px solid #e5e7eb;
            border-radius: 8px;
            margin-bottom: 10px;
            background-color: #f9fafb;
          }
          .item-image {
            width: 80px;
            height: 80px;
            object-fit: cover;
            border-radius: 6px;
            margin-right: 15px;
          }
          .item-details {
            flex: 1;
          }
          .item-name {
            font-weight: bold;
            color: #1f2937;
            margin-bottom: 5px;
          }
          .item-variant {
            color: #6b7280;
            font-size: 14px;
            margin-bottom: 5px;
          }
          .item-quantity {
            color: #6b7280;
            font-size: 14px;
          }
          .item-price {
            font-weight: bold;
            color: #1f2937;
            text-align: right;
          }
          .totals-section {
            background-color: #f9fafb;
            border-radius: 8px;
            padding: 20px;
            margin-top: 20px;
          }
          .total-row {
            display: flex;
            justify-content: space-between;
            padding: 8px 0;
          }
          .total-row.total {
            border-top: 2px solid #1f2937;
            margin-top: 10px;
            padding-top: 15px;
            font-size: 18px;
            font-weight: bold;
          }
          .shipping-address {
            background-color: #f9fafb;
            border-radius: 8px;
            padding: 20px;
            margin-top: 20px;
          }
          .shipping-address h3 {
            margin-top: 0;
            color: #1f2937;
          }
          .address-line {
            margin: 5px 0;
            color: #4b5563;
          }
          .footer {
            background-color: #1f2937;
            color: white;
            padding: 20px;
            text-align: center;
            font-size: 14px;
          }
          .footer a {
            color: white;
            text-decoration: underline;
          }
          .status-badge {
            display: inline-block;
            padding: 6px 12px;
            border-radius: 20px;
            font-size: 14px;
            font-weight: bold;
            margin-top: 10px;
          }
          .status-pending {
            background-color: #fef3c7;
            color: #92400e;
          }
          .status-processing {
            background-color: #dbeafe;
            color: #1e40af;
          }
          .status-shipped {
            background-color: #ddd6fe;
            color: #5b21b6;
          }
          .status-delivered {
            background-color: #d1fae5;
            color: #065f46;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Thank You for Your Order!</h1>
          </div>
          <div class="content">
            <p>Dear ${customerName},</p>
            <p>We're excited to confirm that we've received your order! Your order details are below:</p>

            <div class="order-info">
              <h2>Order Information</h2>
              <div class="info-row">
                <span class="info-label">Order Number:</span>
                <span class="info-value">${order.orderNumber || order._id}</span>
              </div>
              <div class="info-row">
                <span class="info-label">Order Date:</span>
                <span class="info-value">${new Date(order.createdAt || Date.now()).toLocaleDateString('en-PK', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })}</span>
              </div>
              <div class="info-row">
                <span class="info-label">Payment Method:</span>
                <span class="info-value">${order.paymentMethod === 'cod' ? 'Cash on Delivery (COD)' : 'Credit/Debit Card'}</span>
              </div>
              <div class="info-row">
                <span class="info-label">Order Status:</span>
                <span class="info-value">
                  <span class="status-badge status-${order.orderStatus || 'pending'}">
                    ${(order.orderStatus || 'pending').charAt(0).toUpperCase() + (order.orderStatus || 'pending').slice(1)}
                  </span>
                </span>
              </div>
            </div>

            <div class="items-section">
              <h3>Order Items</h3>
              ${order.items?.map(item => `
                <div class="order-item">
                  ${item.images?.[0] ? `<img src="${item.images[0]}" alt="${item.productName}" class="item-image" />` : '<div class="item-image" style="background-color: #e5e7eb;"></div>'}
                  <div class="item-details">
                    <div class="item-name">${item.productName || 'Product'}</div>
                    ${(item.variant?.size || item.variant?.color) ? `
                      <div class="item-variant">
                        ${item.variant.size ? `Size: ${item.variant.size}` : ''}
                        ${item.variant.size && item.variant.color ? ' | ' : ''}
                        ${item.variant.color ? `Color: ${item.variant.color}` : ''}
                      </div>
                    ` : ''}
                    <div class="item-quantity">Quantity: ${item.quantity}</div>
                  </div>
                  <div class="item-price">${formatPrice(item.price * item.quantity)}</div>
                </div>
              `).join('') || ''}
            </div>

            <div class="totals-section">
              <h3>Order Summary</h3>
              <div class="total-row">
                <span>Subtotal:</span>
                <span>${formatPrice(order.subtotal)}</span>
              </div>
              ${order.shipping > 0 ? `
                <div class="total-row">
                  <span>Shipping:</span>
                  <span>${formatPrice(order.shipping)}</span>
                </div>
              ` : ''}
              ${order.tax > 0 ? `
                <div class="total-row">
                  <span>Tax:</span>
                  <span>${formatPrice(order.tax)}</span>
                </div>
              ` : ''}
              ${order.discount > 0 ? `
                <div class="total-row" style="color: #059669;">
                  <span>Discount:</span>
                  <span>-${formatPrice(order.discount)}</span>
                </div>
              ` : ''}
              <div class="total-row total">
                <span>Total:</span>
                <span>${formatPrice(order.total)}</span>
              </div>
            </div>

            <div class="shipping-address">
              <h3>Shipping Address</h3>
              <div class="address-line">${order.shippingAddress?.firstName || ''} ${order.shippingAddress?.lastName || ''}</div>
              <div class="address-line">${order.shippingAddress?.address || ''}</div>
              <div class="address-line">${order.shippingAddress?.city || ''} ${order.shippingAddress?.postalCode || ''}</div>
              <div class="address-line">Phone: ${order.shippingAddress?.phone || ''}</div>
            </div>

            <p style="margin-top: 30px;">
              <strong>Important:</strong> Remember, with our "Open Parcel Before Payment" policy, 
              you can inspect your order before making payment. We'll notify you when your order is shipped.
            </p>

            <p>If you have any questions, please don't hesitate to contact us at 
              <a href="mailto:${BRAND.contact.email}">${BRAND.contact.email}</a> or 
              <a href="tel:${BRAND.contact.phone}">${BRAND.contact.phone}</a>.
            </p>

            <p>Thank you for choosing ${BRAND.name}!</p>
          </div>
          <div class="footer">
            <p>&copy; ${new Date().getFullYear()} ${BRAND.name}. All rights reserved.</p>
            <p>
              <a href="${process.env.NEXT_PUBLIC_SITE_URL || 'https://zammel.store'}/contact">Contact Us</a> | 
              <a href="${process.env.NEXT_PUBLIC_SITE_URL || 'https://zammel.store'}/privacy">Privacy Policy</a>
            </p>
          </div>
        </div>
      </body>
    </html>
  `;
};

/**
 * Generate order status update email HTML
 */
export const getOrderStatusUpdateEmail = (order, oldStatus) => {
  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-PK', {
      style: 'currency',
      currency: 'PKR',
      minimumFractionDigits: 0,
    }).format(Math.round(price || 0));
  };

  const customerName = `${order.shippingAddress?.firstName || ''} ${order.shippingAddress?.lastName || ''}`.trim() || 'Customer';
  const statusMessages = {
    pending: 'Your order is being prepared.',
    processing: 'Your order is being processed and will be shipped soon.',
    shipped: 'Great news! Your order has been shipped and is on its way to you.',
    delivered: 'Your order has been delivered! We hope you love your purchase.',
    cancelled: 'Your order has been cancelled. If you have any questions, please contact us.'
  };

  const statusMessage = statusMessages[order.orderStatus] || 'Your order status has been updated.';

  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            margin: 0;
            padding: 0;
            background-color: #f4f4f4;
          }
          .container {
            max-width: 600px;
            margin: 0 auto;
            background-color: white;
          }
          .header {
            background-color: #1f2937;
            color: white;
            padding: 30px;
            text-align: center;
          }
          .header h1 {
            margin: 0;
            font-size: 24px;
          }
          .content {
            padding: 30px;
          }
          .status-update {
            background-color: #f9fafb;
            border-radius: 8px;
            padding: 20px;
            margin: 20px 0;
            text-align: center;
          }
          .status-badge {
            display: inline-block;
            padding: 10px 20px;
            border-radius: 25px;
            font-size: 18px;
            font-weight: bold;
            margin: 10px 0;
          }
          .status-pending {
            background-color: #fef3c7;
            color: #92400e;
          }
          .status-processing {
            background-color: #dbeafe;
            color: #1e40af;
          }
          .status-shipped {
            background-color: #ddd6fe;
            color: #5b21b6;
          }
          .status-delivered {
            background-color: #d1fae5;
            color: #065f46;
          }
          .status-cancelled {
            background-color: #fee2e2;
            color: #991b1b;
          }
          .order-info {
            background-color: #f9fafb;
            border-radius: 8px;
            padding: 20px;
            margin: 20px 0;
          }
          .info-row {
            display: flex;
            justify-content: space-between;
            padding: 8px 0;
            border-bottom: 1px solid #e5e7eb;
          }
          .info-row:last-child {
            border-bottom: none;
          }
          .info-label {
            font-weight: bold;
            color: #4b5563;
          }
          .info-value {
            color: #1f2937;
          }
          .footer {
            background-color: #1f2937;
            color: white;
            padding: 20px;
            text-align: center;
            font-size: 14px;
          }
          .footer a {
            color: white;
            text-decoration: underline;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Order Status Update</h1>
          </div>
          <div class="content">
            <p>Dear ${customerName},</p>
            <p>Your order status has been updated:</p>

            <div class="status-update">
              <div class="status-badge status-${order.orderStatus || 'pending'}">
                ${(order.orderStatus || 'pending').charAt(0).toUpperCase() + (order.orderStatus || 'pending').slice(1)}
              </div>
              <p style="margin-top: 15px; font-size: 16px; color: #4b5563;">
                ${statusMessage}
              </p>
            </div>

            <div class="order-info">
              <h3 style="margin-top: 0; color: #1f2937;">Order Details</h3>
              <div class="info-row">
                <span class="info-label">Order Number:</span>
                <span class="info-value">${order.orderNumber || order._id}</span>
              </div>
              <div class="info-row">
                <span class="info-label">Order Total:</span>
                <span class="info-value">${formatPrice(order.total)}</span>
              </div>
              <div class="info-row">
                <span class="info-label">Payment Method:</span>
                <span class="info-value">${order.paymentMethod === 'cod' ? 'Cash on Delivery (COD)' : 'Credit/Debit Card'}</span>
              </div>
            </div>

            ${order.orderStatus === 'shipped' ? `
              <p style="background-color: #dbeafe; padding: 15px; border-radius: 8px; color: #1e40af;">
                <strong>📦 Your order is on its way!</strong><br>
                You should receive your order soon. Remember, you can open your parcel before payment!
              </p>
            ` : ''}

            ${order.orderStatus === 'delivered' ? `
              <p style="background-color: #d1fae5; padding: 15px; border-radius: 8px; color: #065f46;">
                <strong>✅ Your order has been delivered!</strong><br>
                We hope you love your purchase. If you have any questions or need to return/exchange anything, 
                please contact us within 7 days.
              </p>
            ` : ''}

            <p>If you have any questions about your order, please don't hesitate to contact us at 
              <a href="mailto:${BRAND.contact.email}">${BRAND.contact.email}</a> or 
              <a href="tel:${BRAND.contact.phone}">${BRAND.contact.phone}</a>.
            </p>

            <p>Thank you for choosing ${BRAND.name}!</p>
          </div>
          <div class="footer">
            <p>&copy; ${new Date().getFullYear()} ${BRAND.name}. All rights reserved.</p>
            <p>
              <a href="${process.env.NEXT_PUBLIC_SITE_URL || 'https://zammel.store'}/contact">Contact Us</a> | 
              <a href="${process.env.NEXT_PUBLIC_SITE_URL || 'https://zammel.store'}/orders/${order._id}">View Order</a>
            </p>
          </div>
        </div>
      </body>
    </html>
  `;
};

