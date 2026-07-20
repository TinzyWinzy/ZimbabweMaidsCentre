import { useMemo, useRef, useState } from 'react'
import type { ReactElement } from 'react'
import { CheckCircle2, Download, Eye, EyeOff, FileUp, Pencil, Plus, Search, X } from 'lucide-react'
import { useAdminWorkers } from '@/features/operations/useOperations'
import type { AdminWorker } from '@/types/operations'

const blankWorker = {
  workerId: '', fullName: '', email: '', phoneNumber: '', whatsappNumber: '', city: 'Harare',
  suburb: '', category: 'Housekeeper', workTypes: [] as string[], skills: [] as string[],
  languages: [] as string[], experienceYears: 0, salaryMin: 0, salaryMax: 0,
  bio: '', adminNotes: '', isPublished: false,
}

function list(value: string) {
  return value.split(',').map((item) => item.trim()).filter(Boolean)
}

function parseCsv(source: string) {
  const rows: string[][] = []
  let row: string[] = []; let cell = ''; let quoted = false
  for (let i = 0; i < source.length; i += 1) {
    const char = source[i]
    if (char === '"') {
      if (quoted && source[i + 1] === '"') { cell += '"'; i += 1 } else quoted = !quoted
    } else if (char === ',' && !quoted) { row.push(cell); cell = '' }
    else if ((char === '\n' || char === '\r') && !quoted) {
      if (char === '\r' && source[i + 1] === '\n') i += 1
      row.push(cell); if (row.some((item) => item.trim())) rows.push(row); row = []; cell = ''
    } else cell += char
  }
  row.push(cell); if (row.some((item) => item.trim())) rows.push(row)
  if (rows.length < 2) return []
  const headers = rows[0].map((header) => header.trim())
  return rows.slice(1).map((values) => Object.fromEntries(headers.map((header, index) => [header, values[index]?.trim() || ''])))
}

export function AdminWorkersPage() {
  const { workers, isLoading, create, update, importRows } = useAdminWorkers()
  const inputRef = useRef<HTMLInputElement>(null)
  const [search, setSearch] = useState('')
  const [published, setPublished] = useState('all')
  const [editing, setEditing] = useState<typeof blankWorker | null>(null)
  const [message, setMessage] = useState('')
  const [formError, setFormError] = useState('')
  const filtered = useMemo(() => workers.filter((worker) => {
    const matches = `${worker.fullName} ${worker.email} ${worker.category} ${worker.location.city} ${worker.skills.join(' ')}`.toLowerCase().includes(search.toLowerCase())
    return matches && (published === 'all' || worker.isPublished === (published === 'published'))
  }), [workers, search, published])

  function openWorker(worker?: AdminWorker) {
    setFormError('')
    if (!worker) return setEditing({ ...blankWorker })
    setEditing({
      workerId: worker.id, fullName: worker.fullName, email: worker.email, phoneNumber: worker.phoneNumber,
      whatsappNumber: worker.whatsappNumber, city: worker.location.city, suburb: worker.location.suburb,
      category: worker.category, workTypes: worker.workTypes, skills: worker.skills, languages: worker.languages,
      experienceYears: worker.experienceYears, salaryMin: worker.expectedSalary.min, salaryMax: worker.expectedSalary.max,
      bio: worker.bio, adminNotes: worker.adminNotes, isPublished: worker.isPublished,
    })
  }

  async function save() {
    if (!editing?.fullName || (!editing.workerId && !editing.email.includes('@'))) {
      setFormError('Full name and a valid email are required.')
      return
    }
    setFormError('')
    try {
      if (editing.workerId) await update.mutateAsync(editing)
      else await create.mutateAsync(editing)
      setEditing(null)
      setMessage(editing.workerId ? 'Worker profile updated.' : 'Worker profile created as unpublished.')
    } catch (error) {
      setFormError(error instanceof Error ? error.message : 'Could not save worker.')
    }
  }

  async function importCsv(file: File) {
    const raw = parseCsv(await file.text())
    const rows = raw.map((item) => ({
      fullName: item.fullName, email: item.email, phoneNumber: item.phoneNumber, whatsappNumber: item.whatsappNumber,
      city: item.city, suburb: item.suburb, category: item.category,
      workTypes: list(item.workTypes || ''), skills: list(item.skills || ''), languages: list(item.languages || ''),
      experienceYears: Number(item.experienceYears || 0), salaryMin: Number(item.salaryMin || 0),
      salaryMax: Number(item.salaryMax || 0), bio: item.bio,
    }))
    try {
      const result = await importRows.mutateAsync(rows)
      setMessage(`${result.imported} workers imported unpublished${result.failed ? `; ${result.failed} rows need correction` : ''}.`)
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Import failed.')
    }
    if (inputRef.current) inputRef.current.value = ''
  }

  function downloadTemplate() {
    const content = 'fullName,email,phoneNumber,whatsappNumber,city,suburb,category,workTypes,skills,languages,experienceYears,salaryMin,salaryMax,bio\n'
    const link = document.createElement('a')
    link.href = URL.createObjectURL(new Blob([content], { type: 'text/csv' }))
    link.download = 'zmc-worker-import-template.csv'
    link.click()
    URL.revokeObjectURL(link.href)
  }

  return (
    <div className="space-y-7">
      <header className="flex flex-col gap-5 border-b border-[#dfe6df] pb-7 sm:flex-row sm:items-end sm:justify-between">
        <div><p className="mb-2 text-[10px] font-bold uppercase tracking-[0.2em] text-[#4d8d3a]">Placement inventory</p><h1 className="font-display text-3xl font-semibold tracking-[-0.035em] text-[#173129] md:text-[42px]">Worker roster</h1><p className="mt-2 text-sm text-[#66766e]">Control every profile that can be presented to a family.</p></div>
        <div className="flex flex-wrap gap-2">
          <button onClick={downloadTemplate} className="inline-flex h-10 items-center gap-2 rounded-lg border border-[#d6ded7] bg-white px-4 text-sm font-semibold text-[#40564c]"><Download className="h-4 w-4" /> Template</button>
          <input ref={inputRef} type="file" accept=".csv,text/csv" className="hidden" onChange={(event) => event.target.files?.[0] && importCsv(event.target.files[0])} />
          <button onClick={() => inputRef.current?.click()} disabled={importRows.isPending} className="inline-flex h-10 items-center gap-2 rounded-lg border border-[#d6ded7] bg-white px-4 text-sm font-semibold text-[#40564c]"><FileUp className="h-4 w-4" /> Import CSV</button>
          <button onClick={() => openWorker()} className="inline-flex h-10 items-center gap-2 rounded-lg bg-[#173129] px-4 text-sm font-semibold text-white"><Plus className="h-4 w-4" /> Add worker</button>
        </div>
      </header>
      {message && <div className="flex items-center justify-between rounded-lg border border-[#bed5b8] bg-[#eef5ea] px-4 py-3 text-sm text-[#315d4d]"><span className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4" /> {message}</span><button onClick={() => setMessage('')} aria-label="Dismiss"><X className="h-4 w-4" /></button></div>}
      <div className="grid gap-3 rounded-xl border border-[#dfe6df] bg-white p-4 sm:grid-cols-[1fr_200px]">
        <label className="flex h-11 items-center gap-3 rounded-lg border border-[#dfe6df] px-3"><Search className="h-4 w-4 text-[#87938c]" /><input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search workers, skills, or location" className="w-full bg-transparent text-sm outline-none" /></label>
        <select value={published} onChange={(e) => setPublished(e.target.value)} className="h-11 rounded-lg border border-[#dfe6df] bg-white px-3 text-sm"><option value="all">All profiles</option><option value="published">Published</option><option value="unpublished">Unpublished</option></select>
      </div>
      <section className="overflow-hidden rounded-xl border border-[#dfe6df] bg-white">
        <div className="grid grid-cols-[1fr_110px] border-b border-[#e4e9e3] bg-[#f8faf6] px-5 py-3 text-[10px] font-bold uppercase tracking-[0.14em] text-[#7b8981] sm:grid-cols-[1.2fr_0.8fr_0.7fr_120px_72px]"><span>Professional</span><span className="hidden sm:block">Category</span><span className="hidden sm:block">Experience</span><span>Status</span><span /></div>
        {isLoading ? <p className="p-8 text-sm text-[#66766e]">Loading roster…</p> : filtered.length === 0 ? <p className="p-10 text-center text-sm text-[#66766e]">No worker profiles match this view.</p> :
          <div className="divide-y divide-[#e8ece7]">{filtered.map((worker) => <article key={worker.id} className="grid grid-cols-[1fr_110px] items-center px-5 py-4 sm:grid-cols-[1.2fr_0.8fr_0.7fr_120px_72px]">
            <div className="min-w-0"><p className="truncate text-sm font-semibold text-[#253b33]">{worker.fullName}</p><p className="mt-1 truncate text-xs text-[#7b8981]">{worker.location.suburb || worker.location.city} · {worker.skills.slice(0, 2).join(', ') || 'Profile incomplete'}</p></div>
            <p className="hidden text-sm text-[#5f7168] sm:block">{worker.category}</p>
            <p className="hidden text-sm text-[#5f7168] sm:block">{worker.experienceYears} years</p>
            <span className={`flex w-fit items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold ${worker.isPublished ? 'bg-[#e8f0e7] text-[#315d4d]' : 'bg-[#f1eee5] text-[#746b57]'}`}>{worker.isPublished ? <Eye className="h-3 w-3" /> : <EyeOff className="h-3 w-3" />}{worker.isPublished ? 'Published' : 'Private'}</span>
            <button onClick={() => openWorker(worker)} className="ml-auto flex h-9 w-9 items-center justify-center rounded-lg border border-[#dfe6df] text-[#617069] hover:text-[#173129]" aria-label={`Edit ${worker.fullName}`}><Pencil className="h-4 w-4" /></button>
          </article>)}</div>}
      </section>
      {editing && <WorkerEditor worker={editing} setWorker={setEditing} onClose={() => setEditing(null)} onSave={save} error={formError} busy={create.isPending || update.isPending} />}
    </div>
  )
}

function WorkerEditor({ worker, setWorker, onClose, onSave, error, busy }: { worker: typeof blankWorker; setWorker: (value: typeof blankWorker) => void; onClose: () => void; onSave: () => void; error: string; busy: boolean }) {
  const set = (key: keyof typeof worker, value: string | number | boolean | string[]) => setWorker({ ...worker, [key]: value })
  return <div className="fixed inset-0 z-[70] flex justify-end bg-[#10271f]/45" role="dialog" aria-modal="true"><div className="h-full w-full max-w-2xl overflow-y-auto bg-[#f8f7f2] shadow-2xl">
    <div className="sticky top-0 z-10 flex items-center justify-between border-b border-[#dfe6df] bg-[#f8f7f2]/95 px-6 py-5 backdrop-blur"><div><p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#4d8d3a]">{worker.workerId ? 'Edit profile' : 'New profile'}</p><h2 className="mt-1 font-display text-2xl font-semibold text-[#173129]">{worker.fullName || 'Add a professional'}</h2></div><button onClick={onClose} className="p-2"><X className="h-5 w-5" /></button></div>
    <div className="grid gap-5 p-6 sm:grid-cols-2">
      <EditorField label="Full name"><input value={worker.fullName} onChange={(e) => set('fullName', e.target.value)} /></EditorField>
      <EditorField label="Email"><input type="email" disabled={!!worker.workerId} value={worker.email} onChange={(e) => set('email', e.target.value)} /></EditorField>
      <EditorField label="Phone"><input value={worker.phoneNumber} onChange={(e) => set('phoneNumber', e.target.value)} /></EditorField>
      <EditorField label="WhatsApp"><input value={worker.whatsappNumber} onChange={(e) => set('whatsappNumber', e.target.value)} /></EditorField>
      <EditorField label="City"><input value={worker.city} onChange={(e) => set('city', e.target.value)} /></EditorField>
      <EditorField label="Suburb"><input value={worker.suburb} onChange={(e) => set('suburb', e.target.value)} /></EditorField>
      <EditorField label="Category"><select value={worker.category} onChange={(e) => set('category', e.target.value)}>{['Housekeeper', 'Nanny', 'Chef', 'Gardener', 'Nurse Aide', 'Driver'].map((item) => <option key={item}>{item}</option>)}</select></EditorField>
      <EditorField label="Years experience"><input type="number" min="0" value={worker.experienceYears} onChange={(e) => set('experienceYears', Number(e.target.value))} /></EditorField>
      <EditorField label="Salary minimum"><input type="number" min="0" value={worker.salaryMin} onChange={(e) => set('salaryMin', Number(e.target.value))} /></EditorField>
      <EditorField label="Salary maximum"><input type="number" min="0" value={worker.salaryMax} onChange={(e) => set('salaryMax', Number(e.target.value))} /></EditorField>
      <EditorField label="Work types" wide><input value={worker.workTypes.join(', ')} onChange={(e) => set('workTypes', list(e.target.value))} placeholder="live-in, live-out, part-time" /></EditorField>
      <EditorField label="Skills" wide><input value={worker.skills.join(', ')} onChange={(e) => set('skills', list(e.target.value))} placeholder="Childcare, Cooking, Laundry" /></EditorField>
      <EditorField label="Languages" wide><input value={worker.languages.join(', ')} onChange={(e) => set('languages', list(e.target.value))} placeholder="English, Shona, Ndebele" /></EditorField>
      <EditorField label="Public biography" wide><textarea value={worker.bio} onChange={(e) => set('bio', e.target.value)} /></EditorField>
      <EditorField label="Internal notes" wide><textarea value={worker.adminNotes} onChange={(e) => set('adminNotes', e.target.value)} /></EditorField>
      <label className="flex items-center gap-3 sm:col-span-2"><input type="checkbox" checked={worker.isPublished} onChange={(e) => set('isPublished', e.target.checked)} className="h-4 w-4 accent-[#43892d]" /><span className="text-sm font-semibold text-[#31483f]">Publish this profile in the public directory</span></label>
      {error && <p className="text-sm text-red-700 sm:col-span-2">{error}</p>}
    </div>
    <div className="sticky bottom-0 flex justify-end gap-3 border-t border-[#dfe6df] bg-[#f8f7f2] px-6 py-4"><button onClick={onClose} className="h-11 px-5 text-sm font-semibold text-[#617069]">Cancel</button><button disabled={busy} onClick={onSave} className="h-11 rounded-lg bg-[#173129] px-6 text-sm font-semibold text-white disabled:opacity-50">{busy ? 'Saving…' : 'Save profile'}</button></div>
  </div></div>
}

function EditorField({ label, wide, children }: { label: string; wide?: boolean; children: ReactElement }) {
  return <label className={wide ? 'sm:col-span-2' : ''}><span className="mb-2 block text-xs font-semibold text-[#5f7168]">{label}</span><span className="[&>input]:h-11 [&>input]:w-full [&>input]:rounded-lg [&>input]:border [&>input]:border-[#d6ded7] [&>input]:bg-white [&>input]:px-3 [&>input]:text-sm [&>input]:outline-none [&>select]:h-11 [&>select]:w-full [&>select]:rounded-lg [&>select]:border [&>select]:border-[#d6ded7] [&>select]:bg-white [&>select]:px-3 [&>select]:text-sm [&>textarea]:min-h-24 [&>textarea]:w-full [&>textarea]:rounded-lg [&>textarea]:border [&>textarea]:border-[#d6ded7] [&>textarea]:bg-white [&>textarea]:p-3 [&>textarea]:text-sm [&>textarea]:outline-none">{children}</span></label>
}

export default AdminWorkersPage
