export interface TVVideo {
  id: string;
  title: string;
  category: 'MUSIC' | 'LIVE' | 'URBAN' | 'VIDEO' | string;
  thumbnail?: string;
}

export type PlayerQuality = 'AUTO' | '1080P' | '4K';

export interface PlayerState {
  currentVideo: TVVideo;
  isPlaying: boolean;
  isBuffering: boolean;
  volume: number;
  isMuted: boolean;
  currentQuality: PlayerQuality;
  isFullscreen: boolean;
  autoplayBlocked: boolean;
  currentTime: number;
  duration: number;
}
