import { useLayoutEffect, useRef } from 'react';

const MIN_GAP_PX = 8;
const MIN_GROWTH_PX = 180; // 최소 7줄(body-md 기준)만큼은 항상 늘어날 수 있도록 보장

export function useAutoResizeTextarea(content: string) {
  const containerRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const resize = () => {
      const container = containerRef.current;
      const textarea = textareaRef.current;
      const bottom = bottomRef.current;
      if (!container || !textarea || !bottom) {
        return;
      }

      textarea.style.height = ''; // 인라인 높이 제거 → CSS min-height 기준으로 자연 높이 측정
      const collapsedHeight = textarea.clientHeight;
      const rawAvailableHeight = container.clientHeight - textarea.offsetTop - bottom.offsetHeight - MIN_GAP_PX;
      const availableHeight = Math.max(rawAvailableHeight, collapsedHeight + MIN_GROWTH_PX);
      const naturalHeight = textarea.scrollHeight;

      if (naturalHeight <= availableHeight) {
        textarea.style.height = `${naturalHeight}px`;
        textarea.style.overflowY = 'hidden';
      } else {
        textarea.style.height = `${Math.max(availableHeight, 0)}px`;
        textarea.style.overflowY = 'auto';
      }
    };

    resize();
    window.addEventListener('resize', resize);
    return () => window.removeEventListener('resize', resize);
  }, [content]);

  return { containerRef, textareaRef, bottomRef };
}