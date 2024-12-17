export enum AssemblyAiActions {
  FinalTranscript = 'FinalTranscript',
  PartialTranscript = 'PartialTranscript'
};

export enum Chrome_Cache_Key {
  RECENT_SEARCHES = 'recentSearches'
};

export type RecentSearchesType = {
  title: string;
  url: string;
};

export const MAX_ATTEMPTS = 3;
export const RECENT_SEARCHES_LIMIT = 3;