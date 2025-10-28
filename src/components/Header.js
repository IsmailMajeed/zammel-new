'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Menu as LucideMenu, Heart } from 'lucide-react';
// Ant Design imports
import { Menu, Drawer, Button } from 'antd';
import {
  HomeOutlined,
  AppstoreOutlined,
  UnorderedListOutlined,
  InfoCircleOutlined,
  PhoneOutlined,
  UserOutlined,
  ShoppingCartOutlined,
  SearchOutlined,
  MenuOutlined,
} from '@ant-design/icons';
import { useSelector, useDispatch } from 'react-redux';
import { openCart } from '@/redux/slices/Cart';
import { openWishlist } from '@/redux/slices/Wishlist';
import 'antd/dist/reset.css';
import { useRouter } from 'next/navigation';
import { BRAND } from '@/utils/brandConstants';

const menuItems = [
  {
    key: '/',
    icon: <HomeOutlined />,
    label: <Link href="/">Home</Link>,
  },
  {
    key: '/collections/hoodie',
    icon: <AppstoreOutlined />,
    label: <Link href="/collections/hoodie">Hoodies</Link>,
  },
  {
    key: '/collections',
    icon: <UnorderedListOutlined />,
    label: <Link href="/collections">Collections</Link>,
  },
  {
    key: '/about',
    icon: <InfoCircleOutlined />,
    label: <Link href="/about">About</Link>,
  },
  {
    key: '/contact',
    icon: <PhoneOutlined />,
    label: <Link href="/contact">Contact</Link>,
  },
];

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const dispatch = useDispatch();
  const { itemCount } = useSelector(state => state.cart);
  const { items: wishlistItems } = useSelector(state => state.wishlist);
  const router = useRouter();

  return (
    <>
      {/* Announcement Bar */}
      <div className="bg-gray-900 text-white py-3 text-center text-sm font-medium">
        <div className="container">
          Open Parcel Delivery | Check First, Then Pay
        </div>
      </div>

      {/* Main Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="container">
          <div className="flex items-center justify-between h-16">

            {/* Desktop / Drawer Menu trigger */}
            <div className='flex items-center gap-1 pl-1 shrink'>
              <button
                className="flex items-center"
                onClick={() => setIsMenuOpen(true)}
              >
                <LucideMenu className='w-7 h-7 text-gray-900 border border-gray-200 p-1 rounded-md' />
              </button>
              <span className='text-xs ml-1 font-medium text-gray-600'>MENU</span>
            </div>

            {/* Logo */}
            <div className="grow text-center">
              <Link href="/" className="text-2xl font-bold text-gray-900">
                {BRAND.name}
              </Link>
            </div>

            {/* Header Actions */}
            {/* 
              Mobile: Show only Cart here (use hidden md:flex)
              Desktop: Show all actions (use hidden on mobile, flex on md+)
            */}
            <div className="flex items-center space-x-2 md:space-x-4">
              {/* Wishlist - Always visible */}
              <Button
                type="text"
                className="p-2 text-gray-700 hover:text-red-500 transition-colors relative"
                onClick={() => dispatch(openWishlist())}
                icon={
                  <span className="relative">
                    <Heart className="w-5 h-5" />
                    {wishlistItems.length > 0 && (
                      <sup className="absolute -top-3 -right-3 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                        {wishlistItems.length}
                      </sup>
                    )}
                  </span>
                }
              />

              {/* Cart - Always visible */}
              <Button
                type="text"
                className="p-2 text-gray-700 hover:text-blue-500 transition-colors relative"
                onClick={() => dispatch(openCart())}
                icon={
                  <span className="relative">
                    <ShoppingCartOutlined style={{ fontSize: 20 }} />
                    {itemCount > 0 && (
                      <sup className="absolute -top-3 -right-3 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                        {itemCount}
                      </sup>
                    )}
                  </span>
                }
              />
              {/* Desktop actions (search/account) */}
              <div className="hidden md:flex items-center space-x-2 md:space-x-4">
                <Button type="text" className="p-2 text-gray-700 hover:text-blue-500 transition-colors" icon={<UserOutlined />} onClick={() => router.push('/auth/login')} />
              </div>
            </div>
          </div>

          {/* antd Drawer for Mobile/Side Menu */}
          <Drawer
            title="Menu"
            placement="left"
            closable={true}
            onClose={() => setIsMenuOpen(false)}
            open={isMenuOpen}
            styles={{ body: { padding: 0 } }}
          >
            <Menu
              mode="inline"
              items={menuItems}
              onClick={() => setIsMenuOpen(false)}
              style={{ border: 'none' }}
            />
            <div className="flex flex-col gap-2 px-4 mt-4 md:hidden">
              <Button
                type="text"
                block
                icon={<UserOutlined />}
                className="flex items-center justify-start text-gray-700 hover:text-blue-500 transition-colors"
                style={{ textAlign: "left" }}
                onClick={() => { setIsMenuOpen(false); router.push('/auth/login'); }}
              >
                Account
              </Button>
            </div>
          </Drawer>
        </div>
      </header>
    </>
  );
}
