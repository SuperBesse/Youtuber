import {Channel} from './channel';

export type Subscriptions = {
  kind: string;
  etag: string;
  nextPageToken: string;
  pageInfo: {totalResults: number; resultsPerPage: number};
  items: Channel[];
};
