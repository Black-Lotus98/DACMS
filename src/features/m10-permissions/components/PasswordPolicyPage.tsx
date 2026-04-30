'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useAppDispatch } from '@/store/hooks';
import { updatePasswordPolicy } from '../store/slice';
import { usePermissionsModule } from '../hooks';
import type { PasswordPolicy } from '../types';

export function PasswordPolicyPage() {
  const dispatch = useAppDispatch();
  const { local } = useParams<{ local: string }>();
  const { passwordPolicy } = usePermissionsModule();
  const [policy, setPolicy] = useState<PasswordPolicy>({ ...passwordPolicy });
  const [saved, setSaved] = useState(false);

  function handleSave() {
    dispatch(updatePasswordPolicy(policy));
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  function setNum(field: keyof PasswordPolicy, value: string) {
    const n = parseInt(value, 10);
    if (!isNaN(n)) setPolicy((p) => ({ ...p, [field]: n }));
  }

  function setBool(field: keyof PasswordPolicy, value: boolean) {
    setPolicy((p) => ({ ...p, [field]: value }));
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">Password Policy</h1>
          <p className="text-sm text-muted-foreground">M10 · F10.8 — Configure complexity, expiry, and lockout rules.</p>
        </div>
        <Link href={`/${local}/permissions`} className="h-9 px-3 rounded-md border text-sm hover:bg-muted inline-flex items-center">
          Back to permissions
        </Link>
      </div>

      <section className="rounded-xl border bg-background p-6 space-y-6 max-w-xl">

        {/* Minimum length */}
        <div className="space-y-1">
          <label className="text-sm font-medium">Minimum password length</label>
          <p className="text-xs text-muted-foreground">SRS default: 8 characters</p>
          <input
            type="number"
            min={6}
            max={32}
            value={policy.minLength}
            onChange={(e) => setNum('minLength', e.target.value)}
            className="w-24 h-9 rounded-md border bg-background px-3 text-sm"
          />
        </div>

        {/* Complexity */}
        <div className="space-y-3">
          <p className="text-sm font-medium">Complexity requirements</p>
          {([
            ['requireUppercase', 'Require uppercase letters (A–Z)'],
            ['requireNumbers',   'Require numbers (0–9)'],
            ['requireSymbols',   'Require special characters (!@#$…)'],
          ] as [keyof PasswordPolicy, string][]).map(([field, label]) => (
            <label key={field} className="flex items-center gap-3 text-sm cursor-pointer">
              <input
                type="checkbox"
                checked={policy[field] as boolean}
                onChange={(e) => setBool(field, e.target.checked)}
                className="w-4 h-4"
              />
              {label}
            </label>
          ))}
        </div>

        {/* Expiry */}
        <div className="space-y-1">
          <label className="text-sm font-medium">Password expiry (days)</label>
          <p className="text-xs text-muted-foreground">Set to 0 to disable expiry</p>
          <input
            type="number"
            min={0}
            max={365}
            value={policy.expiryDays}
            onChange={(e) => setNum('expiryDays', e.target.value)}
            className="w-24 h-9 rounded-md border bg-background px-3 text-sm"
          />
        </div>

        {/* Lockout */}
        <div className="space-y-1">
          <label className="text-sm font-medium">Account lockout after failed attempts</label>
          <p className="text-xs text-muted-foreground">SRS default: 5 failed attempts</p>
          <input
            type="number"
            min={1}
            max={20}
            value={policy.maxFailedAttempts}
            onChange={(e) => setNum('maxFailedAttempts', e.target.value)}
            className="w-24 h-9 rounded-md border bg-background px-3 text-sm"
          />
        </div>

        {/* Current summary */}
        <div className="rounded-lg bg-muted/40 p-3 text-xs text-muted-foreground space-y-1">
          <p className="font-medium text-foreground">Current policy summary</p>
          <p>Min length: {policy.minLength} chars</p>
          <p>Uppercase: {policy.requireUppercase ? 'Required' : 'Not required'}</p>
          <p>Numbers: {policy.requireNumbers ? 'Required' : 'Not required'}</p>
          <p>Symbols: {policy.requireSymbols ? 'Required' : 'Not required'}</p>
          <p>Expiry: {policy.expiryDays === 0 ? 'Never' : `${policy.expiryDays} days`}</p>
          <p>Lockout after: {policy.maxFailedAttempts} failed attempts</p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleSave}
            className="h-9 px-5 rounded-md bg-primary text-primary-foreground text-sm hover:opacity-90"
          >
            Save policy
          </button>
          {saved && <span className="text-xs text-green-600">Policy saved.</span>}
        </div>
      </section>
    </div>
  );
}
