import { useQuery, useMutation } from 'react-query';

import { apiService } from 'services';
import queryClient from 'query-client';
import { LAMBDA_URL } from 'app-constants';

export function useGet() {
  const get = () => apiService.get(LAMBDA_URL.CHANNELS);

  return useQuery(['channels'], get);
}

export function useAdd() {
  const add = (channelId: string) => apiService.post(LAMBDA_URL.CHANNELS, { channelId });

  return useMutation(add, {
    onSuccess: () => { queryClient.invalidateQueries(['channels']); },
  });
}
