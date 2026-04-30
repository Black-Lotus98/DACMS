**DACMS**

Document & Archive Centre Management System

**Gap Analysis — Architecture vs SRS**

| **Document**  | Gap Analysis v1.0                             |
| ------------- | --------------------------------------------- |
| **Reference** | SRS v1.0.0 + src-folder-architecture.md       |
| **Date**      | April 2026                                    |
| **Status**    | Partially resolved — see data-layer status below |

---

# Overview

This note records the gaps identified between the current `src` folder architecture and the SRS requirements. All 15 modules are represented in the architecture (`m1`–`m15`), but several **routes, pages, and structural elements** defined in the SRS have no corresponding implementation path in the current file tree.

---

# Gap 1 — Beneficiary Portal Routes

**SRS Reference:** Section 2.2 (User Classes), Section 3.2 (Platform Components), UC-06-01, Section 8.5 (User Journey)

**What the SRS defines:**
A dedicated public-facing beneficiary portal where Beneficiary Users (المستفيد) can:
- Submit document lending requests
- Track request status
- Receive notifications on request progress

**Current architecture:**
Only `(public)/home/` exists. No request submission, tracking, or beneficiary-scoped pages are defined.

**Missing routes:**
```
app/[local]/(public)/
  request/
    new/           ← submit lending request
    [id]/          ← track individual request status
  requests/        ← beneficiary request list
```

**Priority:** High — affects a full user class with a distinct journey.

---

# Gap 2 — Archive Structure Sub-Level Routes

**SRS Reference:** Module 1, F1.3–F1.6, Data Entities: ArchiveRow, ArchiveCabinet, ArchiveShelf, ArchiveBox

**What the SRS defines:**
Full CRUD management for each level of the physical hierarchy:
> Room → Row → Cabinet → Shelf → Box

**Current architecture:**
Only `archive-structure/room/[id]` exists. Rows, cabinets, shelves, and boxes have no dedicated management pages.

**Missing routes (option A — nested):**
```
archive-structure/
  room/[id]/
    row/[id]/
      cabinet/[id]/
        shelf/[id]/
          box/[id]/
```

**Missing routes (option B — flat):**
```
archive-structure/
  box/[id]/
  shelf/[id]/
  cabinet/[id]/
  row/[id]/
```

Option A mirrors the physical hierarchy; Option B is simpler to implement. Choose based on UX preference.

**Priority:** High — archive structure is a foundational module that all other modules depend on.

---

# Gap 3 — Audit Log Page

**SRS Reference:** Section 3.4 Security Model ("Audit: All create/update/delete operations write an immutable audit log"), F3.7, F4.4, Section 2.4 ("Audit logs are immutable; no UI action may modify or delete a log entry"), Entity: AccessLog (M10), Entity: LocationHistory (M3)

**What the SRS defines:**
An immutable, read-only audit trail viewable by Archive Supervisor and above, covering:
- Record location changes (LocationHistory)
- User access and action events (AccessLog)
- All CUD operations across the system

**Current architecture:**
No audit log route exists anywhere in the app tree.

**Missing route:**
```
app/[local]/(private)/
  audit-log/         ← full system audit trail
    records/         ← optional: record movement history
    access/          ← optional: user access log
```

**Priority:** High — required by SRS section 2.4 as a hard constraint.

---

# Gap 4 — User Profile / Account Settings

**SRS Reference:** F10.8 (password policy enforcement, complexity, expiry, lockout), Section 8.x (all user journeys assume a profile)

**What the SRS defines:**
Users need to change their password, view their own activity, and manage personal settings. The SRS enforces complexity and expiry rules that require a user-facing password change flow.

**Current architecture:**
No profile or settings route exists.

**Missing route:**
```
app/[local]/(private)/
  profile/           ← view and edit user profile
  settings/          ← personal settings, password change
```

**Priority:** Medium — required for password policy compliance and basic usability.

---

# Gap 5 — Bulk Import Route

**SRS Reference:** F3.4 — "Support bulk import of records via structured template (CSV/Excel). Bulk import validates each row; errors reported per line."

**What the SRS defines:**
A dedicated import flow where officers can upload a CSV/Excel file of records, validate each row, and review per-line errors before committing.

**Current architecture:**
`records/new` exists for single record entry but no import page is defined.

**Missing route:**
```
app/[local]/(private)/
  records/
    import/          ← bulk CSV/Excel import with validation
```

**Priority:** Medium — listed as MED priority in SRS, but involves significant UI complexity.

---

# Gap 6 — i18n Message Files (Structural)

**SRS Reference:** Section 2.4 — "All user-facing text must support bilingual (Arabic/English) display; Arabic is the primary language."

**What the SRS defines:**
Full AR/EN bilingual support across all 15 modules and all user-facing text.

**Current architecture:**
The `messages/` folder only contains:
```
messages/
  common/
  home/
```

**Missing namespaces** (one per module at minimum):
```
messages/
  m1-archive-structure/
  m2-data-models/
  m3-records/
  m4-search/
  m5-barcodes/
  m6-lending/
  m7-destruction/
  m8-notifications/
  m9-reports/
  m10-permissions/
  m11-integration/
  m12-kpi/
  m13-org-structure/
  m14-workflow/
  m15-kpi-linking/
  auth/
  profile/
```

**Priority:** Medium — message files are needed before any module UI is shipped.

---

# SRS Internal Inconsistency (Not an Architecture Gap)

**SRS Reference:** Section 3.3 — Module Layering table

The Module Layering table (Section 3.3) uses module numbers that do not match the actual module definitions in Section 4. Examples:

| Layering Table Says | Actual Module |
| ------------------- | ------------- |
| M2 Org Units        | M2 = Data Models & Metadata |
| M4 Classification   | M4 = Search & Retrieval |
| M5 Document Receiving | M5 = Barcode & Coding |
| M9 Barcodes         | M9 = Reports & Statistics |
| M11 Reporting       | M11 = Technical Integration |
| M13 Notifications   | M13 = Organizational Structure |

**Action:** Flag to SRS author for correction in the next revision (v1.0.1). No architecture change needed.

---

# Data-Layer Completion Status

Tracks whether the types / schemas / slice / hooks / components layer for each module is SRS-aligned.
Route gaps (pages, app router routes) are tracked separately in the gap table below.

| Module | Data Layer | Route Layer | Notes |
| ------ | ---------- | ----------- | ----- |
| M1 Archive Structure | ✅ Complete | ⚠️ Partial | Sub-level routes (row/cabinet/shelf/box) still missing — see Gap 2 |
| M2 Data Models | ✅ Complete | ✅ Complete | FK inversion on RetentionPolicy resolved |
| M3 Records | ✅ Complete | ⚠️ Partial | Bulk import route missing — see Gap 5 |
| M14 Workflow | ✅ Complete | ✅ Complete | `/workflow/new` route added |
| M4–M13, M15 | 🔲 Not started | 🔲 Not started | |

See [[Session-M1-M2-M3-M14-Data-Layer-Fixes]] for full details on what was changed.

---

# Summary Table

| # | Gap | Affects | Priority | Status |
| - | --- | ------- | -------- | ------ |
| 1 | Beneficiary portal routes | Public portal, M6 Lending | High | Open |
| 2 | Archive structure sub-level routes (row/cabinet/shelf/box) | M1, M3, M5 | High | Open — data layer done, routes missing |
| 3 | Audit log page | M3, M10, Security | High | Open |
| 4 | User profile & account settings | M10, Auth | Medium | Open |
| 5 | Bulk record import page | M3 | Medium | Open — data layer done, import route missing |
| 6 | i18n message file structure (13 modules missing) | All modules | Medium | Open |
