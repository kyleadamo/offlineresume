export interface CoverLetter {
  id: string;
  title: string;
  lastEdited: string;
  recipientName: string;
  recipientTitle: string;
  companyName: string;
  companyAddress: string;
  date: string;
  greeting: string;
  body: string;
  closing: string;
  senderName: string;
  senderContact: string;
}

export const createBlankCoverLetter = (): CoverLetter => ({
  id: crypto.randomUUID(),
  title: 'Untitled Cover Letter',
  lastEdited: new Date().toISOString(),
  recipientName: '',
  recipientTitle: '',
  companyName: '',
  companyAddress: '',
  date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
  greeting: 'Dear Hiring Manager,',
  body: '',
  closing: 'Sincerely,',
  senderName: '',
  senderContact: '',
});
