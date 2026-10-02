import { useState } from 'react';

const questions = [
  { exam:'JAMB', subject:'English Language', text:'Choose the word nearest in meaning to “meticulous”.', options:['Careless','Thorough','Impatient','Ordinary'], answer:1 },
  { exam:'JAMB', subject:'Mathematics', text:'If 3x + 5 = 20, find x.', options:['3','5','8','15'], answer:1 },
  { exam:'WAEC', subject:'Mathematics', text:'Find the area of a triangle with base 12 cm and height 7 cm.', options:['19 cm²','42 cm²','84 cm²','38 cm²'], answer:1 },
  { exam:'WAEC', subject:'Chemistry', text:'What is the chemical symbol for potassium?', options:['P','Pt','K','Po'], answer:2 },
  { exam:'NECO', subject:'Physics', text:'What is the SI unit of electric current?', options:['Volt','Watt','Ampere','Ohm'], answer:2 },
  { exam:'NECO', subject:'Mathematics', text:'Express 0.25 as a fraction in its simplest form.', options:['1/2','1/3','1/4','2/5'], answer:2 },
];
const days = ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'];
const initialPlan = [['Mathematics','4:00 PM'],['English','4:30 PM'],['Biology','4:00 PM'],['Mathematics','4:30 PM'],['Chemistry','4:00 PM'],['Practice test','10:00 AM'],['Rest day','—']];
const read = (key, fallback) => { try { return JSON.parse(localStorage.getItem(key)) ?? fallback; } catch { return fallback; } };

export default function App() {
  const [page,setPage] = useState('Overview');
  const [exam,setExam] = useState('All');
  const [theme,setTheme] = useState(()=>read('lex-theme','light'));
  const [answers,setAnswers] = useState(()=>read('lex-answers',{}));
  const [plan,setPlan] = useState(()=>read('lex-plan',initialPlan));
  const [user,setUser] = useState(()=>read('lex-user',null));
  const [showAuth,setShowAuth] = useState(false);
  const [signup,setSignup] = useState(false);
  const [examDate,setExamDate] = useState(()=>localStorage.getItem('lex-exam-date')||'');
  const total=Object.keys(answers).length, correct=Object.values(answers).filter(Boolean).length;
  const accuracy=total?Math.round(correct/total*100):0;
  const filtered=questions.map((q,i)=>({...q,id:i})).filter(q=>exam==='All'||q.exam===exam);
  function chooseQuestion(id,index,answer){const next={...answers,[id]:answer===questions[id].answer};setAnswers(next);localStorage.setItem('lex-answers',JSON.stringify(next));}
  function updatePlan(day,field,value){const next=plan.map((row,i)=>i===day?row.map((v,j)=>j===field?value:v):row);setPlan(next);localStorage.setItem('lex-plan',JSON.stringify(next));}
  function goPractice(which='All'){setExam(which);setPage('Practice');}
  function toggleTheme(){const next=theme==='light'?'dark':'light';setTheme(next);localStorage.setItem('lex-theme',JSON.stringify(next));}
  function auth(e){e.preventDefault();const form=new FormData(e.currentTarget);const account={name:signup?form.get('name'):user?.name||String(form.get('email')).split('@')[0],email:form.get('email'),exam:'JAMB / UTME'};setUser(account);localStorage.setItem('lex-user',JSON.stringify(account));setShowAuth(false);}
  return <div className={`app ${theme}`}>
    <aside className="sidebar"><div className="logo">⚡ <b>LEX</b></div><nav>{['Overview','Practice','Timetable','My progress'].map((item,i)=><button className={page===item?'active':''} key={item} onClick={()=>setPage(item)}>{['⌂','▤','▦','◴'][i]} <span>{item}</span></button>)}</nav><div className="sidebar-bottom"><button onClick={toggleTheme}>◐ <span>Switch theme</span></button><button onClick={()=>{setSignup(false);setShowAuth(true)}}>⇥ <span>Log in / Sign up</span></button><p>{user?`${user.name} · ${user.exam}`:'Guest learner · Save progress with an account'}</p></div></aside>
    <main><header><span>My learning space / {page}</span><div><button className="outline" onClick={toggleTheme}>◐ Theme</button> <button className="outline" onClick={()=>{setSignup(false);setShowAuth(true)}}>{user?user.name:'Log in'}</button></div></header>
      {page==='Overview'&&<><section className="welcome"><div><h1>Good day, <em>{user?.name?.split(' ')[0]||'learner'}</em> ⚡</h1><p>Small steps every day lead to big results.</p></div><span>{new Intl.DateTimeFormat('en-NG',{weekday:'short',day:'numeric',month:'short'}).format(new Date())}</span></section>
        <div className="stats"><Stat label="Questions answered" value={total}/><Stat label="Average score" value={total?`${accuracy}%`:'—'}/><Stat label="Study time this week" value="4.5 hrs"/><Stat label="Days to exam" value={examDate?Math.max(0,Math.ceil((new Date(examDate)-new Date())/86400000)):'—'}/></div>
        <div className="columns"><section className="card"><div className="card-head"><h2>Choose your exam</h2><button className="text-button" onClick={()=>goPractice()}>All practice →</button></div><div className="exam-grid">{['JAMB','WAEC','NECO'].map(x=><article className="exam-card" key={x}><small>EXAM PRACTICE</small><h3>{x==='JAMB'?'JAMB / UTME':x}</h3><p>Practice questions and build confidence.</p><button className="primary" onClick={()=>goPractice(x)}>Start practice →</button></article>)}</div></section><section className="card"><div className="card-head"><h2>This week's plan</h2><button className="text-button" onClick={()=>setPage('Timetable')}>Edit plan →</button></div>{plan.slice(0,4).map((row,i)=><div className="day-row" key={days[i]}><b>{days[i].slice(0,3)}</b><span>{row[0]}</span><small>{row[1]}</small></div>)}</section></div>
        <section className="card progress"><h2>Your progress</h2><p>{correct} correct from {total} attempted · {accuracy}% accuracy</p><div className="progress-track"><i style={{width:`${accuracy}%`}}/></div></section>
      </>}
      {page==='Practice'&&<><h1>Practice questions ⚡</h1><p className="muted">Build confidence one question at a time.</p><div className="filters">{['All','JAMB','WAEC','NECO'].map(x=><button className={exam===x?'selected':''} key={x} onClick={()=>setExam(x)}>{x==='All'?'All exams':x}</button>)}</div>{filtered.map(q=><article className="card question" key={q.id}><small>{q.exam} · {q.subject}</small><h3>{q.text}</h3><div className="options">{q.options.map((option,i)=><button disabled={answers[q.id]!==undefined} onClick={()=>chooseQuestion(q.id,i,i)} className={answers[q.id]!==undefined&&i===q.answer?'correct':''} key={option}>{String.fromCharCode(65+i)}. {option}</button>)}</div>{answers[q.id]!==undefined&&<p className="muted">{answers[q.id]?'Correct — nice work!':'Review the highlighted correct answer.'}</p>}</article>)}</>}
      {page==='Timetable'&&<><h1>My study timetable</h1><p className="muted">Make a plan that works for your week. Changes save on this device.</p><section className="card timetable">{plan.map((row,i)=><div className="plan-row" key={days[i]}><b>{days[i]}</b><select value={row[0]} onChange={e=>updatePlan(i,0,e.target.value)}>{['Mathematics','English','Biology','Chemistry','Physics','Practice test','Government','Literature','Rest day'].map(x=><option key={x}>{x}</option>)}</select><input value={row[1]} disabled={row[0]==='Rest day'} onChange={e=>updatePlan(i,1,e.target.value)}/></div>)}<label className="exam-date">My exam date <input type="date" value={examDate} onChange={e=>{setExamDate(e.target.value);localStorage.setItem('lex-exam-date',e.target.value)}}/></label></section></>}
      {page==='My progress'&&<><h1>My progress</h1><p className="muted">Your practice history, all in one place.</p><div className="stats progress-stats"><Stat label="Questions answered" value={total}/><Stat label="Correct answers" value={correct}/><Stat label="Accuracy" value={`${accuracy}%`}/><Stat label="Study days per week" value="6 days"/></div>{['JAMB','WAEC','NECO'].map(ex=>{const list=questions.map((q,i)=>({...q,id:i})).filter(q=>q.exam===ex),attempted=list.filter(q=>answers[q.id]!==undefined);return <section className="card exam-progress" key={ex}><b>{ex}</b><span>{attempted.length?`${attempted.filter(q=>answers[q.id]).length}/${attempted.length} correct`:'Not started'}</span></section>})}</>}
    </main>
    {showAuth&&<div className="overlay" onClick={e=>e.target===e.currentTarget&&setShowAuth(false)}><form className="dialog" onSubmit={auth}><div className="card-head"><b>⚡ LEX</b><button type="button" className="outline" onClick={()=>setShowAuth(false)}>×</button></div><h2>{signup?'Create your account':'Welcome back'}</h2><p className="muted">Save your study plan and track your progress.</p>{signup&&<label>Your name<input name="name" required placeholder="e.g. Ada Okafor"/></label>}<label>Email address<input name="email" type="email" required placeholder="you@example.com"/></label><label>Password<input name="password" type="password" minLength="4" required placeholder="At least 4 characters"/></label><button className="primary wide">{signup?'Sign up':'Log in'}</button><button type="button" className="text-button switch" onClick={()=>setSignup(!signup)}>{signup?'Already have an account? Log in':'Create an account'}</button></form></div>}
  </div>;
}
function Stat({label,value}){return <section className="card stat"><small>{label}</small><strong>{value}</strong></section>}
