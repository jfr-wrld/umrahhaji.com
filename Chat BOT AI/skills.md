# Chatbot AI - Skills & Requirements (Kebutuhan & Kemampuan)

## 1. Visi & Tujuan Utama
Chatbot AI dirancang untuk menjadi asisten virtual 24/7 bagi jamaah di platform UmrahHaji.com. Tujuannya adalah untuk memberikan informasi yang akurat, membantu proses transaksional dan operasional jamaah, serta mengurangi beban kerja *Customer Service* (CS) manusia.

## 2. Persona & Gaya Bahasa
*   **Persona:** Ramah, sabar, empatik, dan profesional.
*   **Gaya Bahasa:** Menggunakan bahasa Indonesia yang baik, sopan, dan inklusif. Menggunakan sapaan Islami (misal: "Assalamualaikum", "Bapak/Ibu", "InsyaAllah").
*   **Tone:** Menenangkan (*calm*) dan dapat dipercaya (*trustworthy*), sejalan dengan prinsip UX platform UmrahHaji.com.

## 3. Daftar Skill Utama (Core Capabilities)

### A. Layanan Pra-Keberangkatan (Discovery & Onboarding)
*   **Bantuan Registrasi:** Memandu jamaah terkait tata cara pembuatan akun, verifikasi email/telepon, atau cara menerima undangan (*invitation*) dari Travel Agent.
*   **Pencarian & Rekomendasi Paket:**
    *   Mampu memproses kriteria pencarian (destinasi, travel agent, jadwal keberangkatan, harga, dan tipe paket).
    *   *Contoh:* Jamaah mengetik "Tampilkan paket Umrah bulan depan dengan budget di bawah Rp 30 juta", lalu Chatbot menampilkan *rich cards* berisi rekomendasi paket.
*   **Tanya Jawab Syarat Umrah/Haji:** Mengakses *Knowledge Base* (artikel/panduan) untuk menjawab pertanyaan seputar ibadah, cuaca, dan persiapan fisik.

### B. Layanan Booking & Pembayaran (Transactional)
*   **Cek Status Booking:** Memberikan update status reservasi (Draft, Pending Confirmation, Confirmed).
*   **Panduan Pembayaran:** Menjelaskan instruksi pembayaran, memberikan rincian *invoice*, menginformasikan status pembayaran (*Unpaid, Partial Paid, Paid*).
*   **Notifikasi Proaktif:** Memberikan pengingat tagihan/jatuh tempo secara otomatis ke dalam *thread* chat.

### C. Manajemen Dokumen & Profil (Readiness)
*   **Status Kelengkapan:** Mengingatkan dokumen apa saja yang berstatus *Missing*, *Under Review*, atau *Need Revision* (Paspor, Visa, Vaksin).
*   **Panduan Upload:** Memberikan instruksi ukuran file (Maks 5 MB) dan format yang diterima (JPG/PDF) tanpa meminta dokumen rahasia dikirim langsung ke chat.

### D. Layanan Perjalanan (My Group Trip & Itinerary)
*   **Detail Itinerary:** Menjawab jadwal kegiatan per hari, lokasi, info hotel, dan maskapai penerbangan.
*   **Info Tim Lapangan:** Menyediakan nama, foto, dan nomor kontak Mutawwif serta kontak penanggung jawab agen travel.
*   **Kesiapan & Keberangkatan:** Mengingatkan jadwal kumpul di bandara, info *gate*, dan persiapan khusus (*checklist* ihram).

### E. Penanganan Masalah & Eskalasi (Reports & Support)
*   **Troubleshooting Dasar:** Menyelesaikan kendala umum (contoh: cara ganti password, letak menu *Payment*).
*   **Eskalasi ke CS (Handover):** Jika Chatbot tidak menemukan jawaban, ia akan otomatis membuatkan tiket *Report/Support* di modul *Admin/Travel Agency* dan menginformasikan ID tiket kepada pengguna.

## 4. Alur Interaksi & Pengerjaan (Workflow)

1.  **Trigger / Sapaan Awal:** Chatbot menyapa pengguna secara kontekstual. Jika di halaman *Payment*, tawarkan bantuan terkait pembayaran; jika di halaman *My Trip*, berikan *update* perjalanan.
2.  **Intent Recognition:** Membaca input pengguna dan menentukan klasifikasi *intent* menggunakan Natural Language Processing (NLP).
3.  **Data Retrieval (Integrasi Backend):** Mengambil data secara *real-time* dari sistem backend platform (seperti *Booking Management* atau *Group Trip*).
4.  **Response Generation:** Menyusun jawaban berbasis konteks menggunakan LLM yang digabungkan dengan panduan kebijakan platform.
5.  **Call to Action (CTA):** Memberikan tombol (*Quick Replies*) yang langsung mengarahkan pengguna ke halaman terkait (misal: tombol "Bayar Sekarang" yang mengarah ke form *Payment Gateway*).
6.  **Feedback Loop:** Di akhir solusi, Chatbot akan meminta respon "Apakah jawaban ini membantu?" untuk kebutuhan perbaikan AI secara berkelanjutan.
