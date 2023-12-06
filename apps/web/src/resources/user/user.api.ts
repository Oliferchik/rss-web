import { useQuery } from 'react-query';

import { apiService } from 'services';

export function useList<T>(params: T) {
  const list = () => apiService.get('/users', params);

  interface UserListResponse {
    count: number;
    items: any[];
    totalPages: number;
  }

  return useQuery<UserListResponse>(['users', params], list);
}
