export const inquiryQueryKeys = {
  list: ['inquiry', 'list'] as const,
  detail: (id: string) => ['inquiry', 'detail', id] as const,
};