import {Localizations} from './localizations';
import {Thumbnails} from './thumbnails';

export type Playlist = {
  kind: 'youtube#playlist';
  etag: string;
  id: string;
  snippet: {
    publishedAt: string;
    channelId: string;
    title: string;
    description: string;
    thumbnails: Thumbnails;
    channelTitle: string;
    defaultLanguage: string;
    localized: {
      title: string;
      description: string;
    };
  };
  status: {
    privacyStatus: string;
  };
  contentDetails: {
    itemCount: number;
  };
  player: {
    embedHtml: string;
  };
  localizations: Localizations;
};
