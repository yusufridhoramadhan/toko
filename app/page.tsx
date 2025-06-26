'use client';

import { useState } from 'react';
import { ShoppingBag, Plus, Minus, MessageCircle, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import storeConfig from '../data/store-config.json';

export default function VoucherStore() {
  const [cart, setCart] = useState<Record<string, number>>({});
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [name, setName] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const { storeInfo, voucherInfo, products, formLabels, messages } =
    storeConfig;
  const minPurchase = storeInfo.minPurchase;
  const totalItems = Object.values(cart).reduce((sum, qty) => sum + qty, 0);
  const totalPrice = Object.entries(cart).reduce((sum, [id, qty]) => {
    const product = products.find((p) => p.id === id);
    return sum + (product?.price || 0) * qty;
  }, 0);

  const addToCart = (productId: string) => {
    setCart((prev) => ({
      ...prev,
      [productId]: (prev[productId] || 0) + 1,
    }));
  };

  const removeFromCart = (productId: string) => {
    setCart((prev) => {
      const newCart = { ...prev };
      if (newCart[productId] > 1) {
        newCart[productId]--;
      } else {
        delete newCart[productId];
      }
      return newCart;
    });
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const sendToWhatsApp = () => {
    if (totalItems < minPurchase) {
      alert(`Minimal pembelian ${minPurchase} item`);
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
  };

  const newdata = products.filter((product) =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-600 via-green-500 to-emerald-500">
      {/* Sticky Header */}
      <div className="sticky top-0 z-50 bg-gradient-to-r from-green-600 to-emerald-600 backdrop-blur-sm border-b border-white/20">
        <div className="container mx-auto px-4 py-4 max-w-md">
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-1">
              <ShoppingBag className="w-6 h-6 text-yellow-200" />
              <h1 className="text-xl font-bold text-white">{storeInfo.name}</h1>
            </div>
            <p className="text-white/90 text-sm">{storeInfo.tagline}</p>
          </div>
        </div>
      </div>

      {/* Floating Cart Counter */}
      <div className="fixed top-20 right-4 z-40">
        <Card className="bg-white/95 backdrop-blur-sm border-white/40 shadow-lg">
          <CardContent className="p-3">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-4 h-4 text-emerald-600" />
              <span className="text-sm font-medium">{totalItems}</span>
              <Badge variant="secondary" className="text-xs">
                {formatPrice(totalPrice)}
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content with padding for sticky elements */}
      <div className="container mx-auto px-4 py-6 max-w-md pb-40">
        {/* Voucher Information */}
        <Card className="mb-6 bg-white/25 backdrop-blur-sm border-white/40">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-3">
              <Info className="w-5 h-5 text-white" />
              <h2 className="text-white font-semibold text-lg">
                {voucherInfo.title}
              </h2>
            </div>
            <div className="space-y-2 text-white/90">
              {voucherInfo.details.map((detail, index) => (
                <div key={index} className="flex items-center gap-2">
                  <span className="text-green-300">✓</span>
                  <span>{detail}</span>
                </div>
              ))}
              <div className="flex items-center gap-2">
                <span className="text-green-300">✓</span>
                <span>Minimal pembelian: {minPurchase} item</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Minimum Purchase Warning */}
        {totalItems < minPurchase && (
          <div className="bg-amber-500 text-white p-3 rounded-lg mb-6 text-center font-medium">
            {messages.minPurchaseWarning.replace(
              '{min}',
              minPurchase.toString()
            )}
          </div>
        )}

        {/* search input */}
        <div className="mb-4">
          <Input
            type="text"
            placeholder={'Cari produk...'}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full"
          />
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          {newdata.map((product) => (
            <Card
              key={product.id}
              className="bg-white rounded-xl overflow-hidden shadow-lg"
            >
              <div className="relative">
                <img
                  src={product.image || '/placeholder.svg'}
                  alt={product.name}
                  className="w-full h-32 object-cover"
                />

                {product.type === 'voucher' && (
                  <Badge className="absolute top-2 left-2 bg-blue-500">
                    Voucher
                  </Badge>
                )}
              </div>
              <CardContent className="p-3">
                <h3 className="font-semibold text-sm mb-1 line-clamp-2">
                  {product.name}
                </h3>
                <p className="text-xs text-gray-600 mb-2 line-clamp-2">
                  {product.description}
                </p>
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <div className="font-bold text-emerald-700">
                      {formatPrice(product.price)}
                    </div>
                    {product.originalPrice && (
                      <div className="text-xs text-gray-500 line-through">
                        {formatPrice(product.originalPrice)}
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => removeFromCart(product.id)}
                      disabled={!cart[product.id]}
                      className="w-8 h-8 p-0"
                    >
                      <Minus className="w-4 h-4" />
                    </Button>
                    <span className="w-8 text-center font-medium">
                      {cart[product.id] || 0}
                    </span>
                    <Button
                      size="sm"
                      onClick={() => addToCart(product.id)}
                      className="w-8 h-8 p-0"
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* empty data */}
        {newdata.length === 0 && (
          <div className="text-center text-gray-500 pb-10">
            Tidak ada produk yang ditemukan
          </div>
        )}

        {/* Contact Information */}
        <Card className="mb-6 bg-white rounded-xl">
          <CardContent className="p-4">
            <div className="space-y-4">
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
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Sticky Footer - Checkout Section */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 shadow-lg">
        <div className="container mx-auto px-4 py-4 max-w-md">
          <div className="flex justify-between items-center mb-3">
            <div>
              <div className="text-lg font-bold text-gray-900">
                Total: {formatPrice(totalPrice)}
              </div>
              <div className="text-sm text-gray-600">({totalItems} item)</div>
            </div>
            <div className="text-right">
              {totalItems < minPurchase && (
                <div className="text-xs text-amber-600 mb-1">
                  Kurang {minPurchase - totalItems} item lagi
                </div>
              )}
            </div>
          </div>
          <Button
            onClick={sendToWhatsApp}
            disabled={totalItems < minPurchase || !name || !email || !phone}
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3 text-lg font-medium rounded-lg disabled:bg-gray-400"
          >
            <MessageCircle className="w-5 h-5 mr-2" />
            {messages.checkoutButton}
          </Button>
        </div>
      </div>
    </div>
  );
}
