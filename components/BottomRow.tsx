'use client';
import { useLang } from '@/lib/lang-context';

export function BottomRow() {
  const { t } = useLang();
  return (
    <div className="bottom-row anim-fade" style={{ '--delay': '800ms' } as React.CSSProperties}>
      <div className="bottom-left">
        <p>{t.bottomLeft}</p>
      </div>
      <div className="bottom-right">
        <p className="bottom-title">{t.bottomRightTitle}</p>
        <p>{t.bottomRight}</p>
      </div>
    </div>
  );
}
