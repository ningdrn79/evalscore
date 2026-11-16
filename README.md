# Aplikasi Web Poling Penilaian Presentasi (Terintegrasi Google Sheets)

Aplikasi web modern berbasis Single-Page Application (SPA) untuk **penilaian presentasi kelompok antar teman (peer assessment)** yang terhubung langsung secara terpusat ke **Google Sheets** dan digabungkan otomatis dengan **penilaian guru**.

---

## 📁 File Penting di Folder Ini:
1. **[index.html](file:///d:/Macem-macem/index.html)**: File utama aplikasi web (buka langsung di browser).
2. **[kode-google-sheets.js](file:///d:/Macem-macem/kode-google-sheets.js)**: Kode Google Apps Script siap pakai untuk ditempel di Google Sheets Anda.

---

## 🛠️ Langkah Mudah Menghubungkan ke Google Sheets (Hanya 3 Menit)

Dengan menghubungkan ke Google Sheets, seluruh siswa bisa membuka web penilaian dari **smartphone masing-masing**, dan saat mereka menekan **"Kirim Penilaian"**, suara mereka akan **langsung otomatis masuk ke Spreadsheet Anda** secara terpusat.

### Langkah 1: Buat Google Spreadsheet Baru
1. Buka [Google Sheets](https://sheets.google.com).
2. Buat spreadsheet kosong baru dan beri nama, misalnya: **Rekap Penilaian Presentasi**.

### Langkah 2: Pasang Kode Script
1. Di Google Sheets, klik menu **Ekstensi** (*Extensions*) > **Apps Script**.
2. Hapus seluruh isi kode bawaan yang ada di editor.
3. Buka file **[kode-google-sheets.js](file:///d:/Macem-macem/kode-google-sheets.js)**, salin (copy) semua isinya, lalu tempel (paste) ke editor Apps Script.
4. Klik tombol **Simpan** (ikon Disket).

### Langkah 3: Deploy sebagai Web App
1. Klik tombol biru **Terapkan** (*Deploy*) di pojok kanan atas > pilih **Penerapan baru** (*New deployment*).
2. Pada jenis penerapan, klik ikon gerigi ⚙️ > pilih **Aplikasi Web** (*Web app*).
3. Atur pengaturannya:
   - **Keterangan**: `Versi 1`
   - **Jalankan sebagai** (*Execute as*): `Saya (email Anda)`
   - **Siapa yang memiliki akses** (*Who has access*): **`Siapa saja` (*Anyone*)** ⚠️ *(Wajib dipilih agar siswa bisa mengirim penilaian tanpa perlu login akun Google khusus)*.
4. Klik **Terapkan** (*Deploy*).
5. Jika muncul permintaan izin (*Authorization required*), klik **Beri akses** > pilih akun Anda > klik *Advanced* / *Lanjutan* > klik *Go to (unsafe)* / *Buka* > klik **Izinkan** (*Allow*).
6. **Salin URL Aplikasi Web** yang muncul (berakhiran `/exec`).

### Langkah 4: Hubungkan ke Aplikasi
1. Buka file **[index.html](file:///d:/Macem-macem/index.html)** di browser.
2. Di pojok kanan atas, klik tombol **"Google Sheets: Offline"** atau menu **"Setup Google Sheets"** di Dashboard Guru.
3. Tempelkan URL yang sudah disalin tadi, lalu klik **"Simpan & Hubungkan"**.
4. Selesai! Indikator akan berubah menjadi hijau **"Google Sheets: Live"**.

---

## 📲 Cara Siswa Mengakses Aplikasi
1. Guru dapat meng-upload file `index.html` ini ke hosting gratis seperti **GitHub Pages**, **Netlify Drop**, **Vercel**, atau membagikan link-nya via local WiFi.
2. Siswa membuka link form dari HP, memilih nama kelompok yang sedang presentasi, memberi penilaian bintang 1-4, dan menekan tombol **Kirim Penilaian**.
3. Di laptop Guru, buka **Dashboard Guru** dan klik tombol **"Tarik Data Terbaru dari Google Sheets"** untuk melihat rekapitulasi, grafik komparasi, dan nilai akhir yang langsung terhitung secara otomatis.
