import { Button } from '@/components/ui/button';
import logo from '@/assets/offlineresume.png';

interface LandingHeaderProps {
  hasSavedResumes: boolean;
  onCreateClick: () => void;
  onMyResumesClick: () => void;
}

const LandingHeader = ({ hasSavedResumes, onCreateClick, onMyResumesClick }: LandingHeaderProps) => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-background/80 border-b border-border">
      <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
        <img src={logo} alt="Offline Resume" className="h-8" />
        <Button
          size="sm"
          onClick={hasSavedResumes ? onMyResumesClick : onCreateClick}
          className="bg-accent text-accent-foreground hover:bg-accent/90"
        >
          {hasSavedResumes ? 'My resumes' : 'Create my resume'}
        </Button>
      </div>
    </header>
  );
};

export default LandingHeader;
