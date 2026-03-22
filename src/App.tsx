/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Dot
} from 'recharts';
import { 
  CheckCircle2, 
  XCircle, 
  HelpCircle, 
  BookOpen, 
  TrendingUp, 
  AlertCircle,
  RotateCcw,
  ChevronRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// --- Data ---

const ebookSalesData = [
  { month: 'J', sales: 95 },
  { month: 'F', sales: 105 },
  { month: 'M', sales: 125 },
  { month: 'A', sales: 108 },
  { month: 'M', sales: 98 },
  { month: 'J', sales: 88 },
  { month: 'J', sales: 95 },
  { month: 'A', sales: 100 },
  { month: 'S', sales: 115 },
  { month: 'O', sales: 100 },
  { month: 'N', sales: 95 },
  { month: 'D', sales: 82 },
];

const harryPotterSalesData = [
  { month: 'June', sales: 2 },
  { month: 'July', sales: 8 },
  { month: 'Aug', sales: 7 },
  { month: 'Sep', sales: 5 },
  { month: 'Oct', sales: 4 },
];

const grammarQuestions = [
  { id: 1, question: "Which preposition is used with particular months and years?", answer: "in", examples: ["in January", "in 2009"] },
  { id: 2, question: "Which prepositions are used to cover a whole time period?", answer: "during, over", examples: ["during the year", "over a one-year period"] },
  { id: 3, question: "Which prepositions are used with a period of time in months?", answer: "between, from... to", examples: ["between March and June", "from June to September"] },
  { id: 4, question: "Which preposition is used with a noun to say what has changed?", answer: "in", examples: ["a decrease in sales", "an increase in schooling"] },
  { id: 5, question: "Which preposition is used to say how much something has risen or fallen?", answer: "by", examples: ["rose by 25 units"] },
  { id: 6, question: "Which prepositions are used to state the figures at the start and end of a trend?", answer: "at, from, to", examples: ["at 95%", "from 95 units to 125"] },
];

const correctionSentences = [
  { id: 1, original: "For the 14-24 age group, attendance reached a peak as 95% in 1996.", correction: "at", explanation: "Use 'at' to state a specific figure for a peak." },
  { id: 2, original: "Exam results were high on January and after that month, they fell.", correction: "in", explanation: "Use 'in' with months." },
  { id: 3, original: "In 2050, the percentage will fall down to 0.9 billion again.", correction: "to", explanation: "Use 'fall to' for a target value; 'down' is redundant." },
  { id: 4, original: "During 2000 to 2005, profits remained stable at five million dollars.", correction: "From", explanation: "Use 'From... to' for a range." },
  { id: 5, original: "The trend decreases gradually from 2006 and ends at just over 70% 2010.", correction: "in", explanation: "Missing 'in' before the year." },
  { id: 6, original: "From the chart, we can see there is an increase of years of schooling.", correction: "in", explanation: "Use 'increase/decrease in' something." },
];

// --- Components ---

const Card = ({ children, className, id }: { children: React.ReactNode; className?: string; id?: string }) => (
  <div id={id} className={cn("bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden", className)}>
    {children}
  </div>
);

const SectionTitle = ({ title, icon: Icon }: { title: string; icon: any }) => (
  <div className="flex items-center gap-2 mb-6">
    <div className="p-2 bg-indigo-50 rounded-lg text-indigo-600">
      <Icon size={20} />
    </div>
    <h2 className="text-xl font-semibold text-slate-800 tracking-tight">{title}</h2>
  </div>
);

export default function App() {
  const [ex1Answers, setEx1Answers] = useState<string[]>(Array(6).fill(''));
  const [ex1Checked, setEx1Checked] = useState(false);
  const [ex2Answers, setEx2Answers] = useState<string[]>(Array(8).fill(''));
  const [ex2Checked, setEx2Checked] = useState(false);
  const [ex3Answers, setEx3Answers] = useState<string[]>(Array(6).fill(''));
  const [ex3Checked, setEx3Checked] = useState(false);
  const [activeGrammar, setActiveGrammar] = useState<number | null>(null);

  const ex2Correct = ['from', 'to', 'at', 'by', 'to', 'during', 'from', 'between']; 
  // Wait, let's re-map Exercise 2 blanks based on the image:
  // 1: rose sharply [from] 2,000 in June [to] 8,000 in July.
  // 2: peaked [at] 8,000 in July.
  // 3: fell [by] 1,000 in August.
  // 4: dropped sharply [to] 5,000 [during] the next month.
  // 5: fell [from] 5,000 to 4,000 in October.
  // 6: fluctuated [between] June and October 2009.
  const ex2CorrectAnswers = ['from', 'to', 'at', 'by', 'to', 'during', 'from', 'between'];

  const handleEx1Check = () => setEx1Checked(true);
  const handleEx1Reset = () => {
    setEx1Answers(Array(6).fill(''));
    setEx1Checked(false);
  };

  const handleEx2Check = () => setEx2Checked(true);
  const handleEx2Reset = () => {
    setEx2Answers(Array(8).fill(''));
    setEx2Checked(false);
  };

  const handleEx3Check = () => setEx3Checked(true);
  const handleEx3Reset = () => {
    setEx3Answers(Array(6).fill(''));
    setEx3Checked(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-12">
        
        {/* Header */}
        <header className="text-center space-y-4">
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-block px-4 py-1.5 bg-indigo-100 text-indigo-700 rounded-full text-sm font-medium tracking-wide uppercase"
          >
            IELTS Academic Writing Task 1
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-4xl md:text-5xl font-bold text-slate-900 tracking-tight"
          >
            Prepositions for Describing Graphs
          </motion.h1>
          <p className="text-slate-500 max-w-2xl mx-auto text-lg">
            Master the essential grammar needed to accurately describe trends, peaks, and fluctuations in data.
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Grammar & Reference - Sticky on Desktop */}
          <div className="lg:col-span-5 space-y-8 lg:sticky lg:top-8">
            <Card className="p-6 border-indigo-100 shadow-indigo-100/20">
              <SectionTitle title="Exercise 1: Prepositions to describe graphs" icon={BookOpen} />
              <p className="text-sm text-slate-500 mb-6 italic">Look at the graph on ebook sales and the sentences below (a-h) that describe it.</p>
              <div className="space-y-6">
                {grammarQuestions.map((q, idx) => (
                  <div key={q.id} className="space-y-2">
                    <div className="flex gap-3">
                      <span className="flex-shrink-0 w-6 h-6 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center text-xs font-bold">
                        {q.id}
                      </span>
                      <p className="text-sm font-medium text-slate-700 leading-tight">{q.question}</p>
                    </div>
                    <div className="ml-9 flex items-center gap-3">
                      <input 
                        className={cn(
                          "flex-1 px-3 py-1.5 rounded-lg border text-sm transition-all",
                          ex1Checked ? (q.answer.toLowerCase().includes((ex1Answers[idx] || '').toLowerCase().trim()) && (ex1Answers[idx] || '').trim() !== '' ? "bg-emerald-50 border-emerald-200" : "bg-rose-50 border-rose-200") : "focus:ring-2 focus:ring-indigo-500"
                        )}
                        value={ex1Answers[idx]}
                        onChange={e => { const a = [...ex1Answers]; a[idx] = e.target.value; setEx1Answers(a); }}
                        placeholder="Type answer..."
                      />
                      {ex1Checked && (
                        <div className="flex-shrink-0">
                          {q.answer.toLowerCase().includes((ex1Answers[idx] || '').toLowerCase().trim()) && (ex1Answers[idx] || '').trim() !== '' ? (
                            <CheckCircle2 className="text-emerald-500" size={20} />
                          ) : (
                            <XCircle className="text-rose-500" size={20} />
                          )}
                        </div>
                      )}
                    </div>
                    {ex1Checked && !(q.answer.toLowerCase().includes((ex1Answers[idx] || '').toLowerCase().trim()) && (ex1Answers[idx] || '').trim() !== '') && (
                      <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="ml-9 p-2 bg-indigo-50 rounded-lg text-xs text-indigo-700 font-medium"
                      >
                        Correct: {q.answer}
                      </motion.div>
                    )}
                  </div>
                ))}
                
                <div className="pt-4 flex gap-3">
                  <button 
                    onClick={handleEx1Check}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm font-medium hover:bg-indigo-700 transition-colors flex items-center gap-2"
                  >
                    <CheckCircle2 size={16} />
                    Check
                  </button>
                  <button 
                    onClick={handleEx1Reset}
                    className="px-4 py-2 bg-slate-100 text-slate-600 rounded-xl text-sm font-medium hover:bg-slate-200 transition-colors flex items-center gap-2"
                  >
                    <RotateCcw size={16} />
                    Reset
                  </button>
                </div>
              </div>
            </Card>

            <Card className="p-6 bg-slate-900 text-white border-none">
              <div className="mb-4">
                <p className="text-xs font-bold text-indigo-400 uppercase tracking-widest mb-1">Graph Reference</p>
                <h3 className="text-lg font-semibold text-white">2009 ebook unit sales - www.fonerbooks.com</h3>
              </div>
              <div className="h-64 w-full mt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={ebookSalesData} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                    <XAxis 
                      dataKey="month" 
                      stroke="#94a3b8" 
                      fontSize={12} 
                      tickLine={false} 
                      axisLine={false}
                    />
                    <YAxis 
                      stroke="#94a3b8" 
                      fontSize={12} 
                      tickLine={false} 
                      axisLine={false}
                      domain={[70, 130]}
                    />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#fff' }}
                      itemStyle={{ color: '#818cf8' }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="sales" 
                      stroke="#818cf8" 
                      strokeWidth={3} 
                      dot={{ r: 4, fill: '#818cf8', strokeWidth: 0 }}
                      activeDot={{ r: 6, strokeWidth: 0 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-8 space-y-3 text-sm text-slate-300 border-t border-slate-800 pt-6">
                <p><span className="text-indigo-400 font-bold mr-2">a</span> The graph shows ebook sales over a one-year period.</p>
                <p><span className="text-indigo-400 font-bold mr-2">b</span> During the year, ebook sales fluctuated.</p>
                <p><span className="text-indigo-400 font-bold mr-2">c</span> Sales rose sharply from 95 units in January to 125 in March.</p>
                <p><span className="text-indigo-400 font-bold mr-2">d</span> Sales peaked in March and in September.</p>
                <p><span className="text-indigo-400 font-bold mr-2">e</span> Sales fell between March and June.</p>
                <p><span className="text-indigo-400 font-bold mr-2">f</span> From June to September, sales rose by 25 units.</p>
                <p><span className="text-indigo-400 font-bold mr-2">g</span> There was a sharp decrease in sales after September.</p>
                <p><span className="text-indigo-400 font-bold mr-2">h</span> Overall, sales fell in 2009.</p>
              </div>
            </Card>
          </div>

          {/* Right Column: Exercises */}
          <div className="lg:col-span-7 space-y-8">
            
            {/* Exercise 2 */}
            <Card className="p-6 border-slate-200">
              <SectionTitle title="Exercise 2: Harry Potter Book Sales" icon={HelpCircle} />
              <p className="text-sm text-slate-500 mb-6 italic">Complete the sentences below describing the graph with the prepositions in the box.</p>
              
              <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
                {/* Graph & Word Bank - Sticky within Card */}
                <div className="xl:col-span-5 space-y-6 xl:sticky xl:top-8 self-start">
                  <div className="h-72 w-full bg-slate-50 rounded-xl p-4 border border-slate-100">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={harryPotterSalesData}>
                        <XAxis dataKey="month" fontSize={10} axisLine={false} tickLine={false} />
                        <YAxis fontSize={10} axisLine={false} tickLine={false} domain={[0, 10]} />
                        <Tooltip />
                        <Line 
                          type="monotone" 
                          dataKey="sales" 
                          stroke="#6366f1" 
                          strokeWidth={2}
                          dot={{ r: 4, fill: '#6366f1' }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>

                  <div className="p-4 bg-indigo-50/50 rounded-xl border border-indigo-100">
                    <p className="text-xs font-bold text-indigo-700 uppercase tracking-wider mb-3">Word Bank</p>
                    <div className="flex flex-wrap gap-2">
                      {['at', 'between', 'by', 'during', 'from', 'in', 'over', 'to'].map(prep => (
                        <span key={prep} className="px-2 py-1 bg-white text-slate-600 rounded border border-slate-200 text-xs font-mono">
                          {prep}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Questions */}
                <div className="xl:col-span-7 space-y-6 text-slate-700 leading-relaxed">
                  <p className="flex flex-wrap items-center gap-x-2 gap-y-3">
                    1. Rose sharply 
                    <input 
                      className={cn("w-20 px-2 py-1 rounded border text-sm transition-all", ex2Checked ? ((ex2Answers[0] || '').toLowerCase() === 'from' ? "bg-emerald-50 border-emerald-200" : "bg-rose-50 border-rose-200") : "focus:ring-2 focus:ring-indigo-500")}
                      value={ex2Answers[0]} onChange={e => { const a = [...ex2Answers]; a[0] = e.target.value; setEx2Answers(a); }}
                      placeholder="..."
                    />
                    2,000 in June 
                    <input 
                      className={cn("w-20 px-2 py-1 rounded border text-sm transition-all", ex2Checked ? ((ex2Answers[1] || '').toLowerCase() === 'to' ? "bg-emerald-50 border-emerald-200" : "bg-rose-50 border-rose-200") : "focus:ring-2 focus:ring-indigo-500")}
                      value={ex2Answers[1]} onChange={e => { const a = [...ex2Answers]; a[1] = e.target.value; setEx2Answers(a); }}
                      placeholder="..."
                    />
                    8,000 in July.
                  </p>
                  <p className="flex flex-wrap items-center gap-x-2 gap-y-3">
                    2. Peaked 
                    <input 
                      className={cn("w-20 px-2 py-1 rounded border text-sm transition-all", ex2Checked ? ((ex2Answers[2] || '').toLowerCase() === 'at' ? "bg-emerald-50 border-emerald-200" : "bg-rose-50 border-rose-200") : "focus:ring-2 focus:ring-indigo-500")}
                      value={ex2Answers[2]} onChange={e => { const a = [...ex2Answers]; a[2] = e.target.value; setEx2Answers(a); }}
                      placeholder="..."
                    />
                    8,000 in July.
                  </p>
                  <p className="flex flex-wrap items-center gap-x-2 gap-y-3">
                    3. Fell 
                    <input 
                      className={cn("w-20 px-2 py-1 rounded border text-sm transition-all", ex2Checked ? ((ex2Answers[3] || '').toLowerCase() === 'by' ? "bg-emerald-50 border-emerald-200" : "bg-rose-50 border-rose-200") : "focus:ring-2 focus:ring-indigo-500")}
                      value={ex2Answers[3]} onChange={e => { const a = [...ex2Answers]; a[3] = e.target.value; setEx2Answers(a); }}
                      placeholder="..."
                    />
                    1,000 in August.
                  </p>
                  <p className="flex flex-wrap items-center gap-x-2 gap-y-3">
                    4. Dropped sharply 
                    <input 
                      className={cn("w-20 px-2 py-1 rounded border text-sm transition-all", ex2Checked ? ((ex2Answers[4] || '').toLowerCase() === 'to' ? "bg-emerald-50 border-emerald-200" : "bg-rose-50 border-rose-200") : "focus:ring-2 focus:ring-indigo-500")}
                      value={ex2Answers[4]} onChange={e => { const a = [...ex2Answers]; a[4] = e.target.value; setEx2Answers(a); }}
                      placeholder="..."
                    />
                    5,000 
                    <input 
                      className={cn("w-24 px-2 py-1 rounded border text-sm transition-all", ex2Checked ? ((ex2Answers[5] || '').toLowerCase() === 'during' ? "bg-emerald-50 border-emerald-200" : "bg-rose-50 border-rose-200") : "focus:ring-2 focus:ring-indigo-500")}
                      value={ex2Answers[5]} onChange={e => { const a = [...ex2Answers]; a[5] = e.target.value; setEx2Answers(a); }}
                      placeholder="..."
                    />
                    the next month.
                  </p>
                  <p className="flex flex-wrap items-center gap-x-2 gap-y-3">
                    5. Fell 
                    <input 
                      className={cn("w-20 px-2 py-1 rounded border text-sm transition-all", ex2Checked ? ((ex2Answers[6] || '').toLowerCase() === 'from' ? "bg-emerald-50 border-emerald-200" : "bg-rose-50 border-rose-200") : "focus:ring-2 focus:ring-indigo-500")}
                      value={ex2Answers[6]} onChange={e => { const a = [...ex2Answers]; a[6] = e.target.value; setEx2Answers(a); }}
                      placeholder="..."
                    />
                    5,000 to 4,000 in October.
                  </p>
                  <p className="flex flex-wrap items-center gap-x-2 gap-y-3">
                    6. Fluctuated 
                    <input 
                      className={cn("w-24 px-2 py-1 rounded border text-sm transition-all", ex2Checked ? ((ex2Answers[7] || '').toLowerCase() === 'between' ? "bg-emerald-50 border-emerald-200" : "bg-rose-50 border-rose-200") : "focus:ring-2 focus:ring-indigo-500")}
                      value={ex2Answers[7]} onChange={e => { const a = [...ex2Answers]; a[7] = e.target.value; setEx2Answers(a); }}
                      placeholder="..."
                    />
                    June and October 2009.
                  </p>
                </div>
              </div>

              <div className="mt-8 flex gap-3">
                <button 
                  onClick={handleEx2Check}
                  className="px-6 py-2 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 transition-colors flex items-center gap-2"
                >
                  <CheckCircle2 size={18} />
                  Check Answers
                </button>
                <button 
                  onClick={handleEx2Reset}
                  className="px-6 py-2 bg-slate-100 text-slate-600 rounded-xl font-medium hover:bg-slate-200 transition-colors flex items-center gap-2"
                >
                  <RotateCcw size={18} />
                  Reset
                </button>
              </div>
            </Card>

            {/* Exercise 3 */}
            <Card className="p-6">
              <SectionTitle title="Exercise 3: Find and Correct Mistakes" icon={AlertCircle} />
              <p className="text-sm text-slate-500 mb-6">Identify the incorrect preposition and provide the correct one.</p>
              
              <div className="space-y-4">
                {correctionSentences.map((s, idx) => (
                  <div key={s.id} className="p-4 rounded-xl border border-slate-100 bg-slate-50/50 space-y-3">
                    <p className="text-sm text-slate-700 leading-relaxed italic">"{s.original}"</p>
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Correction:</span>
                      <input 
                        className={cn(
                          "flex-1 px-3 py-1.5 rounded-lg border text-sm transition-all",
                          ex3Checked ? ((ex3Answers[idx] || '').toLowerCase() === s.correction.toLowerCase() ? "bg-emerald-50 border-emerald-200" : "bg-rose-50 border-rose-200") : "focus:ring-2 focus:ring-indigo-500"
                        )}
                        value={ex3Answers[idx]}
                        onChange={e => { const a = [...ex3Answers]; a[idx] = e.target.value; setEx3Answers(a); }}
                        placeholder="Type correct preposition..."
                      />
                      {ex3Checked && (
                        <div className="flex-shrink-0">
                          {((ex3Answers[idx] || '').toLowerCase() === s.correction.toLowerCase()) ? (
                            <CheckCircle2 className="text-emerald-500" size={20} />
                          ) : (
                            <XCircle className="text-rose-500" size={20} />
                          )}
                        </div>
                      )}
                    </div>
                    {ex3Checked && (ex3Answers[idx] || '').toLowerCase() !== s.correction.toLowerCase() && (
                      <motion.p 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-xs text-indigo-600 font-medium"
                      >
                        Correct answer: <span className="underline">{s.correction}</span>. {s.explanation}
                      </motion.p>
                    )}
                  </div>
                ))}
              </div>

              <div className="mt-8 flex gap-3">
                <button 
                  onClick={handleEx3Check}
                  className="px-6 py-2 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 transition-colors flex items-center gap-2"
                >
                  <CheckCircle2 size={18} />
                  Check Answers
                </button>
                <button 
                  onClick={handleEx3Reset}
                  className="px-6 py-2 bg-slate-100 text-slate-600 rounded-xl font-medium hover:bg-slate-200 transition-colors flex items-center gap-2"
                >
                  <RotateCcw size={18} />
                  Reset
                </button>
              </div>
            </Card>

          </div>
        </div>

        {/* Footer */}
        <footer className="pt-12 border-t border-slate-200 text-center text-slate-400 text-sm pb-8">
          <p>© 2026 IELTS Grammar Master • Built for Academic Writing Success</p>
        </footer>
      </div>
    </div>
  );
}
