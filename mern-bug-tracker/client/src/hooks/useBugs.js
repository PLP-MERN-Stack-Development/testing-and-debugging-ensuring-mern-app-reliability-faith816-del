import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import bugService from '../services/bugService';

export const useBugs = () => {
  const queryClient = useQueryClient();

  const bugsQuery = useQuery({
    queryKey: ['bugs'],
    queryFn: bugService.fetchBugs,
    staleTime: 1000 * 30,
    meta: {
      description: 'Fetches all bugs from the API',
    },
  });

  const createBugMutation = useMutation({
    mutationFn: bugService.createBug,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bugs'] });
    },
  });

  const updateBugMutation = useMutation({
    mutationFn: bugService.updateBug,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bugs'] });
    },
  });

  const deleteBugMutation = useMutation({
    mutationFn: bugService.deleteBug,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bugs'] });
    },
  });

  return {
    bugs: bugsQuery.data ?? [],
    isLoading: bugsQuery.isLoading,
    isError: bugsQuery.isError,
    error: bugsQuery.error,
    refetch: bugsQuery.refetch,
    createBug: createBugMutation.mutateAsync,
    createBugStatus: createBugMutation.status,
    updateBug: updateBugMutation.mutateAsync,
    updateBugStatus: updateBugMutation.status,
    deleteBug: deleteBugMutation.mutateAsync,
    deleteBugStatus: deleteBugMutation.status,
    queryState: {
      ...bugsQuery,
      createBugMutation,
      updateBugMutation,
      deleteBugMutation,
    },
  };
};

export default useBugs;

