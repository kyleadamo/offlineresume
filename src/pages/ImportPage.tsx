import { useState, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useResume } from '@/hooks/ResumeContext';
import { Resume, createBlankResume } from '@/schema/resume';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Upload, ClipboardPaste } from 'lucide-react';
import { motion } from 'framer-motion';

const ImportPage = () => {
  const [searchParams] = useSearchParams();
  const mode = searchParams.get('mode') || 'paste';
  const navigate = useNavigate();
  const { createResume } = useResume();
  const [text, setText] = useState('');
  const [jsonText, setJsonText] = useState('');
  const [error, setError] = useState('');
  const [jsonMethod, setJsonMethod] = useState<'paste' | 'file'>('file');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handlePasteImport = () => {
    if (!text.trim()) return;
    const resume = createBlankResume();
    resume.summary = text.trim();
    resume.title = 'Imported Resume';
    createResume(resume);
    navigate('/builder');
  };

  const processJson = (raw: string) => {
    try {
      setError('');
      const parsed = JSON.parse(raw) as Partial<Resume>;
      const resume: Resume = { ...createBlankResume(), ...parsed, id: crypto.randomUUID(), lastEdited: new Date().toISOString() };
      createResume(resume);
      navigate('/builder');
    } catch {
      setError("Something didn't parse correctly. Check the JSON format and try again.");
    }
  };

  const handleJsonImport = () => processJson(jsonText);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const content = ev.target?.result as string;
      if (file.name.endsWith('.json')) {
        processJson(content);
      } else {
        // Treat as plain text resume
        const resume = createBlankResume();
        resume.summary = content.trim();
        resume.title = file.name.replace(/\.[^.]+$/, '') || 'Imported Resume';
        createResume(resume);
        navigate('/builder');
      }
    };
    reader.readAsText(file);
    // Reset so the same file can be re-selected
    e.target.value = '';
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6">
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-xl"
      >
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" /> Back to studio
        </button>

        {mode === 'paste' && (
          <div className="space-y-4">
            <div>
              <h2 className="text-foreground">Paste your resume</h2>
              <p className="text-muted-foreground text-sm mt-1">
                Paste your resume text below. We'll do our best to structure it.
              </p>
            </div>
            <Textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Paste your resume content here..."
              rows={12}
              className="resize-none"
            />
            <Button onClick={handlePasteImport} disabled={!text.trim()}>
              Import and continue
            </Button>
          </div>
        )}

        {mode === 'json' && (
          <div className="space-y-4">
            <div>
              <h2 className="text-foreground">Import JSON</h2>
              <p className="text-muted-foreground text-sm mt-1">
                Upload a JSON file or paste structured resume data.{' '}
                <button
                  type="button"
                  onClick={() => {
                    const sample = JSON.stringify({
                      title: "Sample Resume",
                      targetRole: "Frontend Engineer",
                      profile: {
                        name: "Alex Johnson",
                        email: "alex@example.com",
                        phone: "(555) 123-4567",
                        location: "San Francisco, CA",
                        links: [{ id: "1", label: "LinkedIn", url: "https://linkedin.com/in/alexjohnson" }]
                      },
                      summary: "Detail-oriented frontend engineer with 5 years of experience building performant web applications using React, TypeScript, and modern CSS.",
                      experience: [{
                        id: "1", role: "Senior Frontend Engineer", company: "Acme Corp",
                        startDate: "2021-06", endDate: "Present",
                        bullets: ["Led migration from legacy jQuery codebase to React, improving page load times by 40%", "Mentored 3 junior developers through code reviews and pair programming"]
                      }, {
                        id: "2", role: "Frontend Developer", company: "StartupXYZ",
                        startDate: "2019-01", endDate: "2021-05",
                        bullets: ["Built component library used across 4 product teams", "Implemented accessibility improvements achieving WCAG 2.1 AA compliance"]
                      }],
                      education: [{ id: "1", institution: "University of California", degree: "B.S.", field: "Computer Science", startDate: "2015", endDate: "2019", description: "" }],
                      skills: [{ id: "1", category: "Languages", skills: ["TypeScript", "JavaScript", "HTML", "CSS"] }, { id: "2", category: "Frameworks", skills: ["React", "Next.js", "Tailwind CSS"] }],
                      projects: [],
                      certifications: [],
                      customSections: []
                    }, null, 2);
                    const blob = new Blob([sample], { type: 'application/json' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = 'sample-resume.json';
                    a.click();
                    URL.revokeObjectURL(url);
                  }}
                  className="text-primary underline underline-offset-2 hover:text-primary/80 transition-colors"
                >
                  Download a sample file
                </button>{' '}
                to see the expected format.
              </p>
            </div>

            {/* Toggle between file upload and paste */}
            <div className="flex gap-2 p-1 bg-secondary rounded-lg">
              <button
                onClick={() => setJsonMethod('file')}
                className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  jsonMethod === 'file'
                    ? 'bg-background text-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <Upload className="w-4 h-4" />
                Browse file
              </button>
              <button
                onClick={() => setJsonMethod('paste')}
                className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  jsonMethod === 'paste'
                    ? 'bg-background text-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <ClipboardPaste className="w-4 h-4" />
                Paste JSON
              </button>
            </div>

            {jsonMethod === 'file' ? (
              <div className="space-y-3">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".json,.txt"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full flex flex-col items-center justify-center gap-3 p-10 border-2 border-dashed border-border rounded-lg hover:border-primary/40 hover:bg-muted/30 transition-colors cursor-pointer"
                >
                  <Upload className="w-8 h-8 text-muted-foreground" />
                  <div className="text-center">
                    <p className="text-sm font-medium text-foreground">Click to browse</p>
                    <p className="text-xs text-muted-foreground mt-1">JSON or TXT files supported</p>
                  </div>
                </button>
                {error && <p className="text-destructive text-sm">{error}</p>}
              </div>
            ) : (
              <div className="space-y-3">
                <Textarea
                  value={jsonText}
                  onChange={(e) => { setJsonText(e.target.value); setError(''); }}
                  placeholder='{"profile": {"name": "..."}, ...}'
                  rows={12}
                  className="resize-none font-mono text-xs"
                />
                {error && <p className="text-destructive text-sm">{error}</p>}
                <Button onClick={handleJsonImport} disabled={!jsonText.trim()}>
                  Import and continue
                </Button>
              </div>
            )}
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default ImportPage;
