// Custom hooks for grading
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { gradingService } from '@/services/grading.service';
import type { GradingRecord } from '@/mocks/mock-entities';

export function useGradingRecords(bookingId?: string) {
  return useQuery({
    queryKey: ['grading', bookingId],
    queryFn: () => gradingService.getGradingRecords(bookingId),
  });
}

export function useCreateGradingRecord() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: {
      bookingId: string;
      assetId: string;
      assetCategory: string;
      grade: GradingRecord['grade'];
      gradedBy: string;
      condition?: string;
      notes?: string;
    }) => gradingService.createGradingRecord(
      data.bookingId,
      data.assetId,
      data.assetCategory,
      data.grade,
      data.gradedBy,
      data.condition,
      data.notes
    ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['grading'] });
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
    },
  });
}

export function useCalculateResaleValue() {
  return (category: string, grade: GradingRecord['grade'], quantity: number) => {
    return gradingService.calculateResaleValue(category, grade, quantity);
  };
}

