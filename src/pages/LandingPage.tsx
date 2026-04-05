import { useState, useEffect } from 'react';
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

  // Load preview resume: most recent saved, or demo data
  useEffect(() => {
    if (hasSavedResumes) {
      const sorted = [...resumes].sort(
        (a, b) => new Date(b.lastEdited).getTime() - new Date(a.lastEdited).getTime()
      );
      setPreviewResume({ ...sorted[0] });
    } else {
      fetch('/demo-resume.json')
        .then((r) => r.json())
        .then((data) => {
          // Ensure demo data has required fields
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

  const handleEditResume = () => {
    if (!previewResume) return;
    if (previewResume.id === 'demo') {
      // Persist demo data as a real resume
      const { id, ...rest } = previewResume;
      const newResume = createResume(rest);
      navigate('/builder');
    } else {
      setActive(previewResume.id);
      navigate('/builder');
    }
  };

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
