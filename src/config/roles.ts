export enum RoleType {
  CenterDirector = 'center_director',
  ArchiveSupervisor = 'archive_supervisor',
  ArchiveOfficer = 'archive_officer',
  Admin = 'admin',
  Beneficiary = 'beneficiary',
}

export enum ClearanceLevel {
  TopSecret = 'top_secret',
  Confidential = 'confidential',
  Restricted = 'restricted',
  Public = 'public',
}

export const ROLE_LABELS: Record<RoleType, string> = {
  [RoleType.CenterDirector]: 'Center Director',
  [RoleType.ArchiveSupervisor]: 'Archive Supervisor',
  [RoleType.ArchiveOfficer]: 'Archive Officer',
  [RoleType.Admin]: 'System Admin',
  [RoleType.Beneficiary]: 'Beneficiary',
};

export const ROLE_CLEARANCE: Record<RoleType, ClearanceLevel> = {
  [RoleType.CenterDirector]: ClearanceLevel.TopSecret,
  [RoleType.ArchiveSupervisor]: ClearanceLevel.Confidential,
  [RoleType.ArchiveOfficer]: ClearanceLevel.Restricted,
  [RoleType.Admin]: ClearanceLevel.TopSecret,
  [RoleType.Beneficiary]: ClearanceLevel.Public,
};

export const ALL_ROLES = Object.values(RoleType);
