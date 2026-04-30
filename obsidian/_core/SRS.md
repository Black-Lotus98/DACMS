**DACMS**

**Document & Archive Centre Management System**

System Requirements Specification

**Client:** Ministry of Industry & Trade (وزارة الصناعة والتجارة)

**Document:** SRS - Functional & Non-Functional Requirements

**Version:** 1.0.0

**Status:** Draft for Review

**Date:** April 2026

**Author:** Systems Analysis Team

# Document Control

## Version History

| **Version** | **Date**   | **Author**            | **Description**                                                                   |
| ----------- | ---------- | --------------------- | --------------------------------------------------------------------------------- |
| 1.0.0       | April 2026 | Systems Analysis Team | Initial draft - full SRS including all 15 modules, ERD, Use Cases, User Journeys. |
| 1.0.1       | -          | -                     | Pending client review and sign-off.                                               |

## Document Approvals

| **Name** | **Title**                     | **Role**              | **Signature** | **Date** |
| -------- | ----------------------------- | --------------------- | ------------- | -------- |
|          | Director, Information Systems | Owner                 |               |          |
|          | IT Project Manager            | Reviewer              |               |          |
|          | Head of Archive Centre        | Subject-Matter Expert |               |          |

## Distribution List

| **Recipient**       | **Department**            | **Purpose**             |
| ------------------- | ------------------------- | ----------------------- |
| Project Manager     | IT / PMO                  | Primary review          |
| Archive Centre Head | Document & Archive Centre | SME validation          |
| Developer Lead      | Software Engineering      | Implementation planning |
| QA Lead             | Quality Assurance         | Test planning           |

Table of Contents

[Document Control 2](#_Toc228354638)

[Version History 2](#_Toc228354639)

[Document Approvals 2](#_Toc228354640)

[Distribution List 2](#_Toc228354641)

[1\. Introduction 4](#_Toc228354642)

[1.1 Purpose 4](#_Toc228354643)

[1.2 Scope 4](#_Toc228354644)

[1.3 Intended Audience 4](#_Toc228354645)

[1.4 Definitions, Acronyms & Abbreviations 4](#_Toc228354646)

[1.5 References 5](#_Toc228354647)

[2\. System Overview 6](#_Toc228354648)

[2.1 System Context 6](#_Toc228354649)

[2.2 User Classes and Characteristics 6](#_Toc228354650)

[2.3 Operating Environment 6](#_Toc228354651)

[2.4 Design and Implementation Constraints 6](#_Toc228354652)

[2.5 Assumptions and Dependencies 7](#_Toc228354653)

[3\. System Architecture 8](#_Toc228354654)

[3.1 Architecture Overview 8](#_Toc228354655)

[3.2 Platform Components 8](#_Toc228354656)

[3.3 Module Layering 8](#_Toc228354657)

[3.4 Security Model 8](#_Toc228354658)

[4\. Functional Modules 9](#_Toc228354659)

[Module 1: Archive Structure Management (إدارة هيكل الأرشيف) 10](#_Toc228354660)

[1.1 Module Overview 10](#_Toc228354661)

[1.2 Data Entities 10](#_Toc228354662)

[1.3 Functional Requirements 11](#_Toc228354663)

[1.4 Use Cases 12](#_Toc228354664)

[Module 2: Data Models & Metadata Management (إدارة النماذج والبيانات) 14](#_Toc228354665)

[2.1 Module Overview 14](#_Toc228354666)

[2.2 Data Entities 14](#_Toc228354667)

[2.3 Functional Requirements 15](#_Toc228354668)

[2.4 Use Cases 16](#_Toc228354669)

[Module 3: Records Registration & Archiving (إدارة السجلات والأرشفة) 17](#_Toc228354670)

[3.1 Module Overview 17](#_Toc228354671)

[3.2 Data Entities 17](#_Toc228354672)

[3.3 Functional Requirements 18](#_Toc228354673)

[3.4 Use Cases 19](#_Toc228354674)

[Module 4: Search & Retrieval (البحث والاسترجاع) 21](#_Toc228354675)

[4.1 Module Overview 21](#_Toc228354676)

[4.2 Data Entities 21](#_Toc228354677)

[4.3 Functional Requirements 21](#_Toc228354678)

[4.4 Use Cases 21](#_Toc228354679)

[5.1 Module Overview 23](#_Toc228354680)

[5.2 Data Entities 23](#_Toc228354681)

[5.3 Functional Requirements 24](#_Toc228354682)

[5.4 Use Cases 24](#_Toc228354683)

[Module 6: Lending & Requests Management (إدارة الإعارة والطلبات الورقية) 26](#_Toc228354684)

[6.1 Module Overview 26](#_Toc228354685)

[6.2 Data Entities 26](#_Toc228354686)

[6.3 Functional Requirements 27](#_Toc228354687)

[6.4 Use Cases 27](#_Toc228354688)

[Module 7: Destruction & Migration Management (إدارة الإتلاف والترحيل) 29](#_Toc228354689)

[7.1 Module Overview 29](#_Toc228354690)

[7.2 Data Entities 29](#_Toc228354691)

[7.3 Functional Requirements 30](#_Toc228354692)

[7.4 Use Cases 30](#_Toc228354693)

[Module 8: Notifications & Alerts (التنبيهات والإشعارات) 32](#_Toc228354694)

[8.1 Module Overview 32](#_Toc228354695)

[8.2 Data Entities 32](#_Toc228354696)

[8.3 Functional Requirements 32](#_Toc228354697)

[8.4 Use Cases 33](#_Toc228354698)

[Module 9: Reports & Statistics (التقارير والإحصائيات) 34](#_Toc228354699)

[9.1 Module Overview 34](#_Toc228354700)

[9.2 Data Entities 34](#_Toc228354701)

[9.3 Functional Requirements 34](#_Toc228354702)

[9.4 Use Cases 35](#_Toc228354703)

[Module 10: Permissions & Security (إدارة الصلاحيات والأمن) 36](#_Toc228354704)

[10.1 Module Overview 36](#_Toc228354705)

[10.2 Data Entities 36](#_Toc228354706)

[10.3 Functional Requirements 37](#_Toc228354707)

[10.4 Use Cases 38](#_Toc228354708)

[Module 11: Technical Integration (التكامل التقني) 39](#_Toc228354709)

[11.1 Module Overview 39](#_Toc228354710)

[11.2 Data Entities 39](#_Toc228354711)

[11.3 Functional Requirements 39](#_Toc228354712)

[11.4 Use Cases 40](#_Toc228354713)

[Module 12: Key Performance Indicators (KPIs) (ملخص مؤشرات الأداء الرئيسية) 41](#_Toc228354714)

[12.1 Module Overview 41](#_Toc228354715)

[12.2 Data Entities 41](#_Toc228354716)

[12.3 Functional Requirements 41](#_Toc228354717)

[12.4 Use Cases 42](#_Toc228354718)

[Module 13: Organizational Structure (الهيكل التنظيمي لمركز الوثائق والمحفوظات) 43](#_Toc228354719)

[13.1 Module Overview 43](#_Toc228354720)

[13.2 Data Entities 43](#_Toc228354721)

[13.3 Functional Requirements 44](#_Toc228354722)

[13.4 Use Cases 44](#_Toc228354723)

[Module 14: Workflow System (نظام سير العمل) 45](#_Toc228354724)

[14.1 Module Overview 45](#_Toc228354725)

[14.2 Data Entities 45](#_Toc228354726)

[14.3 Functional Requirements 46](#_Toc228354727)

[14.4 Use Cases 46](#_Toc228354728)

[Module 15: Structure-KPI Linking (ربط الهيكل بمؤشرات الأداء) 48](#_Toc228354729)

[15.1 Module Overview 48](#_Toc228354730)

[15.2 Data Entities 48](#_Toc228354731)

[15.3 Functional Requirements 48](#_Toc228354732)

[15.4 Use Cases 48](#_Toc228354733)

[6\. Entity-Relationship Diagram & Data Model 50](#_Toc228354734)

[6.1 Entity Catalog 50](#_Toc228354735)

[6.2 Entity Relationship Definitions 52](#_Toc228354736)

[6.3 ERD Narrative Description 53](#_Toc228354737)

[7\. Use Case Catalog - Summary 54](#_Toc228354738)

[8\. User Journey Maps 56](#_Toc228354739)

[8.1 Center Director (مدير مركز الوثائق) 56](#_Toc228354740)

[8.2 Archive Supervisor (مشرف الأرشيف) 57](#_Toc228354741)

[8.3 Archive Officer (موظف الأرشيف) 58](#_Toc228354742)

[8.4 System Administrator (مدير النظام) 59](#_Toc228354743)

[8.5 Beneficiary User (المستفيد) 61](#_Toc228354744)

[9\. Non-Functional Requirements 62](#_Toc228354745)

[9.1 Performance 62](#_Toc228354746)

[9.2 Security 62](#_Toc228354747)

[9.3 Availability & Reliability 62](#_Toc228354748)

[9.4 Scalability 63](#_Toc228354749)

[9.5 Usability 63](#_Toc228354750)

[9.6 Maintainability & Portability 63](#_Toc228354751)

[9.7 Compliance 63](#_Toc228354752)

[10\. Module Interconnectivity 65](#_Toc228354753)

[10.1 Dependency Map 65](#_Toc228354754)

[10.2 Critical Integration Points 66](#_Toc228354755)

[10.3 Module Initialisation Order 67](#_Toc228354756)

[11\. Glossary 68](#_Toc228354757)

# 1\. Introduction

## 1.1 Purpose

This System Requirements Specification (SRS) document describes the complete functional and non-functional requirements for the Document & Archive Centre Management System (DACMS) commissioned by the Ministry of Industry & Trade. The document serves as the contractual baseline between the ministry's stakeholders and the development team, providing a definitive reference for design, implementation, testing, and acceptance.

The DACMS addresses the ministry's need to digitise and standardise the management of its physical and electronic archive, replacing manual paper-based tracking with a fully integrated system that enforces retention policies, lending controls, destruction authorisation, workflow approvals, and role-based access.

## 1.2 Scope

The DACMS covers fifteen functional modules, including:

- Physical archive structure management (rooms, rows, cabinets, shelves, boxes).
- Organisational unit and department management.
- Record and file registration, classification, and tracking.
- Document receiving and ingest workflows.
- Document lending, retrieval, and return processes.
- Retention scheduling and automated lifecycle management.
- Controlled document destruction with approval chains.
- Barcode generation, printing, and scanning for physical items.
- Role-based access control and permissions.
- Reporting, statistics, and KPI dashboards.
- Configurable templates and form management.
- Automated notifications and alert management.
- Configurable workflow and multi-step approval engine.
- Structure-KPI linking for role-filtered performance dashboards.

The system is delivered as a web-based application accessible via desktop browsers, a dedicated admin control panel, and a beneficiary-facing end-user portal. Mobile responsiveness is required for key workflows.

## 1.3 Intended Audience

| **Audience**                            | **Use of Document**                                                |
| --------------------------------------- | ------------------------------------------------------------------ |
| Ministry IT & Project Management Office | Approve scope and requirements; track project progress.            |
| Archive Centre Management               | Validate functional requirements and user journey accuracy.        |
| Software Development Team               | Design, implement, and unit-test the system to this specification. |
| Quality Assurance Team                  | Derive acceptance test cases from functional requirements.         |
| System Administrator (Ministry)         | Understand system configuration and administration capabilities.   |

## 1.4 Definitions, Acronyms & Abbreviations

| **Term**          | **Definition**                                                                              |
| ----------------- | ------------------------------------------------------------------------------------------- |
| DACMS             | Document & Archive Centre Management System - the system described in this SRS.             |
| Archive Room      | Top-level physical space within the archive centre (غرفة أرشيف).                            |
| Archive Box       | Physical container (صندوق) holding archived records; linked to a barcode.                   |
| Record            | A registered archival item (وثيقة) with classification, retention, and location metadata.   |
| File              | A collection of related records grouped under a common subject or case.                     |
| Lending           | The formal process of issuing a physical record to an authorised user for a defined period. |
| Retention Period  | The mandatory holding period for a record type before destruction eligibility.              |
| Destruction Batch | A controlled set of records approved for permanent disposal.                                |
| Barcode           | A machine-readable code affixed to each physical box and record for spatial tracking.       |
| WF                | Workflow - a multi-step approval or processing sequence.                                    |
| SLA               | Service Level Agreement - a time-based performance target for a process step.               |
| KPI               | Key Performance Indicator - a measurable metric tracked on role-specific dashboards.        |
| UC                | Use Case - a discrete functional scenario describing an actor-system interaction.           |
| ERD               | Entity-Relationship Diagram - a data model showing entities and their associations.         |
| RTL               | Right-to-Left - text direction used for all Arabic content in the system.                   |
| FK                | Foreign Key - a relational database reference to another table's primary key.               |
| PK                | Primary Key - unique identifier for a database record.                                      |
| UUID              | Universally Unique Identifier - the primary key format used throughout DACMS.               |

## 1.5 References

| **Reference**                    | **Description**                                                                                                                  |
| -------------------------------- | -------------------------------------------------------------------------------------------------------------------------------- |
| MOT-ARCH-REQ-2025                | Ministry of Industry & Trade - Basic Requirements for the Document & Archive Centre (PDF, 4 pages, 70 requirements, 15 modules). |
| ISO 15489-1:2016                 | Records Management - Concepts and Principles.                                                                                    |
| ISO 16175-1:2020                 | Information and Documentation - Processes and Functional Requirements for Software for Managing Records.                         |
| OAIS Reference Model (ISO 14721) | Open Archival Information System - used to inform lifecycle and retention concepts.                                              |
| DWF BRD v2.0                     | Dynamic Workflow Framework Business Requirements Document - relevant for the Workflow & Approvals module integration.            |

# 2\. System Overview

## 2.1 System Context

The DACMS is deployed as a centralised, server-hosted web application for the Ministry of Industry & Trade's Document and Archive Centre. It replaces a manual paper-ledger-based process for all archiving activities. The system interfaces with:

- Ministry Human Resources system - to import organisational units and employees.
- Ministry Identity/SSO provider - for authenticated login.
- Physical barcode printer/scanner hardware - for physical item tracking.
- Email server (SMTP) - for automated notifications and alerts.

The DACMS does not currently integrate with a Document Management System (DMS) or an ERP; all records are managed natively within DACMS.

## 2.2 User Classes and Characteristics

| **User Class**       | **Arabic Title**  | **Description**                                                                              | **Technical Level**       |
| -------------------- | ----------------- | -------------------------------------------------------------------------------------------- | ------------------------- |
| Center Director      | مدير مركز الوثائق | Oversight and governance; approves destruction batches; views KPI dashboards.                | Low - dashboard consumer. |
| Archive Supervisor   | مشرف الأرشيف      | Manages daily operations; approves lending; assigns archive locations; configures retention. | Medium.                   |
| Archive Officer      | موظف الأرشيف      | Day-to-day data entry; registers records; prints barcodes; processes lending/returns.        | Medium.                   |
| System Administrator | مدير النظام       | Configures roles, departments, workflows, templates, notification rules. Full system access. | High.                     |
| Beneficiary User     | المستفيد          | External or internal user who requests document retrieval via the beneficiary portal.        | Low.                      |

## 2.3 Operating Environment

- Server: Linux-based host, Node.js / Java Spring Boot API, PostgreSQL 15+ database.
- Web Client: Modern browsers - Chrome 110+, Firefox 110+, Edge 110+, Safari 16+.
- Admin Portal: Same browser stack; enhanced permissions; accessible from intranet.
- Beneficiary Portal: Public-facing; supports RTL (Arabic) as primary language; LTR (English) secondary.
- Barcode Integration: USB/Bluetooth barcode scanners; label printers via browser USB/serial API or local agent.
- Email: SMTP relay (Ministry mail server) for notifications.
- Network: Intranet deployment with optional VPN access; beneficiary portal on DMZ.

## 2.4 Design and Implementation Constraints

- All user-facing text must support bilingual (Arabic/English) display; Arabic is the primary language.
- All dates must be displayable in Hijri (Islamic) and Gregorian calendars.
- The system must comply with the Saudi National Data Governance policies and ministerial IT security standards.
- Physical archive locations must mirror the real-world hierarchy exactly: Room → Row → Cabinet → Shelf → Box → Record.
- Barcode format is standardised as Code128; all physical boxes and records require a unique barcode label.
- All destructive operations (record deletion, destruction approval) require at minimum a two-step authorisation.
- Audit logs are immutable; no UI action may modify or delete a log entry.

## 2.5 Assumptions and Dependencies

- Organisational unit data (departments, sections) is provided by the ministry and imported before go-live.
- A master document classification taxonomy is agreed with the Archive Centre before system configuration.
- Barcode scanner hardware is procured and compatible with the web browser barcode API.
- An email server with SMTP relay is accessible from the application server.
- User accounts are pre-seeded or integrated via ministry identity provider.

# 3\. System Architecture

## 3.1 Architecture Overview

DACMS follows a three-tier web application architecture: a React-based single-page application (SPA) front-end, a RESTful Node.js/Express API middle tier, and a PostgreSQL relational database back-end. The system is deployed on a Linux server within the Ministry's data centre.

## 3.2 Platform Components

| **Component**       | **Technology**       | **Audience**                             | **Key Responsibilities**                                                                  |
| ------------------- | -------------------- | ---------------------------------------- | ----------------------------------------------------------------------------------------- |
| Admin Control Panel | React SPA + REST API | System Administrator, Archive Supervisor | System configuration, role management, template design, workflow builder, full reporting. |
| Operations Portal   | React SPA + REST API | Archive Supervisor, Archive Officer      | Record registration, classification, lending, barcoding, return processing.               |
| Beneficiary Portal  | React SPA + REST API | Beneficiary User                         | Document retrieval requests, request tracking, status notifications.                      |
| REST API            | Node.js / Express    | All portals                              | Business logic, authentication, data access, notification dispatch, barcode generation.   |
| Database            | PostgreSQL 15+       | API only                                 | Persistent storage for all system data, audit logs, and configurations.                   |
| Notification Engine | Node.js + SMTP       | API (async)                              | Email and in-app alerts triggered by workflow events and SLA thresholds.                  |
| Barcode Service     | Node.js + bwip-js    | API + print agent                        | Generate Code128 barcodes, serve printable PDF labels.                                    |

## 3.3 Module Layering

The 15 functional modules are grouped into four architectural layers:

| **Layer**                  | **Modules**                                                                       |
| -------------------------- | --------------------------------------------------------------------------------- |
| Foundation / Configuration | M1 Archive Structure, M2 Org Units, M10 Permissions, M12 Templates, M14 Workflows |
| Core Archive Operations    | M3 Records & Files, M4 Classification, M5 Document Receiving, M9 Barcodes         |
| Lifecycle Management       | M6 Lending & Retrieval, M7 Retention, M8 Destruction                              |
| Insight & Governance       | M11 Reporting, M13 Notifications, M15 KPI Linking                                 |

## 3.4 Security Model

- Authentication: JWT-based session tokens; refresh token rotation; session expiry 8h.
- Authorisation: Role-Based Access Control (RBAC) - every API endpoint requires a permission claim.
- Audit: All create/update/delete operations write an immutable audit log entry (user, timestamp, entity, change delta).
- Data Encryption: All data in transit over HTTPS/TLS 1.3; database fields for sensitive data encrypted at rest.
- Password Policy: Minimum 8 characters; complexity enforced; bcrypt hashing.

# 4\. Functional Modules

This section provides the complete functional specification for each of the 15 DACMS modules. Each module section contains: an overview, entity data models, functional requirements table, and use case specifications.

# Module 1: Archive Structure Management (إدارة هيكل الأرشيف)

## 1.1 Module Overview

The Archive Structure Management module establishes and maintains the physical hierarchy of the archive center. It models the real-world physical storage layout from the highest-level archive room down to individual shelves and boxes. Every physical storage unit is registered, coded, and linked to the organizational units it serves, enabling complete spatial tracking of all archived records.

This module is the foundational layer for physical record management. All archiving operations, retrieval requests, lending assignments, and physical location tracking depend on this module having an accurate, up-to-date representation of the physical space. The module supports multi-level organizational linking, capacity thresholds, and location-based coding schemes.

## 1.2 Data Entities

**Entity: ArchiveRoom**

Top-level physical space within the archive center.

| **ArchiveRoom** | | | |
| --- | | | | --- | --- | --- |

| **Attribute**   | **Type**    | **Required** | **Description**                   |
| --------------- | ----------- | ------------ | --------------------------------- |
| **room_id**     | _UUID (PK)_ | **✓**        | Unique identifier                 |
| **name_ar**     | _VARCHAR_   | **✓**        | Arabic room name                  |
| **name_en**     | _VARCHAR_   | **✓**        | English room name                 |
| **room_code**   | _VARCHAR_   | **✓**        | Unique location code (e.g., R01)  |
| **capacity**    | _INT_       | **✓**        | Max number of boxes               |
| **current_use** | _INT_       | ○            | Current occupied capacity         |
| **dept_ids**    | _UUID\[\]_  | ○            | Linked organizational departments |
| **is_active**   | _BOOLEAN_   | **✓**        | Active/Inactive status            |
| **notes**       | _TEXT_      | ○            | Admin notes                       |

**Entity: ArchiveRow**

A row within an archive room, containing cabinets.

| **ArchiveRow** | | | |
| --- | | | | --- | --- | --- |

| **Attribute** | **Type**    | **Required** | **Description**           |
| ------------- | ----------- | ------------ | ------------------------- |
| **row_id**    | _UUID (PK)_ | **✓**        | Unique identifier         |
| **room_id**   | _UUID (FK)_ | **✓**        | Parent room reference     |
| **row_code**  | _VARCHAR_   | **✓**        | Row code (e.g., R01-RW03) |
| **position**  | _INT_       | **✓**        | Physical position number  |
| **capacity**  | _INT_       | **✓**        | Max number of cabinets    |

**Entity: ArchiveCabinet**

A cabinet (كبينة) within a row.

| **ArchiveCabinet** | | | |
| --- | | | | --- | --- | --- |

| **Attribute**    | **Type**    | **Required** | **Description**                 |
| ---------------- | ----------- | ------------ | ------------------------------- |
| **cabinet_id**   | _UUID (PK)_ | **✓**        | Unique identifier               |
| **row_id**       | _UUID (FK)_ | **✓**        | Parent row reference            |
| **cabinet_code** | _VARCHAR_   | **✓**        | Full code (e.g., R01-RW03-CB02) |
| **shelf_count**  | _INT_       | **✓**        | Number of shelves in cabinet    |

**Entity: ArchiveShelf**

A shelf (رف) within a cabinet.

| **ArchiveShelf** | | | |
| --- | | | | --- | --- | --- |

| **Attribute**   | **Type**    | **Required** | **Description**                     |
| --------------- | ----------- | ------------ | ----------------------------------- |
| **shelf_id**    | _UUID (PK)_ | **✓**        | Unique identifier                   |
| **cabinet_id**  | _UUID (FK)_ | **✓**        | Parent cabinet reference            |
| **shelf_code**  | _VARCHAR_   | **✓**        | Full code (e.g., R01-RW03-CB02-SH1) |
| **capacity**    | _INT_       | **✓**        | Max boxes on shelf                  |
| **current_use** | _INT_       | ○            | Current box count                   |

**Entity: ArchiveBox**

A physical storage box (صندوق) placed on a shelf.

| **ArchiveBox** | | | |
| --- | | | | --- | --- | --- |

| **Attribute**  | **Type**    | **Required** | **Description**              |
| -------------- | ----------- | ------------ | ---------------------------- |
| **box_id**     | _UUID (PK)_ | **✓**        | Unique identifier            |
| **shelf_id**   | _UUID (FK)_ | **✓**        | Current shelf location       |
| **box_code**   | _VARCHAR_   | **✓**        | Full barcode-linked code     |
| **label**      | _VARCHAR_   | **✓**        | Human-readable label         |
| **record_ids** | _UUID\[\]_  | ○            | Records stored in this box   |
| **is_sealed**  | _BOOLEAN_   | ○            | Whether box is sealed/closed |

## 1.3 Functional Requirements

| **ID**    | **Functional Requirement**                                                                 | **Priority** | **Notes / Business Rules**                                       |
| --------- | ------------------------------------------------------------------------------------------ | ------------ | ---------------------------------------------------------------- |
| **F1.1**  | Define and register archive rooms with bilingual names, unique codes, and capacity limits. | **HIGH**     | _Room code must follow org-defined naming convention._           |
| **F1.2**  | Link archive rooms to one or more organizational departments.                              | **HIGH**     | _A room can serve multiple departments; permissions apply._      |
| **F1.3**  | Define rows within rooms with positional numbering and codes.                              | **HIGH**     | _Row code auto-generated from room code + sequence._             |
| **F1.4**  | Define cabinets within rows.                                                               | **HIGH**     | _Cabinet count per row configurable by admin._                   |
| **F1.5**  | Define shelves within cabinets with capacity limits.                                       | **HIGH**     | _Capacity alert triggered at 90% fill._                          |
| **F1.6**  | Generate and display hierarchical location codes for all physical units.                   | **HIGH**     | _Format: ROOM-ROW-CABINET-SHELF (e.g., R01-03-B2-S4)._           |
| **F1.7**  | View occupancy status and capacity percentage per level.                                   | **MED**      | _Dashboard widget shows color-coded occupancy._                  |
| **F1.8**  | Activate and deactivate any physical storage unit.                                         | **MED**      | _Deactivated units reject new record assignments._               |
| **F1.9**  | Transfer boxes and their contents between shelf locations.                                 | **MED**      | _Transfer creates audit log entry and updates location codes._   |
| **F1.10** | Set capacity threshold alerts (warning and critical levels).                               | **LOW**      | _Admin configures threshold %; notification sent to supervisor._ |

## 1.4 Use Cases

**UC-01-01: Register New Archive Room**

| **Use Case ID**       | **UC-01-01**                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| --------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Use Case Name**     | **Register New Archive Room**                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
| **Actors**            | System Administrator, Archive Supervisor                                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
| **Pre-conditions**    | 1\. At least one department exists in the system 2. Admin is logged in with room management permission                                                                                                                                                                                                                                                                                                                                                                                                         |
| **Main Flow**         | 1\. Admin navigates to Archive Structure > Rooms > Add New. 2. System presents room creation form with fields: Name (AR/EN), Code, Capacity, Department Links. 3. Admin enters room details and selects linked departments. 4. System validates that room code is unique and capacity is a positive integer. 5. Admin saves the room. 6. System creates room record, sets status to Active, and generates the base location code. 7. System confirms creation and displays the new room in the structure tree. |
| **Alternative Flows** | 1\. Code already exists: System shows error; Admin must enter a unique code. 2. No department selected: System warns; Admin can proceed without a department link.                                                                                                                                                                                                                                                                                                                                             |
| **Post-conditions**   | 1\. New room appears in the archive structure tree. 2. Room is available for row creation. 3. Location code is generated and stored.                                                                                                                                                                                                                                                                                                                                                                           |

**UC-01-02: View Physical Occupancy Dashboard**

| **Use Case ID**       | **UC-01-02**                                                                                                                                                                                                                                                                                                                                                                                                                          |
| --------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Use Case Name**     | **View Physical Occupancy Dashboard**                                                                                                                                                                                                                                                                                                                                                                                                 |
| **Actors**            | Archive Supervisor, Archive Officer                                                                                                                                                                                                                                                                                                                                                                                                   |
| **Pre-conditions**    | 1\. Archive structure is configured with at least one room/shelf.                                                                                                                                                                                                                                                                                                                                                                     |
| **Main Flow**         | 1\. User navigates to Archive Structure > Occupancy Overview. 2. System loads the occupancy dashboard. 3. Dashboard displays each room with total capacity, current occupancy, and percentage fill. 4. Color coding: Green (<70%), Amber (70-89%), Red (≥90%). 5. User clicks on a room to drill down into rows and shelves. 6. System shows granular occupancy at shelf level. 7. User can export the occupancy report to PDF/Excel. |
| **Alternative Flows** | 1\. No data: System shows empty state with setup instructions.                                                                                                                                                                                                                                                                                                                                                                        |
| **Post-conditions**   | 1\. User has a visual picture of available physical space.                                                                                                                                                                                                                                                                                                                                                                            |

# Module 2: Data Models & Metadata Management (إدارة النماذج والبيانات)

## 2.1 Module Overview

The Data Models module provides the schema definitions used to classify, describe, and organize records within the archive center. It manages the taxonomy of document types, hierarchical categories, box and shelf templates, mandatory metadata fields, and retention period configuration. This module is the metadata backbone of the entire system.

Every record stored in the system must conform to a document type template defined in this module. The module supports multi-level classification trees (Document Type → Main Category → Sub-Category → Sub-Sub-Category), configurable mandatory fields, and retention rules that drive the destruction management module.

## 2.2 Data Entities

**Entity: DocumentType**

Top-level classification type for records.

| **DocumentType** | | | |
| --- | | | | --- | --- | --- |

| **Attribute**   | **Type**    | **Required** | **Description**   |
| --------------- | ----------- | ------------ | ----------------- |
| **doctype_id**  | _UUID (PK)_ | **✓**        | Unique identifier |
| **name_ar**     | _VARCHAR_   | **✓**        | Arabic type name  |
| **name_en**     | _VARCHAR_   | **✓**        | English type name |
| **code**        | _VARCHAR_   | **✓**        | Unique type code  |
| **description** | _TEXT_      | ○            | Descriptive notes |
| **is_active**   | _BOOLEAN_   | **✓**        | Active status     |

**Entity: DocumentCategory**

Hierarchical classification category (Main / Sub / SubSub).

| **DocumentCategory** | | | |
| --- | | | | --- | --- | --- |

| **Attribute**     | **Type**    | **Required** | **Description**                        |
| ----------------- | ----------- | ------------ | -------------------------------------- |
| **cat_id**        | _UUID (PK)_ | **✓**        | Unique identifier                      |
| **doctype_id**    | _UUID (FK)_ | **✓**        | Parent document type                   |
| **parent_cat_id** | _UUID (FK)_ | ○            | Parent category (null = main category) |
| **name_ar**       | _VARCHAR_   | **✓**        | Arabic category name                   |
| **name_en**       | _VARCHAR_   | **✓**        | English category name                  |
| **level**         | _INT (1-4)_ | **✓**        | Hierarchy level                        |
| **code**          | _VARCHAR_   | **✓**        | Unique category code within type       |

**Entity: MetadataField**

Reusable metadata field definition.

| **MetadataField** | | | |
| --- | | | | --- | --- | --- |

| **Attribute**     | **Type**    | **Required** | **Description**                                      |
| ----------------- | ----------- | ------------ | ---------------------------------------------------- |
| **field_id**      | _UUID (PK)_ | **✓**        | Unique identifier                                    |
| **field_key**     | _VARCHAR_   | **✓**        | Unique system key                                    |
| **label_ar**      | _VARCHAR_   | **✓**        | Arabic label                                         |
| **label_en**      | _VARCHAR_   | **✓**        | English label                                        |
| **field_type**    | _ENUM_      | **✓**        | TEXT, DATE, NUMBER, DROPDOWN, MULTI_SELECT, CHECKBOX |
| **is_required**   | _BOOLEAN_   | **✓**        | Mandatory flag                                       |
| **default_val**   | _VARCHAR_   | ○            | Default value                                        |
| **option_set_id** | _UUID (FK)_ | ○            | Linked option set for dropdowns                      |

**Entity: RetentionPolicy**

Retention rules per document type.

| **RetentionPolicy** | | | |
| --- | | | | --- | --- | --- |

| **Attribute**    | **Type**    | **Required** | **Description**            |
| ---------------- | ----------- | ------------ | -------------------------- |
| **policy_id**    | _UUID (PK)_ | **✓**        | Unique identifier          |
| **doctype_id**   | _UUID (FK)_ | **✓**        | Linked document type       |
| **period_years** | _INT_       | **✓**        | Retention period in years  |
| **action_after** | _ENUM_      | **✓**        | DESTROY, MIGRATE, REVIEW   |
| **legal_ref**    | _VARCHAR_   | ○            | Legal/regulatory reference |

## 2.3 Functional Requirements

| **ID**   | **Functional Requirement**                                                                      | **Priority** | **Notes / Business Rules**                                         |
| -------- | ----------------------------------------------------------------------------------------------- | ------------ | ------------------------------------------------------------------ |
| **F2.1** | Create and manage document type classifications with bilingual names and unique codes.          | **HIGH**     | _Document types are top-level taxonomy nodes._                     |
| **F2.2** | Create multi-level category hierarchies (Main → Sub → Sub-Sub → Sub-Sub-Sub) per document type. | **HIGH**     | _Maximum 4 levels of category hierarchy._                          |
| **F2.3** | Define metadata fields with types: Text, Date, Number, Dropdown, Multi-Select, Checkbox.        | **HIGH**     | _Fields reusable across multiple document types._                  |
| **F2.4** | Assign mandatory and optional metadata fields to document types.                                | **HIGH**     | _Mandatory fields enforce data completeness on record creation._   |
| **F2.5** | Create and manage option sets (value lists) for dropdown and multi-select fields.               | **MED**      | _Option sets are versioned; deprecated sets retained for history._ |
| **F2.6** | Define retention policies per document type (period, action, legal reference).                  | **HIGH**     | _Retention policies link to the Destruction module._               |
| **F2.7** | Define box templates with metadata fields (label, document type range, capacity).               | **MED**      | _Box template used during physical box creation._                  |
| **F2.8** | Define shelf templates with allowed document categories.                                        | **MED**      | _Shelf templates restrict which doc types can be stored._          |
| **F2.9** | Version control for metadata field definitions; preserve historical data.                       | **LOW**      | _Changes to field definitions create new versions._                |

## 2.4 Use Cases

**UC-02-01: Create Document Type with Category Hierarchy**

| **Use Case ID**       | **UC-02-01**                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| --------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Use Case Name**     | **Create Document Type with Category Hierarchy**                                                                                                                                                                                                                                                                                                                                                                                                                                                                             |
| **Actors**            | System Administrator                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| **Pre-conditions**    | 1\. Admin has Metadata Management permission.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| **Main Flow**         | 1\. Admin opens Data Models > Document Types > Add New. 2. Admin enters Document Type name (AR/EN), code, and optional description. 3. System saves the document type. 4. Admin opens the document type and selects "Add Category" to create the Main Category. 5. Admin sets category name (AR/EN) and code at Level 1. 6. Admin repeats to add Sub-Category (Level 2), Sub-Sub-Category (Level 3) as needed. 7. For each category level, Admin can assign specific metadata fields. 8. Admin saves the complete hierarchy. |
| **Alternative Flows** | 1\. Duplicate code: System prevents saving; Admin must use unique code.                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| **Post-conditions**   | 1\. Document type and full category tree are available for record classification.                                                                                                                                                                                                                                                                                                                                                                                                                                            |

**UC-02-02: Define Retention Policy**

| **Use Case ID**       | **UC-02-02**                                                                                                                                                                                                                                                                                                                                                                                                           |
| --------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Use Case Name**     | **Define Retention Policy**                                                                                                                                                                                                                                                                                                                                                                                            |
| **Actors**            | System Administrator, Legal/Compliance Officer                                                                                                                                                                                                                                                                                                                                                                         |
| **Pre-conditions**    | 1\. Document type exists.                                                                                                                                                                                                                                                                                                                                                                                              |
| **Main Flow**         | 1\. Admin navigates to document type settings > Retention Policy. 2. Admin sets retention period (years) and post-retention action (Destroy/Migrate/Review). 3. Admin optionally enters legal reference (law number, regulation article). 4. System saves the policy. 5. System begins evaluating records of this type against the policy. 6. Records approaching retention end are flagged in the Destruction module. |
| **Alternative Flows** | 1\. Multiple policies per type: System warns but allows override with approval.                                                                                                                                                                                                                                                                                                                                        |
| **Post-conditions**   | 1\. Retention policy active; records flagged automatically on expiry.                                                                                                                                                                                                                                                                                                                                                  |

# Module 3: Records Registration & Archiving (إدارة السجلات والأرشفة)

## 3.1 Module Overview

The Records Registration and Archiving module handles the intake, registration, and physical placement of records into the archive center. It supports both paper-origin records (digitized and physically stored) and born-digital documents. The module captures all required metadata, assigns physical locations, manages box contents, and tracks the complete lifecycle status of each record.

This module integrates directly with the Archive Structure module (physical locations), the Data Models module (metadata schemas), and the Barcode module (physical label assignment). It is the primary data entry point for all archived materials.

## 3.2 Data Entities

**Entity: Record**

Core archivable item (paper or digital origin).

| **Record** | | | |
| --- | | | | --- | --- | --- |

| **Attribute**     | **Type**    | **Required** | **Description**                                 |
| ----------------- | ----------- | ------------ | ----------------------------------------------- |
| **record_id**     | _UUID (PK)_ | **✓**        | Unique identifier                               |
| **ref_number**    | _VARCHAR_   | **✓**        | Auto-generated reference (e.g., REC-2026-00001) |
| **title_ar**      | _VARCHAR_   | **✓**        | Arabic record title                             |
| **title_en**      | _VARCHAR_   | ○            | English record title (optional)                 |
| **doctype_id**    | _UUID (FK)_ | **✓**        | Document type classification                    |
| **category_id**   | _UUID (FK)_ | **✓**        | Category classification                         |
| **box_id**        | _UUID (FK)_ | ○            | Physical box location                           |
| **shelf_id**      | _UUID (FK)_ | ○            | Current shelf (derived from box)                |
| **status**        | _ENUM_      | **✓**        | ACTIVE, LENT, DESTROYED, MIGRATED, ARCHIVED     |
| **issue_date**    | _DATE_      | **✓**        | Original document issue date                    |
| **archive_date**  | _DATE_      | **✓**        | Date record was archived                        |
| **retention_end** | _DATE_      | ○            | Calculated from retention policy                |
| **secrecy_level** | _ENUM_      | **✓**        | PUBLIC, INTERNAL, SECRET, TOP_SECRET            |
| **metadata**      | _JSONB_     | ○            | Template-defined metadata values                |
| **created_by**    | _UUID (FK)_ | **✓**        | Archiving officer who registered the record     |

**Entity: RecordFile**

Digital file attachment associated with a record.

| **RecordFile** | | | |
| --- | | | | --- | --- | --- |

| **Attribute**    | **Type**    | **Required** | **Description**              |
| ---------------- | ----------- | ------------ | ---------------------------- |
| **file_id**      | _UUID (PK)_ | **✓**        | Unique identifier            |
| **record_id**    | _UUID (FK)_ | **✓**        | Parent record                |
| **filename**     | _VARCHAR_   | **✓**        | Original file name           |
| **file_type**    | _VARCHAR_   | **✓**        | MIME type (PDF, DOCX, JPEG…) |
| **storage_path** | _VARCHAR_   | **✓**        | Object storage path          |
| **size_bytes**   | _BIGINT_    | **✓**        | File size                    |
| **upload_date**  | _TIMESTAMP_ | **✓**        | Upload timestamp             |
| **is_primary**   | _BOOLEAN_   | **✓**        | Primary scan vs attachment   |

**Entity: LocationHistory**

Audit trail of physical location changes for a record.

| **LocationHistory** | | | |
| --- | | | | --- | --- | --- |

| **Attribute** | **Type**    | **Required** | **Description**         |
| ------------- | ----------- | ------------ | ----------------------- |
| **hist_id**   | _UUID (PK)_ | **✓**        | Unique identifier       |
| **record_id** | _UUID (FK)_ | **✓**        | Record reference        |
| **from_box**  | _UUID (FK)_ | ○            | Previous box            |
| **to_box**    | _UUID (FK)_ | **✓**        | New box                 |
| **moved_by**  | _UUID (FK)_ | **✓**        | User who performed move |
| **moved_at**  | _TIMESTAMP_ | **✓**        | Timestamp of move       |
| **reason**    | _TEXT_      | ○            | Reason for transfer     |

## 3.3 Functional Requirements

| **ID**    | **Functional Requirement**                                                                       | **Priority** | **Notes / Business Rules**                                                    |
| --------- | ------------------------------------------------------------------------------------------------ | ------------ | ----------------------------------------------------------------------------- |
| **F3.1**  | Register paper records with full metadata: title, doc type, category, issue date, secrecy level. | **HIGH**     | _Reference number auto-generated on save._                                    |
| **F3.2**  | Upload one or more digital files (PDF, DOCX, JPEG, TIFF) per record.                             | **HIGH**     | _Primary scan + optional attachments. Max file size configurable._            |
| **F3.3**  | Assign record to a physical box and shelf location.                                              | **HIGH**     | _System validates box has available capacity._                                |
| **F3.4**  | Support bulk import of records via structured template (CSV/Excel).                              | **MED**      | _Bulk import validates each row; errors reported per line._                   |
| **F3.5**  | View all records within a specific box and their metadata summary.                               | **HIGH**     | _Box content view shows record count, total pages, secrecy levels._           |
| **F3.6**  | Update record lifecycle status (Active, Lent, Destroyed, Migrated).                              | **HIGH**     | _Status updates trigger relevant module workflows._                           |
| **F3.7**  | Maintain complete location history for every record movement.                                    | **HIGH**     | _Immutable audit log; viewable by supervisor and above._                      |
| **F3.8**  | Seal/unseal archive boxes and prevent additions to sealed boxes.                                 | **MED**      | _Sealed boxes are locked for new records; existing records still accessible._ |
| **F3.9**  | Move records between boxes and update location history automatically.                            | **MED**      | _Move triggers barcode re-assignment if applicable._                          |
| **F3.10** | Set record-level confidentiality (Public, Internal, Secret, Top Secret).                         | **HIGH**     | _Access to records is filtered by user clearance level._                      |

## 3.4 Use Cases

**UC-03-01: Register New Archive Record**

| **Use Case ID**       | **UC-03-01**                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| --------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Use Case Name**     | **Register New Archive Record**                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             |
| **Actors**            | Archive Officer                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             |
| **Pre-conditions**    | 1\. User has record registration permission. 2. Document type and category exist. 3. Target box has available capacity.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| **Main Flow**         | 1\. Officer navigates to Records > Register New Record. 2. System presents the registration form based on the selected document type. 3. Officer fills in: Title (AR/EN), Document Type, Category (cascading dropdown), Issue Date, Secrecy Level. 4. Officer fills mandatory metadata fields defined by the document type template. 5. Officer selects the target box (filtered by available capacity and document type constraints). 6. Officer uploads the primary digital scan and any attachments. 7. System generates a unique reference number (REC-YYYY-NNNNN). 8. System assigns a barcode code to the record entry. 9. Officer clicks Save & Assign Barcode. 10. System saves the record with status ACTIVE and updates box occupancy. 11. System triggers barcode label generation for printing. |
| **Alternative Flows** | 1\. Box full: System shows error; Officer must select a different box or create a new one. 2. Missing mandatory field: System highlights the field and prevents saving. 3. Secrecy level exceeds officer clearance: System alerts and requires supervisor approval.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| **Post-conditions**   | 1\. Record is registered with unique reference number. 2. Physical location (box) is assigned. 3. Box occupancy count is updated. 4. Barcode label is ready for printing.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |

**UC-03-02: Move Record Between Boxes**

| **Use Case ID**       | **UC-03-02**                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| --------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Use Case Name**     | **Move Record Between Boxes**                                                                                                                                                                                                                                                                                                                                                                                                                                             |
| **Actors**            | Archive Officer, Archive Supervisor                                                                                                                                                                                                                                                                                                                                                                                                                                       |
| **Pre-conditions**    | 1\. Record exists with ACTIVE status. 2. Destination box has capacity. 3. User has move permission.                                                                                                                                                                                                                                                                                                                                                                       |
| **Main Flow**         | 1\. User navigates to the record detail page. 2. User selects "Change Location" action. 3. System shows current location and prompts for new box selection. 4. User selects destination box (from location tree). 5. User enters reason for move. 6. System validates destination capacity. 7. System updates record box_id, creates LocationHistory entry. 8. System decrements source box occupancy and increments destination. 9. System logs the move in audit trail. |
| **Alternative Flows** | 1\. Destination box sealed: System prevents selection.                                                                                                                                                                                                                                                                                                                                                                                                                    |
| **Post-conditions**   | 1\. Record location updated. 2. Location history entry created. 3. Both box occupancy counts updated.                                                                                                                                                                                                                                                                                                                                                                     |

# Module 4: Search & Retrieval (البحث والاسترجاع)

## 4.1 Module Overview

The Search and Retrieval module provides comprehensive tools for locating records within the archive system. It supports advanced full-text and field-based search across all registered records, physical location lookup using hierarchical codes, document movement history viewing, and search result export. The module ensures that authorized users can quickly find any record regardless of its physical or digital storage location.

## 4.2 Data Entities

**Entity: SearchQuery**

Saved search query for reuse.

| **SearchQuery** | | | |
| --- | | | | --- | --- | --- |

| **Attribute**  | **Type**    | **Required** | **Description**            |
| -------------- | ----------- | ------------ | -------------------------- |
| **query_id**   | _UUID (PK)_ | **✓**        | Unique identifier          |
| **name**       | _VARCHAR_   | **✓**        | Query name                 |
| **user_id**    | _UUID (FK)_ | **✓**        | Owner user                 |
| **filters**    | _JSONB_     | **✓**        | Serialized filter criteria |
| **created_at** | _TIMESTAMP_ | **✓**        | Creation timestamp         |

## 4.3 Functional Requirements

| **ID**   | **Functional Requirement**                                                                                             | **Priority** | **Notes / Business Rules**                                          |
| -------- | ---------------------------------------------------------------------------------------------------------------------- | ------------ | ------------------------------------------------------------------- |
| **F4.1** | Full-text search across all indexed record fields: title, reference number, metadata values.                           | **HIGH**     | _Search must return results within 3 seconds for up to 1M records._ |
| **F4.2** | Advanced filtered search by: document type, category, date range, secrecy level, status, archive location, department. | **HIGH**     | _Filters are combinable; at least one filter required._             |
| **F4.3** | Physical location lookup: display full path (Room → Row → Cabinet → Shelf → Box) for any record.                       | **HIGH**     | _Location path displayed in search results and record detail._      |
| **F4.4** | View complete movement audit log for any record (all location changes and status updates).                             | **HIGH**     | _Audit log is read-only; cannot be edited or deleted._              |
| **F4.5** | Search by barcode scan: scanning a barcode instantly retrieves the associated record.                                  | **HIGH**     | _Both USB scanner and mobile camera barcode input supported._       |
| **F4.6** | Save and reuse search queries.                                                                                         | **MED**      | _Saved searches available per user._                                |
| **F4.7** | Export search results to PDF and Excel formats.                                                                        | **MED**      | _Export includes all visible columns; max 10,000 rows per export._  |
| **F4.8** | Proximity search: find records near a given physical location (same room, same shelf).                                 | **LOW**      | _Useful for bulk retrieval operations._                             |

## 4.4 Use Cases

**UC-04-01: Advanced Record Search**

| **Use Case ID**       | **UC-04-01**                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| --------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Use Case Name**     | **Advanced Record Search**                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| **Actors**            | Archive Officer, Archive Supervisor, Beneficiary User                                                                                                                                                                                                                                                                                                                                                                                                          |
| **Pre-conditions**    | 1\. User is authenticated. 2. At least one record exists in the system.                                                                                                                                                                                                                                                                                                                                                                                        |
| **Main Flow**         | 1\. User navigates to Search > Advanced Search. 2. User selects/enters one or more filter criteria. 3. System executes the search query against the record index. 4. System returns paginated results (50 per page default). 5. Each result shows: Ref#, Title, Doc Type, Category, Physical Location, Status, Archive Date. 6. User clicks a result to open the full record detail. 7. Record detail shows all metadata, digital files, and movement history. |
| **Alternative Flows** | 1\. No results: System displays "No records found" with suggestion to broaden filters. 2. Access restricted: Records with secrecy level above user clearance are hidden from results.                                                                                                                                                                                                                                                                          |
| **Post-conditions**   | 1\. User can view and interact with search results.                                                                                                                                                                                                                                                                                                                                                                                                            |

**UC-04-02: Retrieve Record by Barcode Scan**

| **Use Case ID**       | **UC-04-02**                                                                                                                                                                                                                                                                                                             |
| --------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Use Case Name**     | **Retrieve Record by Barcode Scan**                                                                                                                                                                                                                                                                                      |
| **Actors**            | Archive Officer                                                                                                                                                                                                                                                                                                          |
| **Pre-conditions**    | 1\. Barcode scanner connected or camera available. 2. Record with barcode exists.                                                                                                                                                                                                                                        |
| **Main Flow**         | 1\. Officer navigates to Search > Barcode Scan. 2. Officer scans the barcode label on a physical record or box. 3. System receives the barcode value and queries the record index. 4. System instantly displays the matched record detail page. 5. Officer can view physical location, current status, and all metadata. |
| **Alternative Flows** | 1\. Barcode not found: System shows "Unrecognized barcode" error. 2. Multiple matches: System shows a selection list.                                                                                                                                                                                                    |
| **Post-conditions**   | 1\. Record detail page is displayed for the scanned item.                                                                                                                                                                                                                                                                |

# Module 5: Barcode & Coding Management (إدارة الباركود والترميز)

## 5.1 Module Overview

The Barcode and Coding Management module provides all functionality for generating, printing, and scanning barcodes for physical archive items. Each archive room, row, cabinet, shelf, box, and individual record receives a unique machine-readable code. The module supports both 1D barcodes (Code-128) and 2D QR codes, batch label printing for bulk operations, and USB/camera barcode scanning for rapid record retrieval.

## 5.2 Data Entities

**Entity: BarcodeLabel**

Generated barcode for a physical archive entity.

| **BarcodeLabel** | | | |
| --- | | | | --- | --- | --- |

| **Attribute**    | **Type**    | **Required** | **Description**                        |
| ---------------- | ----------- | ------------ | -------------------------------------- |
| **barcode_id**   | _UUID (PK)_ | **✓**        | Unique identifier                      |
| **entity_type**  | _ENUM_      | **✓**        | ROOM, ROW, CABINET, SHELF, BOX, RECORD |
| **entity_id**    | _UUID (FK)_ | **✓**        | Referenced entity ID                   |
| **barcode_val**  | _VARCHAR_   | **✓**        | Encoded barcode string (unique)        |
| **barcode_type** | _ENUM_      | **✓**        | CODE128 or QR_CODE                     |
| **generated_at** | _TIMESTAMP_ | **✓**        | Generation timestamp                   |
| **printed_at**   | _TIMESTAMP_ | ○            | Last print timestamp                   |
| **is_active**    | _BOOLEAN_   | **✓**        | Active (current) vs replaced           |

**Entity: PrintJob**

Batch print job for multiple barcode labels.

| **PrintJob** | | | |
| --- | | | | --- | --- | --- |

| **Attribute**    | **Type**    | **Required** | **Description**               |
| ---------------- | ----------- | ------------ | ----------------------------- |
| **job_id**       | _UUID (PK)_ | **✓**        | Unique identifier             |
| **created_by**   | _UUID (FK)_ | **✓**        | Requesting user               |
| **label_ids**    | _UUID\[\]_  | **✓**        | Barcodes included in job      |
| **status**       | _ENUM_      | **✓**        | QUEUED, PRINTING, DONE        |
| **print_format** | _VARCHAR_   | **✓**        | Label template (size, layout) |
| **queued_at**    | _TIMESTAMP_ | **✓**        | Queue time                    |

## 5.3 Functional Requirements

| **ID**   | **Functional Requirement**                                                                                      | **Priority** | **Notes / Business Rules**                                            |
| -------- | --------------------------------------------------------------------------------------------------------------- | ------------ | --------------------------------------------------------------------- |
| **F5.1** | Auto-generate a unique barcode for every archive entity upon creation (Room, Row, Cabinet, Shelf, Box, Record). | **HIGH**     | _Barcode value encodes entity type + unique ID._                      |
| **F5.2** | Support CODE-128 and QR Code formats; admin configures default per entity type.                                 | **HIGH**     | _QR codes can encode richer metadata for mobile scanning._            |
| **F5.3** | Print individual barcode labels on demand for any entity.                                                       | **HIGH**     | _Labels include barcode, entity code, human-readable name._           |
| **F5.4** | Batch print barcode labels for a selected set of entities (e.g., all shelves in a room).                        | **HIGH**     | _Print job queued; PDF of label sheet generated for thermal printer._ |
| **F5.5** | Scan barcodes via USB scanner or mobile device camera to retrieve the associated entity instantly.              | **HIGH**     | _Sub-second lookup after scan._                                       |
| **F5.6** | Regenerate/replace barcode for damaged or lost labels while preserving history.                                 | **MED**      | _Old barcode marked inactive; new barcode links to same entity._      |
| **F5.7** | Configure label templates: size (A4, label sheet), font, logo, layout.                                          | **MED**      | _Multiple templates for different physical label sizes._              |

## 5.4 Use Cases

**UC-05-01: Batch Print Barcode Labels for New Shelf Setup**

| **Use Case ID**       | **UC-05-01**                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             |
| --------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Use Case Name**     | **Batch Print Barcode Labels for New Shelf Setup**                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
| **Actors**            | Archive Officer, System Administrator                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| **Pre-conditions**    | 1\. Archive structure (rooms/shelves) configured. 2. Label printer connected.                                                                                                                                                                                                                                                                                                                                                                                                                            |
| **Main Flow**         | 1\. Officer navigates to Barcode Management > Batch Print. 2. Officer selects entity type (e.g., Shelf) and selects a room to filter. 3. System lists all shelves in the selected room. 4. Officer selects all shelves (or a subset) and chooses a label template. 5. System generates a print job with all selected barcode labels. 6. System produces a PDF sheet formatted for the label printer. 7. Officer downloads and prints the PDF. 8. System marks all printed labels with current timestamp. |
| **Alternative Flows** | 1\. Printer offline: System saves PDF for later printing.                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| **Post-conditions**   | 1\. Labels printed and shelves are physically labelled. 2. Print timestamp recorded.                                                                                                                                                                                                                                                                                                                                                                                                                     |

**UC-05-02: Replace Damaged Barcode Label**

| **Use Case ID**       | **UC-05-02**                                                                                                                                                                                                                                                                                                                                                                     |
| --------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Use Case Name**     | **Replace Damaged Barcode Label**                                                                                                                                                                                                                                                                                                                                                |
| **Actors**            | Archive Officer                                                                                                                                                                                                                                                                                                                                                                  |
| **Pre-conditions**    | 1\. Original barcode is unreadable/damaged.                                                                                                                                                                                                                                                                                                                                      |
| **Main Flow**         | 1\. Officer locates the record or box by manual search (reference number or location code). 2. Officer opens record/box and selects "Replace Barcode". 3. System marks old barcode as INACTIVE and generates a new unique barcode value. 4. New barcode is linked to the same entity. 5. System prints the replacement label. 6. Officer applies new label to the physical item. |
| **Alternative Flows** | 1\. Entity not found: Officer uses supervisor escalation for manual ID.                                                                                                                                                                                                                                                                                                          |
| **Post-conditions**   | 1\. New active barcode linked to entity. 2. Old barcode deactivated with timestamp.                                                                                                                                                                                                                                                                                              |

# Module 6: Lending & Requests Management (إدارة الإعارة والطلبات الورقية)

## 6.1 Module Overview

The Lending and Requests Management module governs the complete lifecycle of physical record lending from a beneficiary department's initial request through supervisor approval, messenger dispatch, active lending period tracking, and final return confirmation. It enforces configurable lending rules, calculates due dates based on record type policies, supports multi-document requests, and provides overdue alerts.

This module has its own dedicated workflow defined in Module 14 (Workflow System), with the approval cycle built on top of the general workflow engine.

## 6.2 Data Entities

**Entity: LendingRequest**

A request to borrow one or more records.

| **LendingRequest** | | | |
| --- | | | | --- | --- | --- |

| **Attribute**    | **Type**    | **Required** | **Description**                                                    |
| ---------------- | ----------- | ------------ | ------------------------------------------------------------------ |
| **request_id**   | _UUID (PK)_ | **✓**        | Unique identifier                                                  |
| **ref_number**   | _VARCHAR_   | **✓**        | Auto-generated (LND-YYYY-NNNNN)                                    |
| **requester_id** | _UUID (FK)_ | **✓**        | Requesting user                                                    |
| **dept_id**      | _UUID (FK)_ | **✓**        | Requesting department                                              |
| **purpose**      | _TEXT_      | **✓**        | Business justification                                             |
| **status**       | _ENUM_      | **✓**        | PENDING, APPROVED, REJECTED, DISPATCHED, ACTIVE, RETURNED, OVERDUE |
| **requested_at** | _TIMESTAMP_ | **✓**        | Request submission time                                            |
| **approved_by**  | _UUID (FK)_ | ○            | Approving supervisor                                               |
| **approved_at**  | _TIMESTAMP_ | ○            | Approval timestamp                                                 |
| **due_date**     | _DATE_      | ○            | Calculated return deadline                                         |
| **returned_at**  | _TIMESTAMP_ | ○            | Actual return timestamp                                            |

**Entity: LendingItem**

Individual record within a lending request.

| **LendingItem** | | | |
| --- | | | | --- | --- | --- |

| **Attribute**  | **Type**    | **Required** | **Description**                       |
| -------------- | ----------- | ------------ | ------------------------------------- |
| **item_id**    | _UUID (PK)_ | **✓**        | Unique identifier                     |
| **request_id** | _UUID (FK)_ | **✓**        | Parent lending request                |
| **record_id**  | _UUID (FK)_ | **✓**        | Record being borrowed                 |
| **status**     | _ENUM_      | **✓**        | PENDING, DISPATCHED, ACTIVE, RETURNED |

**Entity: MessengerDispatch**

Dispatch record for messenger handling.

| **MessengerDispatch** | | | |
| --- | | | | --- | --- | --- |

| **Attribute**     | **Type**    | **Required** | **Description**                        |
| ----------------- | ----------- | ------------ | -------------------------------------- |
| **dispatch_id**   | _UUID (PK)_ | **✓**        | Unique identifier                      |
| **request_id**    | _UUID (FK)_ | **✓**        | Lending request                        |
| **messenger_id**  | _UUID (FK)_ | **✓**        | Assigned messenger user                |
| **direction**     | _ENUM_      | **✓**        | OUTBOUND (to dept) or INBOUND (return) |
| **dispatched_at** | _TIMESTAMP_ | ○            | Dispatch timestamp                     |
| **confirmed_at**  | _TIMESTAMP_ | ○            | Delivery/receipt confirmation          |

## 6.3 Functional Requirements

| **ID**    | **Functional Requirement**                                                                               | **Priority** | **Notes / Business Rules**                                          |
| --------- | -------------------------------------------------------------------------------------------------------- | ------------ | ------------------------------------------------------------------- |
| **F6.1**  | Create lending requests with one or more records, purpose statement, and requested lending period.       | **HIGH**     | _Each request gets unique LND-YYYY-NNNNN reference._                |
| **F6.2**  | Multi-document lending: include up to 50 records in a single request.                                    | **HIGH**     | _Each record tracked individually within the request._              |
| **F6.3**  | Route lending request through configurable approval workflow (Requester → Supervisor → Archive Officer). | **HIGH**     | _Approval flow defined in Workflow module._                         |
| **F6.4**  | Electronic approval and rejection with mandatory reason comment.                                         | **HIGH**     | _Rejection sends notification to requester._                        |
| **F6.5**  | Assign and track messenger dispatch for physical delivery to requesting department.                      | **HIGH**     | _Messenger confirms delivery; system timestamps dispatch._          |
| **F6.6**  | Auto-calculate lending period and due date based on document type retention rules.                       | **HIGH**     | _Override by supervisor with justification._                        |
| **F6.7**  | Update record physical location status to LENT during active lending period.                             | **HIGH**     | _Location shows as "On Loan to \[Department\]"._                    |
| **F6.8**  | Request and process lending period extensions (requires supervisor approval).                            | **MED**      | _Extension request auto-creates sub-workflow._                      |
| **F6.9**  | Confirm return of records, update status to ACTIVE, and reassign to original box.                        | **HIGH**     | _Return confirmation triggers location history update._             |
| **F6.10** | Automatic overdue alerts when lending period expires without return.                                     | **HIGH**     | _Alert sent to requester, department head, and archive supervisor._ |

## 6.4 Use Cases

**UC-06-01: Submit Lending Request**

| **Use Case ID**       | **UC-06-01**                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| --------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Use Case Name**     | **§Submit Lending Request**                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| **Actors**            | Beneficiary User, Department Head                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| **Pre-conditions**    | 1\. User authenticated with lending request permission. 2. Requested records exist with ACTIVE status.                                                                                                                                                                                                                                                                                                                                                                                                              |
| **Main Flow**         | 1\. User opens Lending > New Request. 2. User enters purpose/justification. 3. User searches for and adds records (by reference, barcode, or search). 4. System validates each record is ACTIVE and not already lent. 5. System calculates suggested due date based on doc type lending policy. 6. User reviews the request summary and submits. 7. System creates the LendingRequest with status PENDING. 8. System routes request to Archive Supervisor for approval. 9. System sends notification to supervisor. |
| **Alternative Flows** | 1\. Record already lent: System shows warning; User can still add but supervisor will see the conflict.                                                                                                                                                                                                                                                                                                                                                                                                             |
| **Post-conditions**   | 1\. Lending request created with status PENDING. 2. Supervisor receives approval notification.                                                                                                                                                                                                                                                                                                                                                                                                                      |

**UC-06-02: Process Return and Confirm Receipt**

| **Use Case ID**       | **UC-06-02**                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| --------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Use Case Name**     | **Process Return and Confirm Receipt**                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| **Actors**            | Archive Officer, Messenger                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| **Pre-conditions**    | 1\. Lending request in DISPATCHED or ACTIVE status. 2. All items physically returned to archive.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| **Main Flow**         | 1\. Archive Officer opens Lending > Active Loans. 2. Officer locates the lending request being returned. 3. Officer scans barcode of each returned record to confirm items. 4. System validates each scanned item against the lending request. 5. All items confirmed: Officer clicks "Confirm Return". 6. System updates each record status to ACTIVE. 7. System reassigns records to original box locations. 8. System creates location history entry for each record. 9. System calculates any overdue penalty days. 10. System closes the lending request with status RETURNED. |
| **Alternative Flows** | 1\. Partial return: Officer marks specific items returned; rest remain ACTIVE until fully returned.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| **Post-conditions**   | 1\. All items returned; records status ACTIVE. 2. Lending request closed. 3. Location history updated.                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |

# Module 7: Destruction & Migration Management (إدارة الإتلاف والترحيل)

## 7.1 Module Overview

The Destruction and Migration Management module handles the end-of-life and transfer processes for records that have reached or exceeded their retention period, or that need to be migrated to another archive center or storage medium. The module provides formal request workflows, multi-level approval, certificate generation, and automatic retention period monitoring.

## 7.2 Data Entities

**Entity: DestructionRequest**

Formal request to destroy archived records.

| **DestructionRequest** | | | |
| --- | | | | --- | --- | --- |

| **Attribute**     | **Type**    | **Required** | **Description**                                     |
| ----------------- | ----------- | ------------ | --------------------------------------------------- |
| **req_id**        | _UUID (PK)_ | **✓**        | Unique identifier                                   |
| **ref_number**    | _VARCHAR_   | **✓**        | Auto-generated (DST-YYYY-NNNNN)                     |
| **requester_id**  | _UUID (FK)_ | **✓**        | Initiating user                                     |
| **justification** | _TEXT_      | **✓**        | Reason for destruction                              |
| **status**        | _ENUM_      | **✓**        | PENDING, LEGAL_REVIEW, APPROVED, REJECTED, EXECUTED |
| **approved_by**   | _UUID (FK)_ | ○            | Final approver                                      |
| **executed_at**   | _TIMESTAMP_ | ○            | Destruction execution timestamp                     |
| **certificate**   | _VARCHAR_   | ○            | Path to destruction certificate PDF                 |

**Entity: DestructionItem**

Individual record in a destruction request.

| **DestructionItem** | | | |
| --- | | | | --- | --- | --- |

| **Attribute**     | **Type**    | **Required** | **Description**            |
| ----------------- | ----------- | ------------ | -------------------------- |
| **item_id**       | _UUID (PK)_ | **✓**        | Unique identifier          |
| **req_id**        | _UUID (FK)_ | **✓**        | Parent destruction request |
| **record_id**     | _UUID (FK)_ | **✓**        | Record to be destroyed     |
| **retention_end** | _DATE_      | **✓**        | Retention period end date  |

**Entity: MigrationRequest**

Request to migrate records to another system/location.

| **MigrationRequest** | | | |
| --- | | | | --- | --- | --- |

| **Attribute**      | **Type**    | **Required** | **Description**                           |
| ------------------ | ----------- | ------------ | ----------------------------------------- |
| **req_id**         | _UUID (PK)_ | **✓**        | Unique identifier                         |
| **ref_number**     | _VARCHAR_   | **✓**        | Auto-generated (MIG-YYYY-NNNNN)           |
| **destination**    | _VARCHAR_   | **✓**        | Target archive or system                  |
| **migration_type** | _ENUM_      | **✓**        | PHYSICAL, DIGITAL, BOTH                   |
| **status**         | _ENUM_      | **✓**        | PENDING, APPROVED, IN_PROGRESS, COMPLETED |

## 7.3 Functional Requirements

| **ID**   | **Functional Requirement**                                                                                     | **Priority** | **Notes / Business Rules**                                                       |
| -------- | -------------------------------------------------------------------------------------------------------------- | ------------ | -------------------------------------------------------------------------------- |
| **F7.1** | Define retention periods per document type; system auto-calculates retention end dates for all records.        | **HIGH**     | _Retention end = Archive Date + Retention Period._                               |
| **F7.2** | Automatically flag records whose retention end date is within 90 days.                                         | **HIGH**     | _Flagged records shown in Destruction Watchlist._                                |
| **F7.3** | Create destruction requests for expired records with justification.                                            | **HIGH**     | _Only records past retention end date eligible._                                 |
| **F7.4** | Route destruction requests through multi-level approval: Supervisor → Legal Officer → Center Director.         | **HIGH**     | _All levels must approve; single rejection blocks the request._                  |
| **F7.5** | Generate a formal destruction certificate (PDF) upon approval and execution.                                   | **HIGH**     | _Certificate includes: record list, approver signatures, date, legal reference._ |
| **F7.6** | Create migration requests specifying destination system/location and migration type (Physical, Digital, Both). | **MED**      | _Migration routes through simplified 2-step approval._                           |
| **F7.7** | After execution, update record status to DESTROYED or MIGRATED and record execution details.                   | **HIGH**     | _Destroyed records retained as metadata-only stubs for audit purposes._          |
| **F7.8** | Generate periodic reports of records approaching retention expiry.                                             | **MED**      | _Monthly automated report to Center Director._                                   |

## 7.4 Use Cases

**UC-07-01: Initiate Destruction Request for Expired Records**

| **Use Case ID**       | **UC-07-01**                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           |
| --------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Use Case Name**     | **Initiate Destruction Request for Expired Records**                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| **Actors**            | Archive Supervisor                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| **Pre-conditions**    | 1\. Records past retention end date exist. 2. Supervisor has destruction initiation permission.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| **Main Flow**         | 1\. Supervisor opens Destruction > Expired Records Watchlist. 2. System lists all records past retention end date with days-overdue count. 3. Supervisor selects records for destruction and clicks "Create Destruction Request". 4. System groups selected records into a new DestructionRequest. 5. Supervisor enters justification and references applicable legal basis. 6. System saves request with status PENDING and routes to Legal Officer. 7. Legal Officer reviews and approves. 8. System routes to Center Director for final approval. 9. Director approves; System changes status to APPROVED. 10. Supervisor marks request as EXECUTED. 11. System generates Destruction Certificate PDF. 12. System updates all included records status to DESTROYED. |
| **Alternative Flows** | 1\. Legal Officer rejects: Request status set to REJECTED with reason; initiator notified.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             |
| **Post-conditions**   | 1\. Records destroyed (metadata retained). 2. Destruction certificate archived. 3. Box occupancy updated.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |

# Module 8: Notifications & Alerts (التنبيهات والإشعارات)

## 8.1 Module Overview

The Notifications module provides in-app and email notification delivery for all significant system events. It supports automatic alerts for workflow task assignments, overdue lending returns, retention period expirations, SLA breaches, and capacity threshold warnings. Users can configure notification preferences and channels.

## 8.2 Data Entities

**Entity: Notification**

A notification message delivered to a user.

| **Notification** | | | |
| --- | | | | --- | --- | --- |

| **Attribute**  | **Type**    | **Required** | **Description**                                                                |
| -------------- | ----------- | ------------ | ------------------------------------------------------------------------------ |
| **notif_id**   | _UUID (PK)_ | **✓**        | Unique identifier                                                              |
| **user_id**    | _UUID (FK)_ | **✓**        | Target recipient                                                               |
| **type**       | _ENUM_      | **✓**        | TASK_ASSIGNED, APPROVED, REJECTED, OVERDUE, EXPIRY, SLA_BREACH, CAPACITY_ALERT |
| **title**      | _VARCHAR_   | **✓**        | Short notification title                                                       |
| **body**       | _TEXT_      | **✓**        | Notification body text                                                         |
| **link**       | _VARCHAR_   | ○            | Deep link to related entity                                                    |
| **is_read**    | _BOOLEAN_   | **✓**        | Read status                                                                    |
| **channel**    | _ENUM_      | **✓**        | IN_APP, EMAIL, BOTH                                                            |
| **created_at** | _TIMESTAMP_ | **✓**        | Creation timestamp                                                             |

**Entity: NotificationPreference**

User notification preference configuration.

| **NotificationPreference** | | | |
| --- | | | | --- | --- | --- |

| **Attribute**  | **Type**    | **Required** | **Description**           |
| -------------- | ----------- | ------------ | ------------------------- |
| **pref_id**    | _UUID (PK)_ | **✓**        | Unique identifier         |
| **user_id**    | _UUID (FK)_ | **✓**        | User reference            |
| **notif_type** | _ENUM_      | **✓**        | Notification type         |
| **channel**    | _ENUM_      | **✓**        | IN_APP, EMAIL, BOTH, NONE |

## 8.3 Functional Requirements

| **ID**   | **Functional Requirement**                                                            | **Priority** | **Notes / Business Rules**                                        |
| -------- | ------------------------------------------------------------------------------------- | ------------ | ----------------------------------------------------------------- |
| **F8.1** | Send in-app notifications for all workflow task assignments and completions.          | **HIGH**     | _In-app bell icon shows unread count; clickable to entity._       |
| **F8.2** | Send email notifications for critical events: approvals, rejections, overdue returns. | **HIGH**     | _HTML email template with system branding._                       |
| **F8.3** | Auto-generate overdue alerts when lending due date passes without return.             | **HIGH**     | _Alert sent to requester + department head + archive supervisor._ |
| **F8.4** | Alert archive officers when a record's retention period expires.                      | **HIGH**     | _30-day and 7-day advance warnings._                              |
| **F8.5** | Alert archive supervisor when storage occupancy exceeds configured threshold.         | **MED**      | _Threshold configurable; default 90%._                            |
| **F8.6** | Allow users to configure notification preferences per type and channel.               | **MED**      | _In-app, email, or both; can mute specific notification types._   |
| **F8.7** | Provide a notification history page with filter by type, date, and read status.       | **LOW**      | _Retain notification history for 1 year._                         |

## 8.4 Use Cases

**UC-08-01: Receive Overdue Lending Alert**

| **Use Case ID**       | **UC-08-01**                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
| --------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Use Case Name**     | **Receive Overdue Lending Alert**                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
| **Actors**            | System (Scheduled Job), Archive Supervisor                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| **Pre-conditions**    | 1\. Lending request passed due_date with status ACTIVE.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| **Main Flow**         | 1\. Scheduled job runs daily at 06:00. 2. System queries all LendingRequests with status ACTIVE and due_date < today. 3. For each overdue request: System creates Notification records for requester, dept head, and archive supervisor. 4. System sends email notifications (subject: "OVERDUE: Lending Request \[LND-...\]"). 5. In-app notification appears in user bell with red badge. 6. Supervisor opens the overdue notification and can view the request detail. 7. Supervisor can initiate escalation or contact the requester directly. |
| **Alternative Flows** | 1\. Email delivery failure: System retries 3 times; logs failure.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
| **Post-conditions**   | 1\. Overdue notification delivered via configured channels.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        |

# Module 9: Reports & Statistics (التقارير والإحصائيات)

## 9.1 Module Overview

The Reports module provides pre-built and custom analytical views of archive operations. It covers transfer activity, lending performance, destruction/migration statistics, physical storage inventory, user activity, and compliance reporting. Reports are filterable by date range, department, document type, and status, and can be exported to PDF and Excel.

## 9.2 Data Entities

**Entity: ReportDefinition**

Saved custom report configuration.

| **ReportDefinition** | | | |
| --- | | | | --- | --- | --- |

| **Attribute**  | **Type**    | **Required** | **Description**                                                             |
| -------------- | ----------- | ------------ | --------------------------------------------------------------------------- |
| **report_id**  | _UUID (PK)_ | **✓**        | Unique identifier                                                           |
| **name**       | _VARCHAR_   | **✓**        | Report name                                                                 |
| **type**       | _ENUM_      | **✓**        | TRANSFERS, LENDING, DESTRUCTION, INVENTORY, USER_ACTIVITY, CAPACITY, CUSTOM |
| **created_by** | _UUID (FK)_ | **✓**        | Author user                                                                 |
| **filters**    | _JSONB_     | **✓**        | Saved filter configuration                                                  |
| **schedule**   | _JSONB_     | ○            | Auto-run schedule (cron)                                                    |
| **recipients** | _UUID\[\]_  | ○            | Email recipients for scheduled runs                                         |

## 9.3 Functional Requirements

| **ID**    | **Functional Requirement**                                                                           | **Priority** | **Notes / Business Rules**                                    |
| --------- | ---------------------------------------------------------------------------------------------------- | ------------ | ------------------------------------------------------------- |
| **F9.1**  | Archive Transfer Report: records transferred between locations in a date range.                      | **HIGH**     | _Output: PDF, Excel. Filterable by room, date, officer._      |
| **F9.2**  | Lending Activity Report: all lending requests with status, duration, overdue count.                  | **HIGH**     | _Grouped by department and document type._                    |
| **F9.3**  | Destruction & Migration Report: executed destruction/migration requests with certificate references. | **HIGH**     | _Filterable by date, document type, approver._                |
| **F9.4**  | Records Inventory Report: full count of active records by type, category, location.                  | **HIGH**     | _Cross-reference with physical storage for audit._            |
| **F9.5**  | Storage Capacity Report: occupancy per room, shelf, and box with percentage fill.                    | **HIGH**     | _Color-coded capacity visualization._                         |
| **F9.6**  | User Activity Report: actions performed per user (registrations, lending, searches).                 | **MED**      | _Admin only; GDPR/privacy considerations apply._              |
| **F9.7**  | Overdue Records Report: all currently overdue lending requests with overdue days.                    | **HIGH**     | _Real-time data; always reflects current state._              |
| **F9.8**  | Retention Expiry Report: records within 90 days of retention expiry.                                 | **HIGH**     | _Supports Destruction module watchlist._                      |
| **F9.9**  | Schedule reports for automatic generation and email delivery.                                        | **MED**      | _Daily, weekly, or monthly schedule; CRON expression._        |
| **F9.10** | Export any report to PDF and Excel formats.                                                          | **HIGH**     | _Max 50,000 rows; large reports split across multiple pages._ |

## 9.4 Use Cases

**UC-09-01: Generate Monthly Lending Activity Report**

| **Use Case ID**       | **UC-09-01**                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| --------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Use Case Name**     | **Generate Monthly Lending Activity Report**                                                                                                                                                                                                                                                                                                                                                                                                                            |
| **Actors**            | Archive Supervisor, Center Director                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| **Pre-conditions**    | 1\. Lending requests exist for the selected month.                                                                                                                                                                                                                                                                                                                                                                                                                      |
| **Main Flow**         | 1\. User navigates to Reports > Lending Activity. 2. User selects date range (current month) and optionally filters by department. 3. System queries all lending requests in the range. 4. System aggregates: total requests, approved, rejected, returned on time, overdue. 5. System renders the report with charts (bar chart: status breakdown, line chart: trends). 6. User exports to PDF. 7. System generates formatted PDF with organization header and charts. |
| **Alternative Flows** | 1\. No data: System shows empty report with explanation.                                                                                                                                                                                                                                                                                                                                                                                                                |
| **Post-conditions**   | 1\. Report generated and available for download.                                                                                                                                                                                                                                                                                                                                                                                                                        |

# Module 10: Permissions & Security (إدارة الصلاحيات والأمن)

## 10.1 Module Overview

The Permissions and Security module implements a multi-layer access control model governing every user interaction with the system. It manages user accounts, role definitions, permission assignments, and document-level confidentiality enforcement. The module supports role-based access control (RBAC) with permission groups, per-record secrecy level enforcement, and full access audit logging.

## 10.2 Data Entities

**Entity: User**

System user account.

| **User** | | | |
| --- | | | | --- | --- | --- |

| **Attribute**     | **Type**    | **Required** | **Description**                      |
| ----------------- | ----------- | ------------ | ------------------------------------ |
| **user_id**       | _UUID (PK)_ | **✓**        | Unique identifier                    |
| **username**      | _VARCHAR_   | **✓**        | Unique username                      |
| **email**         | _VARCHAR_   | **✓**        | Unique email address                 |
| **name_ar**       | _VARCHAR_   | **✓**        | Arabic full name                     |
| **name_en**       | _VARCHAR_   | **✓**        | English full name                    |
| **dept_id**       | _UUID (FK)_ | ○            | Primary department                   |
| **branch_id**     | _UUID (FK)_ | ○            | Primary branch                       |
| **clearance_lvl** | _ENUM_      | **✓**        | PUBLIC, INTERNAL, SECRET, TOP_SECRET |
| **is_active**     | _BOOLEAN_   | **✓**        | Account active status                |
| **last_login**    | _TIMESTAMP_ | ○            | Last successful login                |

**Entity: Role**

Named permission bundle assigned to users.

| **Role** | | | |
| --- | | | | --- | --- | --- |

| **Attribute**   | **Type**    | **Required** | **Description**                       |
| --------------- | ----------- | ------------ | ------------------------------------- |
| **role_id**     | _UUID (PK)_ | **✓**        | Unique identifier                     |
| **name_ar**     | _VARCHAR_   | **✓**        | Arabic role name                      |
| **name_en**     | _VARCHAR_   | **✓**        | English role name                     |
| **role_type**   | _ENUM_      | **✓**        | MULTI_USER, ONE_PER_DEPT, ONE_PER_ORG |
| **description** | _TEXT_      | ○            | Role description                      |

**Entity: Permission**

Granular action permission.

| **Permission** | | | |
| --- | | | | --- | --- | --- |

| **Attribute** | **Type**    | **Required** | **Description**                   |
| ------------- | ----------- | ------------ | --------------------------------- |
| **perm_id**   | _UUID (PK)_ | **✓**        | Unique identifier                 |
| **perm_key**  | _VARCHAR_   | **✓**        | Unique key (e.g., create_record)  |
| **module**    | _VARCHAR_   | **✓**        | Module this permission belongs to |
| **label_ar**  | _VARCHAR_   | **✓**        | Arabic label                      |
| **label_en**  | _VARCHAR_   | **✓**        | English label                     |

**Entity: AccessLog**

Audit trail of user access and actions.

| **AccessLog** | | | |
| --- | | | | --- | --- | --- |

| **Attribute**   | **Type**    | **Required** | **Description**      |
| --------------- | ----------- | ------------ | -------------------- |
| **log_id**      | _UUID (PK)_ | **✓**        | Unique identifier    |
| **user_id**     | _UUID (FK)_ | **✓**        | Acting user          |
| **action**      | _VARCHAR_   | **✓**        | Action performed     |
| **entity_type** | _VARCHAR_   | **✓**        | Entity type affected |
| **entity_id**   | _UUID_      | **✓**        | Entity ID affected   |
| **ip_address**  | _VARCHAR_   | ○            | Client IP            |
| **timestamp**   | _TIMESTAMP_ | **✓**        | Action timestamp     |

## 10.3 Functional Requirements

| **ID**    | **Functional Requirement**                                                                                     | **Priority** | **Notes / Business Rules**                                               |
| --------- | -------------------------------------------------------------------------------------------------------------- | ------------ | ------------------------------------------------------------------------ |
| **F10.1** | Create, edit, activate, and deactivate user accounts with bilingual names, department, and branch assignments. | **HIGH**     | _Deactivated users lose access; their records are retained._             |
| **F10.2** | Define roles with permission sets; assign roles to users.                                                      | **HIGH**     | _Users can hold multiple roles; permissions are additive._               |
| **F10.3** | Create permission groups (bundles) and assign to users or roles.                                               | **HIGH**     | _Group updates propagate to all assignees._                              |
| **F10.4** | Enforce document-level access based on user clearance vs. record secrecy level.                                | **HIGH**     | _User cannot view/access records above their clearance._                 |
| **F10.5** | Control archive room and shelf access by role or department.                                                   | **HIGH**     | _Room-level permission restricts who can add/view records in that room._ |
| **F10.6** | Log all user actions with timestamp, IP address, and entity reference.                                         | **HIGH**     | _Logs are immutable and retained for minimum 5 years._                   |
| **F10.7** | Integrate with external LDAP/Active Directory for user authentication.                                         | **MED**      | _SSO fallback to local auth if LDAP unavailable._                        |
| **F10.8** | Password policy enforcement: complexity, expiry, and lockout rules.                                            | **HIGH**     | _Configurable by admin; min 8 chars, lockout after 5 failed attempts._   |

## 10.4 Use Cases

**UC-10-01: Create New User with Role Assignment**

| **Use Case ID**       | **UC-10-01**                                                                                                                                                                                                                                                                                                                                                                                                          |
| --------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Use Case Name**     | **Create New User with Role Assignment**                                                                                                                                                                                                                                                                                                                                                                              |
| **Actors**            | System Administrator                                                                                                                                                                                                                                                                                                                                                                                                  |
| **Pre-conditions**    | 1\. Admin has user management permission. 2. Target role exists.                                                                                                                                                                                                                                                                                                                                                      |
| **Main Flow**         | 1\. Admin navigates to Users > Add New User. 2. Admin enters: username, email, name (AR/EN), department, branch, clearance level. 3. Admin assigns one or more roles. 4. System validates uniqueness of username and email. 5. System creates user account with secure temporary password. 6. System sends welcome email with login credentials. 7. System links user to relevant system folders based on department. |
| **Alternative Flows** | 1\. Duplicate email: System shows error. 2. Role type ONE_PER_DEPT already filled: System warns admin.                                                                                                                                                                                                                                                                                                                |
| **Post-conditions**   | 1\. User account created and active. 2. User receives welcome email. 3. Role permissions effective immediately.                                                                                                                                                                                                                                                                                                       |

# Module 11: Technical Integration (التكامل التقني)

## 11.1 Module Overview

The Technical Integration module defines all interfaces for external system connectivity. The archive center system exposes a RESTful API for external integrations, supports webhook-based event notifications, and provides connectors for administrative communications systems, electronic archiving platforms, and email infrastructure.

## 11.2 Data Entities

**Entity: APIKey**

API authentication key for external integrations.

| **APIKey** | | | |
| --- | | | | --- | --- | --- |

| **Attribute**   | **Type**    | **Required** | **Description**        |
| --------------- | ----------- | ------------ | ---------------------- |
| **key_id**      | _UUID (PK)_ | **✓**        | Unique identifier      |
| **name**        | _VARCHAR_   | **✓**        | Integration name       |
| **key_hash**    | _VARCHAR_   | **✓**        | Hashed API key         |
| **permissions** | _JSON_      | **✓**        | Allowed API operations |
| **is_active**   | _BOOLEAN_   | **✓**        | Active status          |
| **expires_at**  | _DATE_      | ○            | Expiry date            |

## 11.3 Functional Requirements

| **ID**    | **Functional Requirement**                                                                                   | **Priority** | **Notes / Business Rules**                                         |
| --------- | ------------------------------------------------------------------------------------------------------------ | ------------ | ------------------------------------------------------------------ |
| **F11.1** | Expose a comprehensive REST API covering all core operations: record CRUD, search, lending, reports.         | **HIGH**     | _API versioned (v1, v2); OpenAPI/Swagger documentation generated._ |
| **F11.2** | API key management: generate, revoke, and permission-scope API keys for external systems.                    | **HIGH**     | _Each API key scoped to specific operations._                      |
| **F11.3** | Webhook support: publish events to external systems on record creation, status change, approval completion.  | **MED**      | _Webhook endpoint configurable per integration._                   |
| **F11.4** | Integration with administrative communications system: receive incoming documents as archive candidates.     | **HIGH**     | _Via REST API push or message queue._                              |
| **F11.5** | Integration with electronic archiving system (e.g., existing DMS): import/export records in standard format. | **HIGH**     | _Supports ISO 15489 metadata exchange format._                     |
| **F11.6** | SMTP email integration for system notification delivery.                                                     | **HIGH**     | _Configurable SMTP settings; TLS required._                        |
| **F11.7** | LDAP/Active Directory integration for centralized user authentication.                                       | **MED**      | _User provisioning via LDAP sync; local accounts as fallback._     |

## 11.4 Use Cases

**UC-11-01: Receive Document from Admin Communications System**

| **Use Case ID**       | **UC-11-01**                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| --------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Use Case Name**     | **Receive Document from Admin Communications System**                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
| **Actors**            | External System (Admin Comms), System (API)                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| **Pre-conditions**    | 1\. Integration API key configured. 2. Document type mapping defined.                                                                                                                                                                                                                                                                                                                                                                                                                                       |
| **Main Flow**         | 1\. Admin communications system sends HTTP POST to /api/v1/records/import. 2. Payload includes: document metadata, file attachment (base64 or URL), classification hints. 3. System validates API key and request schema. 4. System maps incoming metadata to internal document type/category. 5. System creates a record with status PENDING_CLASSIFICATION. 6. System notifies archive officer to review and complete classification. 7. System returns 201 Created with the new record reference number. |
| **Alternative Flows** | 1\. Invalid API key: Return 401 Unauthorized. 2. Missing required metadata: Return 400 with validation errors.                                                                                                                                                                                                                                                                                                                                                                                              |
| **Post-conditions**   | 1\. Record created in system; officer notified for classification.                                                                                                                                                                                                                                                                                                                                                                                                                                          |

# Module 12: Key Performance Indicators (KPIs) (ملخص مؤشرات الأداء الرئيسية)

## 12.1 Module Overview

The KPI module provides configurable performance dashboards for each organizational level within the archive center. It aggregates operational data from all other modules to compute and display KPIs relevant to the Center Director, Archive Supervisor, Archive Officer, and System Administrator. KPIs cover operational throughput, lending performance, storage utilization, and governance compliance.

## 12.2 Data Entities

**Entity: KPIDefinition**

Configuration of a tracked KPI metric.

| **KPIDefinition** | | | |
| --- | | | | --- | --- | --- |

| **Attribute**    | **Type**    | **Required** | **Description**                     |
| ---------------- | ----------- | ------------ | ----------------------------------- |
| **kpi_id**       | _UUID (PK)_ | **✓**        | Unique identifier                   |
| **name_ar**      | _VARCHAR_   | **✓**        | Arabic KPI name                     |
| **name_en**      | _VARCHAR_   | **✓**        | English KPI name                    |
| **formula**      | _TEXT_      | **✓**        | Calculation logic                   |
| **target_value** | _DECIMAL_   | ○            | Target/benchmark value              |
| **unit**         | _VARCHAR_   | **✓**        | Unit (%, count, days)               |
| **role_scope**   | _ENUM_      | **✓**        | Which role dashboard shows this KPI |

**Entity: KPISnapshot**

Periodic captured KPI value.

| **KPISnapshot** | | | |
| --- | | | | --- | --- | --- |

| **Attribute**   | **Type**    | **Required** | **Description**                 |
| --------------- | ----------- | ------------ | ------------------------------- |
| **snap_id**     | _UUID (PK)_ | **✓**        | Unique identifier               |
| **kpi_id**      | _UUID (FK)_ | **✓**        | KPI reference                   |
| **value**       | _DECIMAL_   | **✓**        | Computed value at snapshot time |
| **period**      | _DATE_      | **✓**        | Snapshot period (month-start)   |
| **computed_at** | _TIMESTAMP_ | **✓**        | Computation timestamp           |

## 12.3 Functional Requirements

| **ID**    | **Functional Requirement**                                                                    | **Priority** | **Notes / Business Rules**                            |
| --------- | --------------------------------------------------------------------------------------------- | ------------ | ----------------------------------------------------- |
| **F12.1** | Operational KPIs: total records archived, daily/monthly intake rate, archiving backlog count. | **HIGH**     | _Shown on Archive Officer and Supervisor dashboards._ |
| **F12.2** | Lending KPIs: total active loans, on-time return rate (%), average lending duration.          | **HIGH**     | _SLA target for return rate configurable._            |
| **F12.3** | Storage KPIs: current occupancy % per room, average shelf utilization, projected full date.   | **HIGH**     | _Trend chart showing occupancy growth over time._     |
| **F12.4** | Destruction/Migration KPIs: records past retention end, destruction execution rate.           | **MED**      | _Governance compliance metric._                       |
| **F12.5** | Governance KPIs: access policy violations, unapproved exceptions, audit completeness score.   | **HIGH**     | _Center Director dashboard focus._                    |
| **F12.6** | Each KPI shows current value, trend (up/down/stable), and comparison to target.               | **MED**      | _Traffic-light coloring (green/amber/red vs target)._ |
| **F12.7** | KPI history: view trend charts for any KPI over the past 12 months.                           | **LOW**      | _Monthly granularity for historical view._            |

## 12.4 Use Cases

**UC-12-01: View Center Director Dashboard**

| **Use Case ID**       | **UC-12-01**                                                                                                                                                                                                                                                                                                                                                                                                                                       |
| --------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Use Case Name**     | **View Center Director Dashboard**                                                                                                                                                                                                                                                                                                                                                                                                                 |
| **Actors**            | Center Director                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| **Pre-conditions**    | 1\. Director role has dashboard access. 2. KPI data computed for current period.                                                                                                                                                                                                                                                                                                                                                                   |
| **Main Flow**         | 1\. Director logs in; system detects role and shows Director Dashboard. 2. Dashboard displays Governance Score, Compliance Rate, Total Active Records count. 3. Each KPI shows current value + trend arrow + color status vs target. 4. Director clicks on Governance Score KPI. 5. System shows drill-down: breakdown of violations, unapproved exceptions, audit findings. 6. Director can export dashboard snapshot to PDF for board reporting. |
| **Alternative Flows** | 1\. KPI data not yet computed: System shows last available value with timestamp.                                                                                                                                                                                                                                                                                                                                                                   |
| **Post-conditions**   | 1\. Director has operational visibility into archive performance.                                                                                                                                                                                                                                                                                                                                                                                  |

# Module 13: Organizational Structure (الهيكل التنظيمي لمركز الوثائق والمحفوظات)

## 13.1 Module Overview

The Organizational Structure module defines the administrative hierarchy of the archive center within its parent organization. It models four levels - Supervisory, Operational, Technical, and Organizational (Beneficiary) - and maps each level to system roles and permissions. This module is foundational to workflow routing, KPI scoping, and access control.

## 13.2 Data Entities

**Entity: Organization**

The parent organization owning the archive center.

| **Organization** | | | |
| --- | | | | --- | --- | --- |

| **Attribute** | **Type**    | **Required** | **Description**           |
| ------------- | ----------- | ------------ | ------------------------- |
| **org_id**    | _UUID (PK)_ | **✓**        | Unique identifier         |
| **name_ar**   | _VARCHAR_   | **✓**        | Arabic organization name  |
| **name_en**   | _VARCHAR_   | **✓**        | English organization name |
| **code**      | _VARCHAR_   | **✓**        | Unique organization code  |

**Entity: Branch**

Physical or logical division within the organization.

| **Branch** | | | |
| --- | | | | --- | --- | --- |

| **Attribute** | **Type**    | **Required** | **Description**     |
| ------------- | ----------- | ------------ | ------------------- |
| **branch_id** | _UUID (PK)_ | **✓**        | Unique identifier   |
| **org_id**    | _UUID (FK)_ | **✓**        | Parent organization |
| **name_ar**   | _VARCHAR_   | **✓**        | Arabic branch name  |
| **code**      | _VARCHAR_   | **✓**        | Unique branch code  |
| **is_active** | _BOOLEAN_   | **✓**        | Active status       |

**Entity: Department**

Functional unit within a branch.

| **Department** | | | |
| --- | | | | --- | --- | --- |

| **Attribute**   | **Type**    | **Required** | **Description**                   |
| --------------- | ----------- | ------------ | --------------------------------- |
| **dept_id**     | _UUID (PK)_ | **✓**        | Unique identifier                 |
| **branch_id**   | _UUID (FK)_ | **✓**        | Parent branch                     |
| **parent_dept** | _UUID (FK)_ | ○            | Parent department (for hierarchy) |
| **name_ar**     | _VARCHAR_   | **✓**        | Arabic department name            |
| **code**        | _VARCHAR_   | **✓**        | Unique department code            |
| **assignee_id** | _UUID (FK)_ | ○            | Department responsible user       |

## 13.3 Functional Requirements

| **ID**    | **Functional Requirement**                                                                           | **Priority** | **Notes / Business Rules**                                                |
| --------- | ---------------------------------------------------------------------------------------------------- | ------------ | ------------------------------------------------------------------------- |
| **F13.1** | Configure the organization with branches and departments.                                            | **HIGH**     | _Single-organization model; supports multiple branches._                  |
| **F13.2** | Define Supervisory Level: Center Director role with governance and compliance visibility.            | **HIGH**     | _Director sees all KPIs, all reports, and all records._                   |
| **F13.3** | Define Operational Level: Archive Supervisor and Archive Officer roles with task-based access.       | **HIGH**     | _Officers restricted to their branch/department scope._                   |
| **F13.4** | Define Technical Level: System Administrator with full configuration access.                         | **HIGH**     | _Admin has no operational data access by default (separation of duties)._ |
| **F13.5** | Define Organizational Level: Beneficiary departments with read/lending access to their records only. | **HIGH**     | _Beneficiary departments see only records linked to their department._    |
| **F13.6** | Assign department responsible to each department; they gain department-wide visibility.              | **MED**      | _Department responsible can delegate to subordinates._                    |

## 13.4 Use Cases

**UC-13-01: Onboard New Beneficiary Department**

| **Use Case ID**     | **UC-13-01**                                                                                                                                                                                                                                                                                                                                                            |
| ------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Use Case Name**   | **Onboard New Beneficiary Department**                                                                                                                                                                                                                                                                                                                                  |
| **Actors**          | System Administrator                                                                                                                                                                                                                                                                                                                                                    |
| **Pre-conditions**  | 1\. Branch exists. 2. User accounts for department members ready.                                                                                                                                                                                                                                                                                                       |
| **Main Flow**       | 1\. Admin navigates to Organization > Departments > Add New. 2. Admin creates department with name (AR/EN), code, parent department. 3. Admin assigns department responsible user. 4. System creates department and links to branch. 5. Admin assigns "Beneficiary" role to all department users. 6. System scopes all lending and search to this department's records. |
| **Post-conditions** | 1\. Department available; users can request lending for their records.                                                                                                                                                                                                                                                                                                  |

# Module 14: Workflow System (نظام سير العمل)

## 14.1 Module Overview

The Workflow System module provides the business process automation engine for the archive center. It includes a visual no-code workflow designer for creating and modifying approval processes, a step execution engine, and four pre-built workflows: Archive Intake, Lending Request, Destruction Approval, and Migration Request. Each workflow is versioned, publishable, and linked to role-based task routing.

## 14.2 Data Entities

**Entity: Workflow**

Definition of a business process.

| **Workflow** | | | |
| --- | | | | --- | --- | --- |

| **Attribute**  | **Type**    | **Required** | **Description**                                    |
| -------------- | ----------- | ------------ | -------------------------------------------------- |
| **wf_id**      | _UUID (PK)_ | **✓**        | Unique identifier                                  |
| **name_ar**    | _VARCHAR_   | **✓**        | Arabic workflow name                               |
| **name_en**    | _VARCHAR_   | **✓**        | English workflow name                              |
| **type**       | _ENUM_      | **✓**        | ARCHIVING, LENDING, DESTRUCTION, MIGRATION, CUSTOM |
| **status**     | _ENUM_      | **✓**        | DRAFT, PUBLISHED, ARCHIVED                         |
| **version**    | _INT_       | **✓**        | Version number (auto-increment)                    |
| **created_by** | _UUID (FK)_ | **✓**        | Designer user                                      |

**Entity: WorkflowStep**

A processing step within a workflow.

| **WorkflowStep** | | | |
| --- | | | | --- | --- | --- |

| **Attribute**     | **Type**    | **Required** | **Description**                           |
| ----------------- | ----------- | ------------ | ----------------------------------------- |
| **step_id**       | _UUID (PK)_ | **✓**        | Unique identifier                         |
| **wf_id**         | _UUID (FK)_ | **✓**        | Parent workflow                           |
| **step_type**     | _ENUM_      | **✓**        | TRIGGER, HUMAN, SYSTEM, DECISION, WATCHER |
| **name_ar**       | _VARCHAR_   | **✓**        | Step name                                 |
| **assignee_type** | _ENUM_      | ○            | ROLE, USER, DEPARTMENT                    |
| **sla_hours**     | _INT_       | ○            | SLA hours for this step                   |

**Entity: WorkflowExecution**

Runtime instance of a workflow.

| **WorkflowExecution** | | | |
| --- | | | | --- | --- | --- |

| **Attribute**    | **Type**    | **Required** | **Description**                       |
| ---------------- | ----------- | ------------ | ------------------------------------- |
| **exec_id**      | _UUID (PK)_ | **✓**        | Unique identifier                     |
| **wf_id**        | _UUID (FK)_ | **✓**        | Workflow being executed               |
| **entity_type**  | _VARCHAR_   | **✓**        | LENDING_REQUEST, DESTRUCTION_REQ etc  |
| **entity_id**    | _UUID (FK)_ | **✓**        | Entity driving the workflow           |
| **status**       | _ENUM_      | **✓**        | RUNNING, COMPLETED, FAILED, CANCELLED |
| **current_step** | _UUID (FK)_ | ○            | Current active step                   |
| **started_at**   | _TIMESTAMP_ | **✓**        | Start timestamp                       |
| **completed_at** | _TIMESTAMP_ | ○            | Completion timestamp                  |

## 14.3 Functional Requirements

| **ID**    | **Functional Requirement**                                                                                                            | **Priority** | **Notes / Business Rules**                                              |
| --------- | ------------------------------------------------------------------------------------------------------------------------------------- | ------------ | ----------------------------------------------------------------------- |
| **F14.1** | Visual GUI workflow designer with drag-and-drop step placement and edge connections.                                                  | **HIGH**     | _No-code; admin configures without developer support._                  |
| **F14.2** | Support step types: TRIGGER, HUMAN STEP (approval/form), DECISION (if/else branching), SYSTEM STEP (auto action), WATCHER (observer). | **HIGH**     | _Human Step and Trigger required for Phase 1; others in Phase 2._       |
| **F14.3** | Pre-built Archiving Intake workflow: Trigger → Data Entry → Review → Approve → Location Assignment.                                   | **HIGH**     | _Default workflow; customizable per org requirements._                  |
| **F14.4** | Pre-built Lending Request workflow: Trigger → Requester Input → Supervisor Approval → Archive Officer Dispatch → Return Confirmation. | **HIGH**     | _Multi-step with SLA at each step._                                     |
| **F14.5** | Pre-built Destruction Approval workflow: Supervisor → Legal Review → Director Approval → Execution.                                   | **HIGH**     | _All three levels must approve; single rejection blocks._               |
| **F14.6** | Pre-built Migration Request workflow: Supervisor → Director Approval → Technical Execution.                                           | **MED**      | _Simplified 2-step approval._                                           |
| **F14.7** | Workflow versioning: DRAFT → PUBLISHED → ARCHIVED lifecycle; only one PUBLISHED version at a time.                                    | **HIGH**     | _Published workflows cannot be modified; create new version to change._ |
| **F14.8** | Configure SLA per step; generate alerts when SLA is approaching or breached.                                                          | **HIGH**     | _SLA breach escalates to supervisor automatically._                     |

## 14.4 Use Cases

**UC-14-01: Design and Publish Custom Approval Workflow**

| **Use Case ID**       | **UC-14-01**                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| --------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Use Case Name**     | **Design and Publish Custom Approval Workflow**                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             |
| **Actors**            | System Administrator                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| **Pre-conditions**    | 1\. Roles and departments exist. 2. Templates defined for form steps.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
| **Main Flow**         | 1\. Admin opens Workflow Designer > Create New Workflow. 2. Admin enters workflow name (AR/EN) and type. 3. Admin drags Trigger node onto canvas; configures trigger type (MANUAL). 4. Admin drags Human Step node; configures assignee (by role: Archive Supervisor), SLA (48h), actions (Approve/Reject). 5. Admin connects Trigger → Human Step with an edge. 6. Admin adds Decision node for branching (Approved path / Rejected path). 7. Admin adds final Human Step for archive officer confirmation. 8. Admin validates the workflow (system checks connectivity and terminal steps). 9. Admin publishes the workflow. 10. Workflow becomes available to end users. |
| **Alternative Flows** | 1\. Validation errors: System shows specific issues; Admin must fix before publishing.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| **Post-conditions**   | 1\. Workflow published; available in Start New for authorized users.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        |

# Module 15: Structure-KPI Linking (ربط الهيكل بمؤشرات الأداء)

## 15.1 Module Overview

The Structure-KPI Linking module connects each organizational level to its relevant performance indicators, creating role-filtered KPI dashboards. Rather than a one-size-fits-all view, each user role sees only the KPIs relevant to their function: operational KPIs for officers, governance KPIs for directors, SLA KPIs for officers, and security KPIs for system admins.

## 15.2 Data Entities

**Entity: RoleKPIMapping**

Maps KPI definitions to organizational roles.

| **RoleKPIMapping** | | | |
| --- | | | | --- | --- | --- |

| **Attribute**     | **Type**    | **Required** | **Description**               |
| ----------------- | ----------- | ------------ | ----------------------------- |
| **map_id**        | _UUID (PK)_ | **✓**        | Unique identifier             |
| **role_id**       | _UUID (FK)_ | **✓**        | Role reference                |
| **kpi_id**        | _UUID (FK)_ | **✓**        | KPI reference                 |
| **display_order** | _INT_       | **✓**        | Display position in dashboard |
| **is_primary**    | _BOOLEAN_   | **✓**        | Primary KPI for this role     |

## 15.3 Functional Requirements

| **ID**    | **Functional Requirement**                                                                                          | **Priority** | **Notes / Business Rules**                                     |
| --------- | ------------------------------------------------------------------------------------------------------------------- | ------------ | -------------------------------------------------------------- |
| **F15.1** | Center Director dashboard shows: Governance Score, Compliance Rate, Total Active Records, Destruction Backlog.      | **HIGH**     | _All governance-level KPIs; no operational detail._            |
| **F15.2** | Archive Supervisor dashboard shows: Daily Intake, Overdue Loans, Storage Occupancy, Pending Approvals.              | **HIGH**     | _Operational and supervisory KPIs._                            |
| **F15.3** | Archive Officer dashboard shows: My Tasks Today, Records Registered (today/week), SLA Compliance Rate, Return Rate. | **HIGH**     | _Task-level operational KPIs._                                 |
| **F15.4** | System Administrator dashboard shows: Active Users, API Call Volume, System Errors, Last Backup Status.             | **MED**      | _Technical/infrastructure KPIs; no operational data._          |
| **F15.5** | Each role dashboard allows KPI customization: add/remove KPIs within permitted set.                                 | **LOW**      | _Customization persists per user; admin can reset to default._ |

## 15.4 Use Cases

**UC-15-01: Configure KPI Dashboard for Archive Supervisor**

| **Use Case ID**     | **UC-15-01**                                                                                                                                                                                                                                                                                                                                                                                                      |
| ------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Use Case Name**   | **Configure KPI Dashboard for Archive Supervisor**                                                                                                                                                                                                                                                                                                                                                                |
| **Actors**          | System Administrator                                                                                                                                                                                                                                                                                                                                                                                              |
| **Pre-conditions**  | 1\. Archive Supervisor role exists. 2. KPI definitions exist.                                                                                                                                                                                                                                                                                                                                                     |
| **Main Flow**       | 1\. Admin navigates to KPI Configuration > Role Mapping. 2. Admin selects Archive Supervisor role. 3. System shows all available KPIs with current mapping status. 4. Admin toggles which KPIs appear on the Supervisor dashboard. 5. Admin sets display order for each KPI. 6. Admin marks one KPI as "primary" (shown in summary card). 7. System saves mapping; next supervisor login shows updated dashboard. |
| **Post-conditions** | 1\. Archive Supervisor sees updated KPI dashboard on next login.                                                                                                                                                                                                                                                                                                                                                  |

# 6\. Entity-Relationship Diagram & Data Model

## 6.1 Entity Catalog

The table below lists all primary entities defined across the 15 DACMS modules, their defining module, required attributes, and a brief description.

| **Entity Name**        | **Module** | **Module Name**                    | **Required Attributes**                                                                                               | **Description**                                             |
| ---------------------- | ---------- | ---------------------------------- | --------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------- |
| ArchiveRoom            | M1         | Archive Structure Management       | room_id, name_ar, name_en, room_code, capacity, is_active                                                             | Top-level physical space within the archive center.         |
| ArchiveRow             | M1         | Archive Structure Management       | row_id, room_id, row_code, position, capacity                                                                         | A row within an archive room, containing cabinets.          |
| ArchiveCabinet         | M1         | Archive Structure Management       | cabinet_id, row_id, cabinet_code, shelf_count                                                                         | A cabinet (كبينة) within a row.                             |
| ArchiveShelf           | M1         | Archive Structure Management       | shelf_id, cabinet_id, shelf_code, capacity                                                                            | A shelf (رف) within a cabinet.                              |
| ArchiveBox             | M1         | Archive Structure Management       | box_id, shelf_id, box_code, label                                                                                     | A physical storage box (صندوق) placed on a shelf.           |
| DocumentType           | M2         | Data Models & Metadata Management  | doctype_id, name_ar, name_en, code, is_active                                                                         | Top-level classification type for records.                  |
| DocumentCategory       | M2         | Data Models & Metadata Management  | cat_id, doctype_id, name_ar, name_en, level, code                                                                     | Hierarchical classification category (Main / Sub / SubSub). |
| MetadataField          | M2         | Data Models & Metadata Management  | field_id, field_key, label_ar, label_en, field_type, is_required                                                      | Reusable metadata field definition.                         |
| RetentionPolicy        | M2         | Data Models & Metadata Management  | policy_id, doctype_id, period_years, action_after                                                                     | Retention rules per document type.                          |
| Record                 | M3         | Records Registration & Archiving   | record_id, ref_number, title_ar, doctype_id, category_id, status, issue_date, archive_date, secrecy_level, created_by | Core archivable item (paper or digital origin).             |
| RecordFile             | M3         | Records Registration & Archiving   | file_id, record_id, filename, file_type, storage_path, size_bytes, upload_date, is_primary                            | Digital file attachment associated with a record.           |
| LocationHistory        | M3         | Records Registration & Archiving   | hist_id, record_id, to_box, moved_by, moved_at                                                                        | Audit trail of physical location changes for a record.      |
| SearchQuery            | M4         | Search & Retrieval                 | query_id, name, user_id, filters, created_at                                                                          | Saved search query for reuse.                               |
| BarcodeLabel           | M5         | Barcode & Coding Management        | barcode_id, entity_type, entity_id, barcode_val, barcode_type, generated_at, is_active                                | Generated barcode for a physical archive entity.            |
| PrintJob               | M5         | Barcode & Coding Management        | job_id, created_by, label_ids, status, print_format, queued_at                                                        | Batch print job for multiple barcode labels.                |
| LendingRequest         | M6         | Lending & Requests Management      | request_id, ref_number, requester_id, dept_id, purpose, status, requested_at                                          | A request to borrow one or more records.                    |
| LendingItem            | M6         | Lending & Requests Management      | item_id, request_id, record_id, status                                                                                | Individual record within a lending request.                 |
| MessengerDispatch      | M6         | Lending & Requests Management      | dispatch_id, request_id, messenger_id, direction                                                                      | Dispatch record for messenger handling.                     |
| DestructionRequest     | M7         | Destruction & Migration Management | req_id, ref_number, requester_id, justification, status                                                               | Formal request to destroy archived records.                 |
| DestructionItem        | M7         | Destruction & Migration Management | item_id, req_id, record_id, retention_end                                                                             | Individual record in a destruction request.                 |
| MigrationRequest       | M7         | Destruction & Migration Management | req_id, ref_number, destination, migration_type, status                                                               | Request to migrate records to another system/location.      |
| Notification           | M8         | Notifications & Alerts             | notif_id, user_id, type, title, body, is_read, channel, created_at                                                    | A notification message delivered to a user.                 |
| NotificationPreference | M8         | Notifications & Alerts             | pref_id, user_id, notif_type, channel                                                                                 | User notification preference configuration.                 |
| ReportDefinition       | M9         | Reports & Statistics               | report_id, name, type, created_by, filters                                                                            | Saved custom report configuration.                          |
| User                   | M10        | Permissions & Security             | user_id, username, email, name_ar, name_en, clearance_lvl, is_active                                                  | System user account.                                        |
| Role                   | M10        | Permissions & Security             | role_id, name_ar, name_en, role_type                                                                                  | Named permission bundle assigned to users.                  |
| Permission             | M10        | Permissions & Security             | perm_id, perm_key, module, label_ar, label_en                                                                         | Granular action permission.                                 |
| AccessLog              | M10        | Permissions & Security             | log_id, user_id, action, entity_type, entity_id, timestamp                                                            | Audit trail of user access and actions.                     |
| APIKey                 | M11        | Technical Integration              | key_id, name, key_hash, permissions, is_active                                                                        | API authentication key for external integrations.           |
| KPIDefinition          | M12        | Key Performance Indicators (KPIs)  | kpi_id, name_ar, name_en, formula, unit, role_scope                                                                   | Configuration of a tracked KPI metric.                      |
| KPISnapshot            | M12        | Key Performance Indicators (KPIs)  | snap_id, kpi_id, value, period, computed_at                                                                           | Periodic captured KPI value.                                |
| Organization           | M13        | Organizational Structure           | org_id, name_ar, name_en, code                                                                                        | The parent organization owning the archive center.          |
| Branch                 | M13        | Organizational Structure           | branch_id, org_id, name_ar, code, is_active                                                                           | Physical or logical division within the organization.       |
| Department             | M13        | Organizational Structure           | dept_id, branch_id, name_ar, code                                                                                     | Functional unit within a branch.                            |
| Workflow               | M14        | Workflow System                    | wf_id, name_ar, name_en, type, status, version, created_by                                                            | Definition of a business process.                           |
| WorkflowStep           | M14        | Workflow System                    | step_id, wf_id, step_type, name_ar                                                                                    | A processing step within a workflow.                        |
| WorkflowExecution      | M14        | Workflow System                    | exec_id, wf_id, entity_type, entity_id, status, started_at                                                            | Runtime instance of a workflow.                             |
| RoleKPIMapping         | M15        | Structure-KPI Linking              | map_id, role_id, kpi_id, display_order, is_primary                                                                    | Maps KPI definitions to organizational roles.               |

## 6.2 Entity Relationship Definitions

The following table defines the relationships between entities across all modules. Cardinality follows standard notation: 1:1, 1:N, M:N, 0..1:N.

| **Entity A**       | **Entity B**       | **Cardinality** | **Relationship Description**                                  |
| ------------------ | ------------------ | --------------- | ------------------------------------------------------------- |
| ArchiveRoom        | ArchiveRow         | 1 : N           | A room contains many rows                                     |
| ArchiveRow         | ArchiveCabinet     | 1 : N           | A row contains many cabinets                                  |
| ArchiveCabinet     | ArchiveShelf       | 1 : N           | A cabinet contains many shelves                               |
| ArchiveShelf       | ArchiveBox         | 1 : N           | A shelf holds many boxes                                      |
| ArchiveBox         | Record             | 1 : N           | A box stores many records                                     |
| OrgUnit            | OrgUnit            | 0..1 : N        | Self-referential: a unit has a parent unit (hierarchy)        |
| OrgUnit            | ArchiveRoom        | M : N           | Departments are linked to one or more archive rooms           |
| Record             | RecordFile         | N : 1           | Many records belong to one file                               |
| Record             | LocationHistory    | 1 : N           | A record has many location-change history entries             |
| RecordFile         | OrgUnit            | N : 1           | A file belongs to an organisational unit                      |
| Record             | ClassificationNode | N : 1           | A record is assigned one classification node                  |
| ClassificationNode | ClassificationNode | 0..1 : N        | Self-referential classification tree                          |
| IncomingDocument   | Record             | 1 : 1           | Each incoming document creates exactly one record upon ingest |
| IncomingDocument   | OrgUnit            | N : 1           | Incoming document belongs to a source department              |
| LendingRequest     | Record             | N : 1           | A lending request targets one record (or file)                |
| LendingRequest     | User               | N : 1           | A lending request is submitted by one user                    |
| LendingItem        | LendingRequest     | N : 1           | Items belong to a lending request                             |
| MessengerDispatch  | LendingRequest     | 1 : 1           | A dispatch is created per approved lending request            |
| RetentionSchedule  | ClassificationNode | N : 1           | Retention rule applies to a classification category           |
| DestructionBatch   | Record             | M : N           | A batch contains many eligible records                        |
| DestructionBatch   | User               | N : 1           | Batch approved by a single authorised user                    |
| BarcodeRecord      | Record             | 1 : 1           | Each record has exactly one barcode                           |
| BarcodeRecord      | ArchiveBox         | N : 1           | Multiple barcodes/records in one box                          |
| User               | Role               | M : N           | Users can hold multiple roles                                 |
| Role               | Permission         | M : N           | Roles are granted multiple permissions                        |
| User               | AccessLog          | 1 : N           | A user generates many access log entries                      |
| FormTemplate       | Record             | 1 : N           | A template can be used to register many records               |
| NotificationRule   | User               | 1 : N           | A rule triggers notifications to targeted users               |
| Workflow           | WorkflowStep       | 1 : N           | A workflow has many ordered steps                             |
| WorkflowExecution  | Workflow           | N : 1           | An execution instance runs one workflow                       |
| WorkflowExecution  | LendingRequest     | 1 : 1           | Approval workflow execution tied to lending request           |
| RoleKPIMapping     | Role               | N : 1           | KPI mapping targets a specific role                           |

## 6.3 ERD Narrative Description

The central entity in DACMS is Record, which represents a single archived document or item. Every record is:

- Stored inside an ArchiveBox, which is located on an ArchiveShelf → ArchiveCabinet → ArchiveRow → ArchiveRoom (M1 physical hierarchy).
- Classified under a ClassificationNode in the hierarchical classification tree (M4).
- Assigned a unique BarcodeRecord for physical tracking and scanning (M9).
- Grouped into a RecordFile which belongs to an OrgUnit (M2, M3).
- Subject to a RetentionSchedule based on its classification (M7).
- Potentially issued via a LendingRequest to authorised users (M6).
- Eventually subject to a DestructionBatch when the retention period expires (M8).

The User entity (M10) is the actor in most operations. Users have Roles which carry Permissions governing what operations they can perform on each entity. Every significant operation is recorded in the AccessLog.

The WorkflowExecution entity orchestrates multi-step approvals across modules (lending approval, destruction authorisation, incoming document sign-off). The NotificationRule entity (M13) drives asynchronous alerts based on system events.

# 7\. Use Case Catalog - Summary

This section provides a summary index of all use cases defined across the 15 modules. Detailed use case specifications appear in the individual module sections (Section 5.x.4).

| **UC ID** | **Use Case Name**                                 | **Module**                              | **Primary Actors**                                    | **Complexity** |
| --------- | ------------------------------------------------- | --------------------------------------- | ----------------------------------------------------- | -------------- |
| UC-01-01  | Register New Archive Room                         | M1 - Archive Structure Management       | System Administrator, Archive Supervisor              | Medium         |
| UC-01-02  | View Physical Occupancy Dashboard                 | M1 - Archive Structure Management       | Archive Supervisor, Archive Officer                   | Medium         |
| UC-02-01  | Create Document Type with Category Hierarchy      | M2 - Data Models & Metadata Management  | System Administrator                                  | Medium         |
| UC-02-02  | Define Retention Policy                           | M2 - Data Models & Metadata Management  | System Administrator, Legal/Compliance Officer        | Medium         |
| UC-03-01  | Register New Archive Record                       | M3 - Records Registration & Archiving   | Archive Officer                                       | High           |
| UC-03-02  | Move Record Between Boxes                         | M3 - Records Registration & Archiving   | Archive Officer, Archive Supervisor                   | High           |
| UC-04-01  | Advanced Record Search                            | M4 - Search & Retrieval                 | Archive Officer, Archive Supervisor, Beneficiary User | Medium         |
| UC-04-02  | Retrieve Record by Barcode Scan                   | M4 - Search & Retrieval                 | Archive Officer                                       | Low            |
| UC-05-01  | Batch Print Barcode Labels for New Shelf Setup    | M5 - Barcode & Coding Management        | Archive Officer, System Administrator                 | Medium         |
| UC-05-02  | Replace Damaged Barcode Label                     | M5 - Barcode & Coding Management        | Archive Officer                                       | Medium         |
| UC-06-01  | Submit Lending Request                            | M6 - Lending & Requests Management      | Beneficiary User, Department Head                     | High           |
| UC-06-02  | Process Return and Confirm Receipt                | M6 - Lending & Requests Management      | Archive Officer, Messenger                            | High           |
| UC-07-01  | Initiate Destruction Request for Expired Records  | M7 - Destruction & Migration Management | Archive Supervisor                                    | High           |
| UC-08-01  | Receive Overdue Lending Alert                     | M8 - Notifications & Alerts             | System (Scheduled Job), Archive Supervisor            | Medium         |
| UC-09-01  | Generate Monthly Lending Activity Report          | M9 - Reports & Statistics               | Archive Supervisor, Center Director                   | Medium         |
| UC-10-01  | Create New User with Role Assignment              | M10 - Permissions & Security            | System Administrator                                  | Medium         |
| UC-11-01  | Receive Document from Admin Communications System | M11 - Technical Integration             | External System (Admin Comms), System (API)           | Medium         |
| UC-12-01  | View Center Director Dashboard                    | M12 - Key Performance Indicators (KPIs) | Center Director                                       | Medium         |
| UC-13-01  | Onboard New Beneficiary Department                | M13 - Organizational Structure          | System Administrator                                  | Medium         |
| UC-14-01  | Design and Publish Custom Approval Workflow       | M14 - Workflow System                   | System Administrator                                  | High           |
| UC-15-01  | Configure KPI Dashboard for Archive Supervisor    | M15 - Structure-KPI Linking             | System Administrator                                  | Medium         |

Total use cases: 21

# 8\. User Journey Maps

This section maps the end-to-end journeys for each of the five DACMS user roles across the most critical system workflows. Each table represents a role's experience from goal identification through system interaction to outcome.

## 8.1 Center Director (مدير مركز الوثائق)

The Center Director oversees governance, approves high-stakes decisions, and monitors performance via KPI dashboards. Their journeys are primarily decision and approval-oriented.

**Journey: Monthly Governance Review**

| **Step** | **Goal**                   | **Module Used**  | **System Action**                                                                    | **Actor Decision**             | **Outcome**                             |
| -------- | -------------------------- | ---------------- | ------------------------------------------------------------------------------------ | ------------------------------ | --------------------------------------- |
| 1        | Log in to system           | M10 - Auth       | System validates credentials; loads director dashboard                               | -                              | Director lands on KPI dashboard         |
| 2        | Review governance KPIs     | M15 - KPI        | Dashboard shows: Compliance Rate, Active Records, Destruction Backlog, Overdue Loans | Identify issues                | Issues flagged for follow-up            |
| 3        | Review destruction backlog | M8 - Destruction | Open pending destruction batches list                                                | Select batch for review        | Batch detail shown                      |
| 4        | Approve destruction batch  | M8 - Destruction | Workflow step: Director approval action                                              | Approve or Return for Revision | Batch status updated; notification sent |
| 5        | Review lending SLA report  | M6 + M11         | Open Lending SLA report; filter by month                                             | Note compliance rate           | Report exported to PDF                  |
| 6        | Review workflow SLA        | M14 + M11        | Open Workflow performance report                                                     | Identify bottleneck steps      | Report shared with supervisor           |
| 7        | Log out                    | M10 - Auth       | Session terminated; activity logged                                                  | -                              | Audit log entry created                 |

**Journey: Record Destruction Approval**

| **Step** | **Goal**                                  | **Module Used** | **System Notification**                                                                                      | **Actor Decision** | **Outcome**                                      |
| -------- | ----------------------------------------- | --------------- | ------------------------------------------------------------------------------------------------------------ | ------------------ | ------------------------------------------------ |
| 1        | Receive destruction approval notification | M13             | Email + in-app alert: "Destruction batch #47 awaiting director approval"                                     | Open notification  | Navigate to destruction batch                    |
| 2        | Review batch contents                     | M8              | System shows list of records in batch, their classification, retention expiry, and supervisor recommendation | Review records     | Director satisfied with list                     |
| 3        | Download batch report                     | M8 + M11        | Batch summary PDF generated                                                                                  | -                  | Report reviewed offline                          |
| 4        | Approve batch                             | M8 + M14        | Workflow execution step logged; record statuses updated to "Approved for Destruction"                        | Approve            | Destruction team notified                        |
| 5        | Batch enters final destruction step       | M8              | Archive officer proceeds with physical destruction                                                           | -                  | Records marked Destroyed; certificates generated |

## 8.2 Archive Supervisor (مشرف الأرشيف)

The Archive Supervisor manages daily operations, assigns locations, approves lending requests, manages occupancy, and oversees officers.

**Journey: Process New Document Batch**

| **Step** | **Goal**                                      | **Module Used** | **System Action**                                              | **Actor Decision**  | **Outcome**                                 |
| -------- | --------------------------------------------- | --------------- | -------------------------------------------------------------- | ------------------- | ------------------------------------------- |
| 1        | Receive new documents from department         | M5              | Open Document Receiving module; create new Incoming Batch      | -                   | Batch record created                        |
| 2        | Assign officer to process batch               | M5 + M10        | Assign Archive Officer; send task notification                 | Select officer      | Officer notified via M13                    |
| 3        | Monitor processing progress                   | M5              | View batch status: Pending → In Progress → Classified          | -                   | Progress tracked                            |
| 4        | Assign archive locations to processed records | M1 + M3         | View available shelf capacity; assign records to boxes/shelves | Select target shelf | Location codes assigned to records          |
| 5        | Approve batch completion                      | M5              | Supervisor signs off on batch                                  | Approve             | Batch status → Archived; KPI updated in M15 |

**Journey: Lending Request Approval**

| **Step** | **Goal**                      | **Module Used** | **System Notification**                                                  | **Actor Decision** | **Outcome**                                               |
| -------- | ----------------------------- | --------------- | ------------------------------------------------------------------------ | ------------------ | --------------------------------------------------------- |
| 1        | Receive lending approval task | M13 + M14       | Email + in-app: "Lending request #221 awaiting approval"                 | Open task          | Request detail shown                                      |
| 2        | Review request details        | M6              | View: Beneficiary, Requested record, Justification, Requested duration   | Review             | Supervisor assesses legitimacy                            |
| 3        | Check record availability     | M6 + M3         | System shows current record location and status (Available/Loaned)       | -                  | Record is available                                       |
| 4        | Approve request               | M6 + M14        | Workflow step updated; lending record created; record status → "On Loan" | Approve            | Lending record created; messenger dispatch generated (M6) |
| 5        | Monitor return SLA            | M6 + M13        | SLA countdown shown; alert triggers if overdue                           | -                  | Alert sent to officer on due date                         |

## 8.3 Archive Officer (موظف الأرشيف)

The Archive Officer performs all hands-on data entry and physical operations: registration, classification, barcode printing, lending processing, and returns.

**Journey: Register and Archive a New Record**

| **Step** | **Goal**                            | **Module Used** | **System Action**                                     | **Actor Action**                                            | **Outcome**                                     |
| -------- | ----------------------------------- | --------------- | ----------------------------------------------------- | ----------------------------------------------------------- | ----------------------------------------------- |
| 1        | Open record registration form       | M5 + M3         | System presents registration form (template from M12) | Fill in record details (classification, source dept, dates) | Form populated                                  |
| 2        | Select classification               | M4              | Classification tree picker shown                      | Navigate tree; select category                              | Classification code assigned                    |
| 3        | Attach digital file (if applicable) | M3              | File upload component; virus scan runs                | Upload PDF/image                                            | File stored; hash computed                      |
| 4        | Save record                         | M3              | Record created; unique Record ID assigned             | -                                                           | Record in "Unlocated" status                    |
| 5        | Print barcode label                 | M9              | Barcode generated (Code128); label PDF rendered       | Send to label printer                                       | Label printed; affixed to document              |
| 6        | Assign physical location            | M1 + M3         | Shelf picker shows available space                    | Select shelf/box                                            | Record status → "Archived at \[location code\]" |
| 7        | Confirm placement                   | M9              | Scanner confirmation option (scan barcode at shelf)   | Scan barcode                                                | Location confirmed; audit log entry written     |

**Journey: Process Document Return**

| **Step** | **Goal**                                | **Module Used** | **System Action**                                                    | **Actor Action**                                 | **Outcome**                                          |
| -------- | --------------------------------------- | --------------- | -------------------------------------------------------------------- | ------------------------------------------------ | ---------------------------------------------------- |
| 1        | Receive physical document from borrower | M6              | -                                                                    | Verify document integrity against lending record | Document received                                    |
| 2        | Scan return barcode                     | M9 + M6         | System matches barcode to open lending record                        | Scan document barcode                            | Lending record found                                 |
| 3        | Confirm return in system                | M6              | System prompts: Confirm Return? Shows due date and condition options | Select condition; confirm                        | Lending record closed; record status → Available     |
| 4        | Re-shelve document                      | M1 + M3         | System shows last known location; suggest original shelf             | Physically re-shelve                             | Location record updated                              |
| 5        | Scan barcode at shelf                   | M9              | Confirmation scan; system logs new/confirmed location                | Scan                                             | Final location confirmed; return audit entry written |

## 8.4 System Administrator (مدير النظام)

The System Administrator configures the entire system: users, roles, org structure, templates, workflows, and notification rules.

**Journey: Onboard a New Department and Configure Access**

| **Step** | **Goal**                                        | **Module Used** | **System Action**                     | **Actor Action**                                          | **Outcome**                      |
| -------- | ----------------------------------------------- | --------------- | ------------------------------------- | --------------------------------------------------------- | -------------------------------- |
| 1        | Add new organisational unit                     | M2              | Open Org Units; Add Department        | Enter name (AR/EN), parent unit, code                     | New department created           |
| 2        | Assign archive room to department               | M1 + M2         | Room linking UI                       | Select room(s) for department                             | Room-department link established |
| 3        | Create user accounts for department staff       | M10             | User management; create users         | Enter user details; assign temporary password             | User accounts created            |
| 4        | Assign roles to users                           | M10             | Role assignment UI                    | Assign Archive Officer role to staff                      | Users inherit role permissions   |
| 5        | Configure retention schedule for dept documents | M7              | Retention rules; filter by department | Set retention periods per classification                  | Retention rules applied          |
| 6        | Configure notifications for department events   | M13             | Notification rules UI                 | Set triggers: New Record, Overdue Loan, Destruction Alert | Notification rules active        |
| 7        | Verify access by test login                     | M10             | Log in as new user (test account)     | Verify dashboard, permissions, navigation                 | Configuration confirmed          |

**Journey: Design and Publish an Approval Workflow**

| **Step** | **Goal**                                | **Module Used** | **System Action**                                            | **Actor Action**                                                  | **Outcome**                            |
| -------- | --------------------------------------- | --------------- | ------------------------------------------------------------ | ----------------------------------------------------------------- | -------------------------------------- |
| 1        | Open Workflow Designer                  | M14             | Drag-and-drop workflow canvas opens                          | -                                                                 | Canvas ready                           |
| 2        | Define Trigger node                     | M14             | Trigger type: MANUAL (user-initiated)                        | Configure trigger; set allowed roles                              | Trigger configured                     |
| 3        | Add Human Step: Supervisor Approval     | M14             | Human Step node; configure assignee (by role), SLA, actions  | Set: Assignee=Archive Supervisor; SLA=48h; Actions=Approve/Return | Step configured                        |
| 4        | Add Decision node                       | M14             | Decision node; configure branches                            | Set Approved branch → next step; Rejected → end                   | Branching logic defined                |
| 5        | Add Human Step: Director Final Approval | M14             | Second Human Step                                            | Set: Assignee=Center Director; SLA=72h                            | Final approval step added              |
| 6        | Validate workflow                       | M14             | System checks for disconnected nodes, missing terminal steps | Review validation results                                         | Validation passes                      |
| 7        | Publish workflow                        | M14             | Workflow status → Published; available in Start New list     | Publish                                                           | Workflow live; assigned users notified |

## 8.5 Beneficiary User (المستفيد)

The Beneficiary User interacts exclusively with the public-facing Beneficiary Portal to request document retrieval or submit documents for archiving.

**Journey: Request a Document Retrieval**

| **Step**      | **Goal**                               | **Module Used** | **System Action**                                                                  | **Actor Action**                             | **Outcome**                                        |
| ------------- | -------------------------------------- | --------------- | ---------------------------------------------------------------------------------- | -------------------------------------------- | -------------------------------------------------- |
| 1             | Log in to Beneficiary Portal           | M10             | Authentication screen                                                              | Enter credentials                            | User authenticated; portal loaded                  |
| 2             | Submit retrieval request               | M6              | New Request form: Document description, justification, desired date                | Fill form; attach supporting docs (optional) | Request submitted; Reference # issued              |
| 3             | Receive submission confirmation        | M13             | Automated email: "Request #221 received; expected response within 2 working days"  | -                                            | Expectation set                                    |
| 4             | Track request status                   | M6 + M13        | Portal dashboard shows request status (Pending → Under Review → Approved/Rejected) | Monitor status                               | Status visible                                     |
| 5a (Approved) | Receive approval notification          | M13             | Email: "Request approved; physical delivery scheduled for \[date\]"                | Acknowledge                                  | Awaits delivery                                    |
| 5b (Rejected) | Receive rejection notification         | M13             | Email: "Request rejected; reason: \[reason text\]"                                 | May resubmit with revision                   | Request closed                                     |
| 6             | Confirm receipt (if physical delivery) | M6              | Messenger dispatch confirmation UI                                                 | Sign receipt on portal                       | Lending record updated; document in user's custody |
| 7             | Return document before due date        | M6              | System sends reminder 3 days before due date                                       | Arrange physical return with archive officer | Return processed (by officer journey)              |

# 9\. Non-Functional Requirements

## 9.1 Performance

| **ID**   | **Requirement**                       | **Target**   | **Condition**                             |
| -------- | ------------------------------------- | ------------ | ----------------------------------------- |
| NFR-P-01 | Page load time (initial)              | < 3 seconds  | Under normal load (≤100 concurrent users) |
| NFR-P-02 | Search results response time          | < 1 second   | For up to 500,000 records in database     |
| NFR-P-03 | Barcode generation time               | < 500 ms     | Single barcode PDF label                  |
| NFR-P-04 | Report generation (< 1000 rows)       | < 5 seconds  | Standard report with filters              |
| NFR-P-05 | Bulk record registration (50 records) | < 30 seconds | Batch import via form or CSV              |
| NFR-P-06 | Dashboard KPI load time               | < 2 seconds  | All widgets on a single role dashboard    |

## 9.2 Security

| **ID**   | **Requirement**                                                                                   |
| -------- | ------------------------------------------------------------------------------------------------- |
| NFR-S-01 | All communications over HTTPS/TLS 1.3; HTTP redirects to HTTPS.                                   |
| NFR-S-02 | Passwords hashed with bcrypt (cost factor ≥ 12); never stored in plain text.                      |
| NFR-S-03 | JWT access tokens expire in 1 hour; refresh tokens in 8 hours.                                    |
| NFR-S-04 | All API endpoints require a valid JWT; role/permission claim validated server-side.               |
| NFR-S-05 | SQL injection prevention: all database queries use parameterised statements (ORM).                |
| NFR-S-06 | Input validation and sanitisation on all user-submitted data fields.                              |
| NFR-S-07 | File uploads: type whitelist (PDF, DOCX, JPEG, PNG); max size 50 MB; scanned for malware.         |
| NFR-S-08 | Audit log is append-only; no API or UI action may modify or delete audit entries.                 |
| NFR-S-09 | Session invalidated on logout; JWT revocation list maintained.                                    |
| NFR-S-10 | Failed login attempts throttled: max 5 attempts per 10 minutes; account locked after 10 failures. |

## 9.3 Availability & Reliability

| **ID**   | **Requirement**                                                                                   |
| -------- | ------------------------------------------------------------------------------------------------- |
| NFR-A-01 | System availability: ≥ 99.5% uptime during working hours (7:00-17:00 Sun-Thu).                    |
| NFR-A-02 | Planned maintenance window: Thursday night (22:00-02:00); < 4h/month.                             |
| NFR-A-03 | Automated daily database backup; backup retention ≥ 30 days; offsite copy required.               |
| NFR-A-04 | Recovery Time Objective (RTO): ≤ 4 hours for major failure.                                       |
| NFR-A-05 | Recovery Point Objective (RPO): ≤ 24 hours (daily backup).                                        |
| NFR-A-06 | Graceful degradation: if notification service fails, core archive operations continue unaffected. |

## 9.4 Scalability

| **ID**    | **Requirement**                                                                          |
| --------- | ---------------------------------------------------------------------------------------- |
| NFR-SC-01 | Database must support ≥ 1 million record rows without degradation in search performance. |
| NFR-SC-02 | API must handle ≥ 200 concurrent users without exceeding P95 response time targets.      |
| NFR-SC-03 | System architecture must support horizontal scaling of the API tier via load balancing.  |
| NFR-SC-04 | File storage must support ≥ 5 TB of attached digital documents.                          |

## 9.5 Usability

| **ID**   | **Requirement**                                                                                                                                                 |
| -------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| NFR-U-01 | All UI components fully RTL-compatible (Arabic primary); LTR toggle available.                                                                                  |
| NFR-U-02 | WCAG 2.1 Level AA compliance for all public-facing (beneficiary) portal pages.                                                                                  |
| NFR-U-03 | All date inputs display Gregorian and offer optional Hijri conversion.                                                                                          |
| NFR-U-04 | A new Archive Officer must be able to register their first record within 20 minutes of first login with no training beyond reading the in-app onboarding guide. |
| NFR-U-05 | Error messages must be descriptive (field-level), in Arabic, and suggest corrective action.                                                                     |
| NFR-U-06 | Barcode scanner input must work without mouse interaction (focus-managed keyboard input).                                                                       |

## 9.6 Maintainability & Portability

| **ID**   | **Requirement**                                                                                                     |
| -------- | ------------------------------------------------------------------------------------------------------------------- |
| NFR-M-01 | Source code must follow agreed coding standards (ESLint / Prettier); code coverage ≥ 70%.                           |
| NFR-M-02 | All configuration (roles, retention rules, templates) must be manageable through the admin UI without code changes. |
| NFR-M-03 | Database schema migrations managed via versioned migration tool (Flyway or Liquibase).                              |
| NFR-M-04 | System must be deployable on any standard Linux server (Ubuntu 20.04+) with Docker Compose.                         |
| NFR-M-05 | All third-party libraries must have active maintenance; no abandoned dependencies at go-live.                       |

## 9.7 Compliance

| **ID**   | **Requirement**                                                                                                                                                   |
| -------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| NFR-C-01 | All physical record lifecycle actions (creation, lending, return, destruction) must produce an auditable trail compliant with Saudi National Archive regulations. |
| NFR-C-02 | Personally identifiable information (PII) of beneficiaries must be stored in compliance with PDPL (Saudi Personal Data Protection Law).                           |
| NFR-C-03 | Destruction certificates must be digitally signed and retained for a minimum of 10 years.                                                                         |
| NFR-C-04 | Retention periods must be configurable to align with NCA (National Cybersecurity Authority) archive retention guidelines.                                         |

# 10\. Module Interconnectivity

## 10.1 Dependency Map

The table below lists directional dependencies between modules: FROM (the dependent module) → TO (the module it depends on), the dependency type, and a description.

| **FROM Module**       | **TO Module**         | **Dependency Type** | **Description**                                                                                         |
| --------------------- | --------------------- | ------------------- | ------------------------------------------------------------------------------------------------------- |
| M3 Records            | M1 Archive Structure  | Data                | Records are assigned physical locations from the M1 hierarchy (shelf/box references).                   |
| M3 Records            | M2 Org Units          | Data                | Records belong to an organisational unit; source department tracked.                                    |
| M3 Records            | M4 Classification     | Data                | Every record must be assigned a classification node from the M4 taxonomy.                               |
| M4 Classification     | M7 Retention          | Configuration       | Retention rules in M7 are linked to classification categories from M4.                                  |
| M5 Document Receiving | M3 Records            | Workflow            | Received documents create Record entries; batch ingest writes to M3.                                    |
| M5 Document Receiving | M12 Templates         | Configuration       | Receiving forms use templates defined in M12 for structured ingest.                                     |
| M5 Document Receiving | M14 Workflow          | Workflow            | Document receiving triggers approval workflows defined in M14.                                          |
| M6 Lending            | M3 Records            | Data                | Lending requests reference specific Record IDs; record status updated.                                  |
| M6 Lending            | M14 Workflow          | Workflow            | Lending approval process is governed by a published workflow from M14.                                  |
| M6 Lending            | M13 Notifications     | Event               | Lending approval, rejection, overdue, and return events trigger M13 notifications.                      |
| M6 Lending            | M9 Barcodes           | Physical            | Return confirmation uses barcode scanning from M9 to identify the physical document.                    |
| M7 Retention          | M4 Classification     | Configuration       | Retention periods are mapped to classification nodes; cascades to all records in that category.         |
| M7 Retention          | M8 Destruction        | Lifecycle           | M7 computes retention expiry; eligible records surfaced to M8 for destruction batching.                 |
| M8 Destruction        | M14 Workflow          | Workflow            | Destruction batches require multi-step approval workflow from M14.                                      |
| M8 Destruction        | M13 Notifications     | Event               | Batch submission and director approval events trigger M13 notifications.                                |
| M8 Destruction        | M11 Reporting         | Reporting           | Destruction certificates and batch history surface in M11 reports.                                      |
| M9 Barcodes           | M1 Archive Structure  | Physical            | Barcodes on boxes are linked to ArchiveBox entities in M1; scan confirms physical location.             |
| M9 Barcodes           | M3 Records            | Physical            | Each record has a barcode record; scanning identifies the logical record entity.                        |
| M10 Permissions       | All Modules           | Security            | Every modules API endpoints enforce role/permission checks from M10; all actions are access-controlled. |
| M11 Reporting         | M3 Records            | Reporting           | Report datasets are primarily derived from M3 record data, status, and classification.                  |
| M11 Reporting         | M6 Lending            | Reporting           | Lending SLA, overdue, and return-rate reports drawn from M6 data.                                       |
| M11 Reporting         | M8 Destruction        | Reporting           | Destruction history and certificate reports drawn from M8 data.                                         |
| M12 Templates         | M5 Document Receiving | Configuration       | Templates define the form fields used in M5 document ingest forms.                                      |
| M12 Templates         | M3 Records            | Configuration       | Templates govern metadata fields captured during record registration.                                   |
| M13 Notifications     | M6 Lending            | Event Sink          | Consumes lending events (approval, overdue, return) to dispatch notifications.                          |
| M13 Notifications     | M14 Workflow          | Event Sink          | Consumes workflow step events (assigned, overdue, completed) to dispatch notifications.                 |
| M13 Notifications     | M7 Retention          | Event Sink          | Consumes retention expiry events to notify supervisors of eligible destruction records.                 |
| M14 Workflow          | M6 Lending            | Workflow            | Lending approval workflows execute within the M6 lending process.                                       |
| M14 Workflow          | M8 Destruction        | Workflow            | Destruction authorisation workflows execute within the M8 destruction process.                          |
| M14 Workflow          | M5 Document Receiving | Workflow            | Ingest authorisation workflows execute within the M5 receiving process.                                 |
| M15 KPI Linking       | M11 Reporting         | Data                | KPI dashboard values are sourced from pre-computed report aggregates in M11.                            |
| M15 KPI Linking       | M10 Permissions       | Configuration       | KPI visibility is filtered by user role from M10; role-specific KPI sets.                               |
| M2 Org Units          | M1 Archive Structure  | Configuration       | Rooms are linked to departments from M2; drives access control filtering.                               |
| M2 Org Units          | M10 Permissions       | Configuration       | Departments are assignable to users and roles; drives scope-based permissions.                          |

## 10.2 Critical Integration Points

The following integration points are the most architecturally significant in DACMS and carry the highest risk if not designed carefully:

| **Integration Point**            | **Modules Involved** | **Risk if Broken**                                                   | **Mitigation Strategy**                                                                                 |
| -------------------------------- | -------------------- | -------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------- |
| Record ↔ Physical Location       | M1 + M3 + M9         | Records cannot be physically located or retrieved.                   | Atomic transaction: record creation + location assignment + barcode binding in a single DB transaction. |
| Retention → Destruction Pipeline | M4 + M7 + M8         | Records destroyed prematurely or never destroyed; compliance breach. | Scheduled job + manual supervisor review gate before batch creation; mandatory workflow approval.       |
| Lending Approval Workflow        | M6 + M14 + M13       | Lending requests stuck; records unavailable to legitimate users.     | SLA escalation; fallback manual override by supervisor; comprehensive notification rules.               |
| Permission Propagation           | M10 → All            | Unauthorised access to sensitive records; compliance failure.        | API middleware validates permission on every request; no client-side permission bypass possible.        |
| Notification Event Bus           | M13 ← M6, M8, M14    | Users miss critical alerts; SLA violations undetected.               | Event queue with retry; in-app fallback if email fails; supervisor daily digest as safety net.          |

## 10.3 Module Initialisation Order

For initial system setup, modules must be configured in the following order to ensure referential integrity:

| **Order** | **Module**               | **Reason**                                                               |
| --------- | ------------------------ | ------------------------------------------------------------------------ |
| 1         | M10 - User & Permissions | Roles and users must exist before any other action.                      |
| 2         | M2 - Org Units           | Departments required before rooms are linked.                            |
| 3         | M1 - Archive Structure   | Physical hierarchy before records are assigned locations.                |
| 4         | M4 - Classification      | Taxonomy required before records or retention rules.                     |
| 5         | M12 - Templates          | Forms required before document receiving workflows.                      |
| 6         | M7 - Retention           | Retention rules require classification to exist.                         |
| 7         | M14 - Workflow           | Workflows reference roles (M10) and steps.                               |
| 8         | M13 - Notifications      | Notification rules reference workflows and roles.                        |
| 9         | M9 - Barcodes            | Barcode config requires archive structure to be set.                     |
| 10        | M5, M3, M6, M8, M11, M15 | Operational modules - active once all foundation modules are configured. |

# 11\. Glossary

This glossary defines key terms used throughout the DACMS System Requirements Specification. Arabic equivalents are provided where relevant.

| **Term**                            | **Definition**                                                                                                                                               |
| ----------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Archive Box (صندوق)                 | A physical container holding one or more records. Each box is labelled with a unique barcode and assigned to a specific shelf location.                      |
| Archive Cabinet (خزانة/كبينة)       | A physical storage unit within an archive row, containing multiple shelves.                                                                                  |
| Archive Room (غرفة الأرشيف)         | The top-level physical space within the archive centre. Rooms are assigned to one or more organisational departments.                                        |
| Archive Shelf (رف)                  | A single shelf within an archive cabinet on which boxes are placed.                                                                                          |
| Archive Row (صف)                    | A physical row of cabinets within an archive room.                                                                                                           |
| Audit Log                           | An immutable, append-only record of every significant system operation, including actor, timestamp, entity affected, and operation type.                     |
| Barcode                             | A Code128 machine-readable label affixed to each physical archive box and record. Used for scanning-based physical tracking.                                 |
| Beneficiary (مستفيد)                | An internal ministry employee or authorised external party who requests access to archived documents via the Beneficiary Portal.                             |
| Classification (تصنيف)              | A hierarchical taxonomy categorising records by subject, sensitivity, and organisational function. Used to determine retention periods and access rules.     |
| Destruction Batch (دفعة إتلاف)      | A set of records that have met their retention expiry and have been approved for permanent physical and digital destruction.                                 |
| Destruction Certificate             | A signed document produced after a destruction batch is executed, recording which records were destroyed, by whom, and on what date.                         |
| Document (وثيقة)                    | A single archival item - either physical (paper) or digital (file attachment) - registered in the system as a Record.                                        |
| File (ملف)                          | A logical grouping of related records under a common case, project, or subject heading.                                                                      |
| Incoming Document (وارد)            | A document received from an internal department or external party, processed through the Document Receiving module.                                          |
| KPI (مؤشر الأداء الرئيسي)           | Key Performance Indicator - a quantifiable metric displayed on role-specific dashboards to track system and operational performance.                         |
| Lending (إعارة)                     | The formal process of issuing a physical archive record to an authorised user for a defined, tracked period.                                                 |
| Location Code (رمز الموقع)          | A hierarchical code uniquely identifying the physical position of a box or record, e.g., R01-RW03-CB02-SH1-BX004.                                            |
| Messenger Dispatch (إرسال مع مندوب) | A physical delivery record created when an approved lending item is dispatched to the borrower via a courier/messenger.                                      |
| Module                              | One of the 15 functional groupings of the DACMS. Each module addresses a distinct domain of archive management.                                              |
| Org Unit (وحدة تنظيمية)             | An organisational unit (department, section, or division) of the Ministry of Industry & Trade, as registered in the system.                                  |
| Permission (صلاحية)                 | A granular access right (e.g., "create:record", "approve:lending") that can be assigned to roles.                                                            |
| Record (سجل)                        | The primary data entity in DACMS representing one registered archival item, including its metadata, classification, physical location, and lifecycle status. |
| Retention Period (مدة الاحتفاظ)     | The mandatory holding period for a record, after which it becomes eligible for destruction review.                                                           |
| Retention Schedule (جدول الاحتفاظ)  | The configuration mapping classification categories to their retention periods and actions on expiry (destroy, transfer, review).                            |
| Role (دور)                          | A named collection of permissions assigned to users (e.g., Archive Officer, Archive Supervisor).                                                             |
| SLA (اتفاقية مستوى الخدمة)          | Service Level Agreement - a time-based target for completing a workflow step or processing a request.                                                        |
| Template (قالب)                     | A configurable form or document structure used to standardise record registration, incoming document forms, or report layouts.                               |
| Workflow (مسار العمل)               | A multi-step, rule-driven process governing approvals and actions within DACMS (e.g., lending approval, destruction authorisation).                          |
| Workflow Execution (تنفيذ المسار)   | A specific running instance of a published workflow, tied to a triggering entity (e.g., a lending request or destruction batch).                             |