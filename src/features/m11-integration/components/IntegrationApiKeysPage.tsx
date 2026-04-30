'use client';

import { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';

export function IntegrationApiKeysPage() {
  const { local } = useParams<{ local: string }>();
  const router = useRouter();

  useEffect(() => {
    router.replace(`/${local}/integration`);
  }, [local, router]);

  return null;
}
