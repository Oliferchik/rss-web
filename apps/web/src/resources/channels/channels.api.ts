import { useQuery, useMutation } from 'react-query';

import { apiService } from 'services';
import queryClient from 'query-client';
import { LAMBDA_URL } from 'app-constants';

export function useRssGet() {
  const get = () => apiService.get(LAMBDA_URL.RSS);

  return useQuery(['rss'], get);
}

export function useCreate() {
  const add = (channelId: string) => apiService.post(LAMBDA_URL.RSS, { channelId });

  return useMutation(add, {
    onSuccess: () => { queryClient.invalidateQueries(['rss']); },
  });
}

export function useSync() {
  const add = (channelId: string) => apiService.post(LAMBDA_URL.RSS_SYNC, { channelId });

  return useMutation(add, {
    onSuccess: () => { queryClient.invalidateQueries(['rss']); },
  });
}
