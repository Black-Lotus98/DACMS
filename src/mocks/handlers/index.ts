import { authHandlers } from './auth';
// Module handlers will be imported here as Phase 1–4 modules are built
// e.g. import { permissionsHandlers } from './permissions';

export const handlers = [
  ...authHandlers,
];
