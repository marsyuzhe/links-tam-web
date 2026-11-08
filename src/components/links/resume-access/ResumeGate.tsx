'use client';
import { useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { LockKeyhole } from 'lucide-react';
import { useLocale } from '../Locale';
import { ReadingShell } from '../ReadingShell';
import styles from './resume-access.module.css';

export function ResumeGate() {
  const { locale } = useLocale(),
    en = locale === 'en',
    router = useRouter();
  const [password, setPassword] = useState(''),
    [pending, setPending] = useState(false),
    [error, setError] = useState('');
  async function unlock(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (pending) return;
    setPending(true);
    setError('');
    try {
      const response = await fetch('/api/resume/access', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
        credentials: 'same-origin',
      });
      setPassword('');
      if (response.ok) {
        router.refresh();
        return;
      }
      setError(
        response.status === 429
          ? en
            ? 'Too many attempts. Try again in one minute.'
            : '尝试次数较多，请一分钟后再试。'
          : response.status === 401
            ? en
              ? 'Incorrect password. Please try again.'
              : '密码不正确，请重新输入。'
            : en
              ? 'Access is temporarily unavailable. Please try again.'
              : '暂时无法验证，请稍后重试。',
      );
    } catch {
      setError(en ? 'Connection failed. Please try again.' : '连接失败，请稍后重试。');
    } finally {
      setPending(false);
    }
  }
  return (
    <ReadingShell>
      <section className={styles.gate}>
        <LockKeyhole size={28} strokeWidth={1.3} aria-hidden="true" />
        <p className={styles.eyebrow}>
          {en ? 'LINKS TAM / OFFICIAL RESUME' : 'LINKS TAM / 正式简历'}
        </p>
        <h1>{en ? 'A closer look.' : '再近一步，了解我。'}</h1>
        <p>
          {en
            ? 'Enter the access password to view the resume and download the official PDF.'
            : '请输入查看密码，阅读简历并下载正式 PDF。'}
        </p>
        <form onSubmit={unlock}>
          <label htmlFor="resume-password">{en ? 'Access password' : '查看密码'}</label>
          <div className={styles.fields}>
            <input
              id="resume-password"
              name="password"
              type="password"
              inputMode="numeric"
              autoComplete="current-password"
              required
              maxLength={128}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              aria-invalid={!!error}
              aria-describedby="resume-access-error"
              disabled={pending}
            />
            <button type="submit" className="reading-button" disabled={pending}>
              {pending
                ? en
                  ? 'Verifying…'
                  : '正在验证…'
                : en
                  ? 'Unlock resume ↗'
                  : '解锁简历 ↗'}
            </button>
          </div>
          <p id="resume-access-error" className={styles.error} role="alert">
            {error}
          </p>
        </form>
      </section>
    </ReadingShell>
  );
}

export function LockResumeButton() {
  const { locale } = useLocale(),
    en = locale === 'en';
  const [busy, setBusy] = useState(false),
    [failed, setFailed] = useState(false);
  return (
    <button
      className="reading-button"
      type="button"
      disabled={busy}
      onClick={async () => {
        setBusy(true);
        try {
          const r = await fetch('/api/resume/access', { method: 'DELETE' });
          if (!r.ok) throw Error();
          window.location.reload();
        } catch {
          setFailed(true);
          setBusy(false);
        }
      }}
    >
      {failed ? (en ? 'Try locking again' : '重试锁定') : en ? 'Lock resume' : '锁定简历'}
    </button>
  );
}
