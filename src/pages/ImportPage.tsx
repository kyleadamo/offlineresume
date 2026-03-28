import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSearchParams } from 'react-router-dom';
import { useResume } from '@/hooks/ResumeContext';
import { Resume, createBlankResume } from '@/schema/resume';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';

const ImportPage = () => {
  const [searchParams] = useSearchParams();
  const mode = searchParams.get('mode') || 'paste';
  const navigate = useNavigate();
  const { createResume } = useResume();
  const [text, setText] = useState('');
  const [jsonText, setJsonText] = useState('');
  const [error, setError] = useState('');

  const handlePasteImport = () => {
    if (!text.trim()) return;
    // Basic parsing: create a resume with the pasted text as summary
    const resume = createBlankResume();
    resume.summary = text.trim();
    resume.title = 'Imported Resume';
    createResume(resume);
    navigate('/builder');
  };

  const handleJsonImport = () => {
    try {
      setError('');
      const parsed = JSON.parse(jsonText) as Partial<Resume>;
      const resume: Resume = { ...createBlankResume(), ...parsed, id: crypto.randomUUID(), lastEdited: new Date().toISOString() };
      createResume(resume);
      navigate('/builder');
    } catch {
      setError("Something didn't parse correctly. Check the JSON format and try again.");
    }
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
                Paste a structured resume JSON to import your data.
              </p>
            </div>
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
      </motion.div>
    </div>
  );
};

export default ImportPage;
