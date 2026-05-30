import { useQuery } from '@tanstack/react-query';

import { fetchBiblia } from '../services/biblia.service';

export function useBiblia() {
  return useQuery({ queryKey: ['biblia'], queryFn: fetchBiblia, staleTime: 5 * 60_000 });
}
