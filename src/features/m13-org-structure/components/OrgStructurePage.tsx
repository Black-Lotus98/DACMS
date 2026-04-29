'use client';

import { useMemo, useState } from 'react';
import { Building2 } from 'lucide-react';
import { useOrgModule } from '../hooks';
import { OrgTree } from './OrgTree';
import { useAppDispatch } from '@/store/hooks';
import { addBranch, addDepartment, assignDepartmentResponsible } from '../store/slice';

export function OrgStructurePage() {
  const dispatch = useAppDispatch();
  const { organization, branches, getRootDepts, departments } = useOrgModule();
  const [branchName, setBranchName] = useState('');
  const [branchCode, setBranchCode] = useState('');
  const [deptName, setDeptName] = useState('');
  const [deptCode, setDeptCode] = useState('');
  const [selectedBranchId, setSelectedBranchId] = useState(branches[0]?.id ?? '');
  const [responsibleDeptId, setResponsibleDeptId] = useState(departments[0]?.id ?? '');
  const [responsibleEmail, setResponsibleEmail] = useState('');

  const branchOptions = useMemo(() => branches, [branches]);

  function createBranch() {
    if (!branchName.trim() || !branchCode.trim()) return;
    dispatch(
      addBranch({
        id: `b-${Date.now()}`,
        name: branchName.trim(),
        code: branchCode.trim(),
        organizationId: organization.id,
      })
    );
    setBranchName('');
    setBranchCode('');
  }

  function createDepartment() {
    if (!deptName.trim() || !deptCode.trim() || !selectedBranchId) return;
    dispatch(
      addDepartment({
        id: `d-${Date.now()}`,
        name: deptName.trim(),
        code: deptCode.trim(),
        branchId: selectedBranchId,
      })
    );
    setDeptName('');
    setDeptCode('');
  }

  function assignResponsible() {
    if (!responsibleDeptId || !responsibleEmail.trim()) return;
    dispatch(
      assignDepartmentResponsible({
        departmentId: responsibleDeptId,
        responsibleEmail: responsibleEmail.trim(),
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
          <p className="text-sm text-muted-foreground">{organization.name} — {organization.code}</p>
        </div>
      </div>

      <section className="rounded-xl border bg-background p-4 grid lg:grid-cols-3 gap-4">
        <div className="space-y-2">
          <h2 className="font-semibold text-sm">Add branch</h2>
          <input value={branchName} onChange={(e)=>setBranchName(e.target.value)} placeholder="Branch name" className="w-full h-9 rounded-md border px-3 text-sm" />
          <input value={branchCode} onChange={(e)=>setBranchCode(e.target.value)} placeholder="Branch code" className="w-full h-9 rounded-md border px-3 text-sm font-mono" />
          <button onClick={createBranch} className="h-9 px-3 rounded-md border text-sm hover:bg-muted">إضافة</button>
        </div>
        <div className="space-y-2">
          <h2 className="font-semibold text-sm">Add department</h2>
          <select value={selectedBranchId} onChange={(e)=>setSelectedBranchId(e.target.value)} className="w-full h-9 rounded-md border px-3 text-sm">
            {branchOptions.map((b)=><option key={b.id} value={b.id}>{b.name}</option>)}
          </select>
          <input value={deptName} onChange={(e)=>setDeptName(e.target.value)} placeholder="Department name" className="w-full h-9 rounded-md border px-3 text-sm" />
          <input value={deptCode} onChange={(e)=>setDeptCode(e.target.value)} placeholder="Department code" className="w-full h-9 rounded-md border px-3 text-sm font-mono" />
          <button onClick={createDepartment} className="h-9 px-3 rounded-md border text-sm hover:bg-muted">إضافة</button>
        </div>
        <div className="space-y-2">
          <h2 className="font-semibold text-sm">Assign department responsible</h2>
          <select value={responsibleDeptId} onChange={(e)=>setResponsibleDeptId(e.target.value)} className="w-full h-9 rounded-md border px-3 text-sm">
            {departments.map((d)=><option key={d.id} value={d.id}>{d.name}</option>)}
          </select>
          <input value={responsibleEmail} onChange={(e)=>setResponsibleEmail(e.target.value)} placeholder="email@domain.com" className="w-full h-9 rounded-md border px-3 text-sm" />
          <button onClick={assignResponsible} className="h-9 px-3 rounded-md border text-sm hover:bg-muted">Save</button>
        </div>
      </section>

      <div className="space-y-3">
        {branches.map((branch) => (
          <OrgTree
            key={branch.id}
            branchName={branch.name}
            branchCode={branch.code}
            rootDepts={getRootDepts(branch.id)}
            allDepts={departments}
          />
        ))}
      </div>
    </div>
  );
}
