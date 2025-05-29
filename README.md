# Pet Clinic System 🐾🏥

Aplikasi ini adalah sistem manajemen klinik hewan, yang menyediakan berbagai fitur untuk memudahkan pengelolaan data hewan, klien, perawatan, dan vaksinasi. Tersedia berbagai role untuk setiap pengguna, yang memudahkan akses dan pengelolaan data. Pet Clinic System ini dibuat oleh kelompok A01 dengan anggota :
- Regina Meilani Aruan - 2306275632  
- Raisa Sakila - 2306165755  
- Shabrina Aulia Kinanti - 2306245472  
- Valentino Kim Fernando - 2306275771

---
## Link Deploy
Akses aplikasi secara online melalui link berikut:  
[a01-pet-clinic](https://a01-pet-clinic.vercel.app/)

## Daftar Fitur 🔧

###  **Navbar** - Raisa Sakila (2306165755)
Fitur wajib yang tersedia untuk semua pengguna sebagai navigasi utama aplikasi.

### **C - Pengguna** - Valentino Kim Fernando (2306275771)
Manajemen pengguna yang bisa diakses oleh semua role.

###  **R - Login dan Logout**  - Shabrina Aulia Kinanti (2306245472)
Fitur login dan logout untuk semua pengguna.

###  **RU - Dashboard Pengguna**  - Regina Meilani Aruan (2306275632)
Tampilan dashboard untuk setiap pengguna setelah login, memudahkan akses ke fitur-fitur yang relevan dengan role masing-masing.

## 🟡 **Fitur Kuning**  - Valentino Kim Fernando (2306275771)

### R - Jenis Hewan
Fitur untuk melihat jenis-jenis hewan yang terdaftar, dapat diakses oleh Front-Desk Officer dan Dokter Hewan.

### CUD - Jenis Hewan
Menambah, mengubah, dan menghapus data jenis hewan yang dapat diakses oleh Front-Desk Officer.

### CRU - Hewan Peliharaan
Menambah, mengubah, dan melihat data hewan peliharaan, diakses oleh Front-Desk Officer dan Klien.

### D - Hewan Peliharaan
Menghapus data hewan peliharaan yang dapat diakses oleh Front-Desk Officer.

## 🟢 **Fitur Hijau**  - Raisa Sakila (2306165755)

### CRUD - Perawatan Hewan
Menambah, mengubah, menghapus, dan melihat data perawatan hewan, dapat diakses oleh semua role.

### R - Kunjungan
Fitur untuk melihat data kunjungan hewan ke klinik, dapat diakses oleh semua role.

### CUD - Kunjungan
Menambah, mengubah, dan menghapus data kunjungan, diakses oleh Front-Desk Officer.

### R - Rekam Medis
Fitur untuk melihat data rekam medis hewan, dapat diakses oleh semua role.

### CU - Rekam Medis
Mengubah dan menambah rekam medis, dapat diakses oleh Dokter Hewan.

##  🔵 **Fitur Biru** - Regina Meilani Aruan (2306275632)

### CRUD - Manajemen Obat
Menambah, mengubah, menghapus, dan melihat data obat yang dikelola oleh Tenaga Medis.

### CRUD - Manajemen Perawatan 
Menambah, mengubah, menghapus, dan melihat data perawatan hewan, dikelola oleh Tenaga Medis.

### CRD - Pemberian Obat di Perawatan
Menambah, melihat, dan menghapus pemberian obat pada perawatan hewan, dapat diakses oleh Dokter Hewan dan Klien.

##  🔴 **Fitur Merah** - Shabrina Aulia Kinanti (2306245472)

### RUD - Manajemen Vaksinasi Hewan 
Menambah, mengubah, menghapus, dan melihat data vaksinasi hewan yang dikelola oleh Dokter Hewan.

### CRUD - Data dan Stok Vaksin 
Mengelola data dan stok vaksin, fitur ini dikelola oleh Staf Klinik.

### R - Data Klien dan Hewan Peliharaan
Melihat data klien dan hewan peliharaan yang terdaftar, dapat diakses oleh Front-Desk Officer.

---

## Teknologi yang Digunakan ⚙️

- **Next.js**: Framework utama untuk frontend, menyediakan rendering sisi server (SSR) dan statis (SSG).
- **React.js**: Digunakan untuk membangun antarmuka pengguna interaktif.
- **HTML/CSS**: Untuk struktur dan styling halaman.
- **JavaScript**: Untuk interaktivitas di sisi klien.

---

## Routing Next.js 📍

Di dalam proyek ini, **Next.js** digunakan untuk routing antarmuka pengguna (frontend) dengan rute `http://localhost:3000`
