'use client';

import { useMemo, useState } from 'react';
import { Building2 } from 'lucide-react';
import { useOrgModule } from '../hooks';
import { OrgTree } from './OrgTree';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { addBranch, addDepartment, assignDepartmentResponsible } from '../store/slice';
import Link from 'next/link';
import { useParams } from 'next/navigation';

export function OrgStructurePage() {
  const dispatch = useAppDispatch();
  const { organization, branches, getRootDepts, departments } = useOrgModule();
  const users = useAppSelector((s) => s.permissions.users);
  const { local } = useParams<{ local: string }>();
  const [branchNameAr, setBranchNameAr] = useState('');
  const [branchNameEn, setBranchNameEn] = useState('');
  const [branchCode, setBranchCode] = useState('');
  const [deptNameAr, setDeptNameAr] = useState('');
  const [deptNameEn, setDeptNameEn] = useState('');
  const [deptCode, setDeptCode] = useState('');
  const [selectedBranchId, setSelectedBranchId] = useState(branches[0]?.id ?? '');
  const [parentDeptId, setParentDeptId] = useState('');
  const [responsibleDeptId, setResponsibleDeptId] = useState(departments[0]?.id ?? '');
  const [assigneeId, setAssigneeId] = useState(users[0]?.id ?? '');
  const [responsibleEmail, setResponsibleEmail] = useState('');

  const branchOptions = useMemo(() => branches, [branches]);
  const filteredParentOptions = useMemo(
    () => departments.filter((d) => d.branchId === selectedBranchId),
    [departments, selectedBranchId]
  );

  function createBranch() {
    if (!branchNameAr.trim() || !branchNameEn.trim() || !branchCode.trim()) return;
    dispatch(
      addBranch({
        id: `b-${Date.now()}`,
        nameAr: branchNameAr.trim(),
        nameEn: branchNameEn.trim(),
        code: branchCode.trim(),
        organizationId: organization.id,
        isActive: true,
      })
    );
    setBranchNameAr('');
    setBranchNameEn('');
    setBranchCode('');
  }

  function createDepartment() {
    if (!deptNameAr.trim() || !deptNameEn.trim() || !deptCode.trim() || !selectedBranchId) return;
    dispatch(
      addDepartment({
        id: `d-${Date.now()}`,
        nameAr: deptNameAr.trim(),
        nameEn: deptNameEn.trim(),
        code: deptCode.trim(),
        branchId: selectedBranchId,
        parentDeptId: parentDeptId || undefined,
      })
    );
    setDeptNameAr('');
    setDeptNameEn('');
    setDeptCode('');
    setParentDeptId('');
  }

  function assignResponsible() {
    if (!responsibleDeptId || !assigneeId) return;
    const assignee = users.find((u) => u.id === assigneeId);
    dispatch(
      assignDepartmentResponsible({
        departmentId: responsibleDeptId,
        assigneeId,
        responsibleEmail: responsibleEmail.trim() || assignee?.email,
      })
    );
    setResponsibleEmail('');
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Building2 className="w-6 h-6 text-primary-a0" />
        <div>
          <h1 className="text-2xl font-bold">Org Structure</h1>
          <p className="text-sm text-muted-foreground">{organization.nameEn} — {organization.code}</p>
        </div>
      </div>

      <section className="rounded-xl border bg-background p-4 grid lg:grid-cols-3 gap-4">
        <div className="space-y-2">
          <h2 className="font-semibold text-sm">Add branch</h2>
          <input value={branchNameAr} onChange={(e)=>setBranchNameAr(e.target.value)} placeholder="Branch name (AR)" className="w-full h-9 rounded-md border px-3 text-sm" />
          <input value={branchNameEn} onChange={(e)=>setBranchNameEn(e.target.value)} placeholder="Branch name (EN)" className="w-full h-9 rounded-md border px-3 text-sm" />
          <input value={branchCode} onChange={(e)=>setBranchCode(e.target.value)} placeholder="Branch code" className="w-full h-9 rounded-md border px-3 text-sm font-mono" />
          <button onClick={createBranch} className="h-9 px-3 rounded-md border text-sm hover:bg-muted">Add</button>
        </div>
        <div className="space-y-2">
          <h2 className="font-semibold text-sm">Add department</h2>
          <select value={selectedBranchId} onChange={(e)=>setSelectedBranchId(e.target.value)} className="w-full h-9 rounded-md border px-3 text-sm">
            {branchOptions.map((b)=><option key={b.id} value={b.id}>{b.nameEn}</option>)}
          </select>
          <input value={deptNameAr} onChange={(e)=>setDeptNameAr(e.target.value)} placeholder="Department name (AR)" className="w-full h-9 rounded-md border px-3 text-sm" />
          <input value={deptNameEn} onChange={(e)=>setDeptNameEn(e.target.value)} placeholder="Department name (EN)" className="w-full h-9 rounded-md border px-3 text-sm" />
          <input value={deptCode} onChange={(e)=>setDeptCode(e.target.value)} placeholder="Department code" className="w-full h-9 rounded-md border px-3 text-sm font-mono" />
          <select value={parentDeptId} onChange={(e)=>setParentDeptId(e.target.value)} className="w-full h-9 rounded-md border px-3 text-sm">
            <option value="">No parent department</option>
            {filteredParentOptions.map((d)=><option key={d.id} value={d.id}>{d.nameEn}</option>)}
          </select>
          <button onClick={createDepartment} className="h-9 px-3 rounded-md border text-sm hover:bg-muted">Add</button>
        </div>
        <div className="space-y-2">
          <h2 className="font-semibold text-sm">Assign department responsible</h2>
          <select value={responsibleDeptId} onChange={(e)=>setResponsibleDeptId(e.target.value)} className="w-full h-9 rounded-md border px-3 text-sm">
            {departments.map((d)=><option key={d.id} value={d.id}>{d.nameEn}</option>)}
          </select>
          <select value={assigneeId} onChange={(e)=>setAssigneeId(e.target.value)} className="w-full h-9 rounded-md border px-3 text-sm">
            {users.map((u)=><option key={u.id} value={u.id}>{u.nameEn}</option>)}
          </select>
          <input value={responsibleEmail} onChange={(e)=>setResponsibleEmail(e.target.value)} placeholder="Responsible email (optional override)" className="w-full h-9 rounded-md border px-3 text-sm" />
          <button onClick={assignResponsible} className="h-9 px-3 rounded-md border text-sm hover:bg-muted">Save</button>
        </div>
      </section>

      <div className="space-y-3">
        {branches.map((branch) => (
          <div key={branch.id} className="space-y-2">
            <Link href={`/${local}/org-structure/branch/${branch.id}`} className="text-sm text-primary hover:underline">
              Open branch view: {branch.nameEn}
            </Link>
            <OrgTree
              branchName={branch.nameEn}
              branchCode={branch.code}
              rootDepts={getRootDepts(branch.id)}
              allDepts={departments}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
