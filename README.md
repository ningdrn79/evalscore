# Aplikasi Web Poling Penilaian Presentasi (Multi-Kelas & Realtime Google Sheets)

Aplikasi web interaktif berbasis Single-Page Application (SPA) untuk **penilaian presentasi kelompok antar teman (peer assessment)** dan **penilaian guru**. Sistem ini mendukung 5 kelas (6A, 6B, 6C, 6D, 6E) dan terhubung **secara realtime terpusat ke Google Sheets**, sehingga saat ada kelompok baru atau nilai baru dimasukkan di satu komputer/HP, perangkat lain akan **langsung otomatis melihat perubahannya dalam hitungan detik**!

---

## 📁 File Penting di Folder Ini:
1. **[index.html](file:///d:/Macem-macem/index.html)**: File utama aplikasi web (bisa dibuka langsung di browser Chrome/Edge atau di-host).
2. **[kode-google-sheets.js](file:///d:/Macem-macem/kode-google-sheets.js)**: Kode Google Apps Script terbaru (mendukung sinkronisasi realtime, multi-kelas 6A-6E, dan penambahan/penghapusan kelompok).

---

## ⚡ Fitur Sinkronisasi Realtime Antar Komputer / HP
- **Otomatis Realtime (Polling 5 Detik)**: Komputer siswa dan guru secara otomatis menyinkronkan data setiap 5 detik di latar belakang tanpa me-refresh halaman.
- **Pendaftaran Kelompok Instan**: Begitu kelompok baru didaftarkan di komputer A (oleh siswa atau guru), kelompok tersebut langsung tersimpan ke Google Sheets dan muncul di daftar dropdown komputer B.
- **Dukungan Multi-Kelas (6A s/d 6E)**: Kelompok dan penilaian terpisah rapi per kelas di Google Sheets.
- **Mode Offline Graceful**: Jika internet terputus, data tetap aman tersimpan di penyimpanan lokal browser.

---

## 🛠️ Langkah Menghubungkan Google Sheets (Hanya 3 Menit)

Agar komputer dan smartphone lain dapat saling melihat kelompok dan penilaian secara bersamaan, hubungkan aplikasi ke Google Spreadsheet Anda:

### Langkah 1: Buat Spreadsheet Baru
1. Buka [Google Sheets](https://sheets.google.com).
2. Buat spreadsheet kosong baru dan beri nama, misalnya: **Rekap Penilaian Presentasi Kelas 6**.

### Langkah 2: Pasang Kode Script Terbaru
1. Di Google Sheets, klik menu **Ekstensi** (*Extensions*) > **Apps Script**.
2. Hapus seluruh isi kode bawaan di editor.
3. Buka file **[kode-google-sheets.js](file:///d:/Macem-macem/kode-google-sheets.js)**, salin (copy) semua isinya, lalu tempel (paste) ke editor Apps Script.
4. Klik tombol **Simpan** (ikon Disket).

### Langkah 3: Deploy sebagai Web App
1. Klik tombol biru **Terapkan** (*Deploy*) di kanan atas > pilih **Penerapan baru** (*New deployment*).
   *(Catatan: Jika sebelumnya sudah pernah deploy, klik "Kelola penerapan" > Edit ikon pensil > pilih Versi Baru).*
2. Pada jenis penerapan, klik ikon gerigi ⚙️ > pilih **Aplikasi Web** (*Web app*).
3. Atur pengaturannya:
   - **Keterangan**: `Versi Realtime Multi-Kelas`
   - **Jalankan sebagai** (*Execute as*): `Saya (email Anda)`
   - **Siapa yang memiliki akses** (*Who has access*): **`Siapa saja` (*Anyone*)** ⚠️ *(Wajib dipilih agar semua siswa dan komputer dapat tersambung)*.
4. Klik **Terapkan** (*Deploy*).
5. Beri izin akses akun Google jika diminta (*Lanjutan / Advanced* > *Buka...* > *Izinkan*).
6. **Salin URL Aplikasi Web** yang muncul (berakhiran `/exec`).

### Langkah 4: Hubungkan ke Aplikasi Web
1. Buka file **[index.html](file:///d:/Macem-macem/index.html)** di browser komputer Anda.
2. Di pojok kanan atas, klik tombol status **Sheets** (atau klik ikon Sheets di Meja Guru).
3. Tempelkan URL yang berakhiran `/exec` tadi ke dalam kotak input.
4. Klik **"Simpan & Hubungkan"**. Anda juga bisa klik **"Uji Sambungan"** untuk memastikan koneksi lancar.
5. Indikator di kanan atas akan berubah menjadi hijau: **`Sheets: Realtime Aktif 🟢`**.
6. Buka juga aplikasi di komputer/HP lain dengan link/file yang sama dan simpan URL yang sama. Sekarang semua perangkat saling terhubung realtime!
