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
