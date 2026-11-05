import { useMemo, useState } from 'react'
import { LayoutDashboard, GraduationCap, Users, BookOpen, ClipboardList, Wallet, FileBarChart, Settings, Search, Bell, Menu, X, ChevronDown, Plus, Download, CheckCircle2, AlertCircle, Trash2, Pencil, CalendarDays, TrendingUp, School, UserCheck, BookMarked } from 'lucide-react'

const nav = [
  { label: 'Overview', icon: LayoutDashboard },
  { label: 'Students', icon: GraduationCap },
  { label: 'Teachers', icon: Users },
  { label: 'Classes & subjects', icon: BookOpen },
  { label: 'Subjects', icon: BookMarked },
  { label: 'Attendance', icon: ClipboardList },
  { label: 'Marks', icon: BookMarked },
  { label: 'Report cards', icon: FileBarChart },
  { label: 'Fees', icon: Wallet },
  { label: 'Reports', icon: FileBarChart },
]
const seed = {
  students: [
    { id: 'STU-0248', name: 'Amelia Nansubuga', className: 'Senior 4', gender: 'Female', guardian: 'Grace Nansubuga', phone: '0700000001', status: 'Active' },
    { id: 'STU-0247', name: 'Daniel Okello', className: 'Senior 3', gender: 'Male', guardian: 'Peter Okello', phone: '0700000002', status: 'Active' },
    { id: 'STU-0246', name: 'Sarah Namutebi', className: 'Senior 2', gender: 'Female', guardian: 'Mary Namutebi', phone: '0700000003', status: 'Pending' },
    { id: 'STU-0245', name: 'Brian Kato', className: 'Senior 4', gender: 'Male', guardian: 'John Kato', phone: '0700000004', status: 'Active' },
  ],
  teachers: [
    { id: 'TCH-001', name: 'Esther Achieng', subject: 'Mathematics', phone: '0701000001', email: 'esther@example.com', status: 'Active' },
    { id: 'TCH-002', name: 'Moses Ssemanda', subject: 'English', phone: '0701000002', email: 'moses@example.com', status: 'Active' },
    { id: 'TCH-003', name: 'Peter Lwanga', subject: 'Physics', phone: '0701000003', email: 'peter@example.com', status: 'Active' },
  ],
  subjects: [
    { id: 'SUB-01', name: 'Mathematics', code: 'MTC', level: 'O-Level', teacher: 'Esther Achieng' },
    { id: 'SUB-02', name: 'English Language', code: 'ENG', level: 'O-Level', teacher: 'Moses Ssemanda' },
    { id: 'SUB-03', name: 'Physics', code: 'PHY', level: 'O-Level', teacher: 'Peter Lwanga' },
    { id: 'SUB-04', name: 'Biology', code: 'BIO', level: 'O-Level', teacher: 'Not assigned' },
  ],
  classes: [
    { id: 'CLS-01', name: 'Senior 1', classTeacher: 'Esther Achieng', room: 'Block A · 01', students: '32' },
    { id: 'CLS-02', name: 'Senior 2', classTeacher: 'Moses Ssemanda', room: 'Block A · 02', students: '29' },
    { id: 'CLS-03', name: 'Senior 3', classTeacher: 'Peter Lwanga', room: 'Block B · 01', students: '27' },
    { id: 'CLS-04', name: 'Senior 4', classTeacher: 'Esther Achieng', room: 'Block B · 02', students: '25' },
  ],
  attendance: [],
  marks: [
    { id: 'MRK-01', student: 'Amelia Nansubuga', className: 'Senior 4', subject: 'Mathematics', assessment: 'Beginning of term', score: '78', outOf: '100', term: 'Term 1' },
    { id: 'MRK-02', student: 'Daniel Okello', className: 'Senior 3', subject: 'English', assessment: 'Beginning of term', score: '82', outOf: '100', term: 'Term 1' },
    { id: 'MRK-03', student: 'Sarah Namutebi', className: 'Senior 2', subject: 'Biology', assessment: 'Beginning of term', score: '69', outOf: '100', term: 'Term 1' },
  ],
  fees: [
    { id: 'FEE-001', student: 'Amelia Nansubuga', className: 'Senior 4', amount: '450000', method: 'Bank', date: '2026-11-05', reference: 'DEMO-1001' },
    { id: 'FEE-002', student: 'Daniel Okello', className: 'Senior 3', amount: '300000', method: 'Mobile money', date: '2026-11-04', reference: 'DEMO-1002' },
  ],
}
const today = new Date().toISOString().slice(0, 10)
function useStoredState(key, fallback) {
  const [value, setValue] = useState(() => {
    try { const saved = localStorage.getItem('gency_' + key); return saved ? JSON.parse(saved) : fallback }
    catch { return fallback }
  })
  const save = (next) => { setValue(next); try { localStorage.setItem('gency_' + key, JSON.stringify(next)) } catch {} }
  return [value, save]
}
const initials = (name = '') => name.split(/\s+/).map(part => part[0]).join('').slice(0, 2).toUpperCase()
const money = value => 'UGX ' + Number(value || 0).toLocaleString('en-UG')
function App() {
  const [active, setActive] = useState('Overview')
  const [mobileOpen, setMobileOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [students, setStudents] = useStoredState('students', seed.students)
  const [teachers, setTeachers] = useStoredState('teachers', seed.teachers)
  const [classes, setClasses] = useStoredState('classes', seed.classes)
  const [subjects, setSubjects] = useStoredState('subjects', seed.subjects)
  const [grading, setGrading] = useStoredState('grading', [{ grade: 'A', min: 80, remark: 'Excellent' }, { grade: 'B', min: 70, remark: 'Very good' }, { grade: 'C', min: 60, remark: 'Good' }, { grade: 'D', min: 50, remark: 'Fair' }, { grade: 'E', min: 0, remark: 'Needs improvement' }])
  const [reportStudentId, setReportStudentId] = useState('')
  const [attendance, setAttendance] = useStoredState('attendance', seed.attendance)
  const [marks, setMarks] = useStoredState('marks', seed.marks)
  const [fees, setFees] = useStoredState('fees', seed.fees)
  const [notice, setNotice] = useState('')
  const select = label => { setActive(label); setMobileOpen(false); setQuery(''); setNotice('') }
  const todayAttendance = attendance.filter(a => a.date === today)
  const presentCount = todayAttendance.filter(a => a.status === 'Present').length
  const totalCollected = fees.reduce((sum, fee) => sum + Number(fee.amount || 0), 0)
  const filteredStudents = useMemo(() => students.filter(s => Object.values(s).join(' ').toLowerCase().includes(query.toLowerCase())), [students, query])
  const filteredTeachers = useMemo(() => teachers.filter(s => Object.values(s).join(' ').toLowerCase().includes(query.toLowerCase())), [teachers, query])
  const filteredClasses = useMemo(() => classes.filter(s => Object.values(s).join(' ').toLowerCase().includes(query.toLowerCase())), [classes, query])
  const filteredSubjects = useMemo(() => subjects.filter(s => Object.values(s).join(' ').toLowerCase().includes(query.toLowerCase())), [subjects, query])
  const filteredFees = useMemo(() => fees.filter(s => Object.values(s).join(' ').toLowerCase().includes(query.toLowerCase())), [fees, query])
  const filteredMarks = useMemo(() => marks.filter(s => Object.values(s).join(' ').toLowerCase().includes(query.toLowerCase())), [marks, query])
  const addStudent = () => {
    const name = window.prompt('Student full name')
    if (!name?.trim()) return
    const className = window.prompt('Class (e.g. Senior 1)') || 'Not assigned'
    const guardian = window.prompt('Parent / guardian name') || 'Not provided'
    const phone = window.prompt('Guardian phone number') || ''
    setStudents([...students, { id: 'STU-' + String(Date.now()).slice(-6), name: name.trim(), className, gender: 'Not specified', guardian, phone, status: 'Active' }])
    setNotice('Student record added and saved on this device.')
  }
  const addTeacher = () => {
    const name = window.prompt('Teacher full name')
    if (!name?.trim()) return
    const subject = window.prompt('Main subject taught') || 'Not assigned'
    const phone = window.prompt('Phone number') || ''
    const email = window.prompt('Email address') || ''
    setTeachers([...teachers, { id: 'TCH-' + String(Date.now()).slice(-5), name: name.trim(), subject, phone, email, status: 'Active' }])
    setNotice('Teacher record added.')
  }
  const addSubject = () => {
    const name = window.prompt('Subject name')
    if (!name?.trim()) return
    const code = window.prompt('Subject code') || name.trim().slice(0,3).toUpperCase()
    const level = window.prompt('Level (O-Level / A-Level)') || 'O-Level'
    const teacher = window.prompt('Assigned teacher') || 'Not assigned'
    setSubjects([...subjects, { id: 'SUB-' + String(Date.now()).slice(-5), name: name.trim(), code: code.trim().toUpperCase(), level, teacher }])
    setNotice('Subject added.')
  }
  const addClass = () => {
    const name = window.prompt('Class name (e.g. Senior 1)')
    if (!name?.trim()) return
    const classTeacher = window.prompt('Class teacher') || 'Not assigned'
    const room = window.prompt('Room / classroom') || 'Not assigned'
    setClasses([...classes, { id: 'CLS-' + String(Date.now()).slice(-5), name: name.trim(), classTeacher, room, students: '0' }])
    setNotice('Class created.')
  }
  const addMark = () => {
    const student = window.prompt('Student full name')
    if (!student?.trim()) return
    const subject = window.prompt('Subject') || 'Not specified'
    const score = window.prompt('Score achieved (number)')
    if (score === null || score.trim() === '' || !Number.isFinite(Number(score))) return
    const outOf = window.prompt('Total possible marks', '100') || '100'
    setMarks([...marks, { id: 'MRK-' + String(Date.now()).slice(-5), student: student.trim(), className: 'Not assigned', subject, assessment: 'Assessment', score, outOf, term: 'Term 1' }])
    setNotice('Assessment mark saved.')
  }
  const addFee = () => {
    const student = window.prompt('Student full name')
    if (!student?.trim()) return
    const amount = window.prompt('Amount received in UGX')
    if (amount === null || amount.trim() === '' || !Number.isFinite(Number(amount)) || Number(amount) <= 0) return
    const method = window.prompt('Payment method (Cash / Bank / Mobile money)') || 'Not specified'
    setFees([...fees, { id: 'FEE-' + String(Date.now()).slice(-5), student: student.trim(), className: 'Not assigned', amount, method, date: today, reference: 'MANUAL' }])
    setNotice('Fee payment recorded.')
  }
  const markAttendance = (student, status) => {
    const exists = attendance.find(a => a.studentId === student.id && a.date === today)
    const next = exists ? attendance.map(a => a.id === exists.id ? { ...a, status } : a) : [...attendance, { id: 'ATT-' + student.id + '-' + today, studentId: student.id, student: student.name, className: student.className, date: today, status }]
    setAttendance(next); setNotice('Attendance updated for ' + student.name + '.')
  }
  const removeRecord = (type, id) => {
    if (!window.confirm('Delete this record? This cannot be undone on this device.')) return
    const setters = { students: [students, setStudents], teachers: [teachers, setTeachers], classes: [classes, setClasses], marks: [marks, setMarks], fees: [fees, setFees] }
    const [items, setter] = setters[type]
    setter(items.filter(item => item.id !== id)); setNotice('Record deleted.')
  }
  const exportCsv = (rows, filename) => {
    if (!rows.length) { setNotice('There are no records to export yet.'); return }
    const keys = Object.keys(rows[0])
    const csv = [keys.join(','), ...rows.map(row => keys.map(key => '"' + String(row[key] ?? '').replaceAll('"', '""') + '"').join(','))].join('\n')
    const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8;' }))
    const link = document.createElement('a'); link.href = url; link.download = filename; link.click(); URL.revokeObjectURL(url)
  }
  const addButton = { Students: addStudent, Teachers: addTeacher, 'Classes & subjects': addClass, Subjects: addSubject, Marks: addMark, Fees: addFee }
  const addLabels = { Students: 'Add student', Teachers: 'Add teacher', 'Classes & subjects': 'Add class', Subjects: 'Add subject', Marks: 'Record marks', Fees: 'Record payment' }
  const table = (headers, rows, type, empty) => <div className="overflow-x-auto"><table className="w-full min-w-[650px] text-left"><thead className="bg-slate-50 text-[10px] uppercase tracking-wider text-slate-400"><tr>{headers.map(h => <th key={h} className="px-5 py-3 font-semibold">{h}</th>)}<th className="px-5 py-3">Action</th></tr></thead><tbody>{rows.map(row => <tr key={row.id} className="border-t border-slate-100 hover:bg-slate-50/60">{headers.map((h, i) => <td key={h} className="px-5 py-4 text-xs text-slate-600">{row._cells[i]}</td>)}<td className="px-5 py-4"><button aria-label="Delete record" onClick={() => removeRecord(type, row.id)} className="rounded-lg p-2 text-slate-400 hover:bg-rose-50 hover:text-rose-600"><Trash2 size={15}/></button></td></tr>)}</tbody></table>{rows.length === 0 && <p className="p-9 text-center text-sm text-slate-400">{empty}</p>}</div>
  const makeRows = (items, cells) => items.map(item => ({ ...item, _cells: cells(item) }))
  const headerActions = <div className="flex flex-col gap-3 sm:flex-row"><div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2.5"><Search size={15} className="text-slate-400"/><input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search records..." className="w-full bg-transparent text-xs outline-none sm:w-44"/></div>{addButton[active] && <button onClick={addButton[active]} className="inline-flex items-center justify-center gap-2 rounded-xl bg-navy-950 px-4 py-2.5 text-xs font-semibold text-white"><Plus size={15}/>{addLabels[active]}</button>}</div>
  const pageTitle = { Students: 'Student directory', Teachers: 'Teaching staff', 'Classes & subjects': 'Classes & subjects', Subjects: 'Subject catalogue', Attendance: 'Daily attendance', Marks: 'Marks & assessments', 'Report cards': 'Academic report cards', Fees: 'Fees & payments', Reports: 'School reports' }
  return <div className="min-h-screen bg-canvas">
    {mobileOpen && <button aria-label="Close menu" onClick={() => setMobileOpen(false)} className="fixed inset-0 z-30 bg-navy-950/50 lg:hidden"/>}
    <aside className={`fixed inset-y-0 left-0 z-40 flex w-[258px] flex-col bg-navy-950 text-white transition-transform lg:translate-x-0 ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}`}>
      <div className="flex h-[82px] items-center justify-between border-b border-white/10 px-6"><div className="flex items-center gap-3"><div className="grid h-10 w-10 place-items-center rounded-xl bg-gold-500 text-navy-950"><GraduationCap size={23}/></div><div><div className="font-display text-xl font-extrabold">gency<span className="text-gold-400">.</span></div><div className="text-[10px] uppercase tracking-[.2em] text-slate-400">School workspace</div></div></div><button className="lg:hidden text-slate-300" onClick={() => setMobileOpen(false)}><X size={20}/></button></div>
      <div className="px-4 pt-7"><p className="px-3 pb-3 text-[10px] font-bold uppercase tracking-[.18em] text-slate-500">Workspace</p><nav className="space-y-1">{nav.map(({ label, icon: Icon }) => <button key={label} onClick={() => select(label)} className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-[13px] font-medium transition ${active === label ? 'bg-white/10 text-white' : 'text-slate-400 hover:bg-white/5 hover:text-white'}`}><Icon size={18} className={active === label ? 'text-gold-400' : ''}/>{label}</button>)}</nav></div>
      <div className="mt-auto p-4"><div className="rounded-2xl border border-white/10 bg-white/[.04] p-4"><div className="mb-2 flex items-center gap-2 text-gold-400"><Settings size={15}/><span className="text-xs font-semibold">Development workspace</span></div><p className="text-xs leading-5 text-slate-400">Demo records are saved in this browser only.</p><p className="mt-3 text-[10px] text-slate-500">Backend integration pending</p></div><div className="mt-5 flex items-center gap-2 px-2 text-[10px] text-slate-500"><span className="h-2 w-2 rounded-full bg-emerald-400"/>Demo environment<span className="ml-auto">v0.2.0</span></div></div>
    </aside>
    <main className="min-h-screen lg:pl-[258px]">
      <header className="sticky top-0 z-20 flex h-[76px] items-center justify-between border-b border-slate-200/80 bg-white/90 px-4 backdrop-blur md:px-8"><div className="flex items-center gap-3"><button aria-label="Open menu" onClick={() => setMobileOpen(true)} className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 lg:hidden"><Menu size={20}/></button><div><p className="text-[11px] text-slate-400">School workspace / <span className="text-slate-600">{active}</span></p><h1 className="font-display text-lg font-bold text-navy-950">{active}</h1></div></div><div className="flex items-center gap-3"><div className="hidden items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 md:flex"><Search size={15} className="text-slate-400"/><input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search current module..." className="w-40 bg-transparent text-xs outline-none"/></div><div className="hidden h-9 w-px bg-slate-200 sm:block"/><div className="flex items-center gap-2"><div className="grid h-9 w-9 place-items-center rounded-full bg-navy-900 text-xs font-bold text-gold-300">AD</div><div className="hidden text-left sm:block"><p className="text-xs font-semibold text-navy-950">School Admin</p><p className="text-[10px] text-slate-400">Demo administrator</p></div><ChevronDown size={14} className="hidden text-slate-400 sm:block"/></div></div></header>
      <div className="mx-auto max-w-[1440px] p-4 md:p-8">
        {notice && <div role="status" className="mb-5 flex items-center justify-between rounded-xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-xs text-emerald-800"><span>{notice}</span><button onClick={() => setNotice('')} aria-label="Dismiss"><X size={15}/></button></div>}
        {active === 'Overview' ? <>
          <div className="mb-7 flex flex-col justify-between gap-4 sm:flex-row sm:items-end"><div><p className="text-sm text-slate-500">{new Date().toLocaleDateString('en-UG', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</p><h2 className="mt-1 font-display text-2xl font-extrabold tracking-tight text-navy-950">Good day, Admin<span className="text-gold-500">.</span></h2><p className="mt-1 text-sm text-slate-500">Your school's operational snapshot.</p></div><button onClick={addStudent} className="inline-flex items-center justify-center gap-2 rounded-xl bg-navy-950 px-4 py-3 text-xs font-semibold text-white"><Plus size={16}/> Add new student</button></div>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{[{label:'Total students',value:students.length,icon:GraduationCap,tint:'bg-blue-50 text-blue-700'},{label:'Teaching staff',value:teachers.length,icon:Users,tint:'bg-violet-50 text-violet-700'},{label:'Present today',value:presentCount,icon:UserCheck,tint:'bg-emerald-50 text-emerald-700'},{label:'Fees recorded',value:money(totalCollected),icon:Wallet,tint:'bg-amber-50 text-amber-700'}].map(({label,value,icon:Icon,tint})=><div key={label} className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-soft"><div className="flex items-center justify-between"><span className="text-xs font-medium text-slate-500">{label}</span><span className={`grid h-9 w-9 place-items-center rounded-xl ${tint}`}><Icon size={18}/></span></div><strong className="mt-4 block font-display text-[25px] font-extrabold tracking-tight text-navy-950">{value}</strong></div>)}</div>
          <div className="mt-6 grid gap-5 xl:grid-cols-2"><section className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-soft md:p-6"><h3 className="font-display text-sm font-bold text-navy-950">School directory</h3><p className="mt-1 text-xs text-slate-400">Current records by module</p><div className="mt-5 space-y-4">{[{label:'Students',count:students.length,icon:GraduationCap},{label:'Teachers',count:teachers.length,icon:Users},{label:'Classes',count:classes.length,icon:School},{label:'Assessments',count:marks.length,icon:BookMarked}].map(item=><div key={item.label} className="flex items-center gap-3"><div className="grid h-9 w-9 place-items-center rounded-xl bg-slate-100 text-navy-800"><item.icon size={17}/></div><span className="flex-1 text-xs font-medium text-slate-600">{item.label}</span><strong className="text-sm text-navy-950">{item.count}</strong></div>)}</div></section><section className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-soft md:p-6"><h3 className="font-display text-sm font-bold text-navy-950">Quick actions</h3><p className="mt-1 text-xs text-slate-400">Go straight to a school task</p><div className="mt-5 grid grid-cols-2 gap-3">{[{label:'Add student',icon:GraduationCap,action:addStudent},{label:'Add teacher',icon:Users,action:addTeacher},{label:'Record marks',icon:BookMarked,action:addMark},{label:'Record payment',icon:Wallet,action:addFee}].map(item=><button key={item.label} onClick={item.action} className="flex items-center gap-2 rounded-xl border border-slate-200 p-3 text-left text-xs font-semibold text-navy-900 hover:border-gold-400 hover:bg-amber-50"><item.icon size={16} className="text-gold-600"/>{item.label}</button>)}</div></section></div>
          <section className="mt-5 rounded-2xl border border-slate-200 bg-white p-5"><div className="flex items-center justify-between"><div><h3 className="font-display text-sm font-bold text-navy-950">Recent students</h3><p className="mt-1 text-xs text-slate-400">Latest student records</p></div><button onClick={() => select('Students')} className="text-xs font-semibold text-gold-600">Open directory →</button></div><div className="mt-4 space-y-3">{students.slice(-4).reverse().map(s=><div key={s.id} className="flex items-center gap-3 border-b border-slate-100 pb-3 last:border-0"><div className="grid h-9 w-9 place-items-center rounded-full bg-blue-50 text-xs font-bold text-blue-700">{initials(s.name)}</div><div className="min-w-0 flex-1"><p className="truncate text-xs font-semibold text-navy-950">{s.name}</p><p className="text-[10px] text-slate-400">{s.id} · {s.className}</p></div><span className="text-[10px] text-emerald-700">{s.status}</span></div>)}</div></section>
        </> : active === 'Students' ? <><div className="mb-6 flex flex-col justify-between gap-3 sm:flex-row sm:items-end"><div><h2 className="font-display text-2xl font-extrabold text-navy-950">Student directory</h2><p className="mt-1 text-sm text-slate-500">Enrolment records and guardian contacts.</p></div>{headerActions}</div><div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-soft">{table(['Student','Student ID','Class','Guardian','Phone','Status'], makeRows(filteredStudents,s=>[s.name,s.id,s.className,s.guardian,s.phone,s.status]), 'students','No student records match your search.')}</div></>
        : active === 'Teachers' ? <><div className="mb-6 flex flex-col justify-between gap-3 sm:flex-row sm:items-end"><div><h2 className="font-display text-2xl font-extrabold text-navy-950">Teaching staff</h2><p className="mt-1 text-sm text-slate-500">Manage teacher profiles and contact details.</p></div>{headerActions}</div><div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-soft">{table(['Teacher','Staff ID','Subject','Phone','Email','Status'],makeRows(filteredTeachers,t=>[t.name,t.id,t.subject,t.phone,t.email,t.status]),'teachers','No teacher records found.')}</div></>
        : active === 'Classes & subjects' ? <><div className="mb-6 flex flex-col justify-between gap-3 sm:flex-row sm:items-end"><div><h2 className="font-display text-2xl font-extrabold text-navy-950">Classes & subjects</h2><p className="mt-1 text-sm text-slate-500">Organise class groups, rooms and class teachers.</p></div>{headerActions}</div><div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-soft">{table(['Class','Class ID','Class teacher','Room','Student count'],makeRows(filteredClasses,c=>[c.name,c.id,c.classTeacher,c.room,c.students]),'classes','No classes created yet.')}</div></>
        : active === 'Subjects' ? <><div className="mb-6 flex flex-col justify-between gap-3 sm:flex-row sm:items-end"><div><h2 className="font-display text-2xl font-extrabold text-navy-950">Subject catalogue</h2><p className="mt-1 text-sm text-slate-500">Configure subjects taught at your school.</p></div>{headerActions}</div><div className="mb-5 grid gap-3 sm:grid-cols-2"><div className="rounded-xl border border-slate-200 bg-white p-4"><p className="text-xs text-slate-500">Registered subjects</p><strong className="mt-1 block text-2xl text-navy-950">{subjects.length}</strong></div><div className="rounded-xl border border-slate-200 bg-white p-4"><p className="text-xs text-slate-500">Grading scale</p><strong className="mt-1 block text-sm text-navy-950">{grading.map(g=>g.grade).join(' · ')}</strong><button onClick={()=>{const raw=window.prompt('Minimum marks for grades A,B,C,D,E, separated by commas',grading.map(g=>g.min).join(','));if(!raw)return;const nums=raw.split(',').map(v=>Number(v.trim()));if(nums.length!==5||nums.some(n=>!Number.isFinite(n)||n<0||n>100)||nums.some((n,i)=>i>0&&n>=nums[i-1])){setNotice('Enter five descending thresholds between 0 and 100.');return;}setGrading(grading.map((g,i)=>({...g,min:nums[i]})));setNotice('Grading thresholds updated.');}} className="mt-2 text-xs font-semibold text-gold-700">Configure grade boundaries</button></div></div><div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-soft">{table(['Subject','Code','Level','Assigned teacher'],makeRows(filteredSubjects,x=>[x.name,x.code,x.level,x.teacher]),'subjects','No subjects configured yet.')}</div><div className="mt-4 rounded-xl border border-slate-200 bg-white p-4"><h3 className="text-sm font-bold text-navy-950">Grade boundaries</h3><div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-5">{grading.map(g=><div key={g.grade} className="rounded-lg bg-slate-50 p-3"><strong className="text-lg text-navy-950">{g.grade}</strong><p className="text-[10px] text-slate-500">{g.min}% and above</p><p className="mt-1 text-[10px] text-slate-400">{g.remark}</p></div>)}</div></div></>
        : active === 'Attendance' ? <><div className="mb-6"><h2 className="font-display text-2xl font-extrabold text-navy-950">Daily attendance</h2><p className="mt-1 text-sm text-slate-500">Mark each student's attendance for today.</p></div><div className="mb-4 grid grid-cols-3 gap-3">{[{label:'Present',count:todayAttendance.filter(a=>a.status==='Present').length},{label:'Absent',count:todayAttendance.filter(a=>a.status==='Absent').length},{label:'Not marked',count:students.length-todayAttendance.length}].map(x=><div key={x.label} className="rounded-xl border border-slate-200 bg-white p-4"><p className="text-[10px] text-slate-500">{x.label}</p><strong className="mt-1 block text-xl text-navy-950">{x.count}</strong></div>)}</div><div className="overflow-hidden rounded-2xl border border-slate-200 bg-white"><div className="flex items-center justify-between p-5"><div><h3 className="text-sm font-bold text-navy-950">Attendance register</h3><p className="mt-1 text-xs text-slate-400">{today}</p></div><button onClick={()=>exportCsv(attendance.filter(a=>a.date===today),'gency-attendance.csv')} className="inline-flex items-center gap-2 text-xs text-slate-500"><Download size={14}/> Export</button></div><div className="divide-y divide-slate-100">{students.map(s=>{const record=todayAttendance.find(a=>a.studentId===s.id);return <div key={s.id} className="flex flex-col gap-3 px-5 py-4 sm:flex-row sm:items-center"><div className="flex-1"><p className="text-xs font-semibold text-navy-950">{s.name}</p><p className="mt-1 text-[10px] text-slate-400">{s.id} · {s.className}</p></div><div className="flex gap-2"><button onClick={()=>markAttendance(s,'Present')} className={`rounded-lg px-3 py-2 text-[11px] font-semibold ${record?.status==='Present'?'bg-emerald-600 text-white':'bg-emerald-50 text-emerald-700'}`}>Present</button><button onClick={()=>markAttendance(s,'Absent')} className={`rounded-lg px-3 py-2 text-[11px] font-semibold ${record?.status==='Absent'?'bg-rose-600 text-white':'bg-rose-50 text-rose-700'}`}>Absent</button></div></div>})}{students.length===0&&<p className="p-8 text-center text-sm text-slate-400">Add students before taking attendance.</p>}</div></div></>
        : active === 'Marks' ? <><div className="mb-6 flex flex-col justify-between gap-3 sm:flex-row sm:items-end"><div><h2 className="font-display text-2xl font-extrabold text-navy-950">Marks & assessments</h2><p className="mt-1 text-sm text-slate-500">Record and review student assessment scores.</p></div>{headerActions}</div><div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-soft"><div className="flex justify-end p-4"><button onClick={()=>exportCsv(filteredMarks,'gency-marks.csv')} className="inline-flex items-center gap-2 text-xs text-slate-500"><Download size={14}/> Export marks</button></div>{table(['Student','Class','Subject','Assessment','Score','Term'],makeRows(filteredMarks,m=>[m.student,m.className,m.subject,m.assessment,m.score+'/'+m.outOf,m.term]),'marks','No marks recorded yet.')}</div></>
        : active === 'Fees' ? <><div className="mb-6 flex flex-col justify-between gap-3 sm:flex-row sm:items-end"><div><h2 className="font-display text-2xl font-extrabold text-navy-950">Fees & payments</h2><p className="mt-1 text-sm text-slate-500">Record fee payments and review collections.</p></div>{headerActions}</div><div className="mb-4 rounded-xl border border-amber-100 bg-amber-50 p-4"><p className="text-xs text-amber-800">Total payments recorded in this demo</p><strong className="mt-1 block text-xl text-navy-950">{money(totalCollected)}</strong></div><div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-soft"><div className="flex justify-end p-4"><button onClick={()=>exportCsv(filteredFees,'gency-fees.csv')} className="inline-flex items-center gap-2 text-xs text-slate-500"><Download size={14}/> Export payments</button></div>{table(['Student','Receipt ID','Class','Amount','Method','Date'],makeRows(filteredFees,f=>[f.student,f.id,f.className,money(f.amount),f.method,f.date]),'fees','No payments recorded yet.')}</div></>
        : active === 'Report cards' ? <><div className="mb-6"><h2 className="font-display text-2xl font-extrabold text-navy-950">Academic report cards</h2><p className="mt-1 text-sm text-slate-500">Preview a student's academic summary using recorded marks.</p></div><div className="mb-5 flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 sm:flex-row sm:items-end"><label className="flex-1 text-xs font-semibold text-slate-600">Select student<select value={reportStudentId} onChange={e=>setReportStudentId(e.target.value)} className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm font-normal text-navy-950"><option value="">Choose a student</option>{students.map(st=><option key={st.id} value={st.id}>{st.name} · {st.className}</option>)}</select></label><button disabled={!reportStudentId} onClick={()=>window.print()} className="rounded-xl bg-navy-950 px-4 py-3 text-xs font-semibold text-white disabled:opacity-40">Print report card</button></div>{reportStudentId ? (()=>{const st=students.find(x=>x.id===reportStudentId);const results=marks.filter(m=>m.student===st?.name);const average=results.length?results.reduce((sum,m)=>sum+(Number(m.score)/Math.max(1,Number(m.outOf)))*100,0)/results.length:0;const grade=grading.find(g=>average>=g.min)||grading[grading.length-1];return <div className="mx-auto max-w-3xl rounded-2xl border border-slate-200 bg-white p-6 shadow-soft print:shadow-none"><div className="border-b-2 border-navy-950 pb-5 text-center"><p className="text-[10px] font-bold uppercase tracking-[.25em] text-gold-700">Gency school workspace</p><h3 className="mt-2 font-display text-2xl font-extrabold text-navy-950">STUDENT REPORT CARD</h3><p className="mt-1 text-xs text-slate-500">Academic performance summary · Demo copy</p></div><div className="grid grid-cols-2 gap-4 border-b border-slate-200 py-5 text-xs"><div><span className="text-slate-400">Student</span><p className="mt-1 font-bold text-navy-950">{st.name}</p></div><div><span className="text-slate-400">Admission number</span><p className="mt-1 font-bold text-navy-950">{st.id}</p></div><div><span className="text-slate-400">Class</span><p className="mt-1 font-bold text-navy-950">{st.className}</p></div><div><span className="text-slate-400">Term</span><p className="mt-1 font-bold text-navy-950">{results[0]?.term||'Term 1'}</p></div></div><div className="mt-5 overflow-x-auto"><table className="w-full text-left"><thead className="bg-slate-50 text-[10px] uppercase text-slate-500"><tr><th className="p-3">Subject</th><th className="p-3">Assessment</th><th className="p-3">Score</th><th className="p-3">Percentage</th></tr></thead><tbody>{results.map(m=><tr key={m.id} className="border-b border-slate-100 text-xs"><td className="p-3 font-semibold">{m.subject}</td><td className="p-3">{m.assessment}</td><td className="p-3">{m.score}/{m.outOf}</td><td className="p-3">{(Number(m.score)/Math.max(1,Number(m.outOf))*100).toFixed(1)}%</td></tr>)}</tbody></table>{results.length===0&&<p className="p-6 text-center text-xs text-slate-400">No marks recorded for this student yet.</p>}</div><div className="mt-5 grid grid-cols-2 gap-3"><div className="rounded-xl bg-slate-50 p-4"><p className="text-[10px] text-slate-500">Average</p><strong className="mt-1 block text-2xl text-navy-950">{average.toFixed(1)}%</strong></div><div className="rounded-xl bg-slate-50 p-4"><p className="text-[10px] text-slate-500">Overall grade</p><strong className="mt-1 block text-2xl text-navy-950">{results.length?grade.grade:'—'}</strong><p className="text-[10px] text-slate-500">{results.length?grade.remark:'Awaiting marks'}</p></div></div><div className="mt-10 grid grid-cols-2 gap-8 text-center text-[10px] text-slate-500"><div className="border-t border-slate-300 pt-2">Class teacher signature</div><div className="border-t border-slate-300 pt-2">Head teacher signature</div></div><p className="mt-6 text-center text-[9px] text-slate-400">DEMO REPORT · Confirm official grading policy before use</p></div>})() : <div className="rounded-xl border border-dashed border-slate-300 bg-white p-10 text-center text-sm text-slate-400">Choose a student to preview their report card.</div>}</>
        : active === 'Reports' ? <><div className="mb-6"><h2 className="font-display text-2xl font-extrabold text-navy-950">School reports</h2><p className="mt-1 text-sm text-slate-500">Live summaries based on the demo records in this browser.</p></div><div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">{[{label:'Student enrolment',value:students.length,detail:'Registered student records',icon:GraduationCap,action:()=>exportCsv(students,'gency-students-report.csv')},{label:'Teaching staff',value:teachers.length,detail:'Teacher profiles',icon:Users,action:()=>exportCsv(teachers,'gency-teachers-report.csv')},{label:'Attendance marked today',value:todayAttendance.length,detail:today,icon:CalendarDays,action:()=>exportCsv(todayAttendance,'gency-attendance-report.csv')},{label:'Present today',value:presentCount,detail:'Attendance register',icon:CheckCircle2,action:()=>exportCsv(todayAttendance,'gency-present-report.csv')},{label:'Fee collections',value:money(totalCollected),detail:fees.length+' payment records',icon:Wallet,action:()=>exportCsv(fees,'gency-fees-report.csv')},{label:'Assessment records',value:marks.length,detail:'Recorded marks',icon:TrendingUp,action:()=>exportCsv(marks,'gency-marks-report.csv')}].map(r=><div key={r.label} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-soft"><div className="flex items-center justify-between"><span className="text-xs font-medium text-slate-500">{r.label}</span><r.icon size={18} className="text-gold-600"/></div><strong className="mt-4 block break-words font-display text-2xl font-extrabold text-navy-950">{r.value}</strong><p className="mt-1 text-[11px] text-slate-400">{r.detail}</p><button onClick={r.action} className="mt-5 inline-flex items-center gap-2 text-xs font-semibold text-gold-700"><Download size={14}/> Download CSV</button></div>)}</div><div className="mt-5 rounded-xl border border-amber-100 bg-amber-50 p-4 text-xs leading-5 text-amber-900">Report cards with subject grading, aggregates and printable layouts are a separate next development task. These summaries are operational reports, not official academic report cards.</div></>
        : <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center"><AlertCircle className="mx-auto text-gold-600" size={28}/><h2 className="mt-3 font-display text-xl font-bold text-navy-950">{pageTitle[active]}</h2><p className="mt-2 text-sm text-slate-500">Select a module from the navigation.</p></div>}
        <footer className="mt-8 flex flex-col justify-between gap-2 border-t border-slate-200 pt-5 text-[10px] text-slate-400 sm:flex-row"><span>© 2026 Gency Systems · School operations workspace</span><span>Demo data only · Not for real student records</span></footer>
      </div>
    </main>
  </div>
}
export default App
