'use client';

import { useState } from 'react';
import { Database, FileText, Clock, Package } from 'lucide-react';
import { useDataModelsModule } from '../hooks';
import { ActionAfter, FieldType } from '../types';
import { useAppDispatch } from '@/store/hooks';
import { addBoxTemplate, addCategory, addDocumentType, addMetadataField, addShelfTemplate, deleteBoxTemplate, deleteShelfTemplate } from '../store/slice';
import Link from 'next/link';
import { useParams } from 'next/navigation';

const ACTION_LABELS: Record<ActionAfter, string> = {
  [ActionAfter.Destroy]: 'Destroy',
  [ActionAfter.Migrate]: 'Migrate',
  [ActionAfter.Review]:  'Review',
};

const ACTION_COLOR: Record<ActionAfter, string> = {
  [ActionAfter.Destroy]: 'bg-red-100 text-red-700',
  [ActionAfter.Migrate]: 'bg-blue-100 text-blue-700',
  [ActionAfter.Review]:  'bg-amber-100 text-amber-700',
};

type Tab = 'types' | 'retention' | 'templates';

const INPUT = 'w-full h-9 rounded-md border px-3 text-sm';
const BTN   = 'h-9 px-3 rounded-md border text-sm hover:bg-muted';

export function DataModelsPage() {
  const dispatch = useAppDispatch();
  const { local } = useParams<{ local: string }>();
  const [tab, setTab] = useState<Tab>('types');

  // Doc type form
  const [docTypeNameAr, setDocTypeNameAr] = useState('');
  const [docTypeNameEn, setDocTypeNameEn] = useState('');
  const [docTypeCode, setDocTypeCode]     = useState('');

  // Category form
  const [selectedTypeId,   setSelectedTypeId]   = useState('');
  const [catNameAr,        setCatNameAr]         = useState('');
  const [catNameEn,        setCatNameEn]         = useState('');
  const [catCode,          setCatCode]           = useState('');

  // Metadata field form
  const [fieldLabelAr, setFieldLabelAr] = useState('');
  const [fieldLabelEn, setFieldLabelEn] = useState('');
  const [fieldKey,     setFieldKey]     = useState('');
  const [fieldType,    setFieldType]    = useState<FieldType>(FieldType.Text);
  const [fieldRequired, setFieldRequired] = useState(false);

  // Box template form
  const [btNameAr,    setBtNameAr]    = useState('');
  const [btNameEn,    setBtNameEn]    = useState('');
  const [btCode,      setBtCode]      = useState('');
  const [btWidth,     setBtWidth]     = useState('40');
  const [btHeight,    setBtHeight]    = useState('30');
  const [btDepth,     setBtDepth]     = useState('25');
  const [btMaxDocs,   setBtMaxDocs]   = useState('500');

  // Shelf template form
  const [stNameAr,    setStNameAr]    = useState('');
  const [stNameEn,    setStNameEn]    = useState('');
  const [stCode,      setStCode]      = useState('');
  const [stSlots,     setStSlots]     = useState('10');
  const [stBoxTplId,  setStBoxTplId]  = useState('');

  const { documentTypes, retentionPolicies, getPolicyByDocTypeId, getCategoriesForType, getFieldsForType, boxTemplates, shelfTemplates, getBoxTemplateById } =
    useDataModelsModule();

  const activeTypeId = selectedTypeId || documentTypes[0]?.id || '';

  function createDocType() {
    if (!docTypeNameAr.trim() || !docTypeNameEn.trim() || !docTypeCode.trim()) return;
    dispatch(addDocumentType({
      id: `dt-${Date.now()}`,
      nameAr: docTypeNameAr.trim(),
      nameEn: docTypeNameEn.trim(),
      code: docTypeCode.trim(),
      isActive: true,
    }));
    setDocTypeNameAr(''); setDocTypeNameEn(''); setDocTypeCode('');
  }

  function createCategory() {
    if (!activeTypeId || !catNameAr.trim() || !catNameEn.trim() || !catCode.trim()) return;
    dispatch(addCategory({
      id: `cat-${Date.now()}`,
      nameAr: catNameAr.trim(),
      nameEn: catNameEn.trim(),
      code: catCode.trim(),
      docTypeId: activeTypeId,
      level: 1,
    }));
    setCatNameAr(''); setCatNameEn(''); setCatCode('');
  }

  function createBoxTemplate() {
    if (!btNameAr.trim() || !btNameEn.trim() || !btCode.trim()) return;
    dispatch(addBoxTemplate({
      id: `bt-${Date.now()}`,
      nameAr: btNameAr.trim(), nameEn: btNameEn.trim(), code: btCode.trim(),
      widthCm: Number(btWidth), heightCm: Number(btHeight), depthCm: Number(btDepth),
      maxDocs: Number(btMaxDocs),
    }));
    setBtNameAr(''); setBtNameEn(''); setBtCode('');
  }

  function createShelfTemplate() {
    if (!stNameAr.trim() || !stNameEn.trim() || !stCode.trim()) return;
    dispatch(addShelfTemplate({
      id: `st-${Date.now()}`,
      nameAr: stNameAr.trim(), nameEn: stNameEn.trim(), code: stCode.trim(),
      slots: Number(stSlots),
      boxTemplateId: stBoxTplId || undefined,
    }));
    setStNameAr(''); setStNameEn(''); setStCode(''); setStBoxTplId('');
  }

  function createMetadataField() {
    if (!activeTypeId || !fieldLabelAr.trim() || !fieldLabelEn.trim() || !fieldKey.trim()) return;
    dispatch(addMetadataField({
      id: `mf-${Date.now()}`,
      fieldKey: fieldKey.trim(),
      labelAr: fieldLabelAr.trim(),
      labelEn: fieldLabelEn.trim(),
      fieldType,
      isRequired: fieldRequired,
      docTypeId: activeTypeId,
    }));
    setFieldLabelAr(''); setFieldLabelEn(''); setFieldKey(''); setFieldRequired(false);
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Database className="w-6 h-6 text-primary-a0" />
        <div>
          <h1 className="text-2xl font-bold">Data Models</h1>
          <p className="text-sm text-muted-foreground">Document types, category hierarchies, metadata fields, and retention policies.</p>
        </div>
      </div>

      <div className="flex gap-1 p-1 rounded-lg bg-muted w-fit">
        {([['types', 'Document types', FileText], ['retention', 'Retention policies', Clock], ['templates', 'Templates', Package]] as const).map(
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
        <div className="space-y-4">
          <section className="rounded-xl border bg-background p-4 space-y-4">
            {/* Add document type */}
            <div className="space-y-2">
              <h3 className="font-semibold text-sm">Add document type</h3>
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-2">
                <input value={docTypeNameAr} onChange={(e) => setDocTypeNameAr(e.target.value)} placeholder="الاسم بالعربي" dir="rtl" className={INPUT} />
                <input value={docTypeNameEn} onChange={(e) => setDocTypeNameEn(e.target.value)} placeholder="Name (EN)" className={INPUT} />
                <input value={docTypeCode}   onChange={(e) => setDocTypeCode(e.target.value)}   placeholder="Code (e.g. CORR)" className={`${INPUT} font-mono`} />
                <button onClick={createDocType} className={BTN}>Add</button>
              </div>
            </div>

            {/* Add category */}
            <div className="space-y-2 border-t pt-4">
              <h3 className="font-semibold text-sm">Add category</h3>
              <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-2">
                <select value={activeTypeId} onChange={(e) => setSelectedTypeId(e.target.value)} className={INPUT}>
                  {documentTypes.map((dt) => <option key={dt.id} value={dt.id}>{dt.nameEn}</option>)}
                </select>
                <input value={catNameAr} onChange={(e) => setCatNameAr(e.target.value)} placeholder="الاسم بالعربي" dir="rtl" className={INPUT} />
                <input value={catNameEn} onChange={(e) => setCatNameEn(e.target.value)} placeholder="Category name (EN)" className={INPUT} />
                <input value={catCode}   onChange={(e) => setCatCode(e.target.value)}   placeholder="Code" className={`${INPUT} font-mono`} />
                <button onClick={createCategory} className={BTN}>Add</button>
              </div>
            </div>

            {/* Add metadata field */}
            <div className="space-y-2 border-t pt-4">
              <h3 className="font-semibold text-sm">Add metadata field</h3>
              <div className="grid sm:grid-cols-2 lg:grid-cols-6 gap-2">
                <input value={fieldKey}     onChange={(e) => setFieldKey(e.target.value)}     placeholder="field_key" className={`${INPUT} font-mono`} />
                <input value={fieldLabelAr} onChange={(e) => setFieldLabelAr(e.target.value)} placeholder="التسمية بالعربي" dir="rtl" className={INPUT} />
                <input value={fieldLabelEn} onChange={(e) => setFieldLabelEn(e.target.value)} placeholder="Label (EN)" className={INPUT} />
                <select value={fieldType} onChange={(e) => setFieldType(e.target.value as FieldType)} className={INPUT}>
                  {Object.values(FieldType).map((ft) => <option key={ft} value={ft}>{ft}</option>)}
                </select>
                <label className="flex items-center gap-2 text-sm h-9">
                  <input type="checkbox" checked={fieldRequired} onChange={(e) => setFieldRequired(e.target.checked)} />
                  Required
                </label>
                <button onClick={createMetadataField} className={BTN}>Add</button>
              </div>
            </div>
          </section>

          {documentTypes.map((dt) => {
            const policy = getPolicyByDocTypeId(dt.id);
            const cats   = getCategoriesForType(dt.id);
            const fields = getFieldsForType(dt.id);
            return (
              <div key={dt.id} className="rounded-xl border bg-background p-4 space-y-3">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="font-semibold">{dt.nameAr}</p>
                    <p className="text-sm text-muted-foreground">{dt.nameEn}</p>
                    <p className="text-xs font-mono text-muted-foreground">{dt.code}</p>
                    <Link href={`/${local}/data-models/type/${dt.id}`} className="text-xs text-primary hover:underline mt-1 inline-block">
                      Open type view
                    </Link>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    {!dt.isActive && <span className="text-xs px-1.5 py-0.5 rounded bg-muted text-muted-foreground">Inactive</span>}
                    {policy && (
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${ACTION_COLOR[policy.actionAfter]}`}>
                        {policy.periodYears}y → {ACTION_LABELS[policy.actionAfter]}
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex gap-4 text-xs text-muted-foreground border-t pt-2">
                  <span>{cats.length} categories</span>
                  <span>{fields.length} metadata fields</span>
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
                <th className="text-start p-3 font-medium">Document type</th>
                <th className="text-start p-3 font-medium">Period</th>
                <th className="text-start p-3 font-medium">Action after</th>
                <th className="text-start p-3 font-medium">Legal ref</th>
              </tr>
            </thead>
            <tbody>
              {retentionPolicies.map((rp) => {
                const dt = documentTypes.find((d) => d.id === rp.docTypeId);
                return (
                  <tr key={rp.id} className="border-b last:border-b-0 hover:bg-muted/30">
                    <td className="p-3">{dt ? dt.nameEn : rp.docTypeId}</td>
                    <td className="p-3">{rp.periodYears} years</td>
                    <td className="p-3">
                      <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${ACTION_COLOR[rp.actionAfter]}`}>
                        {ACTION_LABELS[rp.actionAfter]}
                      </span>
                    </td>
                    <td className="p-3 text-muted-foreground">{rp.legalRef ?? '—'}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {tab === 'templates' && (
        <div className="space-y-6">
          {/* Box templates (F2.7) */}
          <section className="rounded-xl border bg-background p-4 space-y-4">
            <h3 className="font-semibold text-sm">Box templates (F2.7)</h3>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-2">
              <input value={btNameAr}  onChange={(e) => setBtNameAr(e.target.value)}  placeholder="الاسم بالعربي" dir="rtl" className={INPUT} />
              <input value={btNameEn}  onChange={(e) => setBtNameEn(e.target.value)}  placeholder="Name (EN)"     className={INPUT} />
              <input value={btCode}    onChange={(e) => setBtCode(e.target.value)}    placeholder="Code"          className={`${INPUT} font-mono`} />
              <div className="grid grid-cols-4 gap-1">
                <input value={btWidth}   onChange={(e) => setBtWidth(e.target.value)}   placeholder="W cm" className={INPUT} type="number" />
                <input value={btHeight}  onChange={(e) => setBtHeight(e.target.value)}  placeholder="H cm" className={INPUT} type="number" />
                <input value={btDepth}   onChange={(e) => setBtDepth(e.target.value)}   placeholder="D cm" className={INPUT} type="number" />
                <input value={btMaxDocs} onChange={(e) => setBtMaxDocs(e.target.value)} placeholder="Max"  className={INPUT} type="number" />
              </div>
            </div>
            <button onClick={createBoxTemplate} className={BTN}>Add box template</button>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 border-t pt-4">
              {boxTemplates.map((bt) => (
                <div key={bt.id} className="rounded-lg border p-3 text-sm space-y-1">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="font-medium">{bt.nameEn}</p>
                      <p className="text-xs text-muted-foreground" dir="rtl">{bt.nameAr}</p>
                      <p className="font-mono text-xs text-muted-foreground">{bt.code}</p>
                    </div>
                    <button onClick={() => dispatch(deleteBoxTemplate(bt.id))} className="text-xs text-red-500 hover:underline shrink-0">Remove</button>
                  </div>
                  <p className="text-xs text-muted-foreground">{bt.widthCm}×{bt.heightCm}×{bt.depthCm} cm · max {bt.maxDocs} docs</p>
                  {bt.description && <p className="text-xs text-muted-foreground">{bt.description}</p>}
                </div>
              ))}
            </div>
          </section>

          {/* Shelf templates (F2.8) */}
          <section className="rounded-xl border bg-background p-4 space-y-4">
            <h3 className="font-semibold text-sm">Shelf templates (F2.8)</h3>
            <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-2">
              <input value={stNameAr} onChange={(e) => setStNameAr(e.target.value)} placeholder="الاسم بالعربي" dir="rtl" className={INPUT} />
              <input value={stNameEn} onChange={(e) => setStNameEn(e.target.value)} placeholder="Name (EN)"     className={INPUT} />
              <input value={stCode}   onChange={(e) => setStCode(e.target.value)}   placeholder="Code"          className={`${INPUT} font-mono`} />
              <input value={stSlots}  onChange={(e) => setStSlots(e.target.value)}  placeholder="Slots"         className={INPUT} type="number" />
              <select value={stBoxTplId} onChange={(e) => setStBoxTplId(e.target.value)} className={INPUT}>
                <option value="">Box template (opt.)</option>
                {boxTemplates.map((bt) => <option key={bt.id} value={bt.id}>{bt.nameEn}</option>)}
              </select>
            </div>
            <button onClick={createShelfTemplate} className={BTN}>Add shelf template</button>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 border-t pt-4">
              {shelfTemplates.map((st) => {
                const boxTpl = st.boxTemplateId ? getBoxTemplateById(st.boxTemplateId) : null;
                return (
                  <div key={st.id} className="rounded-lg border p-3 text-sm space-y-1">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="font-medium">{st.nameEn}</p>
                        <p className="text-xs text-muted-foreground" dir="rtl">{st.nameAr}</p>
                        <p className="font-mono text-xs text-muted-foreground">{st.code}</p>
                      </div>
                      <button onClick={() => dispatch(deleteShelfTemplate(st.id))} className="text-xs text-red-500 hover:underline shrink-0">Remove</button>
                    </div>
                    <p className="text-xs text-muted-foreground">{st.slots} slots{boxTpl ? ` · ${boxTpl.nameEn}` : ''}</p>
                    {st.description && <p className="text-xs text-muted-foreground">{st.description}</p>}
                  </div>
                );
              })}
            </div>
          </section>
        </div>
      )}
    </div>
  );
}
