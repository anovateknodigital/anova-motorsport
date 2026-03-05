# Anova Motorsport - Database Schema

Dokumen ini berisi rancangan skema database (tabel dan relasi) yang dibutuhkan untuk mendukung fitur yang ada pada halaman Beranda (`app/page.tsx`) dan halaman Tentang Kami (`app/about/page.tsx`).

---

## 1. Tabel `events`
Tabel ini menyimpan data event balap yang akan datang maupun yang sudah lewat (digunakan pada section "Upcoming Events").

| Nama Kolom | Tipe Data | Keterangan | Tampil di UI |
| :--- | :--- | :--- | :--- |
| `id` | `UUID` (Primary Key) | ID unik event | Tidak |
| `title` | `VARCHAR` | Nama event (contoh: "ANOVA DRAG BIKE / DRAG RACE") | Ya |
| `type` | `VARCHAR` | Jenis balapan (contoh: "Drag Race", "Motoprix") | Ya |
| `start_date` | `TIMESTAMPTZ` | Waktu mulai event (digunakan untuk Countdown Timer) | Ya |
| `end_date` | `TIMESTAMPTZ` | Waktu selesai event | Ya (dirender sbg rentang tgl) |
| `time_info` | `VARCHAR` | Rentang waktu dalam hari (contoh: "08:00 - 17:00 WIB") | Ya |
| `location` | `TEXT` | Alamat / lokasi sirkuit | Ya |
| `image_url` | `TEXT` | URL gambar poster / background event | Ya |
| `track_image_url`| `TEXT` | (Opsional) URL gambar lintasan sirkuit (seperti di Motoprix) | Ya |
| `registration_url`| `TEXT` | Link untuk tombol "Daftar Online" | Ya (sebagai link) |
| `details_url` | `TEXT` | Link untuk tombol "Detail & Regulasi" | Ya (sebagai link) |
| `is_active` | `BOOLEAN` | Status apakah event masih aktif / akan datang | Tidak |
| `created_at` | `TIMESTAMPTZ` | Waktu record dibuat | Tidak |
| `updated_at` | `TIMESTAMPTZ` | Waktu record diubah | Tidak |

---

## 2. Tabel `race_results`
Menyimpan hasil balapan terakhir dari berbagai event (digunakan pada section "Latest Race Results").

| Nama Kolom | Tipe Data | Keterangan | Tampil di UI |
| :--- | :--- | :--- | :--- |
| `id` | `UUID` (Primary Key) | ID unik hasil balap | Tidak |
| `event_id` | `UUID` (Foreign Key) | Relasi ke tabel `events` | Ya (mengambil type event) |
| `class_name` | `VARCHAR` | Nama kelas balap (contoh: "Underbone 150cc") | Ya |
| `winner_name` | `VARCHAR` | Nama pemenang (contoh: "Bintang N.", "Reza V.") | Ya |
| `winner_team` | `VARCHAR` | Nama tim pemenang (contoh: "Anova RT") | Ya (opsional) |
| `time_result` | `VARCHAR` | Catatan waktu (contoh: "09.012s" untuk Drag Race) | Ya (opsional) |
| `created_at` | `TIMESTAMPTZ` | Waktu record dibuat | Tidak |
| `updated_at` | `TIMESTAMPTZ` | Waktu record diubah | Tidak |

---

## 3. Tabel `media_galleries`
Menyimpan daftar foto untuk bagian "Media Gallery".

| Nama Kolom | Tipe Data | Keterangan | Tampil di UI |
| :--- | :--- | :--- | :--- |
| `id` | `UUID` (Primary Key) | ID unik galeri | Tidak |
| `image_url` | `TEXT` | URL gambar | Ya |
| `caption` | `VARCHAR` | Deskripsi singkat / alt text (contoh: "Paddock") | Ya (sebagai Alt) |
| `is_featured` | `BOOLEAN` | Apakah gambar ditampilkan di grid beranda | Tidak |
| `created_at` | `TIMESTAMPTZ` | Waktu record dibuat | Tidak |

---

## 4. Tabel `videos`
Menyimpan data video YouTube / video lokal untuk section "Latest Race Videos".

| Nama Kolom | Tipe Data | Keterangan | Tampil di UI |
| :--- | :--- | :--- | :--- |
| `id` | `UUID` (Primary Key) | ID unik video | Tidak |
| `title` | `VARCHAR` | Judul video | Ya |
| `tag` | `VARCHAR` | Label video (contoh: "Full Race", "Highlight", "Onboard")| Ya |
| `thumbnail_url`| `TEXT` | URL gambar thumbnail video | Ya |
| `video_url` | `TEXT` | Link YouTube / file video | Ya (ketika di-klik) |
| `is_main` | `BOOLEAN` | Penanda apakah video menjadi highlight utama berukuran besar | Tidak |
| `created_at` | `TIMESTAMPTZ` | Waktu record dibuat | Tidak |

---

## 5. Tabel `news`
Menyimpan artikel berita dan update untuk section "News & Updates".

| Nama Kolom | Tipe Data | Keterangan | Tampil di UI |
| :--- | :--- | :--- | :--- |
| `id` | `UUID` (Primary Key) | ID unik berita | Tidak |
| `title` | `VARCHAR` | Judul berita | Ya |
| `slug` | `VARCHAR` | URL friendly string untuk path (contoh: `panduan-scrutineering`) | Tidak |
| `content` | `TEXT` | Isi berita lengkap (HTML/Markdown) | Tidak (tampil di halaman detail)|
| `image_url` | `TEXT` | Gambar cover berita | Ya |
| `published_at` | `TIMESTAMPTZ` | Tanggal publikasi (ditampilkan sebagai "Maret 12, 2026")| Ya |
| `author_id` | `UUID` | (Opsional) Penulis berita | Tidak |
| `created_at` | `TIMESTAMPTZ` | Waktu record dibuat | Tidak |
| `updated_at` | `TIMESTAMPTZ` | Waktu record diubah | Tidak |

---

## 6. Tabel `sponsors`
Menyimpan logo mitra / sponsor untuk section "Official Partners".

| Nama Kolom | Tipe Data | Keterangan | Tampil di UI |
| :--- | :--- | :--- | :--- |
| `id` | `UUID` (Primary Key) | ID unik sponsor | Tidak |
| `name` | `VARCHAR` | Nama organisasi sponsor | Ya (sebagai Alt text) |
| `logo_url` | `TEXT` | URL gambar logo | Ya |
| `website_url` | `TEXT` | Link ke website sponsor | Ya (jika bisa di-klik) |
| `is_active` | `BOOLEAN` | Apakah sponsor masih aktif untuk ditampilkan | Tidak |
| `display_order`| `INT` | Urutan penempatan logo di halaman | Tidak |

---

## 7. Tabel `platform_settings`
Tabel ini digunakan untuk mengatur statistik dinamis dan konten yang jarang berubah namun perlu dikelola dari CMS, seperti info pada "Quick Stats", deskripsi footer, dan halaman "Tentang Kami" (About Founder). Sebaiknya tabel ini hanya memiliki satu *row* record aktif.

| Nama Kolom | Tipe Data | Keterangan | Tampil di UI |
| :--- | :--- | :--- | :--- |
| `id` | `UUID` (Primary Key) | ID unik pengaturan (biasanya fixed 1 baris) | Tidak |
| `stat_events` | `INT` | Total "Event Terlaksana" (contoh: 50) | Ya (Home) |
| `stat_racers` | `INT` | Total "Pembalap Terdaftar" (contoh: 1000) | Ya (Home) |
| `stat_classes` | `INT` | Total "Kategori Kelas" (contoh: 20) | Ya (Home) |
| `stat_years` | `INT` | Total "Tahun Pengalaman" (contoh: 10) | Ya (Home) |
| `founder_name` | `VARCHAR` | Nama Pendiri (contoh: "RAMLI ANOVA") | Ya (About) |
| `founder_title`| `VARCHAR` | Jabatan/Status (contoh: "Founder & Chairman") | Ya (About) |
| `founder_quote`| `TEXT` | Kutipan (contoh: "Sirkuit bukan hanya jalan...") | Ya (About) |
| `founder_desc` | `TEXT` | Paragraf deskripsi visi & perjalanan | Ya (About) |
| `founder_img` | `TEXT` | URL foto founder | Ya (About) |
| `contact_email`| `VARCHAR` | Email rujukan utama (contoh: `anova@anovamotorsport.com`) | Ya (Footer & About)|
| `contact_phone1`| `VARCHAR` | Nomor kontak pendaftaran | Ya (Footer) |
| `contact_phone2`| `VARCHAR` | Nomor kontak darurat | Ya (Footer) |
| `address` | `TEXT` | Alamat lengkap perusahaan | Ya (Footer) |
| `social_ig` | `TEXT` | Link Instagram | Ya (Header, Footer, Menu)|
| `social_tw` | `TEXT` | Link Twitter / X | Ya (Header, Footer, Menu)|
| `social_yt` | `TEXT` | Link YouTube | Ya (Header, Footer, Menu)|
| `updated_at` | `TIMESTAMPTZ` | Terakhir kali pengaturan diubah | Tidak |
