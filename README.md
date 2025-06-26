# 🛍️ Toko Serbaguna - Simple E-commerce Website

Toko Serbaguna untuk menjual produk fisik dan voucher digital dengan integrasi WhatsApp checkout. Dibangun dengan Next.js dan Tailwind CSS.

## ✨ Fitur Utama

- 📱 **Mobile-First Design** - Dioptimalkan untuk penggunaan mobile
- 🛒 **Shopping Cart** - Sistem keranjang belanja dengan counter real-time
- 💬 **WhatsApp Integration** - Checkout langsung ke WhatsApp admin
- 📦 **Mixed Products** - Mendukung produk fisik dan voucher digital
- 🔧 **JSON Configuration** - Semua data tersimpan dalam file JSON
- ⚡ **Real-time Updates** - Counter dan total harga update otomatis

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- npm atau yarn

### Installation

1. **Clone repository**

   ```bash
   git clone https://github.com/arifintajul4/toko-wa.git
   cd toko-wa
   ```

2. **Install dependencies**

   ```bash
   npm install
   # atau
   yarn install
   ```

3. **Run development server**

   ```bash
   npm run dev
   # atau
   yarn dev
   ```

4. **Open browser**
   Buka [http://localhost:3000](http://localhost:3000)

## ⚙️ Konfigurasi

Semua konfigurasi tersimpan dalam file \`data/store-config.json\`:

### 🏪 Store Information

```json
{
  "storeInfo": {
    "name": "TOKO SERBAGUNA",
    "tagline": "Produk & Voucher Terbaik!",
    "whatsappNumber": "6281234567890",
    "minPurchase": 2
  }
}
```

### 🛍️ Tambah Produk Baru

```json
{
  "products": [
    {
      "id": "7",
      "name": "Produk Baru",
      "type": "physical", // atau "voucher"
      "price": 75000,
      "originalPrice": 90000, // optional untuk diskon
      "image": "/path/to/image.jpg",
      "description": "Deskripsi produk"
    }
  ]
}
```

## 💬 WhatsApp Integration

### Format Pesan Otomatis

```
*PESANAN BARU*

Voucher Gaming Premium x2 = Rp50.000
Kaos Premium x1 = Rp85.000

*Total: Rp135.000*

Nama: John Doe
Email: john@email.com
No. HP: 08123456789

Terima kasih!
```

### Setup WhatsApp

1. Ganti nomor WhatsApp di `store-config.json`
2. Format: `"whatsappNumber": "6281234567890"`
3. Tanpa tanda + di depan

## 🛠️ Customization

### Mengubah Minimal Pembelian

```json
{
  "storeInfo": {
    "minPurchase": 3 // ubah sesuai kebutuhan
  }
}
```

### Mengubah Informasi Produk

```json
{
  "voucherInfo": {
    "title": "📋 Informasi Produk",
    "details": [
      "Voucher berlaku 7 hari setelah pembelian",
      "Garansi 24 jam setelah pembelian"
      // tambah/ubah informasi di sini
    ]
  }
}
```

### Mengubah Label Form

```json
{
  "formLabels": {
    "name": "👤 Nama Pemesan:",
    "email": "📧 Email:",
    "phone": "📱 No. WhatsApp:"
    // ubah label sesuai kebutuhan
  }
}
```

## 📦 Struktur Project

```
voucher-store/
├── app/
│   ├── page.tsx          # Main component
│   ├── layout.tsx        # Root layout
│   └── globals.css       # Global styles
├── data/
│   └── store-config.json # Konfigurasi utama
├── components/
│   └── ui/              # Shadcn UI components
├── public/              # Static assets
└── README.md           # Dokumentasi ini
```

## 🔧 Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS
- **UI Components**: Shadcn/ui
- **Icons**: Lucide React
- **Language**: TypeScript
- **Configuration**: JSON

## 🚀 Deployment

### Vercel (Recommended)

1. Push code ke GitHub
2. Connect repository di Vercel
3. Deploy otomatis

### Manual Build

```bash
npm run build
npm start
```

## 🤝 Contributing

1. Fork repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - React framework
- [Tailwind CSS](https://tailwindcss.com/) - CSS framework
- [Shadcn/ui](https://ui.shadcn.com/) - UI components
- [Lucide](https://lucide.dev/) - Icon library

---

Made with ❤️ for Indonesian e-commerce
