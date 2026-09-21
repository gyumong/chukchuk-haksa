'use client';

import { Component, type PropsWithChildren, type ReactElement } from 'react';

export type FallbackProps = { error: unknown; reset: () => void };

type Props = PropsWithChildren<{
  /** fallbackRender 우선, 없으면 fallback JSX 사용 */
  fallbackRender?: (p: FallbackProps) => ReactElement;
  fallback?: ReactElement;
  /** URL·파라미터 등 오류·리셋 의존성 */
  keys?: readonly unknown[];
  /** 외부 동기화용 콜백 (ex. react-query reset) */
  onReset?: () => void;
}>;

type State = { hasError: boolean; error?: unknown };

const init: State = { hasError: false };

export default class ErrorBoundary extends Component<Props, State> {
  state = init;

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidMount() {
    // 이 바운더리가 새로 마운트될 때마다 react-query의 "이미 에러 던졌으니 재요청 안 함" 플래그를
    // 선제적으로 풀어준다. 뒤로가기 등 언마운트가 보장되지 않는 경로로 화면을 나갔다 다시 들어와도
    // 정상적으로 재요청되도록 하기 위함.
    this.props.onReset?.();
  }

  componentDidUpdate(prev: Props) {
    if (this.state.hasError && !isSameArray(prev.keys, this.props.keys)) {
      this.reset();
    }
  }

  componentWillUnmount() {
    // 에러 상태로 언마운트되는 경우(다른 페이지로 이탈 등), react-query의
    // "재요청 금지" 마킹을 풀어줘야 다음에 이 화면에 재진입했을 때 다시 fetch를 시도한다.
    if (this.state.hasError) {
      this.props.onReset?.();
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
