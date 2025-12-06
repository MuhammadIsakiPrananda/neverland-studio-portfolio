import { useState, useCallback, useEffect, useRef } from "react";
import { useNotification } from "./useNotification";

interface UserData {
  name: string;
  username: string;
  email: string;
  avatar: string | null;
  bio?: string;
  coverPhoto?: string | null;
  socials?: { github?: string; linkedin?: string; twitter?: string };
}

export const useProfileState = (
  user: UserData,
  onUpdateProfile: (user: UserData) => void
) => {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState(user);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [coverPhotoPreview, setCoverPhotoPreview] = useState<string | null>(
    null
  );

  const fileInputRef = useRef<HTMLInputElement>(null);
  const coverPhotoInputRef = useRef<HTMLInputElement>(null);
  const { addNotification } = useNotification();
  const initialUserRef = useRef(user);

  useEffect(() => {
    // Only update if user data actually changed (deep comparison of key fields)
    const hasChanged =
      initialUserRef.current.name !== user.name ||
      initialUserRef.current.email !== user.email ||
      initialUserRef.current.username !== user.username ||
      initialUserRef.current.avatar !== user.avatar;

    if (hasChanged) {
      initialUserRef.current = user;
      setFormData(user);
      setAvatarPreview(null);
      setCoverPhotoPreview(null);
    }
  }, [user.name, user.email, user.username, user.avatar]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    if (name.includes(".")) {
      const [parent, child] = name.split(".");
      setFormData((prev) => ({
        ...prev,
        [parent]: { ...(prev as any)[parent], [child]: value },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const handleCoverPhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setCoverPhotoPreview(URL.createObjectURL(file));
    }
  };

  const handleSaveChanges = useCallback(() => {
    setIsLoading(true);
    setTimeout(() => {
      const updatedUser = {
        ...formData,
        avatar: avatarPreview || user.avatar,
        coverPhoto: coverPhotoPreview || user.coverPhoto,
      };
      onUpdateProfile(updatedUser);
      setIsLoading(false);
      addNotification(
        "Profile Updated",
        "Your profile has been successfully updated.",
        "success"
      );
    }, 1500);
  }, [
    formData,
    avatarPreview,
    coverPhotoPreview,
    user,
    onUpdateProfile,
    addNotification,
  ]);

  const handleCancel = useCallback(() => {
    setFormData(user);
    setAvatarPreview(null);
    setCoverPhotoPreview(null);
  }, [user]);

  return {
    isLoading,
    formData,
    handleInputChange,
    handleSaveChanges,
    handleCancel,
    avatarPreview,
    coverPhotoPreview,
    fileInputRef,
    coverPhotoInputRef,
    handleAvatarChange,
    handleCoverPhotoChange,
  };
};
