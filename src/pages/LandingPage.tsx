import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useResume } from '@/hooks/ResumeContext';
import { Resume, TemplateId, DEFAULT_SECTION_ORDER } from '@/schema/resume';
import LandingHeader from '@/components/landing/LandingHeader';
import HeroSection from '@/components/landing/HeroSection';
import LandingFooter from '@/components/landing/LandingFooter';
import CreateResumeModal from '@/components/landing/CreateResumeModal';
import SavedResumesSheet from '@/components/landing/SavedResumesSheet';
import { track } from '@/lib/analytics';
import SEO from '@/components/SEO';

const STORAGE_KEY = 'resume-studio-resumes';

const LandingPage = () => {
  const navigate = useNavigate();
  const { resumes, createResume, setActive } = useResume();
  const [previewResume, setPreviewResume] = useState<Resume | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isResumesSheetOpen, setIsResumesSheetOpen] = useState(false);

  const hasSavedResumes = resumes.length > 0;

  useEffect(() => {
    track('page_view', { path: '/' });
  }, []);

  // Load preview resume: most recent saved with a name, or demo data
  useEffect(() => {
    const hasNamedResume = hasSavedResumes && resumes.some(r => r.profile?.name?.trim());

    if (hasNamedResume) {
      const sorted = [...resumes].sort(
        (a, b) => new Date(b.lastEdited).getTime() - new Date(a.lastEdited).getTime()
      );
      const best = sorted.find(r => r.profile?.name?.trim()) || sorted[0];
      setPreviewResume({ ...best });
    } else {
      fetch('/demo-resume.json')
        .then((r) => r.json())
        .then((data) => {
          const demo: Resume = {
            id: 'demo',
            title: data.title || 'Demo Resume',
            targetRole: data.targetRole || '',
            lastEdited: new Date().toISOString(),
            templateId: 'creative' as TemplateId,
            profile: data.profile || { name: '', email: '', phone: '', location: '', photo: '', linkedin: '', linkedinDisplayFull: false, website: '', websiteDisplayFull: false, links: [] },
            summary: data.summary || '',
            experience: data.experience || [],
            education: data.education || [],
            projects: data.projects || [],
            skills: data.skills || [],
            certifications: data.certifications || [],
            customSections: data.customSections || [],
            references: data.references || [],
            sectionOrder: data.sectionOrder || DEFAULT_SECTION_ORDER.map((s) => ({ ...s })),
            languages: data.languages || [],
            awards: data.awards || [],
            volunteer: data.volunteer || [],
            publications: data.publications || [],
            affiliations: data.affiliations || [],
            patents: data.patents || [],
            interests: data.interests || [],
          };
          setPreviewResume(demo);
        })
        .catch(() => {});
    }
  }, [hasSavedResumes, resumes]);

  const handleTemplateChange = (id: TemplateId) => {
    if (previewResume) {
      setPreviewResume({ ...previewResume, templateId: id });
    }
  };

  const ensureResumeActive = useCallback(() => {
    if (!previewResume) return;
    if (previewResume.id === 'demo') {
      const { id, ...rest } = previewResume;
      createResume(rest);
    } else {
      setActive(previewResume.id);
    }
  }, [previewResume, createResume, setActive]);

  const handleEditResume = () => {
    ensureResumeActive();
    navigate('/builder');
  };

  // Listen for section clicks in the preview and navigate to builder with that section
  useEffect(() => {
    const handler = (e: Event) => {
      const section = (e as CustomEvent).detail;
      ensureResumeActive();
      sessionStorage.setItem('scroll-to-section', section);
      navigate('/builder');
    };
    window.addEventListener('scroll-to-section', handler);
    return () => window.removeEventListener('scroll-to-section', handler);
  }, [ensureResumeActive, navigate]);

  if (!previewResume) {
    return (
      <div className="dark min-h-screen bg-background flex items-center justify-center">
        <div className="text-muted-foreground text-sm">Loading...</div>
      </div>
    );
  }

  return (
    <div className="dark min-h-screen bg-background">
      <SEO
        title="Offline Resume — Private, Beautiful Resume Builder"
        description="Build a beautiful resume from a dozen designer templates. Runs entirely in your browser — no accounts, no cloud, no tracking of your resume content."
        canonical="https://offlineresume.com/"
        keywords={[
          'offline resume builder',
          'private resume builder',
          'free resume builder',
          'resume builder no signup',
          'ATS resume templates',
          'cover letter builder',
        ]}
        jsonLd={{
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity: [
            {
              '@type': 'Question',
              name: 'Is Offline Resume really free?',
              acceptedAnswer: { '@type': 'Answer', text: 'Yes. Offline Resume is free to use, with no account required and no paywalled templates or exports.' },
            },
            {
              '@type': 'Question',
              name: 'Do you store my resume on a server?',
              acceptedAnswer: { '@type': 'Answer', text: 'No. Your resume data stays in your browser. We never upload, store, or read your resume content.' },
            },
            {
              '@type': 'Question',
              name: 'Are the templates ATS-friendly?',
              acceptedAnswer: { '@type': 'Answer', text: 'Yes. Offline Resume includes single-column ATS-optimized templates alongside more visual multi-column designs.' },
            },
            {
              '@type': 'Question',
              name: 'Can I import an existing resume?',
              acceptedAnswer: { '@type': 'Answer', text: 'Yes. You can import from a URL, pasted text, a PDF upload, or a portable JSON file.' },
            },
          ],
        }}
      />
      <LandingHeader
        hasSavedResumes={hasSavedResumes}
        onCreateClick={() => setIsCreateModalOpen(true)}
        onMyResumesClick={() => setIsResumesSheetOpen(true)}
      />
      <HeroSection
        resume={previewResume}
        onTemplateChange={handleTemplateChange}
        onEditClick={handleEditResume}
      />
      <LandingFooter />
      <CreateResumeModal
        open={isCreateModalOpen}
        onOpenChange={setIsCreateModalOpen}
      />
      <SavedResumesSheet
        open={isResumesSheetOpen}
        onOpenChange={setIsResumesSheetOpen}
        onCreateNew={() => {
          setIsResumesSheetOpen(false);
          setIsCreateModalOpen(true);
        }}
      />
    </div>
  );
};

export default LandingPage;
