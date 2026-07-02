# Chatbot AI - Design & Architecture (Desain & Arsitektur)

## 1. Pendekatan Desain UI/UX (Design Principles)

Sesuai dengan Master PRD UmrahHaji.com, pendekatan difokuskan pada konsep *Mobile-First*, menanamkan *Trust and Calm*, serta memudahkan *Progress Visibility*.

### A. Penempatan Antarmuka (Interface Placement)
*   **Floating Action Button (FAB):** Ikon Chatbot (misal: logo asisten virtual dengan sentuhan Islami) ditempatkan secara persisten di pojok kanan bawah antarmuka web.
*   **Bottom Sheet (Mobile) / Side Drawer (Desktop):** Saat ikon ditekan, panel chat tidak akan menutupi seluruh layar (*full-screen blocking*), melainkan berupa *bottom sheet* pada *smartphone* atau *side drawer* pada tablet/desktop. Pengguna tetap dapat melihat dan menggulir halaman (*scrolling*) web yang sedang mereka akses.

### B. Elemen Komunikasi Visual
*   **Welcome Message & Quick Replies:** Di awal, tampilkan ucapan selamat datang yang terpersonalisasi (jika sudah *login*) dan tawarkan *chips/buttons* respon cepat seperti `Cek Status Pembayaran`, `Upload Dokumen`, atau `Tanya Itinerary`.
*   **Typing Indicator:** Menampilkan animasi "sedang mengetik" (tiga titik berkedip) agar interaksi terasa lebih humanis dan pengguna tahu AI sedang memproses (*fetching data*).
*   **Rich Media Cards:** AI akan merespons menggunakan komponen visual (*Cards*) untuk informasi kompleks. Contoh:
    *   *Package Card:* Menampilkan *thumbnail*, nama paket, travel agent, harga, dan tombol CTA "Lihat Detail".
    *   *Itinerary Card:* Menampilkan ringkasan jam dan agenda.
*   **State Transparency:** Jelas membedakan secara visual apakah pengguna sedang berbicara dengan *Bot (AI)* atau telah dieskalasi ke *Live Agent (CS)*.

## 2. Arsitektur Sistem (System Architecture)

### A. Komponen Utama Arsitektur
1.  **Frontend (Jamaah View):** UI *widget* Chatbot responsif yang tertanam di platform Web.
2.  **AI/NLP Engine:**
    *   *NLU (Natural Language Understanding):* Untuk deteksi intensi pengguna dan ekstraksi entitas (misal: "kapan", "harga", "berapa").
    *   *RAG (Retrieval-Augmented Generation):* Algoritma LLM dihubungkan dengan *Knowledge Base* (artikel FAQ, T&C platform, panduan Umrah) agar respon AI tidak berhalusinasi dan berpegang pada fakta spesifik platform.
3.  **Integration Layer (API Gateway):** 
    *   Layer khusus (*middleware*) yang menghubungkan perintah *Chatbot Engine* dengan API internal UmrahHaji.com (Admin Panel, Travel Agency Portal).
4.  **Backend Services:** Layanan inti platform seperti *Auth*, *Booking*, *Billing*, *Document*, dan *Itinerary*.

### B. Alur Integrasi Data (Data Flow)
1.  **Context & Auth:** Jika *User* sudah *login*, UI Chatbot mengirimkan *Session ID/Token*. Jika belum, *User* berstatus *Anonymous* (hanya bisa tanya FAQ & cari paket publik).
2.  **Query Execution:** 
    *   Pengguna bertanya: "Saya belum bayar, tolong invoice-nya."
    *   NLP Engine mendeteksi intent `check_invoice`.
    *   AI memanggil API *Billing/Finance* melalui Gateway untuk *Booking ID* pengguna tersebut.
    *   Gateway mengembalikan status `Unpaid`.
    *   AI Engine men-generate teks respons dan melampirkan komponen *Invoice Card*, lalu dikirim ke Frontend.
3.  **Handoff to Human:** Apabila skor konfidensi AI di bawah *threshold* atau jamaah meminta "Saya butuh bicara dengan manusia", AI memanggil API *Report Management* untuk mendelegasikan tiket ke tim Support/Mutawwif.

## 3. Data Privacy & Security (Keamanan Data)

Fitur keamanan ini mutlak untuk menjaga kerahasiaan jamaah (mengacu pada *Privacy Requirements* di PRD):
*   **Data Masking:** Chatbot dilarang keras meminta nomor *IC/NRIC*, paspor, atau detail kartu kredit penuh melalui kotak teks percakapan. Jika dibutuhkan *upload*, AI memberikan *link CTA* yang mengarah ke formulir *secure upload* di modul *Profile/Documents*.
*   **Read-Only Orientation:** Chatbot mayoritas melakukan operasi pembacaan (Read). Transaksi yang sensitif (seperti membatalkan pesanan, mengubah preferensi anggota keluarga) harus tetap diselesaikan oleh pengguna di halaman web resmi untuk memastikan audit log transaksi valid.
*   **Audit Logging:** Seluruh *chat transcript* disimpan dengan enkripsi untuk tujuan pengawasan mutu (QA) dan referensi historis, serta mematuhi aturan privasi data.

## 4. Analitik & Evaluasi Metrik

*   **Deflection Rate:** Persentase interaksi sukses dengan AI tanpa perlu intervensi atau pembuatan tiket CS.
*   **Completion Rate:** Tingkat keberhasilan jamaah menyelesaikan aksi (contoh: klik "Bayar" dari notifikasi *chatbot*).
*   **CSAT (Customer Satisfaction Score):** Skor kepuasan yang dikumpulkan via survei singkat (bintang/jempol) di akhir sesi *chat*.
