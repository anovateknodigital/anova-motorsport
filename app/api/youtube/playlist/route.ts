import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

const PLAYLIST_ID = "PLWbWb0irUreOPsN__SwhiXs7mY89llEUj";
const CACHE_TTL_MS = 6 * 60 * 60 * 1000; // 6 jam
const MAX_RESULTS = 50; // max per request YouTube API

interface YTSnippet {
    title: string;
    description: string;
    publishedAt: string;
    thumbnails: {
        default?: { url: string };
        medium?: { url: string };
        high?: { url: string };
        maxres?: { url: string };
        standard?: { url: string };
    };
    resourceId: { videoId: string };
}

interface YTItem {
    snippet: YTSnippet;
}

export interface VideoItem {
    videoId: string;
    title: string;
    description: string;
    publishedAt: string;
    thumbnail: string;
    url: string;
}

// Ambil semua video dari playlist (handle pagination)
async function fetchAllPlaylistItems(apiKey: string): Promise<VideoItem[]> {
    const videos: VideoItem[] = [];
    let pageToken: string | undefined;

    do {
        const params = new URLSearchParams({
            part: "snippet",
            playlistId: PLAYLIST_ID,
            maxResults: String(MAX_RESULTS),
            key: apiKey,
            ...(pageToken ? { pageToken } : {}),
        });

        const res = await fetch(
            `https://www.googleapis.com/youtube/v3/playlistItems?${params}`,
            { cache: "no-store" }
        );

        if (!res.ok) {
            const err = await res.text();
            throw new Error(`YouTube API error ${res.status}: ${err}`);
        }

        const data = await res.json();
        pageToken = data.nextPageToken;

        for (const item of (data.items ?? []) as YTItem[]) {
            const s = item.snippet;
            // Skip video yang dihapus / privat
            if (!s.resourceId?.videoId || s.title === "Deleted video" || s.title === "Private video") continue;

            const thumb =
                s.thumbnails?.maxres?.url ??
                s.thumbnails?.standard?.url ??
                s.thumbnails?.high?.url ??
                s.thumbnails?.medium?.url ??
                s.thumbnails?.default?.url ??
                "";

            videos.push({
                videoId: s.resourceId.videoId,
                title: s.title,
                description: s.description,
                publishedAt: s.publishedAt,
                thumbnail: thumb,
                url: `https://www.youtube.com/watch?v=${s.resourceId.videoId}`,
            });
        }
    } while (pageToken);

    // Urutkan terbaru dulu
    videos.sort(
        (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    );

    return videos;
}

export async function GET() {
    const apiKey = process.env.YOUTUBE_API_KEY;
    if (!apiKey) {
        return NextResponse.json(
            { error: "YOUTUBE_API_KEY is not configured" },
            { status: 500 }
        );
    }

    const supabase = await createClient();

    // 1) Cek cache di Supabase
    const { data: cached } = await supabase
        .from("youtube_cache")
        .select("videos, updated_at")
        .eq("playlist_id", PLAYLIST_ID)
        .single();

    if (cached) {
        const age = Date.now() - new Date(cached.updated_at).getTime();
        if (age < CACHE_TTL_MS) {
            // Cache masih segar → langsung return
            return NextResponse.json({ videos: cached.videos, cached: true });
        }
    }

    // 2) Cache stale / belum ada → fetch dari YouTube
    try {
        const videos = await fetchAllPlaylistItems(apiKey);

        // 3) Simpan/update cache di Supabase
        await supabase.from("youtube_cache").upsert(
            { playlist_id: PLAYLIST_ID, videos, updated_at: new Date().toISOString() },
            { onConflict: "playlist_id" }
        );

        return NextResponse.json({ videos, cached: false });
    } catch (err) {
        console.error("[YouTube API]", err);

        // Kalau fetch gagal tapi cache ada → return cache lama (graceful degradation)
        if (cached?.videos) {
            return NextResponse.json({ videos: cached.videos, cached: true, stale: true });
        }

        return NextResponse.json(
            { error: "Failed to fetch YouTube playlist" },
            { status: 500 }
        );
    }
}
