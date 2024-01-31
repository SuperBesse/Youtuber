import {Thumbnails} from './thumbnails';

export type SearchResult = {
  kind: 'youtube#searchResult';
  etag: string;
  id: {
    kind: 'youtube#channel' | 'youtube#video';
    videoId: string;
    channelId: string;
    playlistId: string;
  };
  snippet: {
    publishedAt: string;
    channelId: string;
    title: string;
    description: string;
    thumbnails: Thumbnails;
    channelTitle: string;
    liveBroadcastContent: string;
  };
};
