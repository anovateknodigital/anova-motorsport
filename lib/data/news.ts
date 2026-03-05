export interface NewsItem {
    id: string;
    slug: string;
    title: string;
    excerpt: string;
    content: string; // HTML markup
    imageUrl: string;
    publishedAt: string;
    author: string;
    category: string;
    readTime: string; // misal "5 Menit"
}

export const DUMMY_NEWS: NewsItem[] = [
    {
        id: "1",
        slug: "update-regulasi-ban-untuk-motoprix-musim-2026",
        title: "Update Regulasi Ban untuk Motoprix Musim 2026",
        excerpt: "Kebijakan baru tentang penggunaan ban tipe soft compound untuk seluruh kelas utama di musim depan guna meningkatkan keselamatan dan persaingan.",
        content: `
      <p>Menyambut musim kompetisi 2026, Anova Motorsport bersama pihak penyelenggara resmi Ikatan Motor Indonesia (IMI) mengumumkan beberapa pembaruan regulasi teknis. Salah satu perubahan paling signifikan adalah penyeragaman penggunaan ban tipe <em>soft compound</em> untuk seluruh kelas utama.</p>
      
      <h3>Mengapa Ada Perubahan?</h3>
      <p>Evaluasi dari seri-seri balapan sepanjang 2025 menunjukkan perlunya peningkatan grip pada sirkuit-sirkuit permanen dengan karakter aspal abrasif. <strong>Keamanan pembalap tetap menjadi prioritas utama</strong>. Dengan penggunaan ban yang lebih lunak, insiden <em>low-side</em> saat keluar tikungan diharapkan dapat diminimalisir secara drastis.</p>
      
      <p>Selain faktor keamanan, penyeragaman ini bertujuan untuk mengurangi kesenjangan performa antara tim pabrikan (factory) dan tim satelit/privater. Seluruh tim kini memiliki akses ke alokasi kompon yang sama beratnya.</p>
      
      <h3>Poin Utama Regulasi Baru</h3>
      <ul>
        <li>Setiap pembalap mendapat alokasi maksimal 4 set ban kering per race weekend.</li>
        <li>Hanya tipe <em>soft</em> dan <em>medium-soft</em> yang diizinkan untuk kualifikasi.</li>
        <li>Penyuplai ban tunggal (Single Seater Tire Supplier) akan menyediakan layanan pemasangan gratis di area paddock.</li>
      </ul>
      
      <blockquote>"Kami percaya ini adalah langkah yang adil dan berorientasi pada kemajuan sport. Performa akan lebih seimbang, mendorong persaingan menjadi lebih rapat dan menghibur penonton." — Direktur Balap, Anova Motorsport.</blockquote>
      
      <p>Aturan ini akan mulai diujicobakan pada tes pramusim resmi di Sirkuit Bangkinang bulan depan.</p>
    `,
        imageUrl: "https://images.unsplash.com/photo-1625930617993-481e41cc7fda?q=80&w=1200&auto=format&fit=crop",
        publishedAt: "2026-03-05T08:00:00Z",
        author: "Tim Redaksi",
        category: "Regulasi",
        readTime: "4 Menit"
    },
    {
        id: "2",
        slug: "panduan-scrutineering-untuk-pemula-di-kelas-drag-201m",
        title: "Panduan Scrutineering untuk Pemula di Kelas Drag 201m",
        excerpt: "Langkah-langkah pemeriksaan teknis wajib sebelum balapan drag race. Pastikan motor Anda lolos dari awal.",
        content: `
      <p>Scrutineering (pemeriksaan teknis) seringkali menjadi momok menakutkan bagi pemula yang baru pertama kali turun di ajang kejuaraan resmi. Namun, proses ini krusial demi memastikan balapan berlangsung 100% aman dan adil.</p>

      <h3>Persiapan Administratif</h3>
      <p>Sebelum membawa motor ke area <em>scrut</em>, pastikan dokumen telah siap. Ini meliputi:</p>
      <ul>
        <li>Kartu Izin Start (KIS) yang masih berlaku.</li>
        <li>Kwitansi pendaftaran asli.</li>
        <li>Formulir scrutineering yang telah diisi identitas dasar (Nama, Nomor Start, Kelas).</li>
      </ul>

      <h3>Pemeriksaan Fisik Kendaraan</h3>
      <p>Petugas tidak akan berkompromi pada hal-hal menyangkut keselamatan. Berikut area yang paling sering diperiksa:</p>
      <ol>
        <li><strong>Sistem Pengereman</strong>: Rem depan maupun belakang harus berfungsi sempurna. Tidak ada toleransi untuk kebocoran minyak rem atau kampas rem yang sudah aus parah.</li>
        <li><strong>Gas Spontan & Kabel</strong>: Puntiran gas harus langsung kembali ke posisi awal tanpa hambatan sesaat setelah dilepas (tidak boleh <em>nyangkut</em>).</li>
        <li><strong>Ukuran Ban</strong>: Untuk kelas bracket 9 detik, ban slick diizinkan, namun harus memenuhi spesifikasi tapak minimal sesuai regulasi.</li>
        <li><strong>Baut & Kawat Pengaman (Wire Lock)</strong>: Terutama di area kaliper rem dan lubang pembuangan oli.</li>
      </ol>

      <p>Jika ada satu item yang tidak lolos, mekanik Anda akan diberi waktu untuk memperbaiki sebelum <em>scrutineering</em> ditutup.</p>
    `,
        imageUrl: "https://images.unsplash.com/photo-1625930601622-031b9099d4f6?q=80&w=1200&auto=format&fit=crop",
        publishedAt: "2026-03-01T10:15:00Z",
        author: "Technical Staff",
        category: "Panduan",
        readTime: "3 Menit"
    },
    {
        id: "3",
        slug: "highlight-event-anova-motorsport-bulan-lalu",
        title: "Highlight Event Anova Motorsport Bulan Lalu",
        excerpt: "Rangkuman aksi terbaik, rekor lap time baru, dan keseruan paddock di seri penutup.",
        content: `
      <p>Seri penutup bulan lalu menyajikan pertarungan sengit di setiap kelas. Mulai dari Underbone 150cc hingga ketatnya selisih 0.001 detik di kelas Bracket Drag 201m.</p>
      <p>Untuk pertama kalinya dalam tiga tahun terakhir, rekor lap time Sirkuit Bangkinang akhirnya terpecahkan oleh Bintang N. dari Anova RT dengan torehan waktu fantastis.</p>
      <p>Terima kasih kepada seluruh sponsor dan puluhan ribu penonton yang telah setia hadir. Nantikan kejutan yang lebih besar di musim pembuka berikutnya!</p>
    `,
        imageUrl: "https://images.unsplash.com/photo-1625930641163-6c1734ecbd65?q=80&w=1200&auto=format&fit=crop",
        publishedAt: "2026-02-28T16:30:00Z",
        author: "Tim Redaksi",
        category: "Berita",
        readTime: "2 Menit"
    },
    {
        id: "4",
        slug: "tips-memilih-gear-set-yang-tepat",
        title: "Tips Memilih Gear Set yang Tepat untuk Sirkuit Pendek",
        excerpt: "Bagaimana cara menentukan kombinasi final gear yang pas untuk sirkuit dengan karakter stop-and-go.",
        content: `
      <p>Rahasia akselerasi tajam tidak hanya di tenaga mesin, tapi pada kombinasi final gear (sprocket). Untuk sirkuit pendek, gunakan setup yang meringankan akselerasi awal (gear belakang lebih besar).</p>
    `,
        imageUrl: "https://images.unsplash.com/photo-1625930545875-b6b0089df67d?q=80&w=1200&auto=format&fit=crop",
        publishedAt: "2026-02-15T09:00:00Z",
        author: "Mekanik Ahli",
        category: "Teknis",
        readTime: "3 Menit"
    }
];

export async function getNewsList() {
    // Simulasi fetch database (nanti kalau butuh Supabase tinggal ganti query)
    return DUMMY_NEWS.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
}

export async function getNewsBySlug(slug: string) {
    return DUMMY_NEWS.find(n => n.slug === slug);
}
