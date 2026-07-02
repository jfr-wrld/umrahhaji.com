import { createOpenAI } from "@ai-sdk/openai";
import { streamText, generateText } from "ai";
import { searchContext } from "@/lib/rag/vectorStore";

// Set timeout for serverless function (optional)
export const maxDuration = 30;

const customProvider = createOpenAI({
  baseURL: 'https://api-ai.hbyspirates.my.id/v1',
  apiKey: process.env.MIMO_API_KEY,
});

export async function POST(req: Request) {
  const { messages, country } = await req.json();
  const latestMessage = messages[messages.length - 1];
  
  // 1. Persiapkan query untuk RAG tanpa memanggil LLM (demi kecepatan respons)
  // Kita gabungkan 2 pesan terakhir dari User agar konteks pembicaraan tidak hilang, namun tetap instan.
  const recentUserMessages = messages
    .filter((m: any) => m.role === 'user')
    .slice(-2)
    .map((m: any) => m.content)
    .join(' ');
  
  const searchQuery = recentUserMessages || latestMessage.content;

  console.log("Generated Search Query:", searchQuery);

  // 2. Ambil konteks dari RAG berdasarkan standalone query
  let context = "";
  try {
    context = await searchContext(searchQuery);
  } catch (error) {
    console.error("Error retrieving context from RAG:", error);
  }

  let countryPrompt = "";
  if (country === 'MY') {
    countryPrompt = `Anda sedang berbicara dengan jamaah dari Malaysia. WAJIB mematuhi aturan berikut:
- Gunakan Bahasa Melayu yang natural dan sopan.
- Jika ada informasi harga dalam Rupiah (Rp), sebutkan estimasi dalam Ringgit Malaysia (RM) atau beri tahu untuk mengonfirmasi harga ke agensi travel tempatan.
- Gunakan istilah Malaysia yang relevan: 'Kad Pengenalan / IC' (untuk KTP), dan sebutkan 'Lembaga Tabung Haji' (sebagai ganti Kemenag) untuk urusan rasmi kerajaan.`;
  } else {
    countryPrompt = `Anda sedang berbicara dengan jamaah dari Indonesia. Gunakan gaya bahasa Indonesia yang sopan. Gunakan istilah KTP, Rupiah, dan rujuk pada Kemenag.`;
  }

  // 2. Susun system prompt yang di-inject dengan konteks RAG
  const systemPrompt = `Anda adalah asisten virtual (Chatbot AI) yang ramah, profesional, dan Islami untuk platform UmrahHaji.com.
Tugas Anda adalah membantu jamaah dengan menjawab pertanyaan terkait umrah dan haji, dokumen, atau status pembayaran.
${countryPrompt}

ATURAN KEAMANAN (SAFETY & BOUNDARY):
1. Anda DILARANG mengeluarkan Fatwa, nasihat hukum, diagnosis medis, garansi ketersediaan kursi, jaminan kelulusan visa, atau keputusan pengembalian dana (refund).
2. Jika ditanya mengenai agama/medis yang spesifik, tolak secara sopan dan sarankan merujuk pada otoritas/ahli resmi (contoh: Kemenag / Dokter).
3. Anda HANYA boleh menjawab berdasarkan INFO RELEVAN di bawah. Dilarang mengarang syarat pendaftaran atau harga.

ATURAN ESKALASI (SUPPORT HANDOFF):
Jika pesan pengguna mengandung unsur: kehilangan paspor/dokumen, uang tidak masuk/gagal bayar, komplain keras, penipuan, atau keadaan darurat medis/keamanan, Anda WAJIB menyisipkan tag "[ESKALASI]" di akhir jawaban Anda dan berikan respons empatik singkat.

INFO RELEVAN DARI DATABASE UMRAHHAJI.COM:
${context}
`;

  // 3. Panggil model dari Custom Provider Anda (MiMo)
  const result = await streamText({
    model: customProvider("mimo/mimo-v2.5-pro"), // Sesuaikan string ini jika API Anda membutuhkan nama model yang berbeda
    system: systemPrompt,
    messages,
  });

  // 4. Stream response langsung ke klien (Frontend)
  return result.toDataStreamResponse();
}
