import { NextResponse } from 'next/server';
import { PLAYLIST_VIDEOS } from '@/components/TVOnlinePlayer/playlistData';
import { TVVideo } from '@/components/TVOnlinePlayer/types';

export const revalidate = 60; // Cache for 60 seconds

export async function GET() {
  try {
    const playlistId = 'PLALJOp7e_srk';
    const feedUrl = `https://www.youtube.com/feeds/videos.xml?playlist_id=${playlistId}`;

    const res = await fetch(feedUrl, {
      next: { revalidate: 60 },
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
      },
    });

    if (!res.ok) {
      return NextResponse.json({ videos: PLAYLIST_VIDEOS });
    }

    const xml = await res.text();

    // Parse entries from Atom RSS feed
    const entries: TVVideo[] = [];
    const entryRegex = /<entry>([\s\S]*?)<\/entry>/g;
    let match;

    while ((match = entryRegex.exec(xml)) !== null) {
      const entryXml = match[1];
      const videoIdMatch = entryXml.match(/<yt:videoId>([^<]+)<\/yt:videoId>/);
      const titleMatch = entryXml.match(/<title>([^<]+)<\/title>/);

      if (videoIdMatch && videoIdMatch[1]) {
        const id = videoIdMatch[1].trim();
        const rawTitle = titleMatch ? titleMatch[1].trim() : 'Track';
        // Unescape common XML entities
        const title = rawTitle
          .replace(/&amp;/g, '&')
          .replace(/&lt;/g, '<')
          .replace(/&gt;/g, '>')
          .replace(/&quot;/g, '"')
          .replace(/&#39;/g, "'");

        entries.push({
          id,
          title,
          category: 'MUSIC',
          thumbnail: `https://img.youtube.com/vi/${id}/hqdefault.jpg`,
        });
      }
    }

    if (entries.length > 0) {
      // Merge unique entries: new ones first, then existing curated list
      const seenIds = new Set<string>();
      const combined: TVVideo[] = [];

      for (const v of entries) {
        if (!seenIds.has(v.id)) {
          seenIds.add(v.id);
          combined.push(v);
        }
      }

      for (const v of PLAYLIST_VIDEOS) {
        if (!seenIds.has(v.id)) {
          seenIds.add(v.id);
          combined.push(v);
        }
      }

      return NextResponse.json({ videos: combined });
    }

    return NextResponse.json({ videos: PLAYLIST_VIDEOS });
  } catch (err) {
    return NextResponse.json({ videos: PLAYLIST_VIDEOS });
  }
}
