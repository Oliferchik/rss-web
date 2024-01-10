import { useQuery, useMutation } from 'react-query';

import { apiService } from 'services';
import queryClient from 'query-client';

export function useRssGet() {
  const get = () => apiService.get('/rss');

  return useQuery(['rss'], get);
}

export function useCreate() {
  const add = (channelId: string) => apiService.post('/rss', { channelId });

  return useMutation(add, {
    onSuccess: () => { queryClient.invalidateQueries(['rss']); },
  });
}

export function useSync() {
  const add = (channelId: string) => apiService.post('/rss-sync', { channelId });

  return useMutation(add, {
    onSuccess: () => { queryClient.invalidateQueries(['rss']); },
  });
}
