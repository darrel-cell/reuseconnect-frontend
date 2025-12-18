// Custom hooks for invoices
import { useQuery } from '@tanstack/react-query';
import { invoicesService } from '@/services/invoices.service';
import { useAuth } from '@/contexts/AuthContext';

export function useInvoices(filter?: { status?: string }) {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['invoices', user?.id, filter],
    queryFn: () => invoicesService.getInvoices(user, filter),
  });
}

export function useInvoice(id: string) {
  return useQuery({
    queryKey: ['invoices', id],
    queryFn: () => invoicesService.getInvoice(id),
    enabled: !!id,
  });
}

