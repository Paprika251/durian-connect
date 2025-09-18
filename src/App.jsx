import { Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage.jsx';
import BrokerRegistrationPage from './pages/BrokerRegistrationPage.jsx';
import BrokerDashboard from './pages/BrokerDashboard.jsx';
import SubmitProposalPage from './pages/SubmitProposalPage.jsx';
import RecordActivityPage from './pages/RecordActivityPage.jsx';
import RecordFruitPage from './pages/RecordFruitPage.jsx';
import RecordFinancePage from './pages/RecordFinancePage.jsx';
import ReportProblemPage from './pages/ReportProblemPage.jsx';
import OwnerDashboard from './pages/OwnerDashboard.jsx';
import TreeStatusPage from './pages/TreeStatusPage.jsx';
import HarvestOverviewPage from './pages/HarvestOverviewPage.jsx';
import OwnerProposalsPage from './pages/OwnerProposalsPage.jsx';
import OwnerFinancePage from './pages/OwnerFinancePage.jsx';
import OwnerProblemPage from './pages/OwnerProblemPage.jsx';
import OwnerActivityPage from './pages/OwnerActivityPage.jsx';
import NotFoundPage from './pages/NotFoundPage.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';

const App = () => (
  <Routes>
    <Route path="/" element={<LoginPage />} />
    <Route path="/register-broker" element={<BrokerRegistrationPage />} />

    <Route
      path="/broker/dashboard"
      element={(
        <ProtectedRoute allowedRoles={["broker"]}>
          <BrokerDashboard />
        </ProtectedRoute>
      )}
    />
    <Route
      path="/broker/submit-proposal"
      element={(
        <ProtectedRoute allowedRoles={["broker"]}>
          <SubmitProposalPage />
        </ProtectedRoute>
      )}
    />
    <Route
      path="/broker/record-activity"
      element={(
        <ProtectedRoute allowedRoles={["broker"]}>
          <RecordActivityPage />
        </ProtectedRoute>
      )}
    />
    <Route
      path="/broker/record-fruit"
      element={(
        <ProtectedRoute allowedRoles={["broker"]}>
          <RecordFruitPage />
        </ProtectedRoute>
      )}
    />
    <Route
      path="/broker/record-finance"
      element={(
        <ProtectedRoute allowedRoles={["broker"]}>
          <RecordFinancePage />
        </ProtectedRoute>
      )}
    />
    <Route
      path="/broker/report-problem"
      element={(
        <ProtectedRoute allowedRoles={["broker"]}>
          <ReportProblemPage />
        </ProtectedRoute>
      )}
    />

    <Route
      path="/owner/dashboard"
      element={(
        <ProtectedRoute allowedRoles={["owner"]}>
          <OwnerDashboard />
        </ProtectedRoute>
      )}
    />
    <Route
      path="/owner/tree-status"
      element={(
        <ProtectedRoute allowedRoles={["owner"]}>
          <TreeStatusPage />
        </ProtectedRoute>
      )}
    />
    <Route
      path="/owner/harvest"
      element={(
        <ProtectedRoute allowedRoles={["owner"]}>
          <HarvestOverviewPage />
        </ProtectedRoute>
      )}
    />
    <Route
      path="/owner/proposals"
      element={(
        <ProtectedRoute allowedRoles={["owner"]}>
          <OwnerProposalsPage />
        </ProtectedRoute>
      )}
    />
    <Route
      path="/owner/finances"
      element={(
        <ProtectedRoute allowedRoles={["owner"]}>
          <OwnerFinancePage />
        </ProtectedRoute>
      )}
    />
    <Route
      path="/owner/problems"
      element={(
        <ProtectedRoute allowedRoles={["owner"]}>
          <OwnerProblemPage />
        </ProtectedRoute>
      )}
    />
    <Route
      path="/owner/activities"
      element={(
        <ProtectedRoute allowedRoles={["owner"]}>
          <OwnerActivityPage />
        </ProtectedRoute>
      )}
    />

    <Route path="*" element={<NotFoundPage />} />
  </Routes>
);

export default App;
