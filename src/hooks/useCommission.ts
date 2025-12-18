// Custom hooks for commission
import { useQuery } from '@tanstack/react-query';
import { commissionService } from '@/services/commission.service';
import { useAuth } from '@/contexts/AuthContext';

export function useCommissions(filter?: { status?: string; period?: string }) {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['commissions', user?.id, filter],
    queryFn: () => commissionService.getCommissions(user, filter),
  });
}

export function useCommissionSummary() {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['commissionSummary', user?.id],
    queryFn: () => commissionService.getCommissionSummary(user),
  });
}

