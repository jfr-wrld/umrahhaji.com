import Image from 'next/image';
import ChatbotWidget from '@/components/ChatbotWidget';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-8">
      <main className="max-w-2xl text-center space-y-6">
        <Image src="/logo-full.svg" alt="UmrahHaji Logo" width={240} height={60} className="mx-auto mb-4" />
        <h1 className="text-4xl font-bold text-gray-900">Selamat Datang di UmrahHaji.com</h1>
        <p className="text-gray-600 text-lg">
          Platform terpercaya untuk perjalanan ibadah Umrah dan Haji Anda.
        </p>
        <div className="p-6 bg-white rounded-xl shadow-sm border text-left">
          <h2 className="font-semibold text-xl mb-4 text-emerald-700">Coba Fitur Asisten AI!</h2>
          <p className="text-gray-600 mb-4">
            Kami telah mengintegrasikan Asisten Virtual (Chatbot AI) di pojok kanan bawah layar ini. 
            Silakan klik tombol 💬 untuk mencoba interaksi:
          </p>
          <ul className="list-disc pl-5 space-y-2 text-sm text-gray-700">
            <li>Tanyakan: <strong>"Apa saja dokumen untuk mendaftar umrah?"</strong></li>
            <li>Tanyakan: <strong>"Bagaimana cara pembayarannya?"</strong></li>
            <li>Tanyakan: <strong>"Kapan info hotel keluar?"</strong></li>
          </ul>
          <p className="text-xs text-gray-400 mt-6">* Jawaban dihasilkan secara pintar menggunakan LangChain RAG & MiMo API.</p>
        </div>
        
        {/* Contact Info Section */}
        <div className="mt-8 text-sm text-gray-500">
          <p>Butuh bantuan langsung? Hubungi Customer Service kami:</p>
          <div className="flex items-center justify-center gap-6 mt-3">
            <a href="https://wa.me/6281234567890" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-emerald-600 hover:text-emerald-700 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
              +62 812-3456-7890
            </a>
            <a href="mailto:cs@umrahhaji.dummy.com" className="flex items-center gap-2 text-emerald-600 hover:text-emerald-700 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"></rect><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path></svg>
              cs@umrahhaji.dummy.com
            </a>
          </div>
        </div>
      </main>
      <ChatbotWidget />
    </div>
  );
}
