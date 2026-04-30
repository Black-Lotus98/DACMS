# Session: M1, M2, M3 & M14 Data-Layer Fixes

**Date:** 2026-04-30
**Type:** Session Summary
**Files changed:**
- `src/features/m1-archive-structure/types/index.ts` — bilingual fields, structural props
- `src/features/m1-archive-structure/schemas/index.ts` — row/cabinet/box schemas updated
- `src/features/m1-archive-structure/store/slice.ts` — CRUD + toggle-active actions added
- `src/features/m1-archive-structure/hooks/index.ts` — occupancy thresholds, new selectors
- `src/features/m1-archive-structure/data/index.ts` — seeds rewritten bilingually
- `src/features/m1-archive-structure/components/ArchiveStructurePage.tsx` — full rewrite
- `src/features/m1-archive-structure/components/ArchiveRoomDetailPage.tsx` — full rewrite
- `src/features/m1-archive-structure/components/OccupancyDashboard.tsx` — rewrite
- `src/features/m14-workflow/types/index.ts` — full SRS-aligned type system
- `src/features/m14-workflow/data/index.ts` — 4 pre-built SRS workflows seeded
- `src/features/m14-workflow/store/slice.ts` — archiveWorkflow, createNewVersion, cancelExecution
- `src/features/m14-workflow/components/WorkflowDesignerPage.tsx` — new step builder UI
- `src/app/[local]/(private)/workflow/new/page.tsx` — new route
- `src/features/m2-data-models/types/index.ts` — bilingual, FK inversion, OptionSet added
- `src/features/m2-data-models/schemas/index.ts` — full rewrite
- `src/features/m2-data-models/data/index.ts` — bilingual seeds, option sets, legalRef
- `src/features/m2-data-models/store/slice.ts` — update/toggle actions added
- `src/features/m2-data-models/hooks/index.ts` — getPolicyByDocTypeId, getOptionSetById, etc.
- `src/features/m2-data-models/components/DataModelsPage.tsx` — full rewrite
- `src/features/m2-data-models/components/DataModelTypeDetailPage.tsx` — full rewrite
- `src/features/m3-records/types/index.ts` — bilingual, FK IDs, RecordFile entity
- `src/features/m3-records/schemas/index.ts` — full rewrite
- `src/features/m3-records/data/index.ts` — bilingual seeds + RecordFile seeds
- `src/features/m3-records/store/slice.ts` — updateRecord, updateRecordStatus, addRecordFile
- `src/features/m3-records/hooks/index.ts` — corrected secrecy rank, new selectors
- `src/features/m3-records/components/RecordsPage.tsx` — full rewrite
- `src/features/m3-records/components/RecordFormPage.tsx` — full rewrite
- `src/features/m3-records/components/RecordDetailPage.tsx` — full rewrite
- `src/features/m3-records/store/slice.test.ts` — updated to match new shape
- `src/features/m6-lending/components/LendingFormPage.tsx` — removed RecordStatus.Draft guard
- `src/features/m7-destruction/components/DestructionFormPage.tsx` — removed RecordStatus.Draft guard

---

## Problem / Goal

The SRS defines a fully bilingual (Arabic/English) data model with specific entity shapes, FK relationships, and enum values. The original codebase had been scaffolded with simplified, English-only placeholders that diverged from the SRS in field names, enum values, FK direction, and missing entities. This session aligned modules M1, M2, M3, and M14 with the SRS.

---

## What Changed

### M1 — Archive Structure

The original `ArchiveRoom` had a single `name: string`. The SRS requires bilingual `nameAr`/`nameEn` on every entity, plus structural properties:

- `ArchiveRoom`: added `nameAr`, `nameEn`, `currentUse`, `deptIds`, `notes?`; removed `name`
- `ArchiveRow`: added `position`, `capacity`, `isActive`
- `ArchiveCabinet`: added `shelfCount`, `isActive`
- `ArchiveShelf` / `ArchiveBox`: added `isActive`; `ArchiveBox` gained `label` and `recordIds`

Occupancy logic (F1.10) uses two thresholds: `OCCUPANCY_WARNING = 70`, `OCCUPANCY_CRITICAL = 90`. The hook computes `getOccupancyStatus()` which returns `'ok' | 'warning' | 'critical'` — components consume this instead of inlining the ternary.

Toggle-active actions (`toggleRoomActive`, `toggleRowActive`, …) added for F1.8 activate/deactivate flows.

### M14 — Workflow Engine

The SRS defines four pre-built workflow types: ARCHIVING, LENDING, DESTRUCTION, MIGRATION. Each has a `StepType` enum (TRIGGER / HUMAN / SYSTEM / DECISION / WATCHER). The previous codebase had none of this.

Key decision: `publishWorkflow` archives **only same-type** previously published workflows (not all workflows globally). The SRS says "one PUBLISHED version per type at a time," not globally.

A new `WorkflowDesignerPage` and `/workflow/new` route were created to support F14.1 (visual step builder).

### M2 — Data Models

**FK inversion (the most important decision in this session):**

The original code had `retentionPolicyId` on `DocumentType`. The SRS has it the other way — `RetentionPolicy` holds `docTypeId`. This is a 1:1 relationship where the policy owns the FK. The `getPolicyByDocTypeId(docTypeId)` hook replaces the old `getPolicyById(docType.retentionPolicyId)` lookup everywhere.

Other changes:
- `DocumentType`: `name` → `nameAr` / `nameEn`; removed `retentionPolicyId`; added `description?`, `isActive`
- `DocumentCategory`: `name` → `nameAr` / `nameEn`; added `code`
- `MetadataField`: `label` → `labelAr` / `labelEn`; `required` → `isRequired`; `options` array removed (replaced by `optionSetId?`)
- `RetentionPolicy`: added `docTypeId`, `legalRef?`
- New entity: `OptionSet` (`id`, `nameAr`, `nameEn`, `options: string[]`) — replaces inline option arrays on fields

`FieldType` enum values: TEXT / DATE / NUMBER / DROPDOWN / MULTI_SELECT / CHECKBOX
`ActionAfter` enum values: DESTROY / MIGRATE / REVIEW

### M3 — Records

**Enum values corrected:**

| Old | New |
|-----|-----|
| `RecordStatus.Draft` | removed (no draft state in SRS) |
| `RecordStatus.Moved` | removed |
| `SecrecyLevel.Restricted` | `SecrecyLevel.Internal` |
| `SecrecyLevel.Confidential` | `SecrecyLevel.Secret` |

**Secrecy rank remapping (gotcha):**

The `ClearanceLevel` enum in `src/config/roles.ts` still uses `Restricted` and `Confidential`. The M3 hook maps between the two systems:

```typescript
// ClearanceLevel (roles.ts) → rank
Restricted  = 1
Confidential = 2

// SecrecyLevel (m3 types) → rank
Internal  = 1   ← maps to same rank as ClearanceLevel.Restricted
Secret    = 2   ← maps to same rank as ClearanceLevel.Confidential
```

A user with `ClearanceLevel.Restricted` can see records up to `SecrecyLevel.Internal`. This mapping must be kept in sync if either enum changes.

**Entity shape:**

`RecordItem` expanded from 7 fields to 14:
- `title` → `titleAr` / `titleEn`
- `docType: string` → `docTypeId: string` (FK to DocumentType)
- `boxCode: string` → `boxId: string` + `shelfId: string` (FK to ArchiveBox / ArchiveShelf)
- Added: `categoryId`, `issueDate`, `archiveDate`, `retentionEnd`, `metadata: Record<string,string>`, `createdBy`

`LocationHistory` gained `movedBy: string` and `reason: string`.

New entity: `RecordFile` (`id`, `recordId`, `fileName`, `fileType`, `fileUrl`, `uploadedAt`, `uploadedBy`) — represents digital attachments per SRS F3.x.

`RecordsState` now includes `files: RecordFile[]`.

New hook selectors: `getFilesForRecord`, `getRecordsByBox`, `getRecordsByDocType`.

---

## Decisions & Trade-offs

| Decision | Chosen | Rejected | Why |
|----------|--------|----------|-----|
| FK direction on RetentionPolicy | `RetentionPolicy.docTypeId` (SRS FK) | `DocumentType.retentionPolicyId` | SRS explicitly puts the FK on RetentionPolicy; also allows policies to be assigned/removed without touching DocumentType |
| Option sets | Separate `OptionSet` entity with `optionSetId?` on MetadataField | Inline `options: string[]` on field | Allows reuse across field types; aligns with SRS F2.5 |
| publishWorkflow scope | Archive same-type only | Archive all published workflows | SRS: "one PUBLISHED version per type at a time" — global archiving would break unrelated workflow types |
| Occupancy logic location | `getOccupancyStatus()` in hook | Inline ternary in components | Single source of truth; easier to change thresholds; prevents drift between Dashboard and RoomDetail |

---

## Gotchas & Things to Know

**1. SecrecyLevel vs ClearanceLevel naming drift**
`SecrecyLevel` (M3) and `ClearanceLevel` (`src/config/roles.ts`) use different words for the same ranks. They are aligned by numeric rank in the hook, not by string matching. If you rename one enum, you must update the rank table in `m3-records/hooks/index.ts`.

**2. RecordStatus.Draft is gone**
M6 (Lending) and M7 (Destruction) had guards checking `record.status === RecordStatus.Draft`. Since Draft no longer exists, these were replaced with semantically equivalent checks (`Destroyed`/`Migrated` for lending; `Destroyed` for destruction).

**3. RetentionPolicy FK is on the policy, not the type**
Any component that needs a type's retention policy must call `getPolicyByDocTypeId(docType.id)` — not access `docType.retentionPolicyId` (that field doesn't exist).

**4. OptionSet is the source of dropdown options**
`MetadataField.options` no longer exists. To get options for a dropdown field, look up `field.optionSetId` then call `getOptionSetById(id)`.

**5. Occupancy thresholds are constants in the hook**
`OCCUPANCY_WARNING = 70`, `OCCUPANCY_CRITICAL = 90`. They are not in a config file — change them in `m1-archive-structure/hooks/index.ts`.

---

## Loose Ends

- [ ] Gap 2 (archive sub-level routes) is still open — only the data layer was fixed, not the page routes for row/cabinet/shelf/box
- [ ] Gap 5 (bulk record import) still needs a `/records/import` route and CSV validation UI
- [ ] Gap 6 (i18n message files) — all module namespaces are still missing
- [ ] M3 `RecordFormPage` uses hardcoded `'current-user'` as `createdBy` — should wire to auth store once M10 is implemented
- [ ] `getOptionSetById` in M2 hook should be used in `RecordFormPage` to populate DROPDOWN field options dynamically

---

## Related Notes

- [[Gap-Analysis]] — architectural gaps vs SRS; data-layer gaps for M1/M2/M3 are now resolved
- [[Execution-Plan]] — phased build plan; M1, M2, M3, M14 data layers are complete
