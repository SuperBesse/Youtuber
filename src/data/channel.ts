import {ResourceId} from './resourceId';
import {Thumbnails} from './thumbnails';

export type Channel = {
  kind: string;
  etag: string;
  id: string;
  snippet: {
    publishedAt: string;
    title: string;
    description: string;
    resourceId: ResourceId;
    channelId: string;
    thumbnails: Thumbnails;
  };
  contentDetails: {
    totalItemCount: number;
    newItemCount: number;
    activityType: 'all' | 'uploads';
  };
  subscriberSnippet?: {
    title: string;
    description: string;
    channelId: string;
    thumbnails: Thumbnails;
  };
};

export const sortChannels = (channels: Channel[]) => {
  return channels.sort((a: Channel, b: Channel) => {
    // Assurez-vous que title existe et est une chaîne de caractères
    const titleA = a.snippet.title
      ? a.snippet.title.toString().toLowerCase()
      : '';
    const titleB = b.snippet.title
      ? b.snippet.title.toString().toLowerCase()
      : '';

    if (titleA < titleB) {
      return -1;
    }
    if (titleA > titleB) {
      return 1;
    }
    return 0;
  });
};
