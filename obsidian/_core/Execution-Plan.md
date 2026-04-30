**DACMS**

Document & Archive Centre Management System

**Frontend Execution Plan - Next.js UI Prototype**

| **Client**      | Ministry of Industry & Trade                         |
| --------------- | ---------------------------------------------------- |
| **Document**    | Frontend Execution Plan v1.0                         |
| **Framework**   | Next.js 16 + App Router + TypeScript Strict          |
| **State**       | Redux Toolkit + MSW + React Hook Form + Zod          |
| **Scope**       | 15 Modules - UI Prototype (No Backend)               |
| **Build Order** | Layer-based: Foundation → Core → Lifecycle → Insight |
| **Date**        | April 2026                                           |
| **Status**      | All phases complete (Phase 0 → Phase 4)             |

# **0. Architecture Snapshot (Quick Reference)**

Use this section as the fast architecture index. Detailed rationale and module plans remain in later sections.

## **0.1 Core Stack**

- **Framework:** Next.js 16 App Router + TypeScript strict
- **State:** Redux Toolkit (async thunks) + `react-redux`
- **Forms:** React Hook Form + Zod
- **Mock API:** MSW (network-level handler interception)
- **Styling/UI:** Tailwind CSS v4 + shadcn/ui + Radix UI
- **i18n:** `next-intl` (AR primary / EN secondary)

## **0.2 Folder Strategy (Hybrid)**

- **Thin routes:** `src/app/[local]/*` page files stay minimal (compose + render)
- **Feature modules:** `src/features/mX-*` hold:
  - `types/`
  - `schemas/`
  - `data/`
  - `store/`
  - `hooks/`
  - `components/`

## **0.3 Shared Infrastructure**

- `src/store/store.ts` - root store (all module slices + auth)
- `src/store/authSlice.ts` - mock session (`role`, `user`, `clearanceLevel`)
- `src/mocks/browser.ts` - MSW worker bootstrap
- `src/mocks/handlers/index.ts` - combines module handlers
- `src/config/navigation.ts` - role-based sidebar config
- `src/config/roles.ts` - role + clearance enums
- `src/components/layout/*` - app shell (`Sidebar`, `Header`, `RoleBadge`)

## **0.4 Delivery Order**

1. **Foundation:** global setup (store, mocks, auth, layout, navigation)
2. **Core:** foundational modules with highest dependency weight
3. **Lifecycle:** operational flow modules
4. **Insight:** KPI/reporting and cross-module analytics

# **1\. Architecture Decisions**

All decisions below were resolved through a structured grilling session against the SRS requirements. These choices are fixed for the prototype phase and map cleanly to real backend integration.

| **Decision**         | **Choice**                                            | **Rationale**                                             |
| -------------------- | ----------------------------------------------------- | --------------------------------------------------------- |
| **Framework**        | Next.js 16 App Router + TypeScript strict             | Existing project; SSR + RTL/i18n support                  |
| **State Management** | Redux Toolkit + RTK async thunks                      | Scalable; maps cleanly to real API later                  |
| **Forms**            | React Hook Form + Zod schemas                         | Type-safe validation; reusable across modules             |
| **API Simulation**   | Mock Service Worker (MSW)                             | Network-level interception; zero refactor to real backend |
| **Styling**          | Tailwind CSS v4 + shadcn/ui + Radix UI                | Existing setup; TailAdmin as design reference             |
| **i18n**             | next-intl (AR primary / EN secondary)                 | RTL/LTR already configured in project                     |
| **Auth Simulation**  | Mock login page → role in Redux                       | Demo-friendly; realistic role experience                  |
| **Role Switcher**    | Dev badge + quick-switch dropdown                     | Fast switching without re-login during dev                |
| **Folder Strategy**  | Hybrid: /features/ + thin /app/ pages                 | Module isolation; easy backend swap per module            |
| **Build Order**      | Layer-based (Foundation → Core → Lifecycle → Insight) | Follows SRS section 10.3 dependency graph                 |
| **Design Reference** | TailAdmin (where it fits gov dashboard use case)      | Data-dense tables, KPI cards, stat widgets                |

# **2\. Full Folder Structure**

The hybrid structure extends the existing DACMS project. App Router page files stay thin (import + render only). All Redux slices, Zod schemas, MSW handlers, dummy data, hooks, and components live in /src/features/.

## **2.1 App Router Routes**

**src/app/\[local\]/**

**├── (auth)/login/page.tsx ← Mock login + role picker (5 role cards)**

**├── (private)/**

**│ ├── layout.tsx ← Shared layout: Sidebar + Header + RoleBadge**

**│ ├── dashboard/page.tsx ← Role-driven dashboard router**

**│ ├── archive-structure/page.tsx ← M1: Archive Structure**

**│ ├── data-models/page.tsx ← M2: Data Models & Metadata**

**│ ├── records/page.tsx ← M3: Records Registration**

**│ ├── records/\[id\]/page.tsx ← M3: Record Detail + History**

**│ ├── search/page.tsx ← M4: Search & Retrieval**

**│ ├── barcodes/page.tsx ← M5: Barcode Management**

**│ ├── lending/page.tsx ← M6: Lending Requests**

**│ ├── lending/\[id\]/page.tsx ← M6: Request Detail**

**│ ├── destruction/page.tsx ← M7: Destruction & Migration**

**│ ├── notifications/page.tsx ← M8: Notifications History**

**│ ├── reports/page.tsx ← M9: Reports & Statistics**

**│ ├── permissions/page.tsx ← M10: Users & Roles**

**│ ├── integration/page.tsx ← M11: Technical Integration**

**│ ├── kpi/page.tsx ← M12: KPI Dashboards**

**│ ├── org-structure/page.tsx ← M13: Organizational Structure**

**│ ├── workflow/page.tsx ← M14: Workflow System**

**│ └── kpi-linking/page.tsx ← M15: Structure-KPI Linking**

## **2.2 Features Directory (per-module structure)**

**src/features/**

**├── m1-archive-structure/**

**│ ├── types/index.ts ← TypeScript interfaces (ArchiveRoom, ArchiveBox…)**

**│ ├── schemas/index.ts ← Zod schemas (roomSchema, shelfSchema…)**

**│ ├── data/index.ts ← Dummy objects (10-20 realistic records)**

**│ ├── store/slice.ts ← RTK slice: state + reducers + async thunks**

**│ ├── hooks/index.ts ← Custom hooks wrapping dispatch + selectors**

**│ ├── components/ ← All UI components for this module**

**│ └── index.ts ← Public exports**

**├── m2-data-models/ ← Same sub-structure for every module**

**├── m3-records/**

**├── m4-search/**

**├── m5-barcodes/**

**├── m6-lending/**

**├── m7-destruction/**

**├── m8-notifications/**

**├── m9-reports/**

**├── m10-permissions/**

**├── m11-integration/**

**├── m12-kpi/**

**├── m13-org-structure/**

**├── m14-workflow/**

**└── m15-kpi-linking/**

## **2.3 Shared Infrastructure**

**src/store/store.ts ← Root Redux store (combines all 15 slices + authSlice)**

**src/store/authSlice.ts ← Mock session: { role, user, clearanceLevel }**

**src/mocks/browser.ts ← MSW service worker setup**

**src/mocks/handlers/index.ts ← Imports all 15 module handler arrays**

**src/config/navigation.ts ← Role → sidebar items mapping (single source of truth)**

**src/config/roles.ts ← Role enum + ClearanceLevel enum**

**src/types/index.ts ← Global shared types**

**src/components/layout/**

**├── Sidebar.tsx ← Role-filtered navigation from navigationConfig**

**├── Header.tsx ← App header + notification bell + user menu**

**└── RoleBadge.tsx ← Shows active role + quick-switch dropdown**

# **3\. Global Setup Tasks (Phase 0)**

Complete all Phase 0 tasks before writing any module code. These form the foundation every feature depends on.  
**Update (2026-04-29): Phase 0 complete. Phase 1 complete. Phase 2 complete. Phase 3 complete. Phase 4 complete.**

## **3.1 Packages to Install**

**npm install @reduxjs/toolkit react-redux**

**npm install react-hook-form @hookform/resolvers zod**

**npm install msw --save-dev**

**npm install date-fns date-fns-jalali**

**npm install recharts # KPI + report charts (M9, M12)**

**npm install @tanstack/react-table # data tables across all modules**

**npm install bwip-js # barcode rendering in browser (M5)**

**npm install @dnd-kit/core @dnd-kit/sortable # drag-reorder KPI mapping (M15)**

## **3.2 MSW Setup Commands**

**npx msw init public/ --save**

**\# Creates: public/mockServiceWorker.js**

**\# Create: src/mocks/browser.ts - setupWorker(handlers)**

**\# Create: src/mocks/handlers/index.ts - combines all module handlers**

**\# Wrap app layout with: &lt;MSWProvider&gt; (dev only, reads NODE_ENV)**

## **3.3 Redux Store Shape**

**// src/store/store.ts**

**{**

**auth: { role, user, clearanceLevel }**

**archiveStructure: { rooms, rows, cabinets, shelves, boxes }**

**dataModels: { documentTypes, categories, metadataFields, retentionPolicies }**

**records: { items, locationHistory, filters, selected }**

**search: { filters, results, savedQueries, loading }**

**barcodes: { labels, printJobs }**

**lending: { requests, items, dispatches }**

**destruction: { requests, items, migrations }**

**notifications: { items, unreadCount, preferences }**

**reports: { definitions, activeReport, filters }**

**permissions: { users, roles, permissions, accessLog }**

**integration: { apiKeys, webhooks, status }**

**kpi: { definitions, snapshots, currentValues }**

**orgStructure: { organization, branches, departments }**

**workflows: { definitions, steps, executions }**

**kpiMapping: { mappings }**

**}**

## **3.4 Mock Login Page**

**// src/app/\[local\]/(auth)/login/page.tsx**

**// Five role cards displayed in a grid:**

**// Center Director | Archive Supervisor | Archive Officer | Admin | Beneficiary**

**// Clicking a card: dispatch(setRole(role)) → authSlice → redirect to /dashboard**

**// MSW handler: POST /api/auth/login → returns { user, role, clearanceLevel }**

**// RoleBadge in header: shows active role name + click to open quick-switch popover**

## **3.5 TailAdmin Design Usage**

TailAdmin is used as a design reference where it fits the government archive use case. It is NOT used for bespoke components.

- Stat / KPI cards with trend arrows and traffic-light colors (M12, M15)
- Data tables with sortable columns, filters, pagination, action menus (M3, M6, M9)
- Sidebar navigation with role-filtered menu items and active indicators
- Form layouts for record registration, lending requests, destruction batches
- Occupancy progress bars and storage capacity widgets (M1)

Custom components (NOT TailAdmin): OrgTree, CategoryTreeEditor, PermissionMatrix, WorkflowStepList, BarcodeViewer, ApprovalChain progress bar.

# **4\. Layer-Based Build Order**

Follows SRS §3.3 Module Layering and §10.3 Module Initialisation Order. No module is started until all its dependencies are complete.

| **Phase** | **Modules**       | **Description**                                                     | **SRS Init Order** | **Blocked By** |
| --------- | ----------------- | ------------------------------------------------------------------- | ------------------ | -------------- |
| Phase 0 ✅ | Global Setup      | Store, MSW, auth, nav config, layout, role switcher, mock login     | Pre-module         | Nothing        |
| Phase 1 ✅ | M10, M13, M1, M2  | Foundation: Permissions, Org Structure, Archive Hierarchy, Metadata | 1 → 2 → 3 → 4      | None           |
| Phase 2 ✅ | M3, M4, M5, M14   | Core Operations: Records, Search, Barcodes, Workflow Engine         | 5 → 6 → 7 → 8      | None           |
| Phase 3 ✅ | M6, M7, M8        | Lifecycle: Lending, Destruction & Migration, Notifications          | 9 → 10 → 11        | None           |
| Phase 4 ✅ | M9, M11, M12, M15 | Insight & Governance: Reports, Integration, KPIs, KPI Linking       | 12 → 13 → 14 → 15  | None           |

# **5\. Module-by-Module Breakdown**

Every module follows the identical file pattern: types → Zod schemas → dummy data → Redux slice → MSW handlers → components → page. The pattern is repeated consistently for all 15 modules.

**src/features/mX-module-name/**

**├── types/index.ts ← TypeScript interfaces matching SRS entity definitions**

**├── schemas/index.ts ← Zod schemas for every form in the module**

**├── data/index.ts ← 10-20 realistic dummy records per entity**

**├── store/slice.ts ← RTK slice: initialState + reducers + createAsyncThunk**

**├── hooks/index.ts ← useModule() hook: wraps dispatch + useSelector**

**├── components/ ← All UI components (List, Form, Detail, Table, Modals)**

**└── index.ts ← Public exports (re-exports slice, hooks, types)**

## **Phase 1 - M10: Permissions & Security (إدارة الصلاحيات والأمن)**

Build first. User, Role, Permission entities are referenced by every other module.

| **SRS Entities**     | User, Role, Permission, AccessLog                                                                         |
| -------------------- | --------------------------------------------------------------------------------------------------------- |
| **SRS Requirements** | F10.1 - F10.8: User CRUD, RBAC role assignment, clearance enforcement, audit log                          |
| **Key Use Cases**    | UC-10-01: Create New User with Role Assignment                                                            |
| **Types**            | User, Role, Permission, AccessLog \| Enums: ClearanceLevel, RoleType                                      |
| **Zod Schemas**      | createUserSchema, updateUserSchema, assignRoleSchema, permissionGroupSchema                               |
| **Dummy Data**       | 5 users (one per role), 5 roles, 20 permissions across modules, 30 access log entries                     |
| **Redux Slice**      | usersSlice (CRUD) \| rolesSlice (CRUD) \| accessLogSlice (append-only - no delete reducer)                |
| **MSW Handlers**     | GET/POST/PUT/DELETE /api/users \| GET/POST /api/roles \| GET /api/permissions \| GET /api/access-log      |
| **Components**       | UserTable, UserForm, RoleTable, RoleForm, PermissionMatrix (checkbox grid), AccessLogTable                |
| **Routes**           | /permissions → users list \| /permissions/new \| /permissions/roles \| /permissions/logs                  |
| **Design Notes**     | PermissionMatrix: role × permission checkbox grid - custom component, not TailAdmin pattern               |
| **Business Rules**   | usePermission(perm_key) hook reads active role from authSlice → returns boolean for conditional rendering |

## **Phase 1 - M13: Organizational Structure (الهيكل التنظيمي)**

Build second. Department data is imported as reference by M1, M3, M6, M10.

| **SRS Entities**     | Organization, Branch, Department                                                                        |
| -------------------- | ------------------------------------------------------------------------------------------------------- |
| **SRS Requirements** | F13.1 - F13.6: Org config, 4 structural levels, department responsible assignment                       |
| **Key Use Cases**    | UC-13-01: Onboard New Beneficiary Department                                                            |
| **Types**            | Organization, Branch, Department (with optional parent_dept for hierarchy)                              |
| **Zod Schemas**      | createBranchSchema, createDepartmentSchema, assignResponsibleSchema                                     |
| **Dummy Data**       | 1 organization (Ministry), 3 branches, 10 departments with parent-child hierarchy                       |
| **Redux Slice**      | orgSlice: branches + departments CRUD \| orgTree computed selector                                      |
| **MSW Handlers**     | GET/POST/PUT /api/branches \| GET/POST/PUT /api/departments \| GET /api/org-tree                        |
| **Components**       | OrgTree (recursive TreeNode component), BranchForm, DepartmentForm, DepartmentCard                      |
| **Routes**           | /org-structure → tree view \| /org-structure/branches \| /org-structure/departments/new                 |
| **Design Notes**     | OrgTree: recursive expand/collapse tree with indented children - fully custom component                 |
| **Business Rules**   | Beneficiary role scoped to their department's records only. Department responsible sees dept-wide data. |

## **Phase 1 - M1: Archive Structure Management (إدارة هيكل الأرشيف)**

| **SRS Entities**     | ArchiveRoom, ArchiveRow, ArchiveCabinet, ArchiveShelf, ArchiveBox                                      |
| -------------------- | ------------------------------------------------------------------------------------------------------ |
| **SRS Requirements** | F1.1 - F1.10: Rooms, rows, cabinets, shelves, boxes, occupancy dashboard, box transfer                 |
| **Key Use Cases**    | UC-01-01: Register New Archive Room \| UC-01-02: View Physical Occupancy Dashboard                     |
| **Types**            | ArchiveRoom, ArchiveRow, ArchiveCabinet, ArchiveShelf, ArchiveBox                                      |
| **Zod Schemas**      | roomSchema, rowSchema, cabinetSchema, shelfSchema, boxSchema                                           |
| **Dummy Data**       | 3 rooms × 3 rows × 2 cabinets × 4 shelves × 5 boxes = ~360 entity nodes with realistic codes           |
| **Redux Slice**      | archiveStructureSlice: full hierarchy + occupancy computed selectors (% fill per shelf/room)           |
| **MSW Handlers**     | Full CRUD for all 5 entity types \| GET /api/archive/tree (full nested hierarchy response)             |
| **Components**       | ArchiveTree, RoomCard, OccupancyBar, OccupancyDashboard, TransferBoxModal, RoomForm, ShelfForm         |
| **Routes**           | /archive-structure → tree \| /archive-structure/rooms \| /archive-structure/occupancy                  |
| **Design Notes**     | OccupancyDashboard: TailAdmin stat cards with color-coded % - green (<70%), amber (70-89%), red (≥90%) |
| **Business Rules**   | Location code format: R01-RW03-CB02-SH1. Capacity alert at 90%. Deactivated units reject new records.  |

## **Phase 1 - M2: Data Models & Metadata (إدارة النماذج والبيانات)**

| **SRS Entities**     | DocumentType, DocumentCategory, MetadataField, RetentionPolicy                                                    |
| -------------------- | ----------------------------------------------------------------------------------------------------------------- |
| **SRS Requirements** | F2.1 - F2.9: Doc types, 4-level category hierarchy, metadata fields, option sets, retention policies              |
| **Key Use Cases**    | UC-02-01: Create Document Type with Category Hierarchy \| UC-02-02: Define Retention Policy                       |
| **Types**            | DocumentType, DocumentCategory, MetadataField, RetentionPolicy \| Enums: FieldType, ActionAfter                   |
| **Zod Schemas**      | documentTypeSchema, categorySchema, metadataFieldSchema, retentionPolicySchema, optionSetSchema                   |
| **Dummy Data**       | 5 document types, 3-level category trees per type, 15 metadata fields of varied types, 5 retention policies       |
| **Redux Slice**      | documentTypesSlice + categoriesSlice + metadataFieldsSlice + retentionPoliciesSlice                               |
| **MSW Handlers**     | CRUD all 4 entities \| GET /api/doc-types/:id/tree (full category hierarchy with children)                        |
| **Components**       | DocTypeTable, CategoryTreeEditor (4-level accordion), MetadataFieldForm, RetentionPolicyForm, FieldTypeSelector   |
| **Routes**           | /data-models → types list \| /data-models/:id → categories \| /data-models/retention                              |
| **Design Notes**     | CategoryTreeEditor: 4-level accordion tree with inline add/edit at each level - fully custom component            |
| **Business Rules**   | Max 4 hierarchy levels. Retention end = archive_date + period_years. Deprecated option sets retained for history. |

## **Phase 2 - M3: Records Registration & Archiving (إدارة السجلات والأرشفة)**

The most complex module. The dynamic form must load metadata fields from the selected DocumentType in M2.

| **SRS Entities**     | Record, RecordFile, LocationHistory                                                                                         |
| -------------------- | --------------------------------------------------------------------------------------------------------------------------- |
| **SRS Requirements** | F3.1 - F3.10: Register, upload files, assign location, bulk import, move between boxes, seal boxes                          |
| **Key Use Cases**    | UC-03-01: Register New Archive Record \| UC-03-02: Move Record Between Boxes                                                |
| **Types**            | Record, RecordFile, LocationHistory \| Enums: RecordStatus, SecrecyLevel                                                    |
| **Zod Schemas**      | registerRecordSchema (dynamic - injects fields from DocType template) \| moveRecordSchema                                   |
| **Dummy Data**       | 50 records across all document types, with files, location history, varied statuses and secrecy levels                      |
| **Redux Slice**      | recordsSlice: CRUD + status transitions + location moves + immutable locationHistory append                                 |
| **MSW Handlers**     | GET/POST/PUT /api/records \| POST /api/records/:id/move \| GET /api/records/:id/history \| POST /api/records/bulk-import    |
| **Components**       | RecordTable, RegisterRecordForm, RecordDetail, LocationHistoryTimeline, MoveRecordModal, BoxContentView, BulkImportUploader |
| **Routes**           | /records → table \| /records/new \| /records/:id \| /records/:id/history                                                    |
| **Design Notes**     | RecordTable: TailAdmin data table with status badge, secrecy pill, location code, action menu per row                       |
| **Business Rules**   | Ref auto-gen: REC-YYYY-NNNNN. Sealed box rejects new records. Records above user clearance hidden from results.             |

## **Phase 2 - M4: Search & Retrieval (البحث والاسترجاع)**

| **SRS Entities**     | SearchQuery (saved searches)                                                                                                           |
| -------------------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| **SRS Requirements** | F4.1 - F4.8: Full-text search, advanced filters, physical location lookup, barcode scan, export                                        |
| **Key Use Cases**    | UC-04-01: Advanced Record Search \| UC-04-02: Retrieve Record by Barcode Scan                                                          |
| **Types**            | SearchQuery, SearchFilters, SearchResult                                                                                               |
| **Zod Schemas**      | searchFiltersSchema (all filter combinations) \| saveQuerySchema                                                                       |
| **Dummy Data**       | Reuses M3 records as result set. 5 pre-saved named search queries.                                                                     |
| **Redux Slice**      | searchSlice: filters + paginated results + savedQueries + loading state                                                                |
| **MSW Handlers**     | POST /api/search (body: filters) \| GET /api/search/barcode/:val \| GET/POST /api/search/saved                                         |
| **Components**       | AdvancedSearchForm, SearchResultTable, BarcodeSearchInput, SavedQueriesPanel, LocationPathBreadcrumb, ExportButton                     |
| **Routes**           | /search → advanced \| /search/barcode → scanner mode                                                                                   |
| **Design Notes**     | BarcodeSearchInput: full-width text input with auto-focus, simulates scanner (Enter = submit). Location path as breadcrumb in results. |
| **Business Rules**   | Results filtered by user clearance. Export simulates CSV blob download. Saved queries scoped per user.                                 |

## **Phase 2 - M5: Barcode & Coding Management (إدارة الباركود والترميز)**

| **SRS Entities**     | BarcodeLabel, PrintJob                                                                                                          |
| -------------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| **SRS Requirements** | F5.1 - F5.7: Auto-generate CODE128+QR, individual + batch print, scan retrieval, replace damaged                                |
| **Key Use Cases**    | UC-05-01: Batch Print Barcode Labels \| UC-05-02: Replace Damaged Barcode Label                                                 |
| **Types**            | BarcodeLabel, PrintJob \| Enums: EntityType, BarcodeType, PrintStatus                                                           |
| **Zod Schemas**      | generateBarcodeSchema, batchPrintSchema, replaceBarcodeSchema                                                                   |
| **Dummy Data**       | Barcodes generated for all M1 rooms/shelves/boxes and M3 records                                                                |
| **Redux Slice**      | barcodesSlice: labels CRUD + printJobs queue (QUEUED → PRINTING → DONE)                                                         |
| **MSW Handlers**     | POST /api/barcodes/generate \| POST /api/barcodes/batch-print \| PUT /api/barcodes/:id/replace \| GET /api/barcodes/:entityId   |
| **Components**       | BarcodeViewer (bwip-js rendered CODE128), BatchPrintSelector, PrintJobQueue, LabelPreview, ReplaceBarcodelModal                 |
| **Routes**           | /barcodes → list \| /barcodes/batch-print \| /barcodes/scan                                                                     |
| **Design Notes**     | BarcodeViewer: bwip-js renders actual CODE128 barcode image in browser. LabelPreview shows full label layout before printing.   |
| **Business Rules**   | 1 active barcode per entity. Old barcode marked INACTIVE on replace (history preserved). Batch print produces downloadable PDF. |

## **Phase 2 - M14: Workflow System (نظام سير العمل)**

| **SRS Entities**     | Workflow, WorkflowStep, WorkflowExecution                                                                                  |
| -------------------- | -------------------------------------------------------------------------------------------------------------------------- |
| **SRS Requirements** | F14.1 - F14.8: 4 pre-built workflows, step types, versioning (DRAFT→PUBLISHED→ARCHIVED), SLA per step                      |
| **Key Use Cases**    | UC-14-01: Design and Publish Custom Approval Workflow                                                                      |
| **Types**            | Workflow, WorkflowStep, WorkflowExecution \| Enums: StepType, WorkflowStatus, ExecutionStatus                              |
| **Zod Schemas**      | workflowSchema, workflowStepSchema, executionActionSchema                                                                  |
| **Dummy Data**       | 4 pre-built workflows (Archiving, Lending, Destruction, Migration) fully defined with steps                                |
| **Redux Slice**      | workflowsSlice: CRUD + publish action \| executionsSlice: running instances + step advancement                             |
| **MSW Handlers**     | CRUD /api/workflows \| POST /api/workflows/:id/publish \| POST /api/executions \| PUT /api/executions/:id/advance          |
| **Components**       | WorkflowList, WorkflowStepList (linear ordered list), WorkflowExecutionTracker, SLABadge, ApprovalActionPanel              |
| **Routes**           | /workflow → list \| /workflow/:id → step editor \| /workflow/:id/executions → execution history                            |
| **Design Notes**     | No drag-and-drop canvas for prototype - ordered list with add/remove/reorder. Canvas is a post-prototype enhancement.      |
| **Business Rules**   | One PUBLISHED version at a time. Publishing locks the workflow - changes require a new version. SLA breach triggers alert. |

## **Phase 3 - M6: Lending & Requests Management (إدارة الإعارة والطلبات)**

| **SRS Entities**     | LendingRequest, LendingItem, MessengerDispatch                                                                                                |
| -------------------- | --------------------------------------------------------------------------------------------------------------------------------------------- |
| **SRS Requirements** | F6.1 - F6.10: Full lending lifecycle - request, approval, dispatch, tracking, return, overdue alerts                                          |
| **Key Use Cases**    | UC-06-01: Submit Lending Request \| UC-06-02: Process Return and Confirm Receipt                                                              |
| **Types**            | LendingRequest, LendingItem, MessengerDispatch \| Enums: LendingStatus, DispatchDirection                                                     |
| **Zod Schemas**      | createLendingRequestSchema, approvalSchema, extensionRequestSchema, returnConfirmSchema                                                       |
| **Dummy Data**       | 15 lending requests across all statuses, 3 overdue, messenger dispatch records                                                                |
| **Redux Slice**      | lendingSlice: requests CRUD + status machine + items tracking + dispatch management                                                           |
| **MSW Handlers**     | CRUD /api/lending \| PUT /api/lending/:id/approve \| PUT /api/lending/:id/dispatch \| PUT /api/lending/:id/return \| GET /api/lending/overdue |
| **Components**       | LendingRequestTable, NewLendingForm (multi-record selector), RequestDetail, ApprovalPanel, DispatchTracker, ReturnConfirmModal, OverdueBadge  |
| **Routes**           | /lending → table \| /lending/new \| /lending/:id \| /lending/overdue                                                                          |
| **Design Notes**     | Status badges: PENDING=gray, APPROVED=blue, ACTIVE=green, OVERDUE=red, RETURNED=slate. Due date countdown shown on active requests.           |
| **Business Rules**   | Ref: LND-YYYY-NNNNN. Max 50 records per request. Due date from doc type policy. Extension requires supervisor approval sub-workflow.          |

## **Phase 3 - M7: Destruction & Migration Management (إدارة الإتلاف والترحيل)**

| **SRS Entities**     | DestructionRequest, DestructionItem, MigrationRequest                                                                                            |
| -------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| **SRS Requirements** | F7.1 - F7.8: Retention monitoring, destruction request, 3-level approval, certificate, migration                                                 |
| **Key Use Cases**    | UC-07-01: Initiate Destruction Request for Expired Records                                                                                       |
| **Types**            | DestructionRequest, DestructionItem, MigrationRequest \| Enums: DestructionStatus, MigrationType                                                 |
| **Zod Schemas**      | createDestructionRequestSchema, migrationRequestSchema, approvalSchema                                                                           |
| **Dummy Data**       | 20 records past retention end date, 5 destruction requests in varied approval stages, 2 migration requests                                       |
| **Redux Slice**      | destructionSlice: requests + items + 3-level approval state \| migrationSlice: migration CRUD                                                    |
| **MSW Handlers**     | CRUD /api/destruction \| GET /api/destruction/watchlist \| PUT /api/destruction/:id/approve \| POST /api/destruction/:id/execute                 |
| **Components**       | RetentionWatchlist, DestructionRequestTable, DestructionForm, ApprovalChain (3-step progress), CertificatePreview, MigrationForm                 |
| **Routes**           | /destruction → watchlist \| /destruction/requests \| /destruction/:id \| /destruction/migration                                                  |
| **Design Notes**     | ApprovalChain: 3-step horizontal progress bar (Supervisor → Legal Officer → Director) with current stage highlighted in blue                     |
| **Business Rules**   | Ref: DST-YYYY-NNNNN. Only records past retention_end eligible. Certificate PDF generated on execution. Metadata stub retained after destruction. |

## **Phase 3 - M8: Notifications & Alerts (التنبيهات والإشعارات)**

| **SRS Entities**     | Notification, NotificationPreference                                                                                                         |
| -------------------- | -------------------------------------------------------------------------------------------------------------------------------------------- |
| **SRS Requirements** | F8.1 - F8.7: In-app notifications, email alerts, overdue, expiry, capacity threshold, preferences                                            |
| **Key Use Cases**    | UC-08-01: Receive Overdue Lending Alert                                                                                                      |
| **Types**            | Notification, NotificationPreference \| Enums: NotificationType, NotificationChannel                                                         |
| **Zod Schemas**      | notificationPreferenceSchema                                                                                                                 |
| **Dummy Data**       | 30 notifications across all types (mix of read/unread), preferences for each dummy user                                                      |
| **Redux Slice**      | notificationsSlice: list + unreadCount + markRead + markAllRead \| preferencesSlice: per-user preferences                                    |
| **MSW Handlers**     | GET /api/notifications \| PUT /api/notifications/:id/read \| PUT /api/notifications/read-all \| GET/PUT /api/notifications/preferences       |
| **Components**       | NotificationBell (header icon + red badge count), NotificationDropdown (last 5), NotificationPage (full history), PreferencesForm            |
| **Routes**           | /notifications → full history \| /notifications/preferences                                                                                  |
| **Design Notes**     | Bell icon in shared Header. Dropdown on click shows last 5 with read/unread state. Full list at /notifications with filter by type and date. |
| **Business Rules**   | 'Run Daily Job' dev button in RoleBadge toolbar simulates scheduler - dispatches overdue alerts. 30-day and 7-day retention warnings fired.  |

## **Phase 4 - M9: Reports & Statistics (التقارير والإحصائيات)**

| **SRS Entities**     | ReportDefinition                                                                                                                  |
| -------------------- | --------------------------------------------------------------------------------------------------------------------------------- |
| **SRS Requirements** | F9.1 - F9.10: 8 report types, filters, charts, schedule, PDF/Excel export                                                         |
| **Key Use Cases**    | UC-09-01: Generate Monthly Lending Activity Report                                                                                |
| **Types**            | ReportDefinition, ReportFilters \| Enum: ReportType                                                                               |
| **Zod Schemas**      | reportFiltersSchema, saveReportSchema, scheduleSchema                                                                             |
| **Dummy Data**       | Pre-aggregated data objects for all 8 report types derived from M3, M6, M7 dummy data                                             |
| **Redux Slice**      | reportsSlice: definitions + active report + filter state + export loading                                                         |
| **MSW Handlers**     | GET /api/reports/lending \| /reports/inventory \| /reports/destruction \| /reports/capacity \| POST /api/reports/export           |
| **Components**       | ReportSelector, ReportFiltersPanel, LendingChart (Recharts bar+line), InventoryTable, CapacityHeatmap, ExportButton               |
| **Routes**           | /reports → type selector \| /reports/lending \| /reports/inventory \| /reports/destruction \| /reports/capacity                   |
| **Design Notes**     | Charts: Recharts bar chart for status breakdown, line chart for trends. TailAdmin card wrappers around each chart section.        |
| **Business Rules**   | Export simulated: generates dummy CSV blob download. Large tables paginated (50 rows/page). Max export 50,000 rows shown as note. |

## **Phase 4 - M11: Technical Integration (التكامل التقني)**

| **SRS Entities**     | APIKey                                                                                                                          |
| -------------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| **SRS Requirements** | F11.1 - F11.7: REST API docs, API key management, webhooks, SMTP config, LDAP                                                   |
| **Key Use Cases**    | UC-11-01: Receive Document from Admin Communications System                                                                     |
| **Types**            | APIKey, WebhookConfig, IntegrationStatus                                                                                        |
| **Zod Schemas**      | createAPIKeySchema, webhookConfigSchema, smtpConfigSchema                                                                       |
| **Dummy Data**       | 3 API keys (2 active, 1 expired), 2 webhook configs, integration status for 4 external systems                                  |
| **Redux Slice**      | integrationSlice: apiKeys CRUD + webhooks CRUD + integrationStatus                                                              |
| **MSW Handlers**     | CRUD /api/integration/keys \| GET/POST /api/integration/webhooks \| GET /api/integration/status                                 |
| **Components**       | APIKeyTable, CreateAPIKeyModal (key shown once), WebhookList, IntegrationStatusCard, SMTPConfigForm                             |
| **Routes**           | /integration → status overview \| /integration/keys \| /integration/webhooks                                                    |
| **Design Notes**     | IntegrationStatusCard: TailAdmin stat card with green (connected) / red (disconnected) indicator per external system            |
| **Business Rules**   | API key value shown once on creation with copy-to-clipboard prompt. Thereafter only hash shown. Webhook delivery log simulated. |

## **Phase 4 - M12: KPI Dashboards (مؤشرات الأداء الرئيسية)**

| **SRS Entities**     | KPIDefinition, KPISnapshot                                                                                                     |
| -------------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| **SRS Requirements** | F12.1 - F12.7: Operational, lending, storage, destruction, governance KPIs with trend history                                  |
| **Key Use Cases**    | UC-12-01: View Center Director Dashboard                                                                                       |
| **Types**            | KPIDefinition, KPISnapshot \| Enum: KPITrend (UP / DOWN / STABLE)                                                              |
| **Zod Schemas**      | kpiTargetSchema                                                                                                                |
| **Dummy Data**       | 20 KPI definitions, 12 monthly snapshots each (1 full year of trend history)                                                   |
| **Redux Slice**      | kpiSlice: definitions + snapshots + computed current values + trend calculation                                                |
| **MSW Handlers**     | GET /api/kpi/definitions \| GET /api/kpi/snapshots?kpiId=&period= \| GET /api/kpi/current                                      |
| **Components**       | KPICard (value + trend arrow + traffic-light color), KPITrendChart (Recharts line), KPIDashboard (role-filtered grid of cards) |
| **Routes**           | /kpi → auto-renders role-appropriate dashboard (reads active role from Redux)                                                  |
| **Design Notes**     | KPICard: TailAdmin stat card with trend arrow icon (↑↓→), value vs target %, traffic-light background (green/amber/red)        |
| **Business Rules**   | Dashboard auto-detects active role → renders only that role's mapped KPIs. Drill-down click on KPI shows 12-month trend chart. |

## **Phase 4 - M15: Structure-KPI Linking (ربط الهيكل بمؤشرات الأداء)**

| **SRS Entities**     | RoleKPIMapping                                                                                                                                                                                |
| -------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **SRS Requirements** | F15.1 - F15.5: Per-role KPI assignment, display order, primary KPI flag, user customization                                                                                                   |
| **Key Use Cases**    | UC-15-01: Configure KPI Dashboard for Archive Supervisor                                                                                                                                      |
| **Types**            | RoleKPIMapping                                                                                                                                                                                |
| **Zod Schemas**      | roleKPIMappingSchema                                                                                                                                                                          |
| **Dummy Data**       | Pre-defined mappings for all 5 roles per SRS F15.1-F15.4 requirements                                                                                                                         |
| **Redux Slice**      | kpiMappingSlice: mappings per role + display order + primary KPI flag                                                                                                                         |
| **MSW Handlers**     | GET /api/kpi-mapping/:roleId \| PUT /api/kpi-mapping/:roleId                                                                                                                                  |
| **Components**       | KPIMappingEditor (role selector + KPI toggle list + @dnd-kit drag-reorder), RoleDashboardPreview                                                                                              |
| **Routes**           | /kpi-linking → role selector (Admin only) \| /kpi-linking/:roleId → mapping editor                                                                                                            |
| **Design Notes**     | @dnd-kit/sortable for drag-to-reorder KPI list. Live preview panel shows how the dashboard will look for the selected role.                                                                   |
| **Business Rules**   | Director KPIs: Governance Score, Compliance Rate, Active Records, Destruction Backlog (per F15.1). Supervisor: Daily Intake, Overdue Loans, Storage Occupancy, Pending Approvals (per F15.2). |

# **6\. Non-Functional Requirements - UI Simulation**

Key NFRs from SRS §9 that apply to the frontend prototype and how each is addressed without a backend.

| **NFR ID**   | **Requirement (SRS §9)**                   | **UI Simulation Approach**                                      |
| ------------ | ------------------------------------------ | --------------------------------------------------------------- |
| **NFR-P-01** | Page load < 3 seconds                      | Skeleton loaders on all list/table pages                        |
| **NFR-P-02** | Search results < 1 second for 500k records | Debounced filter on in-memory dummy data array                  |
| **NFR-P-06** | KPI dashboard load < 2 seconds             | Static pre-computed values from Redux dummy state               |
| **NFR-U-01** | Full RTL (Arabic primary, LTR toggle)      | next-intl + Tailwind RTL; all forms and tables mirrored         |
| **NFR-U-03** | Hijri + Gregorian date display             | date-fns-jalali library for dual calendar display               |
| **NFR-U-04** | Officer onboards in 20 min, no training    | In-app onboarding tooltip overlay on first login                |
| **NFR-S-08** | Audit log is append-only (immutable)       | Redux append-only log slice - no delete/edit action exists      |
| **NFR-C-01** | Auditable lifecycle trail for every record | LocationHistory entries created on every status/location change |

# **7\. MSW Handler Pattern**

All 15 module handler files follow the same pattern. Switching to a real backend = delete the handler file and update the base URL. Zero Redux refactoring required.

**// src/mocks/handlers/m1-archive-structure.ts**

**import { http, HttpResponse } from 'msw'**

**import { dummyRooms, dummyBoxes } from '@/features/m1-archive-structure/data'**

**export const archiveStructureHandlers = \[**

**http.get('/api/rooms', () => HttpResponse.json(dummyRooms)),**

**http.post('/api/rooms', async ({ request }) => {**

**const body = await request.json()**

**const newRoom = { ...body, room_id: crypto.randomUUID(), is_active: true }**

**return HttpResponse.json(newRoom, { status: 201 })**

**}),**

**http.put('/api/rooms/:id', async ({ params, request }) => {**

**const body = await request.json()**

**return HttpResponse.json({ ...body, room_id: params.id })**

**}),**

**http.delete('/api/rooms/:id', () => new HttpResponse(null, { status: 204 })),**

**\]**

**// src/mocks/handlers/index.ts - combines all module handlers**

**export const handlers = \[**

**...archiveStructureHandlers, // M1**

**...dataModelsHandlers, // M2**

**...recordsHandlers, // M3**

**// ... through M15**

**\]**

# **8\. Execution Summary**

| **Phase**                    | **Modules**       | **Deliverables**                                                                                                                                                                    | **Exit Criteria**                                                                                                                                   |
| ---------------------------- | ----------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| Phase 0 Global Setup ✅      | -                 | Redux store (all 15 slices), MSW setup, mock login page (5 role cards), shared layout, Sidebar, Header, RoleBadge, navigation config                                                | Role switching works. All 15 route pages load without errors. Sidebar filters by role correctly.                                                    |
| Phase 1 Foundation ✅        | M10, M13, M1, M2  | Users, roles, permission matrix, org tree, archive hierarchy tree, occupancy dashboard, document types, category trees, metadata fields, retention policies                         | Admin can create a user, assign a role, create a department, register a room, and define a document type with retention policy.                     |
| Phase 2 Core Operations ✅   | M3, M4, M5, M14   | Record registration (dynamic form), record detail + history timeline, advanced search, barcode scan, batch label printing, barcode viewer, workflow definitions + execution tracker | Officer can register a record, assign it to a box, print its barcode, find it via advanced search, and view its location history.                   |
| Phase 3 Lifecycle ✅         | M6, M7, M8        | Full lending flow (submit → approve → dispatch → return), destruction watchlist + 3-level approval chain + certificate, notification bell + history                                 | Supervisor can approve a lending request. Director can approve a destruction batch. Overdue alerts appear. Notification bell shows unread count.    |
| Phase 4 Insight & Governance ✅ | M9, M11, M12, M15 | 8 report types with Recharts charts, integration status + API key management, role-specific KPI dashboards with trend charts, KPI mapping editor with drag-reorder                  | Director sees governance KPI dashboard. Supervisor sees operational KPIs. Reports render with charts. KPI mapping editor saves role configurations. |

## **9\. Post-Phase Enhancement Log**

- **2026-04-29 — M3 depth pass:** Added `/records/new` and `/records/:id` flows (create form + detail view with history).
- **2026-04-29 — M6 depth pass:** Added `/lending/new` and `/lending/:id` flows (request form + detail view with status transitions: approve/deliver/return).
- **2026-04-29 — M7 depth pass:** Added `/destruction/new` and `/destruction/:id` flows (new request form + detail view + approval chain actions).
- **2026-04-29 — M8 depth pass:** Added interactive notification actions (single read + mark all read) and editable notification preferences toggles.
- **2026-04-29 — M4 depth pass:** Added advanced search controls (query + secrecy filter), apply/reset flow, save query action, and saved-query apply buttons.
- **2026-04-29 — M5 depth pass:** Added real barcode rendering with `bwip-js` preview and interactive print queue status transitions.
- **2026-04-29 — M10 depth pass:** Added interactive role reassignment per user and editable permission matrix toggles per role.
- **2026-04-29 — M1 depth pass:** Added quick create actions for rooms and shelves, plus a transfer-box action in archive structure controls.
- **2026-04-29 — M2 depth pass:** Added create flows for document types, categories, and metadata fields with interactive form controls in data models page.
- **2026-04-29 — M11 depth pass:** Added create/toggle flows for API keys and webhooks plus integration status selector.
- **2026-04-29 — M12 depth pass:** Added role-based KPI filtering that reads mapping definitions from M15 and renders KPI cards by selected role.
- **2026-04-29 — M15 depth pass:** Added editable role-to-KPI mapping UI with checkbox toggles and live mapping state updates.
- **2026-04-29 — M14 depth pass:** Added workflow creation UI, publish action (single published version behavior), and execution step advancement controls.
- **2026-04-29 — M6/M7 rule hardening pass:** Enforced valid lending status transitions + overdue refresh + due-date validation, and enforced 3-level destruction approval chain before final destroy action.
- **2026-04-29 — M3/M4 clearance hardening pass:** Added clearance-based visibility filtering so records/search results respect active user clearance level.
- **2026-04-29 — M9 depth pass:** Added report category/period filters, active report switching, and report preview panel behavior.
- **2026-04-29 — M13 depth pass:** Added branch/department creation controls and responsible-email assignment flow for departments.
- **2026-04-29 — Testing foundation pass:** Added Vitest setup + test scripts and reducer tests for M3/M6/M7 business rules; test suite currently passing.
- **2026-04-29 — English-only pass:** Converted hardcoded Arabic UI/content strings to English across app modules/configs (translation message files intentionally unchanged).
- **2026-04-29 — M6/M7 cross-module validation pass:** Added record-existence/eligibility checks against M3 records and duplicate open-request blocking for lending and destruction forms.
- **2026-04-29 — M6 overdue subroute pass:** Added `/lending/overdue` route with overdue-only listing and wired an entry link from the main lending screen.
- **2026-04-29 — M7 watchlist subroute pass:** Added `/destruction/watchlist` route with watchlist-only listing and wired an entry link from the main destruction screen.
- **2026-04-29 — M8 unread subroute pass:** Added `/notifications/unread` route with unread-only listing and wired an entry link from the main notifications screen.
- **2026-04-29 — M11 API-keys subroute pass:** Added `/integration/api-keys` route for focused API-key management and wired an entry link from the integration screen.
- **2026-04-29 — M9 report-detail subroute pass:** Added `/reports/:id` route for focused report views and wired per-report entry links from the reports grid.
- **2026-04-29 — M12 role-detail subroute pass:** Added `/kpi/role/:role` route for focused role KPI views and wired entry links from the KPI dashboard.
- **2026-04-29 — M10 role-detail subroute pass:** Added `/permissions/role/:role` route for focused role members/permissions view and wired entry links from the roles list.
- **2026-04-29 — M13 branch-detail subroute pass:** Added `/org-structure/branch/:id` route for focused branch department views and wired branch entry links from the org structure page.
- **2026-04-29 — M1 room-detail subroute pass:** Added `/archive-structure/room/:id` route for focused room structure summaries and wired quick room entry links from the archive structure page.
- **2026-04-29 — M2 type-detail subroute pass:** Added `/data-models/type/:id` route for focused document type details and wired entry links from the data models page.
- **2026-04-29 — M4 saved-query subroute pass:** Added `/search/saved/:id` route for focused saved-query results and wired entry links from the search saved-queries list.
- **2026-04-29 — M5 print-job subroute pass:** Added `/barcodes/print-job/:id` route for focused print queue item management and wired entry links from the barcodes page.
- **2026-04-29 — M14 workflow-detail subroute pass:** Added `/workflow/:id` route for focused workflow definition/execution views and wired entry links from the workflow definitions list.
- **2026-04-29 — M15 role-linking subroute pass:** Added `/kpi-linking/role/:role` route for focused role-to-KPI mapping details and wired entry links from the KPI linking screen.
- **2026-04-29 — Route sanity + UI language cleanup pass:** Verified all newly added private routes are present/reachable and normalized remaining mixed-language UI strings in active feature components to English (seed data left unchanged).

---

## Related Notes

- [[Session-M1-M2-M3-M14-Data-Layer-Fixes]] — full log of SRS-alignment work for M1/M2/M3/M14 data layers (2026-04-30)
- [[Gap-Analysis]] — architectural gaps vs SRS; includes per-module data-layer completion status

DACMS Frontend Execution Plan | Ministry of Industry & Trade | Confidential | April 2026