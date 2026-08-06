# Veritabanı Tasarımı (Database Schema)

### 1. Companies (Şirketler)
- id: Benzersiz Şirket Kimliği
- name: Şirket Adı
- phone: İletişim Numarası
- type: "Owner" (İşi Veren) veya "Affiliate" (Taşeron)

### 2. Drivers (Sürücüler)
- id: Sürücü Kimliği
- company_id: Bağlı Olduğu Şirket
- name_surname: Sürücü Ad Soyad
- phone: Telefon Numarası
- vehicle_info: Araç Modeli ve Plaka

### 3. Trips (Sürüş / Transfer İşleri)
- id: Transfer Kimliği (#41711 gibi)
- company_id: İşi Oluşturan Şirket
- driver_id: Atanan Sürücü
- passenger_name: Yolcu Ad Soyad
- passenger_phone: Yolcu Telefonu
- passenger_count: Kişi Sayısı
- pickup_address: Alış Adresi
- dropoff_address: Bırakış Adresi
- pickup_datetime: Transfer Tarihi ve Saati
- flight_code: Uçuş Kodu (Örn: UAL 1755)
- status: "Pending", "On The Way", "Arrived", "Customer In Car", "Dropped"
- access_token: SMS İle Gönderilen Özel Gizli Link Kodu

### 4. Trip_Logs (GPS ve Durum Zaman Çizelgesi)
- id: Log Kimliği
- trip_id: İlgili Transfer
- status_name: Güncellenen Durum
- timestamp: İşlem Saati
- latitude: Enlem (GPS)
- longitude: Boylam (GPS)
