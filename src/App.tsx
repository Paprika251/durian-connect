import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import BrokerRegistration from "./pages/BrokerRegistration";
import BrokerDashboard from "./pages/BrokerDashboard";
import OwnerDashboard from "./pages/OwnerDashboard";
import SubmitProposal from "./pages/SubmitProposal";
import RecordActivity from "./pages/RecordActivity";
import RecordFruitCount from "./pages/RecordFruitCount";
import RecordFinance from "./pages/RecordFinance";
import ReportProblem from "./pages/ReportProblem";
import TreeStatus from "./pages/TreeStatus";
import HarvestRecords from "./pages/HarvestRecords";
import Proposals from "./pages/Proposals";
import FinancialOverview from "./pages/FinancialOverview";
import ProblemReports from "./pages/ProblemReports";
import ActivityLogs from "./pages/ActivityLogs";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/register-broker" element={<BrokerRegistration />} />
          <Route path="/broker-dashboard" element={<BrokerDashboard />} />
          <Route path="/owner-dashboard" element={<OwnerDashboard />} />
          <Route path="/submit-proposal" element={<SubmitProposal />} />
          <Route path="/record-activity" element={<RecordActivity />} />
          <Route path="/record-fruit-count" element={<RecordFruitCount />} />
          <Route path="/record-finance" element={<RecordFinance />} />
          <Route path="/report-problem" element={<ReportProblem />} />
          <Route path="/tree-status" element={<TreeStatus />} />
          <Route path="/harvest-records" element={<HarvestRecords />} />
          <Route path="/proposals" element={<Proposals />} />
          <Route path="/financial-overview" element={<FinancialOverview />} />
          <Route path="/problem-reports" element={<ProblemReports />} />
          <Route path="/activity-logs" element={<ActivityLogs />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
