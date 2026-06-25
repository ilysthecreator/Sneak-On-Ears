# BAB 1: PENDAHULUAN

Aplikasi **Sneak On Ears** adalah platform e-commerce modern berbasis web yang dirancang khusus untuk memfasilitasi penjualan sepatu basket premium dengan gaya visual *neo-brutalist* minimalis. Selain menyediakan katalog produk, platform ini dilengkapi dengan sistem pencarian berbasis kecocokan warna gambar (*visual search*), halaman artikel edukatif seputar kultur lapangan basket dan tips pelatihan fisik, serta modul manajemen transaksi dan manajemen pengguna terintegrasi bagi administrator. Dokumen ini disusun untuk menjelaskan deskripsi topik, kebutuhan pengguna (*user story*), rancangan fungsionalitas (*use case*), serta spesifikasi detail mengenai modul sistem yang dikembangkan.

---

## 1.1. Deskripsi Topik

*Sneak On Ears* memadukan aspek e-commerce ritel dengan fungsionalitas pencarian pintar berbasis kecocokan visual. Proyek ini menggunakan stack teknologi React + TypeScript pada sisi frontend, Node.js + Express pada sisi backend server, dan database relasional MySQL.

**Scope (Batasan) Proyek yang Dikerjakan:**
- **Autentikasi Akun Terintegrasi**: Pendaftaran (Signup) dan Masuk (Login) yang dilengkapi dengan normalisasi spasi (*trim*) dan keseragaman huruf kecil (*lowercase*) pada input email guna mencegah kegagalan login akibat spasi otomatis (*autofill padding*) pada perangkat mobile.
- **Katalog Sepatu Basket**: Tampilan daftar produk dengan badge khusus (seperti "NEW DROP", "EXCLUSIVE"), deskripsi bahan, spesifikasi detail produk, harga real-time, pilihan ukuran kaki, dan galeri foto produk.
- **Pencarian Visual (*Visual Search*)**: Modul yang memungkinkan pengguna mengunggah gambar sepatu basket untuk dianalisis warna dominannya, kemudian mencocokkannya dengan koleksi sepatu basket yang memiliki palet warna serupa di database.
- **Sistem Keranjang Belanja Terkunci**: Kebijakan di mana pengguna yang belum login dibatasi untuk tidak bisa menambahkan produk ke keranjang belanja dan secara otomatis akan diarahkan ke halaman login terlebih dahulu demi keamanan data keranjang.
- **Checkout & Pembayaran (Simulasi Midtrans)**: Integrasi transaksi checkout keranjang belanja dengan gerbang pembayaran (Payment Gateway) Midtrans Snap Token untuk simulasi transaksi sukses secara aman.
- **Profil & Riwayat Transaksi**: Halaman profil dinamis yang menampilkan riwayat pesanan (ID transaksi, rincian produk, total bayar, status pesanan seperti *pending*, *paid*, *shipped*, atau *completed*) serta visualisasi statistik performa bermain pengguna (kalori terbakar dan akumulasi jam bermain di lapangan).
- **Dashboard Administrator Terpadu**:
  - Statistik platform (jumlah produk aktif, pengguna terdaftar, transaksi masuk, dan artikel).
  - Manajemen Produk (tambah produk baru dengan fitur unggah berkas gambar base64 lokal secara asinkron, hapus produk).
  - Manajemen Artikel (tambah artikel baru seputar info basket beserta gambar base64, hapus artikel).
  - Manajemen Transaksi (pemantauan status pembayaran pesanan pelanggan, pembaruan status logistik dari *paid* ke *shipped* atau *completed*, hapus transaksi).
  - Manajemen Pengguna (pemantauan daftar pengguna, pengubahan hak akses role dari *customer* ke *admin* secara instan, hapus akun pengguna dengan cascade delete terjamin).

---

## 1.2. User Story

Kebutuhan sistem didefinisikan berdasarkan perspektif dua aktor utama: **Customer** (Pelanggan) dan **Admin** (Administrator).

### 1.2.1. Aktor: Customer
1. **Pendaftaran Akun**: Sebagai Customer, saya ingin mendaftarkan akun baru dengan memasukkan username, email, dan password agar saya bisa memiliki keranjang belanja pribadi yang tersimpan dan melihat riwayat pesanan saya sendiri.
2. **Autentikasi Fleksibel**: Sebagai Customer, saya ingin sistem login saya toleran terhadap kesalahan spasi di awal/akhir alamat email yang biasa ditambahkan oleh fitur *autofill* keyboard HP agar proses login tidak gagal.
3. **Melihat Katalog Minimalis**: Sebagai Customer, saya ingin menjelajahi produk sepatu basket terbaru lewat tampilan minimalis tanpa gambar dekoratif di form utama agar saya bisa berfokus pada detail spesifikasi sepatu.
4. **Menyimpan Produk Favorit**: Sebagai Customer, saya ingin menyimpan sepatu basket favorit saya ke dalam daftar wishlist (*Saved Pairs*) agar saya dapat mencarinya kembali dengan mudah di lain waktu.
5. **Membaca Artikel Tips**: Sebagai Customer, saya ingin membaca artikel blog tentang tips latihan ketangkasan guard atau analisis gear sepatu basket agar wawasan olahraga saya terus bertambah.
6. **Mencari Berdasarkan Foto**: Sebagai Customer, saya ingin mengunggah foto sepatu basket dari perangkat saya agar sistem dapat secara otomatis menyaring sepatu yang memiliki warna serupa di katalog.
7. **Mengelola Keranjang Belanja**: Sebagai Customer, saya ingin memasukkan sepatu dengan ukuran pilihan saya ke keranjang belanja, memperbarui jumlah kuantitas, atau menghapus item secara real-time sebelum melakukan pembayaran.
8. **Simulasi Transaksi Pembayaran**: Sebagai Customer, saya ingin melakukan checkout barang dari keranjang belanja dan membayar dengan simulasi Midtrans Snap untuk menyelesaikan pembelian barang saya.
9. **Memantau Riwayat Belanja**: Sebagai Customer, saya ingin melihat riwayat status transaksi saya (*pending*, *paid*, *shipped*, *completed*) di halaman profil untuk melacak apakah barang sudah dikirim oleh pihak admin.

### 1.2.2. Aktor: Admin
1. **Melihat Statistik Dashboard**: Sebagai Admin, saya ingin melihat rangkuman total sepatu, pengguna terdaftar, keranjang aktif, dan jumlah artikel dalam satu halaman utama untuk mempermudah monitoring sistem.
2. **Mengelola Katalog Produk**: Sebagai Admin, saya ingin menambahkan sepatu basket baru ke sistem dengan mengunggah file gambar langsung dari folder komputer lokal (berformat base64) tanpa harus menginput link URL eksternal secara manual.
3. **Mengelola Artikel Berita**: Sebagai Admin, saya ingin menambahkan artikel tips latihan baru dan menghapus artikel usang demi memastikan kebaruan informasi web.
4. **Mengelola Status Logistik**: Sebagai Admin, saya ingin melihat seluruh pesanan masuk dari pelanggan dan memperbarui statusnya dari *paid* menjadi *shipped* ketika barang telah diserahkan ke kurir pengiriman.
5. **Mengelola Pengguna**: Sebagai Admin, saya ingin melihat semua user terdaftar, menaikkan peran (*role*) user tertentu menjadi admin pendamping, atau menghapus akun user yang melanggar aturan secara aman.

---

## 1.3. Use Case Diagram

Interaksi antara Customer dan Admin dengan sistem *Sneak On Ears* digambarkan pada diagram use case berikut:

```mermaid
usecaseDiagram
    actor Customer as "Customer (Pelanggan)"
    actor Admin as "Admin (Administrator)"

    rectangle System as "Platform Sneak On Ears" {
        usecase UC1 as "Registrasi & Login Akun"
        usecase UC2 as "Melihat Katalog & Detail Produk"
        usecase UC3 as "Menyimpan Produk (Saved Pairs)"
        usecase UC4 as "Melakukan Pencarian Warna (Visual Search)"
        usecase UC5 as "Membaca Artikel Olahraga"
        usecase UC6 as "Mengelola Keranjang Belanja"
        usecase UC7 as "Checkout & Simulasi Pembayaran"
        usecase UC8 as "Melihat Profil & Statistik Pengguna"
        
        usecase UC9 as "Melihat Statistik Dashboard"
        usecase UC10 as "Mengelola Katalog Sepatu\n(Tambah File Base64, Hapus)"
        usecase UC11 as "Mengelola Artikel Berita\n(Tambah, Hapus)"
        usecase UC12 as "Mengelola Transaksi Pesanan\n(Update Status, Hapus)"
        usecase UC13 as "Mengelola Akun Pengguna\n(Ubah Role, Hapus)"
    }

    Customer --> UC1
    Customer --> UC2
    Customer --> UC3
    Customer --> UC4
    Customer --> UC5
    Customer --> UC6
    Customer --> UC7
    Customer --> UC8

    Admin --> UC1
    Admin --> UC9
    Admin --> UC10
    Admin --> UC11
    Admin --> UC12
    Admin --> UC13

    UC6 ..> UC1 : "<<include>>\n(Harus Login)"
    UC7 ..> UC6 : "<<include>>"
```

---

## 1.4. Use Case Specification

Berikut adalah spesifikasi detail mengenai skenario langkah-langkah untuk beberapa Use Case utama di dalam sistem.

### 1.4.1. UC-01: Registrasi & Login Akun
- **Aktor**: Customer / Admin
- **Deskripsi**: Aktor melakukan pendaftaran akun baru atau masuk ke sistem untuk mendapatkan hak akses berbelanja atau mengelola dashboard admin.
- **Kondisi Awal (Pre-conditions)**: Aktor berada di halaman `/login` dan belum terautentikasi oleh session sistem.
- **Alur Utama (Basic Flow)**:
  1. Aktor menginput email, username, dan password pada form pendaftaran (untuk registrasi baru).
  2. Sistem melakukan pembersihan spasi tambahan (*trim*) di ujung email dan mengubah seluruh karakter email menjadi huruf kecil (*lowercase*).
  3. Sistem memeriksa keunikan email di database relasional `users`. Jika email belum terdaftar, data pengguna disimpan dengan role default `'customer'`.
  4. Untuk login, aktor menginput email dan sandi.
  5. Sistem melakukan normalisasi email dan mencocokkannya dengan database.
  6. Jika cocok, sistem menetapkan session pengguna ke local storage (`sneak_user`) dan mengarahkan ke halaman toko `/shop` atau `/admin` (jika role admin).
- **Alur Alternatif (Alternative Flow)**:
  - *Format Email Tidak Valid*: Sistem menolak input dan meminta aktor melengkapi format email yang benar.
  - *Email Sudah Terdaftar*: Sistem menampilkan pesan error "Email already registered".
  - *Password Salah*: Sistem menampilkan pesan error "Invalid email or password" di kartu login brutalis.

### 1.4.2. UC-02: Checkout Keranjang Belanja & Pembayaran
- **Aktor**: Customer
- **Deskripsi**: Customer memproses item-item di keranjang belanja menjadi pesanan resmi melalui simulasi pembayaran Midtrans.
- **Kondisi Awal (Pre-conditions)**: Customer sudah masuk (login), memiliki setidaknya satu produk di keranjang belanja, dan berada di halaman `/cart`.
- **Alur Utama (Basic Flow)**:
  1. Customer meninjau alamat pengiriman dan pilihan metode pembayaran standar pada form ringkasan checkout.
  2. Customer menekan tombol "Pay Simulated / Pay Now".
  3. Sistem mengirim permintaan ke server `/api/payment/checkout` untuk mencatat transaksi baru ke tabel `orders` dengan status `'pending'` dan mencatat detail item belanja ke tabel `order_items`.
  4. Sistem memanggil layanan Midtrans Snap API untuk memproduksi Snap Token.
  5. Pop-up Snap muncul di layar, atau sistem menjalankan simulasi pembayaran langsung.
  6. Setelah pembayaran berhasil dikonfirmasi oleh Payment Gateway, sistem memanggil `/api/payment/success` untuk memperbarui status pesanan menjadi `'paid'`.
  7. Sistem mengosongkan keranjang belanja milik Customer di database dan mengarahkannya kembali ke katalog dengan status transaksi sukses.
- **Kondisi Akhir (Post-conditions)**: Keranjang belanja kosong dan detail transaksi berstatus `'paid'` tercatat di riwayat transaksi profil Customer.

### 1.4.3. UC-03: Pencarian Visual Berbasis Warna (Visual Search)
- **Aktor**: Customer
- **Deskripsi**: Customer mengunggah berkas foto sepatu basket untuk mencari sepatu dengan warna yang mirip di katalog *Sneak On Ears*.
- **Kondisi Awal (Pre-conditions)**: Customer berada di halaman pencarian visual `/scan`.
- **Alur Utama (Basic Flow)**:
  1. Customer mengklik area dropzone atau mengunggah berkas gambar sepatu berformat PNG/JPG.
  2. Sistem membaca data pixel gambar dan mengekstrak 3 warna dominan teratas menggunakan algoritma ekstraksi warna canvas sisi klien.
  3. Sistem membandingkan palet warna tersebut dengan data warna yang dimiliki oleh koleksi sepatu di database.
  4. Sistem mengurutkan produk sepatu basket yang memiliki kemiripan warna tertinggi dari yang paling identik hingga yang terendah.
  5. Sistem menampilkan hasil pencarian tersebut dalam bentuk kartu produk yang dapat diklik untuk masuk ke halaman detail.

### 1.4.4. UC-04: Pengelolaan Produk Katalog (Admin)
- **Aktor**: Admin
- **Deskripsi**: Admin menambah produk sepatu basket baru ke dalam database katalog dengan melampirkan berkas gambar lokal.
- **Kondisi Awal (Pre-conditions)**: Admin telah login dengan role `'admin'` dan berada di tab **Manage Products** di halaman `/admin`.
- **Alur Utama (Basic Flow)**:
  1. Admin mengklik tombol "Add New Product" untuk memunculkan formulir produk baru.
  2. Admin mengisi form (ID sepatu, Nama sepatu, Harga, Deskripsi, Warna Utama, badge status, dan ukuran kaki).
  3. Admin memilih file gambar dari komputer lokal menggunakan tombol "Choose File".
  4. Sistem membaca file tersebut secara asinkron dan mengubahnya menjadi string teks Base64 berukuran panjang.
  5. Admin menekan tombol submit "Save Product".
  6. Server menyimpan data string base64 tersebut langsung ke dalam kolom bertipe `LONGTEXT` di tabel `sneakers` database MySQL.
  7. Katalog diperbarui dan produk baru langsung muncul di katalog web.
