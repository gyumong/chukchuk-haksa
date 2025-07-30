import { useMutation } from '@tanstack/react-query';
import { portalLogin } from '../service';

export function usePortalLoginMutation() {
  return useMutation({
    mutationFn: portalLogin,
  });
}