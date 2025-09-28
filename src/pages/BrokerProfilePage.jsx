import BackButton from '../components/BackButton.jsx';
import ProfileEditor from '../components/ProfileEditor.jsx';
import { useAuth } from '../context/AuthContext.jsx';

const BrokerProfilePage = () => {
  const { user, updateUser } = useAuth();

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-emerald-50">
      <div className="max-w-3xl mx-auto px-6 py-10 space-y-6">
        <BackButton fallback="/broker/dashboard" />
        <ProfileEditor user={user} onUpdated={updateUser} />
      </div>
    </div>
  );
};

export default BrokerProfilePage;
