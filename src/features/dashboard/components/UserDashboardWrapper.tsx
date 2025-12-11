import { useAuth } from "@/features/auth";
import UserDashboard from "./UserDashboard";

interface UserDashboardWrapperProps {
  onClose: () => void;
  initialSection?: string;
}

/**
 * Wrapper component that connects UserDashboard to AuthContext
 * This avoids having to pass auth props through the entire component tree
 */
export const UserDashboardWrapper = ({
  onClose,
  initialSection = "profile",
}: UserDashboardWrapperProps) => {
  const auth = useAuth();

  if (!auth.userProfile) {
    return null;
  }

  // Map UserProfile to UserDashboard's expected format
  const user = {
    ...auth.userProfile,
    image: auth.userProfile.image || null,
  };

  return (
    <UserDashboard
      user={user}
      onUpdateProfile={auth.updateProfile}
      onClose={onClose}
      onDeleteAccount={auth.logout}
      initialSection={initialSection}
    />
  );
};

export default UserDashboardWrapper;
