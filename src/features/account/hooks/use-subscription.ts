import { useQuery } from '@tanstack/react-query';

import { useAuth } from '@/providers/AuthProvider';

import { checkSubscription } from '../services/subscription.service';

export function useSubscription() {
  const { user } = useAuth();
  return useQuery({
    queryKey: ['subscription', user?.id],
    queryFn: checkSubscription,
    enabled: Boolean(user?.id),
    staleTime: 60_000,
  });
}
