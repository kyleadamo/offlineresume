import { useState, useRef, useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useResume } from '@/hooks/ResumeContext';
import { Resume, createBlankResume } from '@/schema/resume';
import { createSampleResume } from '@/schema/sampleResume';
import { resumeParseSchema } from '@/lib/resumeValidator';
import { supabase } from '@/integrations/supabase/client';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Upload, ClipboardPaste, Globe, Sparkles, FileText, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';

/* ── PDF text extraction ───────────────────────────────── */
async function extractPdfText(file: File): Promise<string> {
  const pdfjsLib = await import('pdfjs-dist');
  pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`;
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
  const pages: string[] = [];
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    pages.push(content.items.map((item: any) => item.str).join(' '));
  }
  return pages.join('\n\n');
}

/* ┅ ── AI parse call ─────────────────────────────────────── */
async function parseResumeAI(payload: { text?: string; url?: string }) {
  const { data, error } = await supabase.functions.invoke('parse-resume', {
    body: payload,
  });
  if (error) throw new Error(error.message || 'Parse failed');
  if (data?.error) throw new Error(data.error);
  // Validate through Zod
  const parsed = resumeParseSchema.safeParse(data?.data);
  if (!parsed.success) throw new Error('Parsed data did not match expected format.');
  return parsed.data;
}

type ImportTab = 'paste' | 'pdf' | 'url' | 'json';

const ImportPage = () => {
  const [searchParams] = useSearchParams();
  const initialMode = searchParams.get('mode') || 'paste';
  const navigate = useNavigate();
  const { createResume } = useResume();

  const [tab, setTab] = useState<ImportTab>(
    initialMode === 'json' ? 'json' : 'paste'
  );

  // Paste state
  const [text, setText] = useState('');
  // URL state
  const [url, setUrl] = useState('');
  // JSON state
  const [jsonText, setJsonText] = useState('');
  const [jsonMethod, setJsonMethod] = useState<'paste' | 'file'>('file');
  // PDF file name
  const [pdfFileName, setPdfFileName] = useState('');

  // Shared
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState<ReturnType<typeof resumeParseSchema.parse> | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const pdfInputRef = useRef<HTMLInputElement>(null);

  /* ── AI-powered import ──────────────────────────────── */
  const handleAIParse = useCallback(async (payload: { text?: string; url?: string }) => {
    setLoading(true);
    setError('');
    setPreview(null);
    try {
      const result = await parseResumeAI(payload);
      setPreview(result);
    } catch (e: any) {
      setError(e.message || 'Something went wrong.');
      toast.error(e.message || 'Failed to parse resume');
    } finally {
      setLoading(false);
    }
  }, []);

  /* ── Confirm preview → create resume ────────────────── */
  const handleConfirmPreview = useCallback(() => {
    if (!preview) return;
    const resume: Resume = {
      ...createBlankResume(),
      ...preview,
      id: crypto.randomUUID(),
      title: preview.profile?.name
        ? `${preview.profile.name}'s Resume`
        : 'Imported Resume',
      lastEdited: new Date().toISOString(),
    };
    createResume(resume);
    toast.success('Resume imported successfully!');
    navigate('/builder');
  }, [preview, createResume, navigate]);

  /* ── JSON import (unchanged logic) ──────────────────── */
  const processJson = (raw: string) => {
    try {
      setError('');
      const parsed = JSON.parse(raw) as Partial<Resume>;
      const resume: Resume = {
        ...createBlankResume(),
        ...parsed,
        id: crypto.randomUUID(),
        lastEdited: new Date().toISOString(),
      };
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
        const resume = createBlankResume();
        resume.summary = content.trim();
        resume.title = file.name.replace(/\.[^.]+$/, '') || 'Imported Resume';
        createResume(resume);
        navigate('/builder');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  /* ── PDF upload ─────────────────────────────────────── */
  const handlePdfUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPdfFileName(file.name);
    setError('');
    setLoading(true);
    try {
      const extractedText = await extractPdfText(file);
      if (!extractedText.trim()) {
        throw new Error('Could not extract text from this PDF. It may be scanned/image-based.');
      }
      await handleAIParse({ text: extractedText });
    } catch (err: any) {
      setError(err.message || 'Failed to process PDF.');
      setLoading(false);
    }
    e.target.value = '';
  };

  const tabs: { id: ImportTab; label: string; icon: React.ReactNode }[] = [
    { id: 'paste', label: 'Paste Text', icon: <ClipboardPaste className="w-4 h-4" /> },
    { id: 'pdf', label: 'Upload PDF', icon: <FileText className="w-4 h-4" /> },
    { id: 'url', label: 'From URL', icon: <Globe className="w-4 h-4" /> },
    { id: 'json', label: 'Import JSON', icon: <Upload className="w-4 h-4" /> },
  ];

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

        {/* ── Tab bar ─────────────────────────────────── */}
        <div className="flex gap-1 p-1 bg-secondary rounded-lg mb-6">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => { setTab(t.id); setError(''); setPreview(null); }}
              className={`flex-1 flex items-center justify-center gap-1.5 px-2 py-2 rounded-md text-xs font-medium transition-colors ${
                tab === t.id
                  ? 'bg-background text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {t.icon}
              <span className="hidden sm:inline">{t.label}</span>
            </button>
          ))}
        </div>

        {/* ── Preview overlay ─────────────────────────── */}
        <AnimatePresence>
          {preview && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="space-y-4"
            >
              <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                <CheckCircle2 className="w-4 h-4 text-green-500" />
                Resume parsed successfully
              </div>

              <div className="border border-border rounded-lg p-4 space-y-3 max-h-80 overflow-y-auto text-sm">
                {preview.profile?.name && (
                  <div><span className="font-medium">Name:</span> {preview.profile.name}</div>
                )}
                {preview.profile?.email && (
                  <div><span className="font-medium">Email:</span> {preview.profile.email}</div>
                )}
                {preview.summary && (
                  <div><span className="font-medium">Summary:</span> {preview.summary.slice(0, 200)}…</div>
                )}
                {preview.experience.length > 0 && (
                  <div><span className="font-medium">Experience:</span> {preview.experience.length} position(s)</div>
                )}
                {preview.education.length > 0 && (
                  <div><span className="font-medium">Education:</span> {preview.education.length} entry/entries</div>
                )}
                {preview.skills.length > 0 && (
                  <div><span className="font-medium">Skills:</span> {preview.skills.map(s => s.category).join(', ')}</div>
                )}
                {preview.projects.length > 0 && (
                  <div><span className="font-medium">Projects:</span> {preview.projects.length}</div>
                )}
                {preview.certifications.length > 0 && (
                  <div><span className="font-medium">Certifications:</span> {preview.certifications.length}</div>
                )}
                {preview.languages.length > 0 && (
                  <div><span className="font-medium">Languages:</span> {preview.languages.map(l => l.language).join(', ')}</div>
                )}
              </div>

              <div className="flex gap-3">
                <Button onClick={handleConfirmPreview} className="gap-2">
                  <CheckCircle2 className="w-4 h-4" /> Use this resume
                </Button>
                <Button variant="outline" onClick={() => setPreview(null)}>
                  Try again
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Tab content ─────────────────────────────── */}
        {!preview && (
          <>
            {/* PASTE */}
            {tab === 'paste' && (
              <div className="space-y-4">
                <div>
                  <h2 className="text-foreground">Paste your resume</h2>
                  <p className="text-muted-foreground text-sm mt-1">
                    Paste your resume text below. AI will structure it automatically.
                  </p>
                </div>
                <Textarea
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="Paste your resume content here..."
                  rows={12}
                  className="resize-none"
                />
                {error && <p className="text-destructive text-sm flex items-center gap-1"><AlertCircle className="w-3 h-3" /> {error}</p>}
                <Button
                  onClick={() => handleAIParse({ text })}
                  disabled={!text.trim() || loading}
                  className="gap-2"
                >
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                  {loading ? 'Parsing…' : 'Parse with AI'}
                </Button>
              </div>
            )}

            {/* PDF */}
            {tab === 'pdf' && (
              <div className="space-y-4">
                <div>
                  <h2 className="text-foreground">Upload a PDF resume</h2>
                  <p className="text-muted-foreground text-sm mt-1">
                    Upload a PDF and AI will extract and structure the content.
                  </p>
                </div>
                <input
                  ref={pdfInputRef}
                  type="file"
                  accept=".pdf"
                  onChange={handlePdfUpload}
                  className="hidden"
                />
                <button
                  onClick={() => pdfInputRef.current?.click()}
                  disabled={loading}
                  className="w-full flex flex-col items-center justify-center gap-3 p-10 border-2 border-dashed border-border rounded-lg hover:border-primary/40 hover:bg-muted/30 transition-colors cursor-pointer disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-8 h-8 text-muted-foreground animate-spin" />
                      <div className="text-center">
                        <p className="text-sm font-medium text-foreground">Processing {pdfFileName}…</p>
                        <p className="text-xs text-muted-foreground mt-1">Extracting text and parsing with AI</p>
                      </div>
                    </>
                  ) : (
                    <>
                      <FileText className="w-8 h-8 text-muted-foreground" />
                      <div className="text-center">
                        <p className="text-sm font-medium text-foreground">Click to upload PDF</p>
                        <p className="text-xs text-muted-foreground mt-1">We'll extract and structure the content</p>
                      </div>
                    </>
                  )}
                </button>
                {error && <p className="text-destructive text-sm flex items-center gap-1"><AlertCircle className="w-3 h-3" /> {error}</p>}
              </div>
            )}

            {/* URL */}
            {tab === 'url' && (
              <div className="space-y-4">
                <div>
                  <h2 className="text-foreground">Import from URL</h2>
                  <p className="text-muted-foreground text-sm mt-1">
                    Provide a link to an online resume or LinkedIn profile. AI will fetch and parse it.
                  </p>
                </div>
                <Input
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://example.com/my-resume"
                  type="url"
                />
                {error && <p className="text-destructive text-sm flex items-center gap-1"><AlertCircle className="w-3 h-3" /> {error}</p>}
                <Button
                  onClick={() => handleAIParse({ url })}
                  disabled={!url.trim() || loading}
                  className="gap-2"
                >
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Globe className="w-4 h-4" />}
                  {loading ? 'Fetching…' : 'Import from URL'}
                </Button>
              </div>
            )}

            {/* JSON (unchanged) */}
            {tab === 'json' && (
              <div className="space-y-4">
                <div>
                  <h2 className="text-foreground">Import JSON</h2>
                  <p className="text-muted-foreground text-sm mt-1">
                    Upload a JSON file or paste structured resume data.{' '}
                    <button
                      type="button"
                      onClick={() => {
                        const sample = JSON.stringify(createSampleResume(), null, 2);
                        const blob = new Blob([sample], { type: 'application/json' });
                        const dlUrl = URL.createObjectURL(blob);
                        const a = document.createElement('a');
                        a.href = dlUrl;
                        a.download = 'sample-resume.json';
                        a.click();
                        URL.revokeObjectURL(dlUrl);
                      }}
                      className="text-primary underline underline-offset-2 hover:text-primary/80 transition-colors"
                    >
                      Download a sample file
                    </button>{' '}
                    to see the expected format.
                  </p>
                </div>

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
          </>
        )}
      </motion.div>
    </div>
  );
};

export default ImportPage;
