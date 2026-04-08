import { Button } from '@/components/ui/button';

interface LandingHeaderProps {
  hasSavedResumes: boolean;
  onCreateClick: () => void;
  onMyResumesClick: () => void;
}

const LogoIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="40" height="40">
    <rect x="10" y="5" width="22" height="28" rx="2.5" fill="#1e1e38"/>
    <rect x="24" y="5" width="8" height="8" fill="#12121f"/>
    <path d="M24 5 L32 13 L24 13 Z" fill="#f5a623"/>
    <rect x="14" y="14" width="10" height="1.8" rx="0.9" fill="#fff" opacity="0.85"/>
    <rect x="14" y="18" width="14" height="1.2" rx="0.6" fill="#fff" opacity="0.3"/>
    <rect x="14" y="21.5" width="12" height="1.2" rx="0.6" fill="#fff" opacity="0.3"/>
    <rect x="14" y="25" width="9" height="1.2" rx="0.6" fill="#fff" opacity="0.3"/>
    <circle cx="33" cy="36" r="9" fill="#12121f"/>
    <circle cx="33" cy="36" r="7.5" fill="#f5a623"/>
    <line x1="33" y1="32" x2="33" y2="37.5" stroke="white" strokeWidth="2" strokeLinecap="round"/>
    <polyline points="30,35.5 33,39 36,35.5" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <line x1="30" y1="40.5" x2="36" y2="40.5" stroke="white" strokeWidth="1.8" strokeLinecap="round"/>
  </svg>
);

const LandingHeader = ({ hasSavedResumes, onCreateClick, onMyResumesClick }: LandingHeaderProps) => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-background/80 border-b border-border">
      <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <LogoIcon />
          <div className="flex flex-col">
            <span
              style={{ fontFamily: "'DM Serif Display', Georgia, serif", fontSize: '22px', color: '#F0EEE8' }}
            >
              OfflineResume
            </span>
            <span
              style={{ fontFamily: 'monospace', fontSize: '10px', color: '#F5A623', letterSpacing: '0.2em', textTransform: 'uppercase' as const }}
            >
              Cloudless · Yours
            </span>
          </div>
        </div>
        <Button
          size="sm"
          onClick={hasSavedResumes ? onMyResumesClick : onCreateClick}
        >
          {hasSavedResumes ? 'My resumes' : 'Create my resume'}
        </Button>
      </div>
    </header>
  );
};

export default LandingHeader;
