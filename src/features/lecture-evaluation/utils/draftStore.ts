import type { LectureEvaluationDraft, LectureEvaluationGrade, LectureEvaluationTag } from '../types';
import { createEvaluationDrafts, toggleEvaluationTag, updateEvaluationReview } from './evaluationDraft';

type Listener = () => void;

export interface LectureEvaluationDraftStore {
  // 내부 배열을 직접 노출하면 호출 측 mutation 이 toggleTag/updateReview 를 우회해 notify 가 안 돌 수 있다.
  // 외부에는 readonly 로만 노출해 구독 모델(useSyncExternalStore)과 제출 데이터의 정합성을 지킨다.
  getDrafts: () => readonly LectureEvaluationDraft[];
  getSelectedTags: (index: number) => readonly LectureEvaluationTag[];
  getReview: (index: number) => string;
  toggleTag: (index: number, tag: LectureEvaluationTag) => void;
  updateReview: (index: number, review: string) => void;
  subscribeSelectedTags: (index: number, listener: Listener) => () => void;
  subscribeReview: (index: number, listener: Listener) => () => void;
}

function subscribe(listeners: Map<number, Set<Listener>>, index: number, listener: Listener): () => void {
  const indexListeners = listeners.get(index) ?? new Set<Listener>();
  indexListeners.add(listener);
  listeners.set(index, indexListeners);

  return () => {
    indexListeners.delete(listener);
    if (indexListeners.size === 0) {
      listeners.delete(index);
    }
  };
}

function notify(listeners: Map<number, Set<Listener>>, index: number): void {
  listeners.get(index)?.forEach(listener => listener());
}

export function createLectureEvaluationDraftStore(grades: LectureEvaluationGrade[]): LectureEvaluationDraftStore {
  const drafts = createEvaluationDrafts(grades);
  const selectedTagListeners = new Map<number, Set<Listener>>();
  const reviewListeners = new Map<number, Set<Listener>>();

  return {
    getDrafts: () => drafts,
    getSelectedTags: index => drafts[index]?.selectedTags ?? [],
    getReview: index => drafts[index]?.review ?? '',
    toggleTag: (index, tag) => {
      const draft = drafts[index];
      if (!draft) {
        return;
      }
      drafts[index] = toggleEvaluationTag(draft, tag);
      notify(selectedTagListeners, index);
    },
    updateReview: (index, review) => {
      const draft = drafts[index];
      if (!draft) {
        return;
      }
      const nextDraft = updateEvaluationReview(draft, review);
      if (nextDraft.review === draft.review) {
        return;
      }
      drafts[index] = nextDraft;
      notify(reviewListeners, index);
    },
    subscribeSelectedTags: (index, listener) => subscribe(selectedTagListeners, index, listener),
    subscribeReview: (index, listener) => subscribe(reviewListeners, index, listener),
  };
}

export function createLectureEvaluationSessionKey(
  year: number,
  semester: number,
  grades: LectureEvaluationGrade[]
): string {
  return JSON.stringify({ year, semester, grades });
}
