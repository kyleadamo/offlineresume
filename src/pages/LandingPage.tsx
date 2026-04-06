import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useResume } from '@/hooks/ResumeContext';
import { Resume, TemplateId, DEFAULT_SECTION_ORDER } from '@/schema/resume';
import LandingHeader from '@/components/landing/LandingHeader';
import HeroSection from '@/components/landing/HeroSection';
import CreateResumeModal from '@/components/landing/CreateResumeModal';
import SavedResumesSheet from '@/components/landing/SavedResumesSheet';

const STORAGE_KEY = 'resume-studio-resumes';

const LandingPage = () => {
  const navigate = useNavigate();
  const { resumes, createResume, setActive } = useResume();
  const [previewResume, setPreviewResume] = useState<Resume | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isResumesSheetOpen, setIsResumesSheetOpen] = useState(false);

  const hasSavedResumes = resumes.length > 0;

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
