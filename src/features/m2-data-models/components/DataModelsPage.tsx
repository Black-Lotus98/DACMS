'use client';

import { useState } from 'react';
import { Database, FileText, Clock } from 'lucide-react';
import { useDataModelsModule } from '../hooks';
import { ActionAfter, FieldType } from '../types';
import { useAppDispatch } from '@/store/hooks';
import { addCategory, addDocumentType, addMetadataField } from '../store/slice';

const ACTION_LABELS: Record<ActionAfter, string> = {
  [ActionAfter.Destroy]: 'إتلاف',
  [ActionAfter.Transfer]: 'نقل',
  [ActionAfter.Review]: 'مراجعة',
};

type Tab = 'types' | 'retention';

export function DataModelsPage() {
  const dispatch = useAppDispatch();
  const [tab, setTab] = useState<Tab>('types');
  const [docTypeName, setDocTypeName] = useState('');
  const [docTypeCode, setDocTypeCode] = useState('');
  const [selectedTypeId, setSelectedTypeId] = useState('');
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newFieldLabel, setNewFieldLabel] = useState('');
  const [newFieldType, setNewFieldType] = useState<FieldType>(FieldType.Text);

  const { documentTypes, retentionPolicies, getPolicyById, getCategoriesForType, getFieldsForType } =
    useDataModelsModule();

  const activeTypeId = selectedTypeId || documentTypes[0]?.id || '';

  function createDocType() {
    const fallbackPolicy = retentionPolicies[0]?.id;
    if (!docTypeName.trim() || !docTypeCode.trim() || !fallbackPolicy) return;
    dispatch(
      addDocumentType({
        id: `dt-${Date.now()}`,
        name: docTypeName.trim(),
        code: docTypeCode.trim(),
        retentionPolicyId: fallbackPolicy,
      })
    );
    setDocTypeName('');
    setDocTypeCode('');
  }

  function createCategory() {
    if (!activeTypeId || !newCategoryName.trim()) return;
    dispatch(
      addCategory({
        id: `cat-${Date.now()}`,
        name: newCategoryName.trim(),
        docTypeId: activeTypeId,
        level: 1,
      })
    );
    setNewCategoryName('');
  }

  function createMetadataField() {
    if (!activeTypeId || !newFieldLabel.trim()) return;
    dispatch(
      addMetadataField({
        id: `mf-${Date.now()}`,
        label: newFieldLabel.trim(),
        fieldType: newFieldType,
        required: false,
        docTypeId: activeTypeId,
      })
    );
    setNewFieldLabel('');
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Database className="w-6 h-6 text-primary-a0" />
        <div>
          <h1 className="text-2xl font-bold">النماذج والبيانات</h1>
          <p className="text-sm text-muted-foreground">أنواع الوثائق، هياكل الفئات، الحقول، وسياسات الاحتفاظ</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 rounded-lg bg-muted w-fit">
        {([['types', 'أنواع الوثائق', FileText], ['retention', 'سياسات الاحتفاظ', Clock]] as const).map(
          ([key, label, Icon]) => (
            <button
              key={key}
              onClick={() => setTab(key as Tab)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm transition-colors ${tab === key ? 'bg-background shadow-sm font-medium' : 'text-muted-foreground hover:text-foreground'}`}
            >
              <Icon className="w-4 h-4" />
              {label}
            </button>
          )
        )}
      </div>

      {tab === 'types' && (
        <div className="space-y-3">
          <section className="rounded-xl border bg-background p-4 grid lg:grid-cols-3 gap-4">
            <div className="space-y-2">
              <h3 className="font-semibold text-sm">إضافة نوع وثيقة</h3>
              <input value={docTypeName} onChange={(e)=>setDocTypeName(e.target.value)} placeholder="اسم النوع" className="w-full h-9 rounded-md border px-3 text-sm" />
              <input value={docTypeCode} onChange={(e)=>setDocTypeCode(e.target.value)} placeholder="الرمز (DOCX)" className="w-full h-9 rounded-md border px-3 text-sm font-mono" />
              <button onClick={createDocType} className="h-9 px-3 rounded-md border text-sm hover:bg-muted">إضافة</button>
            </div>
            <div className="space-y-2">
              <h3 className="font-semibold text-sm">إضافة فئة</h3>
              <select value={activeTypeId} onChange={(e)=>setSelectedTypeId(e.target.value)} className="w-full h-9 rounded-md border px-3 text-sm">
                {documentTypes.map((dt) => <option key={dt.id} value={dt.id}>{dt.name}</option>)}
              </select>
              <input value={newCategoryName} onChange={(e)=>setNewCategoryName(e.target.value)} placeholder="اسم الفئة" className="w-full h-9 rounded-md border px-3 text-sm" />
              <button onClick={createCategory} className="h-9 px-3 rounded-md border text-sm hover:bg-muted">إضافة</button>
            </div>
            <div className="space-y-2">
              <h3 className="font-semibold text-sm">إضافة حقل بيانات</h3>
              <select value={newFieldType} onChange={(e)=>setNewFieldType(e.target.value as FieldType)} className="w-full h-9 rounded-md border px-3 text-sm">
                {Object.values(FieldType).map((ft)=><option key={ft} value={ft}>{ft}</option>)}
              </select>
              <input value={newFieldLabel} onChange={(e)=>setNewFieldLabel(e.target.value)} placeholder="اسم الحقل" className="w-full h-9 rounded-md border px-3 text-sm" />
              <button onClick={createMetadataField} className="h-9 px-3 rounded-md border text-sm hover:bg-muted">إضافة</button>
            </div>
          </section>
          {documentTypes.map((dt) => {
            const policy = getPolicyById(dt.retentionPolicyId);
            const cats = getCategoriesForType(dt.id);
            const fields = getFieldsForType(dt.id);
            return (
              <div key={dt.id} className="rounded-xl border bg-background p-4 space-y-3">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="font-semibold">{dt.name}</p>
                    <p className="text-xs font-mono text-muted-foreground">{dt.code}</p>
                  </div>
                  <span className="text-xs bg-muted px-2 py-1 rounded-full whitespace-nowrap">
                    {policy?.name ?? '—'}
                  </span>
                </div>
                <div className="flex gap-4 text-xs text-muted-foreground border-t pt-3">
                  <span>{cats.length} فئة</span>
                  <span>{fields.length} حقل بيانات</span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {tab === 'retention' && (
        <div className="rounded-xl border bg-background overflow-hidden">
          <table className="w-full text-sm">
            <thead className="border-b bg-muted/50">
              <tr>
                <th className="text-start p-3 font-medium">السياسة</th>
                <th className="text-start p-3 font-medium">فترة الاحتفاظ</th>
                <th className="text-start p-3 font-medium">الإجراء بعد الانتهاء</th>
              </tr>
            </thead>
            <tbody>
              {retentionPolicies.map((rp) => (
                <tr key={rp.id} className="border-b last:border-b-0 hover:bg-muted/30">
                  <td className="p-3">{rp.name}</td>
                  <td className="p-3">{rp.periodYears} سنة</td>
                  <td className="p-3">
                    <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${
                      rp.actionAfter === ActionAfter.Destroy ? 'bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-400'
                      : rp.actionAfter === ActionAfter.Transfer ? 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-400'
                      : 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400'
                    }`}>
                      {ACTION_LABELS[rp.actionAfter]}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
