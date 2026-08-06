# Sürücü Mobil Ekran Tasarımı (UI/UX Specification)

### 1. Üst Bilgi Kartı (Header & Trip Details)
- **Şirket Logosu:** İş veren şirketin veya kendi markanın logosu.
- **Tarih & Saat:** Alış zamanı ve Benzersiz Sürüş ID (#41711).
- **Yolcu Kartı:** Yolcu Adı, Telefonu (Arama Butonlu), Kişi Sayısı.

### 2. Rota & Uçuş Bilgisi (Routing Section)
- **Pickup (PU):** Alış adresi (Google Maps entegreli).
- **Dropoff (DO):** Bırakış adresi ve tahmini varış saati.
- **Uçuş Kodu:** Canlı rötar durumlu uçuş bilgisi (Örn: UAL 1755).

### 3. Dinamik Karşılama Tabelası (Get Signage Modal)
- **İşlev:** Sürücü havalimanında yolcuyu beklerken tıklar.
- **Görünüm:** Ekranı tam ekran siyah yapar, büyük beyaz/sarı harflerle **YOLCU ADI** gösterilir.

### 4. Durum Butonları (Status Workflow)
Sürücü sırasıyla tıklar; her tıklama anlık GPS ve zaman damgası gönderir:
1. `[ ] On The Way` (Yeşil Vurgu)
2. `[ ] Arrived`
3. `[ ] Customer In Car`
4. `[ ] Dropped`

### 5. Hızlı Aksiyon Butonları (Bottom Fixed Bar)
- **Text:** Yolcuya hızlı SMS.
- **Call:** Doğrudan arama.
- **Navigate to Pickup:** Google Maps / Waze / Apple Maps uygulamasını tek tıkla açar.
