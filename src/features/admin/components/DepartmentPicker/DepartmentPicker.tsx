import { useId, useState } from 'react';
import type { DepartmentOption } from '@/shared/api/data-contracts';
import { useDepartmentSearchQuery } from '../../apis/queries/useAdminQueries';
import { DEPARTMENT_SEARCH_DEBOUNCE_MS } from '../../constants';
import { useDebouncedValue } from '../../hooks/useDebouncedValue';
import styles from './DepartmentPicker.module.scss';

interface DepartmentPickerProps {
  label: string;
  value: DepartmentOption | null;
  onChange: (department: DepartmentOption | null) => void;
  disabled?: boolean;
}

// 학과 선택. test-options 의 전체 목록은 수백 건이라 select 에 다 넣으면 못 고른다 →
// GET /api/admin/departments 검색(디바운스)으로 좁힌 뒤 클릭 선택한다.
export function DepartmentPicker({ label, value, onChange, disabled }: DepartmentPickerProps) {
  const inputId = useId();
  const [keyword, setKeyword] = useState('');
  const debouncedKeyword = useDebouncedValue(keyword, DEPARTMENT_SEARCH_DEBOUNCE_MS);
  const { data: results, isFetching, error } = useDepartmentSearchQuery(disabled ? '' : debouncedKeyword);

  const handleSelect = (department: DepartmentOption) => {
    onChange(department);
    setKeyword('');
  };

  return (
    <div className={styles.picker}>
      <label htmlFor={inputId} className={styles.label}>
        {label}
      </label>

      {value ? (
        <div className={styles.selected}>
          <span className={styles.selectedText}>
            {value.name}{' '}
            <span className={styles.meta}>
              ({value.code} · id {value.id})
            </span>
          </span>
          <button type="button" className={styles.clearButton} onClick={() => onChange(null)} disabled={disabled}>
            변경
          </button>
        </div>
      ) : (
        <>
          <input
            id={inputId}
            type="text"
            className={styles.input}
            value={keyword}
            disabled={disabled}
            placeholder="학과명 또는 학과코드 검색"
            onChange={event => setKeyword(event.target.value)}
          />

          {debouncedKeyword.trim().length > 0 && (
            <div className={styles.results}>
              {isFetching && <p className={styles.hint}>검색 중…</p>}
              {error && <p className={styles.error}>검색 실패: {error instanceof Error ? error.message : ''}</p>}
              {!isFetching && !error && results?.length === 0 && <p className={styles.hint}>결과 없음</p>}
              {results?.map(department => (
                <button
                  key={department.id}
                  type="button"
                  className={styles.resultItem}
                  onClick={() => handleSelect(department)}
                >
                  {department.name}{' '}
                  <span className={styles.meta}>
                    ({department.code} · id {department.id})
                  </span>
                </button>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
