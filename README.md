# QEST - Anket Uygulaması

## Proje Hakkında

Qest, kullanıcıların kolayca anketler oluşturmasını, yönetmesini ve yanıtlarını analiz etmesini sağlayan modern bir web uygulamasıdır. Firebase altyapısını kullanarak gerçek zamanlı veri senkronizasyonu, kullanıcı kimlik doğrulama ve veri depolama özellikleri sunar.

## Özellikler

- **Kullanıcı Kimlik Doğrulama:** Güvenli giriş ve kayıt sistemi
- **Anket Oluşturma:** Çoktan seçmeli, açık uçlu ve ölçek tipi soru oluşturma
- **Anketleri Paylaşma:** Anketi bağlantı ile paylaşma
- **Yanıt Toplama:** Anonim yanıt alma ve depolama
- **Yanıt Analizi:** Yanıtları görüntüleme ve analiz etme
- **Sayfalama:** Büyük veri setlerinde kolay gezinme
- **Duyarlı Tasarım:** Tüm cihazlara uyumlu arayüz

## Teknolojiler

- **Frontend:** React.js, Redux Toolkit, Styled Components
- **Backend:** Firebase (Authentication, Firestore)
- **Build Aracı:** Vite
- **Dil:** JavaScript

## Kurulum ve Çalıştırma

### Gereksinimler

- Node.js (v14.0.0 veya üzeri)
- npm veya yarn

### Kurulum Adımları

1. Projeyi klonlayın:

```bash
git clone https://github.com/kullaniciadi/survey-app.git
cd survey-app
```

2. Bağımlılıkları yükleyin:

```bash
npm install
# veya
yarn install
```

3. Firebase yapılandırmasını ayarlayın:

   - Firebase konsolunda yeni bir proje oluşturun
   - Authentication ve Firestore hizmetlerini etkinleştirin
   - Firestore kurallarını düzenleyin
   - Firebase yapılandırma bilgilerini `src/firebase/firebase.js` dosyasına ekleyin

4. Uygulamayı geliştirme modunda çalıştırın:

```bash
npm run dev
# veya
yarn dev
```

5. Tarayıcınızda `http://localhost:5173` adresine giderek uygulamayı görüntüleyin

### Dağıtım (Deployment)

Uygulamayı üretim için oluşturmak:

```bash
npm run build
# veya
yarn build
```

## Kullanım

1. Hesap oluşturun veya giriş yapın
2. "Anket Oluştur" butonuna tıklayarak yeni bir anket oluşturun
3. Anketinize başlık ve açıklama ekleyin
4. Farklı türlerde sorular ekleyin
5. Anketinizi kaydedin
6. "Paylaş" butonuyla anket bağlantısını kopyalayın ve paylaşın
7. Yanıtları "Yanıtlar" bölümünden görüntüleyin ve analiz edin

## Katkı Sağlama

Projeye katkıda bulunmak isterseniz, lütfen bir issue açın veya pull request gönderin. Tüm katkılar değerlendirilecektir.

---

Uygulamayı geliştiren: Esmanur Mazlum
