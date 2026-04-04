import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ResumeProvider } from "@/hooks/ResumeContext";
import { CoverLetterProvider } from "@/hooks/CoverLetterContext";
import Index from "./pages/Index.tsx";
import BuilderPage from "./pages/BuilderPage.tsx";
import ImportPage from "./pages/ImportPage.tsx";
import CoverLetterBuilderPage from "./pages/CoverLetterBuilderPage.tsx";
import ImportCoverLetterPage from "./pages/ImportCoverLetterPage.tsx";
import WorkspacePage from "./pages/WorkspacePage.tsx";
import NotFound from "./pages/NotFound.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <ResumeProvider>
        <CoverLetterProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/builder" element={<BuilderPage />} />
              <Route path="/import" element={<ImportPage />} />
              <Route path="/cover-letter/builder" element={<CoverLetterBuilderPage />} />
              <Route path="/cover-letter/import" element={<ImportCoverLetterPage />} />
              <Route path="/workspace" element={<WorkspacePage />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </CoverLetterProvider>
      </ResumeProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
