import { STORE } from '../api';
import { useSettings } from '../context/SettingsContext';
export function Lotus({ size = 28 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" aria-hidden="true" fill="currentColor">
      <path d="M32 8c6 8 6 18 0 26-6-8-6-18 0-26z" /><path d="M14 20c9 2 15 9 16 18-9-2-15-9-16-18z" />
      <path d="M50 20c-1 9-7 16-16 18 1-9 7-16 16-18z" /><path d="M8 36c8-2 16 1 22 8-8 2-16-1-22-8z" />
      <path d="M56 36c-6 7-14 10-22 8 6-7 14-10 22-8z" />
    </svg>
  );
}
export default function Logo({ small }) {
  const ctx = useSettings();
  return (
    <span className={`logo ${small ? 'logo-sm' : ''}`}>
      <Lotus size={small ? 22 : 30} />
      <span className="logo-word">{ctx?.settings?.storeName || STORE}</span>
    </span>
  );
}
