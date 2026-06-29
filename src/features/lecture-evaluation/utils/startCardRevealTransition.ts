interface ViewTransitionCapableDocument {
  startViewTransition?: (update: () => void) => void;
}

export function startCardRevealTransition(update: () => void) {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const transitionDocument = document as unknown as ViewTransitionCapableDocument;

  if (prefersReducedMotion || !transitionDocument.startViewTransition) {
    update();
    return;
  }

  transitionDocument.startViewTransition(update);
}
