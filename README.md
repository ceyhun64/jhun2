# .jhun{} — Resmi Şirket Sitesi

**jhun.com.tr** | İletişim, Portfolyo & Profesyonel Web Geliştirme Hizmetleri

[![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com)

---

## Hakkında

İhtiyaca göre her türlü sitenin tasarlandığı profesyonel web geliştirme hizmetlerimizle işletmenizi dijitale taşıyor, markanıza özel modern ve kullanıcı dostu çözümler sunuyoruz.

Kişisel portfolyo sitelerinden kurumsal tanıtım sayfalarına, bloglardan e-ticaret altyapılarına kadar tüm projeleri estetik, hızlı ve güvenli şekilde hayata geçiriyoruz. Mobil uyumlu tasarımlar, güçlü içerik yönetim sistemleri ve SEO odaklı altyapımız sayesinde hem görünürlüğünüzü artırıyor hem de ziyaretçilere etkileyici bir deneyim sunuyoruz.

Tasarım, yazılım, güncelleme ve teknik destek süreçlerinde yanınızda olarak dijitalde güçlü bir varlık oluşturmanıza yardımcı oluyoruz. İster iletişim, ister portfolyo, ister tanıtım amaçlı olsun; hayal ettiğiniz siteyi eksiksiz şekilde gerçeğe dönüştürürüz.

---

## Özellikler

- **Çok Dilli Destek**: İngilizce ve Türkçe dilleri desteklenir (next-intl ile)
- **Admin Paneli**: Blog, projeler ve teknolojiler için yönetim arayüzü
- **Blog Sistemi**: İçerik yönetimi ve blog yazıları
- **Proje Portfolyosu**: Projelerin detaylı gösterimi
- **Teknoloji Yönetimi**: Kullanılan teknolojilerin listesi
- **Chatbot**: AI destekli sohbet botu (Anthropic AI, Google Generative AI)
- **İletişim Formu**: E-posta gönderme özelliği (Nodemailer)
- **Görsel Yönetimi**: Cloudinary entegrasyonu
- **Ödeme Entegrasyonu**: İyzico ödeme sistemi
- **SEO Optimizasyonu**: Meta etiketleri ve performans iyileştirmeleri
- **Responsive Tasarım**: Mobil uyumlu arayüz
- **Koyu/Açık Tema**: Kullanıcı tercihine göre tema değiştirme
- **Animasyonlar**: Framer Motion ve GSAP ile akıcı animasyonlar

---

## Teknoloji Yığını

### Frontend

- **Next.js 16**: React tabanlı framework
- **React 19**: Kullanıcı arayüzü kütüphanesi
- **TypeScript**: Tip güvenliği
- **Tailwind CSS**: CSS framework
- **Radix UI**: Erişilebilir UI bileşenleri
- **Framer Motion**: Animasyon kütüphanesi
- **Lucide React**: İkon seti

### Backend & Veritabanı

- **MongoDB**: NoSQL veritabanı
- **Mongoose**: MongoDB ODM
- **NextAuth.js**: Kimlik doğrulama
- **API Routes**: Next.js API endpoints

### AI & Entegrasyonlar

- **Anthropic AI SDK**: AI sohbet botu
- **Google Generative AI**: AI özellikleri
- **Cloudinary**: Görsel yönetimi
- **Nodemailer**: E-posta gönderme
- **İyzico**: Ödeme sistemi

### Diğer Araçlar

- **Prisma**: Veritabanı araçları (eklentiler için)
- **Zod**: Şema validasyonu
- **React Hook Form**: Form yönetimi
- **Recharts**: Grafik ve istatistikler

---

## Kurulum ve Çalıştırma

### Gereksinimler

- Node.js 18+
- MongoDB (yerel veya Atlas)
- npm, yarn, pnpm veya bun

### Adımlar

1. **Depoyu Klonlayın**

   ```bash
   git clone https://github.com/kullanici/jhun.git
   cd jhun
   ```

2. **Bağımlılıkları Yükleyin**

   ```bash
   npm install
   # veya
   yarn install
   # veya
   pnpm install
   ```

3. **Ortam Değişkenlerini Ayarlayın**

   `.env.local` dosyasını oluşturun ve aşağıdaki değişkenleri ekleyin:

   ```env
   MONGODB_URI=mongodb://localhost:27017/jhun
   NEXTAUTH_SECRET=your-secret-key
   NEXTAUTH_URL=http://localhost:3000
   CLOUDINARY_CLOUD_NAME=your-cloud-name
   CLOUDINARY_API_KEY=your-api-key
   CLOUDINARY_API_SECRET=your-api-secret
   ANTHROPIC_API_KEY=your-anthropic-key
   GOOGLE_AI_API_KEY=your-google-ai-key
   EMAIL_USER=your-email@example.com
   EMAIL_PASS=your-email-password
   IYZICO_API_KEY=your-iyzico-key
   IYZICO_SECRET_KEY=your-iyzico-secret
   ```

4. **Veritabanını Başlatın**

   MongoDB'yi yerel olarak çalıştırın veya MongoDB Atlas kullanın.

5. **Geliştirme Sunucusunu Başlatın**

   ```bash
   npm run dev
   # veya
   yarn dev
   # veya
   pnpm dev
   ```

6. **Tarayıcıda Açın**

   [http://localhost:3000](http://localhost:3000) adresine gidin.

---

## Kullanım

### Admin Paneli

- `/admin` yoluna gidin
- Giriş yapın (varsayılan admin bilgileri için `models/admin.ts` kontrol edin)
- Blog yazıları, projeler ve teknolojileri yönetin

### API Endpoints

- `GET /api/blog` - Blog yazıları
- `POST /api/blog` - Yeni blog yazısı
- `GET /api/projects` - Projeler
- `POST /api/projects` - Yeni proje
- `GET /api/technology` - Teknolojiler
- `POST /api/technology` - Yeni teknoloji
- `POST /api/auth/login` - Giriş
- `POST /api/mail` - E-posta gönderme
- `POST /api/chat` - Chatbot mesajı
- `POST /api/upload` - Dosya yükleme

### Çok Dilli Destek

- URL'de `[locale]` parametresi ile dil değiştirme
- Desteklenen diller: `en`, `tr`

---

## Proje Yapısı

```
jhun/
├── app/                    # Next.js App Router
│   ├── [locale]/          # Çok dilli sayfalar
│   ├── admin/             # Admin paneli
│   ├── api/               # API endpoints
│   └── globals.css        # Global stiller
├── components/            # React bileşenleri
│   ├── ui/                # UI bileşenleri (Radix UI)
│   ├── admin/             # Admin bileşenleri
│   ├── blog/              # Blog bileşenleri
│   └── ...
├── data/                  # Sabit veriler ve seed
├── hooks/                 # Özel React hooks
├── lib/                   # Yardımcı fonksiyonlar
├── messages/              # Çok dilli mesajlar
├── models/                # MongoDB modelleri
├── public/                # Statik dosyalar
└── types/                 # TypeScript tipleri
```

---

## Yayına Alma

### Vercel (Önerilen)

1. [Vercel](https://vercel.com)'e bağlanın
2. Projeyi import edin
3. Ortam değişkenlerini ayarlayın
4. Deploy edin

### Diğer Platformlar

- **Netlify**: `npm run build` sonrası dist klasörünü yükleyin
- **Railway**: Docker desteği ile kolay deployment
- **Heroku**: Buildpack ile otomatik deployment

Daha fazla bilgi için [Next.js dağıtım belgelerine](https://nextjs.org/docs/app/building-your-application/deploying) göz atın.

---

## Katkıda Bulunma

1. Fork edin
2. Feature branch oluşturun (`git checkout -b feature/amazing-feature`)
3. Commit edin (`git commit -m 'Add amazing feature'`)
4. Push edin (`git push origin feature/amazing-feature`)
5. Pull Request açın

### Geliştirme Standartları

- TypeScript kullanın
- ESLint kurallarına uyun
- Test yazın (gelecekte eklenecek)
- Semantic commit mesajları kullanın

---

## Lisans

Bu proje MIT Lisansı altında lisanslanmıştır. Detaylar için [LICENSE](LICENSE) dosyasına bakın.

---

## İletişim

**Web:** [jhun.com.tr](https://jhun.com.tr)  
**E-posta:** jhuntechofficial@gmail.com.tr  

---

_Bu README, proje dosyalarının analizi sonucu oluşturulmuştur._
