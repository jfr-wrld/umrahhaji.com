'use client';

import { useChat } from 'ai/react';
import { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { X, Volume2, VolumeX, Mic, MicOff, Send, ThumbsUp, ThumbsDown, AlertCircle, Headset } from 'lucide-react';

export default function ChatbotWidget() {
  const [country, setCountry] = useState('ID');
  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat({
    body: { country }
  });
  const [isOpen, setIsOpen] = useState(false);
  const [playingId, setPlayingId] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const [isListening, setIsListening] = useState(false);
  const pathname = usePathname();

  const getContextName = () => {
    if (pathname === '/') return 'Beranda';
    if (pathname?.includes('/package')) return 'Detail Paket';
    if (pathname?.includes('/booking')) return 'Pemesanan';
    return 'Layanan Umum';
  };

  const [feedback, setFeedback] = useState<Record<string, 'up' | 'down'>>({});
  
  const handleFeedback = (id: string, type: 'up' | 'down') => {
    setFeedback(prev => ({ ...prev, [id]: type }));
    // Simulasi Toast
    alert(type === 'up' ? "Terima kasih! Umpan balik Anda sangat membantu." : "Mohon maaf jika jawaban belum sesuai. Kami akan memperbaikinya.");
  };

  const handleSuggestedClick = (text: string) => {
    handleInputChange({ target: { value: text } } as any);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const toggleListening = () => {
    if (isListening) {
      setIsListening(false);
      return;
    }
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Browser Anda tidak mendukung fitur suara.");
      return;
    }
    const recognition = new SpeechRecognition();
    recognition.lang = 'id-ID';
    recognition.interimResults = false;
    
    recognition.onstart = () => {
      console.log("Speech recognition started");
      setIsListening(true);
    };
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      handleInputChange({ target: { value: input + (input ? " " : "") + transcript } } as any);
    };
    recognition.onerror = (event: any) => {
      console.error("Speech recognition error:", event.error, event);
      if (event.error === 'not-allowed') {
        alert("Akses mikrofon ditolak. Pastikan Anda memberikan izin dan mengakses situs ini menggunakan HTTPS atau localhost.");
      } else if (event.error === 'network') {
        alert("Gagal terhubung ke server pengenalan suara. Cek koneksi internet Anda.");
      }
      setIsListening(false);
    };
    recognition.onend = () => {
      console.log("Speech recognition ended");
      setIsListening(false);
    };
    
    try {
      recognition.start();
    } catch (e) {
      console.error("Failed to start speech recognition:", e);
      setIsListening(false);
    }
  };

  const playAudio = async (messageId: string, text: string) => {
    // Gunakan Web Speech API bawaan browser karena proxy server tidak mendukung endpoint TTS
    if (!('speechSynthesis' in window)) {
      alert("Browser Anda tidak mendukung fitur Text-to-Speech bawaan.");
      return;
    }

    if (playingId === messageId) {
      window.speechSynthesis.cancel();
      setPlayingId(null);
      return;
    }

    // Berhenti memutar suara sebelumnya
    window.speechSynthesis.cancel();
    setPlayingId(messageId);

    // Gunakan setTimeout kecil untuk menghindari bug di Safari setelah pemanggilan cancel()
    setTimeout(() => {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = country === 'MY' ? 'ms-MY' : 'id-ID';
      utterance.rate = 1.0;
      
      const voices = window.speechSynthesis.getVoices();
      const langKey = country === 'MY' ? 'ms-my' : 'id-id';
      const selectedVoice = voices.find(v => v.lang.replace('_', '-').toLowerCase().includes(langKey));
      if (selectedVoice) {
        utterance.voice = selectedVoice;
      }

      utterance.onend = () => setPlayingId(null);
      utterance.onerror = (e) => {
        // Abaikan error 'interrupted' yang terjadi jika pengguna menekan cancel
        if (e.error !== 'interrupted') {
          console.error("SpeechSynthesis error:", e);
        }
        setPlayingId(null);
      };

      window.speechSynthesis.speak(utterance);
    }, 50);
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {isOpen && (
        <div className="bg-white border rounded-xl shadow-xl w-80 h-[500px] flex flex-col mb-4 overflow-hidden">
          {/* Header */}
          <div className="bg-emerald-600 text-white px-4 py-3 flex justify-between items-center shadow-md">
            <div className="flex items-center gap-2">
              <div className="bg-white p-1 rounded-full flex items-center justify-center">
                <Image src="/logo-mark.svg" alt="Logo" width={20} height={20} />
              </div>
              <div>
                <h3 className="font-semibold text-sm leading-tight flex items-center gap-1.5">
                  Asisten UmrahHaji
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                  </span>
                </h3>
                <p className="text-[10px] text-emerald-100 flex items-center gap-1">
                  Online now • Konteks: {getContextName()}
                </p>
              </div>
            </div>
            
            <div className="flex items-center">
              <select 
                value={country} 
                onChange={(e) => setCountry(e.target.value)}
                className="mr-2 bg-emerald-700 text-white text-xs border border-emerald-500 rounded px-1.5 py-1 outline-none cursor-pointer hover:bg-emerald-600 transition-colors"
                title="Pilih Negara Asal"
              >
                <option value="ID">🇮🇩 ID</option>
                <option value="MY">🇲🇾 MY</option>
              </select>
              <button onClick={() => setIsOpen(false)} className="text-white hover:text-emerald-200 transition-colors">
                <X size={18} />
              </button>
            </div>
          </div>
          
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 text-black">
            {messages.length === 0 && (
              <div className="text-center text-gray-500 text-sm mt-4 flex flex-col items-center gap-4">
                <div className="bg-emerald-100 p-3 rounded-full text-emerald-600 mb-[-8px]">
                  <Headset size={28} />
                </div>
                <p>Assalamualaikum! Ada yang bisa kami bantu terkait layanan Umrah & Haji?</p>
                
                {/* Suggested Questions */}
                <div className="flex flex-wrap gap-2 justify-center w-full mt-2 mb-2">
                  <button onClick={() => handleSuggestedClick("Bagaimana cara booking?")} className="bg-emerald-50 text-emerald-700 text-xs px-3 py-1.5 rounded-full border border-emerald-200 hover:bg-emerald-100 transition-colors">Bagaimana cara booking?</button>
                  <button onClick={() => handleSuggestedClick("Apa dokumen yang harus disiapkan?")} className="bg-emerald-50 text-emerald-700 text-xs px-3 py-1.5 rounded-full border border-emerald-200 hover:bg-emerald-100 transition-colors">Syarat Dokumen</button>
                  <button onClick={() => handleSuggestedClick("Status pembayaran saya pending")} className="bg-emerald-50 text-emerald-700 text-xs px-3 py-1.5 rounded-full border border-emerald-200 hover:bg-emerald-100 transition-colors">Status Pembayaran</button>
                </div>
                
                <div className="bg-gray-50 border rounded-lg p-3 w-full text-left space-y-2 text-xs">
                  <p className="font-semibold text-gray-700">Atau hubungi CS kami:</p>
                  <a href="https://wa.me/6281234567890" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-emerald-600 hover:text-emerald-700 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
                    +62 812-3456-7890
                  </a>
                  <a href="mailto:cs@umrahhaji.dummy.com" className="flex items-center gap-2 text-emerald-600 hover:text-emerald-700 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"></rect><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path></svg>
                    cs@umrahhaji.dummy.com
                  </a>
                </div>
              </div>
            )}
            {messages.map((m) => (
              <div key={m.id} className={`flex flex-col ${m.role === 'user' ? 'items-end' : 'items-start'}`}>
                <div className="flex flex-col gap-1 max-w-[85%]">
                  <div className={`px-4 py-2 rounded-xl text-sm relative group ${
                    m.role === 'user' ? 'bg-emerald-100 text-emerald-900 rounded-tr-none' : 'bg-gray-100 text-gray-800 rounded-tl-none pr-8'
                  }`}>
                    <div className={`prose prose-sm max-w-none ${m.role === 'user' ? 'prose-emerald' : ''}`}>
                      <ReactMarkdown>
                        {m.content.replace('[ESKALASI]', '')}
                      </ReactMarkdown>
                    </div>
                    
                    {/* Timestamp */}
                    <div className={`text-[10px] mt-1 opacity-60 flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                      {new Intl.DateTimeFormat('id-ID', { hour: '2-digit', minute: '2-digit' }).format(m.createdAt || new Date())}
                    </div>
                    
                    {/* Handoff Card */}
                    {m.content.includes('[ESKALASI]') && (
                      <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                        <div className="flex items-center gap-2 text-red-700 font-medium text-xs mb-2">
                          <AlertCircle size={14} />
                          Layanan Darurat / Eskalasi
                        </div>
                        <p className="text-xs text-gray-600 mb-2">Asisten virtual tidak dapat menangani permintaan ini secara langsung demi keamanan Anda.</p>
                        <a href="https://wa.me/6281234567890" target="_blank" rel="noopener noreferrer" className="block text-center w-full bg-red-600 text-white rounded text-xs py-1.5 hover:bg-red-700 transition-colors">
                          Buat Tiket Bantuan (Hubungi CS)
                        </a>
                      </div>
                    )}
                    
                    {/* TTS Button untuk pesan AI */}
                    {m.role === 'assistant' && (
                    <button 
                      onClick={() => playAudio(m.id, m.content)}
                      className={`absolute right-1 top-2 flex items-center justify-center p-1 rounded-full transition-colors ${
                        playingId === m.id ? 'text-emerald-600' : 'text-gray-400 hover:text-emerald-600'
                      }`}
                      title={playingId === m.id ? 'Hentikan Suara' : 'Bacakan Pesan'}
                    >
                      {playingId === m.id ? <VolumeX size={16} /> : <Volume2 size={16} />}
                    </button>
                  )}
                </div>
                
                {/* Feedback Buttons */}
                {m.role === 'assistant' && (
                  <div className="flex gap-2 ml-1 mt-1">
                    <button onClick={() => handleFeedback(m.id, 'up')} className={`p-1 rounded transition-colors ${feedback[m.id] === 'up' ? 'text-emerald-600 bg-emerald-50' : 'text-gray-400 hover:text-emerald-600'}`}>
                      <ThumbsUp size={12} />
                    </button>
                    <button onClick={() => handleFeedback(m.id, 'down')} className={`p-1 rounded transition-colors ${feedback[m.id] === 'down' ? 'text-red-500 bg-red-50' : 'text-gray-400 hover:text-red-500'}`}>
                      <ThumbsDown size={12} />
                    </button>
                  </div>
                )}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="px-4 py-2 rounded-xl bg-gray-100 text-gray-800 text-sm rounded-tl-none">
                  <span className="animate-pulse">Mengetik...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <form 
            onSubmit={(e) => {
              e.preventDefault();
              handleSubmit(e);
            }} 
            className="border-t p-3 bg-gray-50 flex gap-2"
          >
            <input
              type="text"
              className="flex-1 border rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 text-black"
              value={input}
              onChange={handleInputChange}
              placeholder="Tulis pesan..."
            />
            <button
              type="button"
              onClick={toggleListening}
              className={`rounded-full w-10 h-10 flex items-center justify-center transition-colors ${
                isListening ? 'bg-red-500 text-white animate-pulse' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
              title={isListening ? 'Mendengarkan...' : 'Gunakan Suara'}
            >
              {isListening ? <MicOff size={18} /> : <Mic size={18} />}
            </button>
            <button 
              type="submit"
              disabled={isLoading || !input || input.trim() === ''}
              className="bg-emerald-600 text-white rounded-full min-w-10 w-10 h-10 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed transition-colors hover:bg-emerald-700"
            >
              <Send size={18} className="pr-[2px] pt-[2px]" />
            </button>
          </form>
        </div>
      )}

      {/* FAB */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-full w-14 h-14 shadow-lg flex items-center justify-center transition-transform hover:scale-105 border-2 border-white"
        >
          <div className="bg-white p-1.5 rounded-full flex items-center justify-center">
            <Image src="/logo-mark.svg" alt="Chat" width={24} height={24} />
          </div>
        </button>
      )}
    </div>
  );
}
