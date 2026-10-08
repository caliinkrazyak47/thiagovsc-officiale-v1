import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const url = request.nextUrl.searchParams.get('url');

  if (!url) {
    return new NextResponse('Missing url parameter', { status: 400 });
  }

  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': '*/*',
        'Connection': 'keep-alive'
      }
    });

    if (!response.ok) {
      return new NextResponse(`Error fetching: ${response.statusText}`, { status: response.status });
    }

    const contentType = response.headers.get('content-type') || '';

    // Si es un playlist m3u8, reescribimos las URLs internas
    if (contentType.includes('mpegurl') || url.includes('.m3u8')) {
      let text = await response.text();
      const baseUrl = new URL(response.url);

      text = text.split('\n').map(line => {
        const trimmed = line.trim();
        // Reescribir lineas que son enlaces directos a segmentos o sub-playlists
        if (trimmed && !trimmed.startsWith('#')) {
          let absoluteUrl = trimmed;
          if (!trimmed.startsWith('http')) {
            absoluteUrl = new URL(trimmed, baseUrl).href;
          }
          return `/api/proxy?url=${encodeURIComponent(absoluteUrl)}`;
        }
        
        // Reescribir URIs dentro de etiquetas
        if (trimmed.startsWith('#EXT-X-KEY') || trimmed.startsWith('#EXT-X-MEDIA')) {
           return trimmed.replace(/URI="([^"]+)"/, (match, uri) => {
              let absoluteUrl = uri;
              if (!uri.startsWith('http')) {
                absoluteUrl = new URL(uri, baseUrl).href;
              }
              return `URI="/api/proxy?url=${encodeURIComponent(absoluteUrl)}"`;
           });
        }
        
        return line;
      }).join('\n');

      return new NextResponse(text, {
        headers: {
          'Content-Type': 'application/vnd.apple.mpegurl',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, OPTIONS',
          'Access-Control-Allow-Headers': '*'
        }
      });
    }

    // Para segmentos de video (.ts) u otros archivos, streamear directo
    return new NextResponse(response.body, {
      headers: {
        'Content-Type': contentType || 'video/MP2T',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Access-Control-Allow-Headers': '*'
      }
    });

  } catch (error: any) {
    return new NextResponse(`Proxy error: ${error.message}`, { status: 500 });
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': '*'
    }
  });
}
