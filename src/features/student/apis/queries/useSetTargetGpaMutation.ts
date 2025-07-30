import { useMutation } from '@tanstack/react-query';
import { setTargetGpa } from '../service';

export function useSetTargetGpaMutation() {
  return useMutation({
    mutationFn: setTargetGpa,
  });
}