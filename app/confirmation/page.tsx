'use client';

import { useState, useEffect } from 'react';
import {
  ArrowLeft,
  ShoppingBag,
  MessageCircle,
  Package,
  Ticket,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useRouter } from 'next/navigation';
import storeConfig from '../../data/store-config.json';

interface Product {
  id: string;
  name: string;
  type: 'voucher' | 'physical';
  price: number;
  image: string;
  description: string;
  originalPrice?: number;
}

export default function ConfirmationPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [name, setName] = useState('');
  const [cart, setCart] = useState<Record<string, number>>({});
  const [isLoaded, setIsLoaded] = useState(false);

  const { storeInfo, products, formLabels, messages } = storeConfig;

  // Load cart from localStorage
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem('cart');
      if (savedCart) {
        const parsedCart = JSON.parse(savedCart);
        setCart(parsedCart);

        // If cart is empty, redirect to home
        if (Object.keys(parsedCart).length === 0) {
          router.replace('/');
          return;
        }
      } else {
        router.replace('/');
        return;
      }
    } catch (error) {
      console.error('Error loading cart from localStorage:', error);
      router.replace('/');
      return;
    }
    setIsLoaded(true);
  }, [router]);

  const totalItems = Object.values(cart).reduce((sum, qty) => sum + qty, 0);
  const totalPrice = Object.entries(cart).reduce((sum, [id, qty]) => {
    const product = products.find((p) => p.id === id);
    return sum + (product?.price || 0) * qty;
  }, 0);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const sendToWhatsApp = () => {
    if (!name || !email || !phone) {
      alert('Mohon lengkapi semua data yang diperlukan');
      return;
    }

    const orderDetails = Object.entries(cart)
      .map(([id, qty]) => {
        const product = products.find((p) => p.id === id);
        return `${product?.name} x${qty} = ${formatPrice(
          (product?.price || 0) * qty
        )}`;
      })
      .join('\n');

    const message = messages.orderMessage
      .replace('{orderDetails}', orderDetails)
      .replace('{total}', formatPrice(totalPrice))
      .replace('{name}', name)
      .replace('{email}', email)
      .replace('{phone}', phone);

    const whatsappUrl = `https://wa.me/${
      storeInfo.whatsappNumber
    }?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');

    // Clear cart after successful order
    localStorage.removeItem('cart');
    setCart({});
  };

  const goBack = () => {
    router.push('/');
  };

  // Loading state
  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-600 via-green-500 to-emerald-500 flex items-center justify-center">
        <div className="text-white text-center">
          <ShoppingBag className="w-12 h-12 mx-auto mb-4 animate-pulse" />
          <p>Memuat pesanan...</p>
        </div>
      </div>
    );
  }

  if (totalItems === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-600 via-green-500 to-emerald-500 flex items-center justify-center">
        <Card className="mx-4 max-w-md">
          <CardContent className="p-6 text-center">
            <ShoppingBag className="w-16 h-16 mx-auto mb-4 text-gray-400" />
            <h2 className="text-xl font-bold mb-2">Keranjang Kosong</h2>
            <p className="text-gray-600 mb-4">
              Silakan pilih produk terlebih dahulu
            </p>
            <Button
              onClick={goBack}
              className="bg-emerald-600 hover:bg-emerald-700"
            >
              Kembali Belanja
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-600 via-green-500 to-emerald-500">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-gradient-to-r from-green-600 to-emerald-600 backdrop-blur-sm border-b border-white/20">
        <div className="container mx-auto px-4 py-4 max-w-md">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={goBack}
              className="text-white hover:bg-white/20 p-2"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-lg font-bold text-white">
                Konfirmasi Pesanan
              </h1>
              <p className="text-white/80 text-sm">
                Review & checkout pesanan Anda
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6 max-w-md pb-32">
        {/* Order Summary */}
        <Card className="mb-6 bg-white/95 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-emerald-600" />
              Ringkasan Pesanan
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {Object.entries(cart).map(([id, qty]) => {
              const product = products.find((p) => p.id === id);
              if (!product) return null;

              return (
                <div
                  key={id}
                  className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
                >
                  <img
                    src={product.image || '/placeholder.svg'}
                    alt={product.name}
                    className="w-12 h-12 object-cover rounded"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-medium text-sm">{product.name}</h3>
                      {product.type === 'voucher' ? (
                        <Ticket className="w-4 h-4 text-blue-500" />
                      ) : (
                        <Package className="w-4 h-4 text-green-500" />
                      )}
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-600">Qty: {qty}</span>
                      <span className="font-bold text-sm text-emerald-700">
                        {formatPrice(product.price * qty)}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}

            <div className="border-t pt-4">
              <div className="flex justify-between items-center">
                <span className="font-bold text-lg">Total:</span>
                <span className="font-bold text-xl text-emerald-700">
                  {formatPrice(totalPrice)}
                </span>
              </div>
              <div className="text-sm text-gray-600 mt-1">
                {totalItems} item • Sudah termasuk pajak
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Customer Information Form */}
        <Card className="mb-12 bg-white/95 backdrop-blur-sm">
          <CardHeader>
            <CardTitle>📝 Data Pemesan</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {formLabels.name}
              </label>
              <Input
                type="text"
                placeholder={formLabels.namePlaceholder}
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {formLabels.email}
              </label>
              <Input
                type="email"
                placeholder={formLabels.emailPlaceholder}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {formLabels.phone}
              </label>
              <Input
                type="tel"
                placeholder={formLabels.phonePlaceholder}
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full"
                required
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Sticky Footer - Checkout */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 shadow-lg">
        <div className="container mx-auto px-4 py-4 max-w-md">
          <div className="flex justify-between items-center mb-3">
            <div>
              <div className="text-lg font-bold text-gray-900">
                Total: {formatPrice(totalPrice)}
              </div>
              <div className="text-sm text-gray-600">{totalItems} item</div>
            </div>
            <Badge variant="secondary" className="text-sm">
              Siap Checkout
            </Badge>
          </div>

          <Button
            onClick={sendToWhatsApp}
            disabled={!name || !email || !phone}
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3 text-lg font-medium rounded-lg disabled:bg-gray-400"
          >
            <MessageCircle className="w-5 h-5 mr-2" />
            {messages.checkoutButton}
          </Button>

          {(!name || !email || !phone) && (
            <p className="text-xs text-gray-500 text-center mt-2">
              Lengkapi semua data untuk melanjutkan
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
