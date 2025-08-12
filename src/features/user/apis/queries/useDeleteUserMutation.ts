import { useMutation } from '@tanstack/react-query';
import { deleteUser } from '../service';

export function useDeleteUserMutation() {
  return useMutation({
    mutationFn: deleteUser,
  });
}