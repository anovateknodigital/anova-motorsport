import { createClient } from "@/lib/supabase/server";

export interface NewsItem {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string; // HTML markup
  image_url: string;
  published_at: string;
  author: string;
  category: string;
  read_time: string; // misal "5 Menit"
}

export async function getNewsList(): Promise<NewsItem[]> {
  const supabase = await createClient();
  const { data, error } = await supabase.from("news").select("*").order("published_at", { ascending: false });
  if (error) {
    console.error(error);
    return [];
  }
  return data as NewsItem[];
}

export async function getNewsBySlug(slug: string): Promise<NewsItem | null> {
  const supabase = await createClient();
  const { data, error } = await supabase.from("news").select("*").eq("slug", slug).single();
  if (error || !data) {
    return null;
  }
  return data as NewsItem;
}
