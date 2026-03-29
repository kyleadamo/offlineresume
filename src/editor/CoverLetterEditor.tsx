import { useCoverLetter } from '@/hooks/CoverLetterContext';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

const CoverLetterEditor = () => {
  const { activeLetter, updateLetter } = useCoverLetter();

  if (!activeLetter) return null;

  const update = (updates: Record<string, string>) => {
    updateLetter(activeLetter.id, updates);
  };

  return (
    <div className="p-6 space-y-6">
      <section className="space-y-4">
        <h3 className="text-sm font-medium text-foreground uppercase tracking-wider">Sender</h3>
        <div className="space-y-3">
          <div>
            <Label className="text-xs text-muted-foreground">Your Name</Label>
            <Input
              value={activeLetter.senderName}
              onChange={(e) => update({ senderName: e.target.value })}
              placeholder="Jane Doe"
            />
          </div>
          <div>
            <Label className="text-xs text-muted-foreground">Contact Info</Label>
            <Input
              value={activeLetter.senderContact}
              onChange={(e) => update({ senderContact: e.target.value })}
              placeholder="jane@example.com · (555) 123-4567"
            />
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <h3 className="text-sm font-medium text-foreground uppercase tracking-wider">Recipient</h3>
        <div className="space-y-3">
          <div>
            <Label className="text-xs text-muted-foreground">Name</Label>
            <Input
              value={activeLetter.recipientName}
              onChange={(e) => update({ recipientName: e.target.value })}
              placeholder="John Smith"
            />
          </div>
          <div>
            <Label className="text-xs text-muted-foreground">Title</Label>
            <Input
              value={activeLetter.recipientTitle}
              onChange={(e) => update({ recipientTitle: e.target.value })}
              placeholder="Hiring Manager"
            />
          </div>
          <div>
            <Label className="text-xs text-muted-foreground">Company</Label>
            <Input
              value={activeLetter.companyName}
              onChange={(e) => update({ companyName: e.target.value })}
              placeholder="Acme Corp"
            />
          </div>
          <div>
            <Label className="text-xs text-muted-foreground">Company Address</Label>
            <Input
              value={activeLetter.companyAddress}
              onChange={(e) => update({ companyAddress: e.target.value })}
              placeholder="123 Main St, City, State"
            />
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <h3 className="text-sm font-medium text-foreground uppercase tracking-wider">Letter</h3>
        <div className="space-y-3">
          <div>
            <Label className="text-xs text-muted-foreground">Date</Label>
            <Input
              value={activeLetter.date}
              onChange={(e) => update({ date: e.target.value })}
              placeholder="January 1, 2025"
            />
          </div>
          <div>
            <Label className="text-xs text-muted-foreground">Greeting</Label>
            <Input
              value={activeLetter.greeting}
              onChange={(e) => update({ greeting: e.target.value })}
              placeholder="Dear Hiring Manager,"
            />
          </div>
          <div>
            <Label className="text-xs text-muted-foreground">Body (Markdown supported)</Label>
            <Textarea
              value={activeLetter.body}
              onChange={(e) => update({ body: e.target.value })}
              placeholder="Write your cover letter here...&#10;&#10;Use blank lines to separate paragraphs."
              rows={16}
              className="resize-none font-sans text-sm leading-relaxed"
            />
          </div>
          <div>
            <Label className="text-xs text-muted-foreground">Closing</Label>
            <Input
              value={activeLetter.closing}
              onChange={(e) => update({ closing: e.target.value })}
              placeholder="Sincerely,"
            />
          </div>
        </div>
      </section>
    </div>
  );
};

export default CoverLetterEditor;
