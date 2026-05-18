import { createClient } from "@/lib/supabase/server";

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
    overlayImage?: string;
    regulationFileUrl?: string;
}

// Map snake_case DB row to camelCase EventItem
function mapRow(row: Record<string, unknown>): EventItem {
    return {
        id: String(row.id),
        slug: (row.slug as string) ?? String(row.id),
        title: (row.title as string) ?? "",
        category: (row.category as string) ?? "",
        startDate: (row.start_date as string) ?? "",
        endDate: (row.end_date as string) ?? "",
        timeInfo: (row.time_info as string) ?? "",
        location: (row.location as string) ?? "",
        description: (row.description as string) ?? "",
        imageUrl: (row.image_url as string) ?? "",
        status: ((row.status as string) === "past" ? "past" : "upcoming") as "upcoming" | "past",
        registrationUrl: (row.registration_url as string | null) ?? undefined,
        overlayImage: (row.overlay_image as string | null) ?? undefined,
        regulationFileUrl: (row.regulation_file_url as string | null) ?? undefined,
    };
}

export async function getEventsList(): Promise<EventItem[]> {
    try {
        const supabase = await createClient();
        const { data, error } = await supabase
            .from("events")
            .select("*")
            .order("start_date", { ascending: true });

        if (error) {
            console.error("[getEventsList] Supabase error:", error.message);
            return [];
        }

        return (data ?? []).map((row) => mapRow(row as Record<string, unknown>));
    } catch (err) {
        console.error("[getEventsList] Unexpected error:", err);
        return [];
    }
}

export async function getEventBySlug(slug: string): Promise<EventItem | null> {
    try {
        const supabase = await createClient();
        const { data, error } = await supabase
            .from("events")
            .select("*")
            .eq("slug", slug)
            .single();

        if (error || !data) return null;
        return mapRow(data as Record<string, unknown>);
    } catch (err) {
        console.error("[getEventBySlug] Unexpected error:", err);
        return null;
    }
}

export async function getUpcomingEvents(limit = 2): Promise<EventItem[]> {
    try {
        const supabase = await createClient();
        const { data, error } = await supabase
            .from("events")
            .select("*")
            .eq("status", "upcoming")
            .order("start_date", { ascending: true })
            .limit(limit);

        if (error) {
            console.error("[getUpcomingEvents] Supabase error:", error.message);
            return [];
        }

        return (data ?? []).map((row) => mapRow(row as Record<string, unknown>));
    } catch (err) {
        console.error("[getUpcomingEvents] Unexpected error:", err);
        return [];
    }
}
