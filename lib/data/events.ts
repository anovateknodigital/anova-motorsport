export interface EventItem {
    id: string;
    slug: string;
    title: string;
    category: string;
    startDate: string; // ISO format or YYYY-MM-DD
    endDate: string; // ISO format
    timeInfo: string;
    location: string;
    description: string;
    imageUrl: string;
    status: "upcoming" | "past";
    registrationUrl?: string;
}

export const DUMMY_EVENTS: EventItem[] = [
    {
        id: "1",
        slug: "anova-motoprix-kejurnas-2026",
        title: "KEJURNAS ANOVA MOTOPRIX",
        category: "Motoprix",
        startDate: "2026-05-30T08:00:00Z",
        endDate: "2026-05-31T17:00:00Z",
        timeInfo: "08:00 - 17:00 WIB",
        location: "Sirkuit Permanent Sport Centre Bangkinang, Kampar",
        description: "Kejuaraan Nasional Motoprix wilayah Sumatera yang diselenggarakan dengan standar tertinggi. Menampilkan pembalap terbaik dari seluruh region Sumatera dalam memperebutkan poin krusial untuk juara nasional. Kelas pendukung termasuk Matic, Underbone 2T, dan Sport.",
        imageUrl: "https://d34vm3j4h7f97z.cloudfront.net/original/4X/8/7/9/8798a3766550f77660de63c571a51c829cbefd5c.jpeg",
        status: "upcoming",
        registrationUrl: "#"
    },
    {
        id: "2",
        slug: "anova-drag-bike-championship-2026",
        title: "ANOVA DRAG BIKE CHAMPIONSHIP",
        category: "Drag Race",
        startDate: "2026-04-15T15:00:00Z",
        endDate: "2026-04-16T22:00:00Z",
        timeInfo: "15:00 - 22:00 WIB (Night Race)",
        location: "Sirkuit Non Permanen, Lanud Roesmin Nurjadin",
        description: "Ajang adu 201 meter paling bergengsi tahun ini! Didominasi oleh format Night Race dengan lintasan berpengamanan tinggi dan sistem timing kelas dunia. Berhadiah total ratusan juta rupiah untuk lebih dari 15 kelas perlombaan.",
        imageUrl: "https://cdn.medcom.id/dynamic/content/2025/07/13/1768639/X7pS9VTW2A.jpg?w=800",
        status: "upcoming",
        registrationUrl: "#"
    },
    {
        id: "3",
        slug: "sumatera-road-race-open-2025",
        title: "SUMATERA ROAD RACE OPEN",
        category: "Motoprix",
        startDate: "2025-11-20T08:00:00Z",
        endDate: "2025-11-21T18:00:00Z",
        timeInfo: "08:00 - 18:00 WIB",
        location: "Sirkuit Permanent Sport Centre Bangkinang, Kampar",
        description: "Event penutup tahun 2025 yang sukses dihadiri 12.000 penonton. Memperebutkan Piala Bergilir Bupati Kampar dan memecahkan 3 rekor putaran tercepat di sirkuit.",
        imageUrl: "https://images.unsplash.com/photo-1625930601622-031b9099d4f6?q=80&w=1200",
        status: "past"
    },
    {
        id: "4",
        slug: "anova-sunday-drag-battle-2025",
        title: "ANOVA SUNDAY DRAG BATTLE",
        category: "Drag Race",
        startDate: "2025-08-10T09:00:00Z",
        endDate: "2025-08-10T17:00:00Z",
        timeInfo: "09:00 - 17:00 WIB",
        location: "Sirkuit Non Permanen, Lanud Roesmin Nurjadin",
        description: "Pertarungan motor-motor tercepat di aspal Lanud. Mencatatkan rekor waktu 6.8 detik di kelas FFA Campuran 250cc.",
        imageUrl: "https://images.unsplash.com/photo-1613246273006-7f7476e693d9?q=80&w=1200",
        status: "past"
    }
];

export async function getEventsList() {
    // Return all events sorted by start date (newest first for layout, but for upcoming we want closest first)
    return [...DUMMY_EVENTS];
}

export async function getEventBySlug(slug: string) {
    return DUMMY_EVENTS.find(e => e.slug === slug);
}
