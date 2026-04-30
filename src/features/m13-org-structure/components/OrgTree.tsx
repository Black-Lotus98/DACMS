'use client';

import { useState } from 'react';
import { ChevronDown, ChevronRight, Layers, Users } from 'lucide-react';
import type { Department } from '../types';

interface DeptNodeProps {
  dept: Department;
  allDepts: Department[];
  depth?: number;
}

function DeptNode({ dept, allDepts, depth = 0 }: DeptNodeProps) {
  const [open, setOpen] = useState(depth < 1);
  const children = allDepts.filter((d) => d.parentDeptId === dept.id);

  return (
    <div>
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center gap-2 py-2 px-3 rounded-lg hover:bg-muted text-sm text-start transition-colors"
        style={{ paddingInlineStart: `${(depth + 1) * 20 + 12}px` }}
      >
        {children.length > 0
          ? open
            ? <ChevronDown className="w-3.5 h-3.5 shrink-0 text-muted-foreground" />
            : <ChevronRight className="w-3.5 h-3.5 shrink-0 text-muted-foreground" />
          : <span className="w-3.5 shrink-0" />}
        <Users className="w-4 h-4 shrink-0 text-muted-foreground" />
        <span className="flex-1">{dept.nameEn}</span>
        <span className="text-xs text-muted-foreground font-mono">{dept.code}</span>
      </button>
      {open && children.map((child) => (
        <DeptNode key={child.id} dept={child} allDepts={allDepts} depth={depth + 1} />
      ))}
    </div>
  );
}

interface OrgTreeProps {
  branchName: string;
  branchCode: string;
  rootDepts: Department[];
  allDepts: Department[];
}

export function OrgTree({ branchName, branchCode, rootDepts, allDepts }: OrgTreeProps) {
  const [open, setOpen] = useState(true);

  return (
    <div className="rounded-xl border bg-background overflow-hidden">
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center gap-2 p-3 text-sm font-semibold hover:bg-muted/50 transition-colors"
      >
        {open
          ? <ChevronDown className="w-4 h-4 text-muted-foreground" />
          : <ChevronRight className="w-4 h-4 text-muted-foreground" />}
        <Layers className="w-4 h-4 text-primary-a0" />
        <span className="flex-1 text-start">{branchName}</span>
        <span className="text-xs text-muted-foreground font-mono font-normal">{branchCode}</span>
      </button>
      {open && (
        <div className="border-t pb-2">
          {rootDepts.map((dept) => (
            <DeptNode key={dept.id} dept={dept} allDepts={allDepts} />
          ))}
        </div>
      )}
    </div>
  );
}
