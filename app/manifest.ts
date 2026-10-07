import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Thiago VSC | The Influencer Experience',
    short_name: 'THIAGOVSC',
    description: 'TV Online 4K en Directo, Radio En Vivo, TikTok Feed y Eventos Exclusivos.',
    start_url: '/',
    display: 'standalone',
    background_color: '#09070D',
    theme_color: '#DE4176',
    icons: [
      {
        src: '/icon.svg',
        sizes: 'any',
        type: 'image/svg+xml',
      },
    ],
  };
}
