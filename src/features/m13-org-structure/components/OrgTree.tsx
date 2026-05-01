'use client';

import { useState } from 'react';
import { ChevronDown, ChevronRight, Layers, Users, Trash2 } from 'lucide-react';
import type { Department } from '../types';

interface DeptNodeProps {
  dept:     Department;
  allDepts: Department[];
  onDelete?: (id: string) => void;
  depth?:   number;
}

function DeptNode({ dept, allDepts, onDelete, depth = 0 }: DeptNodeProps) {
  const [open, setOpen] = useState(depth < 1);
  const children = allDepts.filter((d) => d.parentDeptId === dept.id);

  return (
    <div>
      <div
        className="flex items-center gap-2 py-1.5 px-3 rounded-lg hover:bg-muted text-sm transition-colors group"
        style={{ paddingInlineStart: `${(depth + 1) * 20 + 12}px` }}
      >
        <button
          onClick={() => setOpen((v) => !v)}
          className="shrink-0 w-4 flex items-center justify-center"
        >
          {children.length > 0
            ? open
              ? <ChevronDown  className="w-3.5 h-3.5 text-muted-foreground" />
              : <ChevronRight className="w-3.5 h-3.5 text-muted-foreground" />
            : <span className="w-3.5" />}
        </button>
        <Users className="w-4 h-4 shrink-0 text-muted-foreground" />
        <span className="flex-1 leading-tight">
          {dept.nameEn}
          <span className="ml-1.5 text-[11px] text-muted-foreground opacity-70">{dept.nameAr}</span>
        </span>
        <span className="text-xs text-muted-foreground font-mono">{dept.code}</span>
        {onDelete && (
          <button
            onClick={() => onDelete(dept.id)}
            className="opacity-0 group-hover:opacity-100 ml-1 text-destructive hover:text-destructive/80 transition-opacity"
            title="Delete department"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
      {open && children.map((child) => (
        <DeptNode key={child.id} dept={child} allDepts={allDepts} onDelete={onDelete} depth={depth + 1} />
      ))}
    </div>
  );
}

interface OrgTreeProps {
  branchName:    string;
  branchNameAr?: string;
  branchCode:    string;
  rootDepts:     Department[];
  allDepts:      Department[];
  onDelete?:     (id: string) => void;
}

export function OrgTree({ branchName, branchNameAr, branchCode, rootDepts, allDepts, onDelete }: OrgTreeProps) {
  const [open, setOpen] = useState(true);

  return (
    <div className="rounded-xl border bg-background overflow-hidden">
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center gap-2 p-3 text-sm font-semibold hover:bg-muted/50 transition-colors"
      >
        {open
          ? <ChevronDown  className="w-4 h-4 text-muted-foreground" />
          : <ChevronRight className="w-4 h-4 text-muted-foreground" />}
        <Layers className="w-4 h-4 text-primary" />
        <span className="flex-1 text-start">
          {branchName}
          {branchNameAr && <span className="ml-2 text-xs text-muted-foreground font-normal">{branchNameAr}</span>}
        </span>
        <span className="text-xs text-muted-foreground font-mono font-normal">{branchCode}</span>
      </button>
      {open && (
        <div className="border-t pb-2">
          {rootDepts.length === 0
            ? <p className="px-4 py-2 text-xs text-muted-foreground">No departments in this branch.</p>
            : rootDepts.map((dept) => (
                <DeptNode key={dept.id} dept={dept} allDepts={allDepts} onDelete={onDelete} />
              ))
          }
        </div>
      )}
    </div>
  );
}
