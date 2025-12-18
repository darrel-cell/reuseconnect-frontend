// Custom hooks for client management
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { clientsService } from '@/services/clients.service';
import { useAuth } from '@/contexts/AuthContext';

export function useClients(filter?: { status?: string; resellerId?: string }) {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['clients', user?.id, filter],
    queryFn: () => clientsService.getClients(user, filter),
  });
}

export function useClient(id: string) {
  return useQuery({
    queryKey: ['clients', id],
    queryFn: () => clientsService.getClient(id),
    enabled: !!id,
  });
}

export function useUpdateClientStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ clientId, status }: { clientId: string; status: 'active' | 'inactive' | 'pending' }) =>
      clientsService.updateClientStatus(clientId, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clients'] });
    },
  });
}

