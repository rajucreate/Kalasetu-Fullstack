import { useEffect, useRef, useState } from 'react';
import '../styles/cursor.css';

const INTERACTIVE_SELECTOR = [
  'a',
  'button',
  '[role="button"]',
  '.button',
  'summary',
  'label[for]',
  'select',
  'input[type="submit"]',
  'input[type="button"]',
].join(',');

const TEXT_SELECTOR = [
  'input:not([type="checkbox"]):not([type="radio"]):not([type="range"]):not([type="file"]):not([type="submit"]):not([type="button"])',
  'textarea',
  '[contenteditable="true"]',
].join(',');

export function CustomCursor() {
  const ringRef = useRef(null);
  const dotRef = useRef(null);
  const rafRef = useRef(null);
  const [enabled, setEnabled] = useState(false);
  const [visible, setVisible] = useState(false);
  const [pressed, setPressed] = useState(false);
  const [mode, setMode] = useState('default');

  useEffect(() => {
    const mediaQuery = window.matchMedia('(hover: hover) and (pointer: fine)');

    const syncCapability = () => {
      setEnabled(mediaQuery.matches);
    };

    syncCapability();
    mediaQuery.addEventListener('change', syncCapability);

    return () => {
      mediaQuery.removeEventListener('change', syncCapability);
    };
  }, []);

  useEffect(() => {
    if (!enabled) {
      document.body.classList.remove('custom-cursor-enabled');
      return undefined;
    }

    document.body.classList.add('custom-cursor-enabled');

    const target = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const ring = { x: target.x, y: target.y };
    const dot = { x: target.x, y: target.y };

    const animate = () => {
      dot.x += (target.x - dot.x) * 0.35;
      dot.y += (target.y - dot.y) * 0.35;
      ring.x += (target.x - ring.x) * 0.18;
      ring.y += (target.y - ring.y) * 0.18;

      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${dot.x}px, ${dot.y}px, 0)`;
      }
      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${ring.x}px, ${ring.y}px, 0)`;
      }

      rafRef.current = requestAnimationFrame(animate);
    };

    const onPointerMove = (event) => {
      target.x = event.clientX;
      target.y = event.clientY;
      setVisible(true);
    };

    const onPointerDown = () => setPressed(true);
    const onPointerUp = () => setPressed(false);

    const onPointerOver = (event) => {
      const source = event.target;
      if (!(source instanceof Element)) {
        setMode('default');
        return;
      }

      if (source.closest(TEXT_SELECTOR)) {
        setMode('text');
        return;
      }

      if (source.closest(INTERACTIVE_SELECTOR)) {
        setMode('interactive');
        return;
      }

      setMode('default');
    };

    const onPointerLeave = () => {
      setVisible(false);
      setPressed(false);
      setMode('default');
    };

    window.addEventListener('pointermove', onPointerMove, { passive: true });
    window.addEventListener('pointerdown', onPointerDown);
    window.addEventListener('pointerup', onPointerUp);
    document.addEventListener('pointerover', onPointerOver);
    document.addEventListener('pointerleave', onPointerLeave);

    rafRef.current = requestAnimationFrame(animate);

    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }

      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('pointerup', onPointerUp);
      document.removeEventListener('pointerover', onPointerOver);
      document.removeEventListener('pointerleave', onPointerLeave);
      document.body.classList.remove('custom-cursor-enabled');
    };
  }, [enabled]);

  if (!enabled) {
    return null;
  }

  return (
    <div
      className={`custom-cursor ${visible ? 'is-visible' : ''} ${pressed ? 'is-pressed' : ''} mode-${mode}`}
      aria-hidden="true"
    >
      <div className="custom-cursor-layer custom-cursor-ring-layer" ref={ringRef}>
        <div className="custom-cursor-ring" />
      </div>
      <div className="custom-cursor-layer custom-cursor-dot-layer" ref={dotRef}>
        <div className="custom-cursor-dot" />
      </div>
    </div>
  );
}
