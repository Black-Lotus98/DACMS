import { authHandlers } from './auth';
import { permissionsHandlers } from './permissions';
import { orgHandlers } from './org';
import { archiveHandlers } from './archive';
import { dataModelsHandlers } from './data-models';
import { recordsHandlers } from './records';
import { searchHandlers } from './search';
import { barcodesHandlers } from './barcodes';
import { workflowHandlers } from './workflow';
import { lendingHandlers } from './lending';
import { destructionHandlers } from './destruction';
import { notificationsHandlers } from './notifications';
import { reportsHandlers } from './reports';
import { integrationHandlers } from './integration';
import { kpiHandlers } from './kpi';
import { kpiLinkingHandlers } from './kpi-linking';

export const handlers = [
  ...authHandlers,
  ...permissionsHandlers,
  ...orgHandlers,
  ...archiveHandlers,
  ...dataModelsHandlers,
  ...recordsHandlers,
  ...searchHandlers,
  ...barcodesHandlers,
  ...workflowHandlers,
  ...lendingHandlers,
  ...destructionHandlers,
  ...notificationsHandlers,
  ...reportsHandlers,
  ...integrationHandlers,
  ...kpiHandlers,
  ...kpiLinkingHandlers,
];
