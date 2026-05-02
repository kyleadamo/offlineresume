import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import logoImg from '@/assets/offline-resume-logo.png';

interface LandingHeaderProps {
  hasSavedResumes: boolean;
  onCreateClick: () => void;
  onMyResumesClick: () => void;
}

const LandingHeader = ({ hasSavedResumes, onCreateClick, onMyResumesClick }: LandingHeaderProps) => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-background/80 border-b border-border">
      <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
        <Link to="/" className="flex items-center">
          <img src={logoImg} alt="OfflineResume" className="h-8 w-auto" />
        </Link>
        <div className="flex items-center gap-4">
          <Link
            to="/blog"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors hidden sm:inline"
          >
            Blog
          </Link>
          <Button
            size="sm"
            onClick={hasSavedResumes ? onMyResumesClick : onCreateClick}
            className="bg-accent text-accent-foreground hover:bg-accent/90"
          >
            {hasSavedResumes ? 'My resumes' : 'Create my resume'}
          </Button>
        </div>
      </div>
    </header>
  );
};

export default LandingHeader;
