import { useMutation } from '@tanstack/react-query';
import { submitPortalLink } from '../services/portalLinkService';

export function usePortalLinkMutation() {
  return useMutation({
    mutationFn: submitPortalLink,
  });
}
