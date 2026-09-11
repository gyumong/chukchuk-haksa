'use client';

import { useCallback, useEffect, useRef } from 'react';
import { useSemesterSlider } from '../../hooks/useSemesterSlider';
import styles from './SemesterSlider.module.scss';

interface SemesterSliderProps {
  currentYear: number;
  currentSemester: number;
}

const DRAG_THRESHOLD = 5;

export default function SemesterSlider({ currentYear, currentSemester }: SemesterSliderProps) {
  const { semesterItems, handleSemesterClick } = useSemesterSlider(currentYear, currentSemester);

  const containerRef = useRef<HTMLDivElement>(null);
  const isDraggingRef = useRef(false);
  const didDragRef = useRef(false);
  const startXRef = useRef(0);
  const scrollLeftRef = useRef(0);

  // 마우스 휠(세로 입력)을 가로 스크롤로 변환.
  // React의 onWheel은 passive 리스너로 등록되어 preventDefault가 무시되므로,
  // 네이티브 addEventListener로 { passive: false } 직접 등록.
  useEffect(() => {
    const el = containerRef.current;
    if (!el) {
      return;
    }

    const onWheel = (e: WheelEvent) => {
      if (el.scrollWidth <= el.clientWidth) {
        return;
      }
      e.preventDefault();
      el.scrollLeft += e.deltaY;
    };

    el.addEventListener('wheel', onWheel, { passive: false });
    return () => el.removeEventListener('wheel', onWheel);
  }, []);

  // 마우스 드래그로 스크롤. pointerType으로 마우스만 걸러 터치/펜 입력과 분리.
  // setPointerCapture는 버튼의 click 타겟팅을 방해할 수 있어 사용하지 않고,
  // 드래그 중에만 window에 move/up 리스너를 붙였다 뗀다.
  const handlePointerDown = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== 'mouse') {
      return;
    }
    const el = containerRef.current;
    if (!el) {
      return;
    }

    isDraggingRef.current = true;
    didDragRef.current = false;
    startXRef.current = e.clientX;
    scrollLeftRef.current = el.scrollLeft;

    const handleMove = (moveEvent: PointerEvent) => {
      if (!isDraggingRef.current) {
        return;
      }
      const delta = moveEvent.clientX - startXRef.current;
      if (Math.abs(delta) > DRAG_THRESHOLD) {
        didDragRef.current = true;
      }
      el.scrollLeft = scrollLeftRef.current - delta;
    };

    const handleUp = () => {
      isDraggingRef.current = false;
      window.removeEventListener('pointermove', handleMove);
      window.removeEventListener('pointerup', handleUp);
      window.removeEventListener('pointercancel', handleUp);
    };

    window.addEventListener('pointermove', handleMove);
    window.addEventListener('pointerup', handleUp);
    window.addEventListener('pointercancel', handleUp);
  }, []);

  // 드래그(임계값 이상 이동) 직후 버튼의 onClick이 같이 발화되는 것을 막는다.
  const handleClickCapture = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (didDragRef.current) {
      e.preventDefault();
      e.stopPropagation();
      didDragRef.current = false;
    }
  }, []);

  return (
    <div
      ref={containerRef}
      className={styles.sliderContainer}
      onPointerDown={handlePointerDown}
      onClickCapture={handleClickCapture}
    >
      {semesterItems.map(item => (
        <button
          key={`${item.year}-${item.semester}`}
          className={`${styles.semesterButton} ${item.isActive ? styles.active : ''}`}
          onClick={() => handleSemesterClick(item.year, item.semester)}
        >
          {item.label}
        </button>
      ))}
    </div>
  );
}