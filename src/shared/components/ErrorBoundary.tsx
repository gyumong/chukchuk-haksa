'use client';

import { Component, type PropsWithChildren, type ReactElement } from 'react';

export type FallbackProps = { error: Error; reset: () => void };

type Props = PropsWithChildren<{
  /** fallbackRender 우선, 없으면 fallback JSX 사용 */
  fallbackRender?: (p: FallbackProps) => ReactElement;
  fallback?: ReactElement;
  /** URL·파라미터 등 오류·리셋 의존성 */
  keys?: readonly unknown[];
  /** 외부 동기화용 콜백 (ex. react-query reset) */
  onReset?: () => void;
}>;

type State = { hasError: boolean; error?: Error };

const init: State = { hasError: false };

export default class ErrorBoundary extends Component<Props, State> {
  state = init;

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidUpdate(prev: Props) {
    if (this.state.hasError && !isSameArray(prev.keys, this.props.keys)) {
      this.reset();
    }
  }

  reset = () => {
    this.props.onReset?.();
    this.setState(init);
  };

  render() {
    if (!this.state.hasError) {
      return this.props.children;
    }

    const { fallbackRender, fallback } = this.props;
    if (fallbackRender) {
      return fallbackRender({ error: this.state.error!, reset: this.reset });
    }
    return fallback ?? null;
  }
}

const isSameArray = (a: readonly unknown[] = [], b: readonly unknown[] = []) =>
  a.length === b.length && a.every((v, i) => Object.is(v, b[i]));
