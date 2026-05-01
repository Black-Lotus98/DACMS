'use client';

import { useMemo, useState } from 'react';
import { Building2 } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { ROLE_LABELS, type RoleType } from '@/config/roles';
import { useOrgModule } from '../hooks';
import { OrgTree } from './OrgTree';
import {
  addBranch, addDepartment, assignDepartmentResponsible,
  toggleBranch, updateOrganization, deleteDepartment,
} from '../store/slice';
import { OrgLevel } from '../types';

const LEVEL_BADGE: Record<OrgLevel, string> = {
  [OrgLevel.Supervisory]:    'bg-purple-100 text-purple-800 border-purple-200',
  [OrgLevel.Operational]:    'bg-blue-100 text-blue-800 border-blue-200',
  [OrgLevel.Technical]:      'bg-amber-100 text-amber-800 border-amber-200',
  [OrgLevel.Organizational]: 'bg-green-100 text-green-800 border-green-200',
};

type Tab = 'structure' | 'levels' | 'manage';

export function OrgStructurePage() {
  const dispatch  = useAppDispatch();
  const { local } = useParams<{ local: string }>();
  const {
    organization, branches, departments, levelDefinitions,
    getRootDepts,
  } = useOrgModule();
  const users = useAppSelector((s) => s.permissions.users);

  const [tab, setTab] = useState<Tab>('structure');

  // ── org edit ──────────────────────────────────────────────────────────────
  const [editingOrg, setEditingOrg] = useState(false);
  const [orgNameAr,  setOrgNameAr]  = useState(organization.nameAr);
  const [orgNameEn,  setOrgNameEn]  = useState(organization.nameEn);
  const [orgCode,    setOrgCode]    = useState(organization.code);

  function saveOrg() {
    if (!orgNameAr.trim() || !orgNameEn.trim() || !orgCode.trim()) return;
    dispatch(updateOrganization({ nameAr: orgNameAr.trim(), nameEn: orgNameEn.trim(), code: orgCode.trim() }));
    setEditingOrg(false);
  }

  // ── add branch ────────────────────────────────────────────────────────────
  const [branchNameAr, setBranchNameAr] = useState('');
  const [branchNameEn, setBranchNameEn] = useState('');
  const [branchCode,   setBranchCode]   = useState('');

  function createBranch() {
    if (!branchNameAr.trim() || !branchNameEn.trim() || !branchCode.trim()) return;
    dispatch(addBranch({
      id: `b-${Date.now()}`,
      nameAr: branchNameAr.trim(), nameEn: branchNameEn.trim(),
      code: branchCode.trim(), organizationId: organization.id, isActive: true,
    }));
    setBranchNameAr(''); setBranchNameEn(''); setBranchCode('');
  }

  // ── add department ────────────────────────────────────────────────────────
  const [deptNameAr,       setDeptNameAr]       = useState('');
  const [deptNameEn,       setDeptNameEn]       = useState('');
  const [deptCode,         setDeptCode]         = useState('');
  const [selectedBranchId, setSelectedBranchId] = useState(branches[0]?.id ?? '');
  const [parentDeptId,     setParentDeptId]     = useState('');

  const filteredParentOptions = useMemo(
    () => departments.filter((d) => d.branchId === selectedBranchId),
    [departments, selectedBranchId]
  );

  function createDepartment() {
    if (!deptNameAr.trim() || !deptNameEn.trim() || !deptCode.trim() || !selectedBranchId) return;
    dispatch(addDepartment({
      id: `d-${Date.now()}`,
      nameAr: deptNameAr.trim(), nameEn: deptNameEn.trim(),
      code: deptCode.trim(), branchId: selectedBranchId,
      parentDeptId: parentDeptId || undefined,
    }));
    setDeptNameAr(''); setDeptNameEn(''); setDeptCode(''); setParentDeptId('');
  }

  // ── assign responsible ────────────────────────────────────────────────────
  const [responsibleDeptId, setResponsibleDeptId] = useState(departments[0]?.id ?? '');
  const [assigneeId,        setAssigneeId]        = useState(users[0]?.id ?? '');
  const [responsibleEmail,  setResponsibleEmail]  = useState('');

  function assignResponsible() {
    if (!responsibleDeptId || !assigneeId) return;
    const assignee = users.find((u) => u.id === assigneeId);
    dispatch(assignDepartmentResponsible({
      departmentId: responsibleDeptId, assigneeId,
      responsibleEmail: responsibleEmail.trim() || assignee?.email,
    }));
    setResponsibleEmail('');
  }

  const tabs: { id: Tab; label: string }[] = [
    { id: 'structure', label: 'Org Tree' },
    { id: 'levels',    label: 'Role Levels (F13.2–F13.5)' },
    { id: 'manage',    label: 'Manage' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <Building2 className="w-6 h-6 text-primary" />
          <div>
            {editingOrg ? (
              <div className="flex flex-wrap items-center gap-2">
                <input value={orgNameAr}  onChange={(e) => setOrgNameAr(e.target.value)}  className="h-8 rounded-md border px-2 text-sm w-44" placeholder="Arabic name" />
                <input value={orgNameEn}  onChange={(e) => setOrgNameEn(e.target.value)}  className="h-8 rounded-md border px-2 text-sm w-44" placeholder="English name" />
                <input value={orgCode}    onChange={(e) => setOrgCode(e.target.value)}    className="h-8 rounded-md border px-2 text-sm w-24 font-mono" placeholder="Code" />
                <button onClick={saveOrg}               className="h-8 px-3 rounded-md bg-primary text-primary-foreground text-sm">Save</button>
                <button onClick={() => setEditingOrg(false)} className="h-8 px-3 rounded-md border text-sm">Cancel</button>
              </div>
            ) : (
              <>
                <h1 className="text-2xl font-bold">{organization.nameEn}</h1>
                <p className="text-sm text-muted-foreground">{organization.nameAr} · {organization.code}</p>
              </>
            )}
          </div>
        </div>
        {!editingOrg && (
          <button onClick={() => { setOrgNameAr(organization.nameAr); setOrgNameEn(organization.nameEn); setOrgCode(organization.code); setEditingOrg(true); }}
            className="h-9 px-3 rounded-md border text-sm hover:bg-muted shrink-0">
            Edit Org
          </button>
        )}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 border-b">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`h-9 px-4 text-sm border-b-2 transition-colors ${tab === t.id ? 'border-primary font-medium' : 'border-transparent text-muted-foreground hover:text-foreground'}`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* ── Org Tree tab ─────────────────────────────────────────────────── */}
      {tab === 'structure' && (
        <div className="space-y-3">
          {branches.map((branch) => (
            <div key={branch.id} className="space-y-1">
              <div className="flex items-center gap-2">
                <Link href={`/${local}/org-structure/branch/${branch.id}`} className="text-sm text-primary hover:underline">
                  {branch.nameEn}
                </Link>
                <span className="text-xs text-muted-foreground">({branch.nameAr})</span>
                <span className={`text-[10px] px-1.5 py-0.5 rounded-full border ${branch.isActive ? 'bg-green-50 text-green-700 border-green-200' : 'bg-muted text-muted-foreground border-border'}`}>
                  {branch.isActive ? 'Active' : 'Inactive'}
                </span>
                <button
                  onClick={() => dispatch(toggleBranch(branch.id))}
                  className="text-xs text-muted-foreground hover:underline"
                >
                  {branch.isActive ? 'Deactivate' : 'Activate'}
                </button>
              </div>
              <OrgTree
                branchName={branch.nameEn}
                branchNameAr={branch.nameAr}
                branchCode={branch.code}
                rootDepts={getRootDepts(branch.id)}
                allDepts={departments}
                onDelete={(id) => dispatch(deleteDepartment(id))}
              />
            </div>
          ))}
        </div>
      )}

      {/* ── Role Levels tab (F13.2–F13.5) ────────────────────────────────── */}
      {tab === 'levels' && (
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            The four organizational levels defined in the SRS (F13.2–F13.5), mapping roles to their access scope.
          </p>
          <div className="grid sm:grid-cols-2 gap-4">
            {levelDefinitions.map((lvl) => (
              <div key={lvl.level} className={`rounded-xl border p-4 space-y-3 ${LEVEL_BADGE[lvl.level]}`}>
                <div>
                  <p className="text-[11px] opacity-60">{lvl.labelAr}</p>
                  <p className="font-semibold">{lvl.labelEn}</p>
                </div>
                <div className="flex flex-wrap gap-1">
                  {lvl.roles.map((r) => (
                    <span key={r} className="text-xs px-2 py-0.5 rounded-full bg-background/60 border font-mono">
                      {ROLE_LABELS[r as RoleType] ?? r}
                    </span>
                  ))}
                </div>
                <p className="text-xs opacity-70">{lvl.accessSummaryEn}</p>
                <p className="text-xs opacity-50 text-right">{lvl.accessSummaryAr}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Manage tab ────────────────────────────────────────────────────── */}
      {tab === 'manage' && (
        <div className="grid lg:grid-cols-3 gap-4">
          {/* Add Branch */}
          <div className="rounded-xl border p-4 space-y-2">
            <h2 className="font-semibold text-sm">Add Branch</h2>
            <input value={branchNameAr} onChange={(e) => setBranchNameAr(e.target.value)} placeholder="Branch name (AR)" className="w-full h-9 rounded-md border px-3 text-sm" />
            <input value={branchNameEn} onChange={(e) => setBranchNameEn(e.target.value)} placeholder="Branch name (EN)" className="w-full h-9 rounded-md border px-3 text-sm" />
            <input value={branchCode}   onChange={(e) => setBranchCode(e.target.value)}   placeholder="Code" className="w-full h-9 rounded-md border px-3 text-sm font-mono" />
            <button onClick={createBranch} className="h-9 px-4 rounded-md bg-primary text-primary-foreground text-sm hover:bg-primary/90">Add Branch</button>
          </div>

          {/* Add Department */}
          <div className="rounded-xl border p-4 space-y-2">
            <h2 className="font-semibold text-sm">Add Department</h2>
            <select value={selectedBranchId} onChange={(e) => setSelectedBranchId(e.target.value)} className="w-full h-9 rounded-md border px-3 text-sm bg-background">
              {branches.map((b) => <option key={b.id} value={b.id}>{b.nameEn}</option>)}
            </select>
            <input value={deptNameAr} onChange={(e) => setDeptNameAr(e.target.value)} placeholder="Department name (AR)" className="w-full h-9 rounded-md border px-3 text-sm" />
            <input value={deptNameEn} onChange={(e) => setDeptNameEn(e.target.value)} placeholder="Department name (EN)" className="w-full h-9 rounded-md border px-3 text-sm" />
            <input value={deptCode}   onChange={(e) => setDeptCode(e.target.value)}   placeholder="Code" className="w-full h-9 rounded-md border px-3 text-sm font-mono" />
            <select value={parentDeptId} onChange={(e) => setParentDeptId(e.target.value)} className="w-full h-9 rounded-md border px-3 text-sm bg-background">
              <option value="">No parent department</option>
              {filteredParentOptions.map((d) => <option key={d.id} value={d.id}>{d.nameEn}</option>)}
            </select>
            <button onClick={createDepartment} className="h-9 px-4 rounded-md bg-primary text-primary-foreground text-sm hover:bg-primary/90">Add Department</button>
          </div>

          {/* Assign Responsible (F13.6) */}
          <div className="rounded-xl border p-4 space-y-2">
            <h2 className="font-semibold text-sm">Assign Responsible (F13.6)</h2>
            <select value={responsibleDeptId} onChange={(e) => setResponsibleDeptId(e.target.value)} className="w-full h-9 rounded-md border px-3 text-sm bg-background">
              {departments.map((d) => <option key={d.id} value={d.id}>{d.nameEn}</option>)}
            </select>
            <select value={assigneeId} onChange={(e) => setAssigneeId(e.target.value)} className="w-full h-9 rounded-md border px-3 text-sm bg-background">
              {users.map((u) => <option key={u.id} value={u.id}>{u.nameEn}</option>)}
            </select>
            <input value={responsibleEmail} onChange={(e) => setResponsibleEmail(e.target.value)} placeholder="Email override (optional)" className="w-full h-9 rounded-md border px-3 text-sm" />
            <button onClick={assignResponsible} className="h-9 px-4 rounded-md bg-primary text-primary-foreground text-sm hover:bg-primary/90">Save</button>
          </div>
        </div>
      )}
    </div>
  );
}
