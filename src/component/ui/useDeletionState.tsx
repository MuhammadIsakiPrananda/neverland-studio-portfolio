import React, { useState, useCallback } from 'react';

export const useDeletionState = (onDeleteAccount: () => void) => {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleAccountDeletion = useCallback((confirmation: string, username: string) => {
    if (confirmation !== username) return;
    setIsDeleting(true);
    setTimeout(() => {
      setIsDeleting(false);
      onDeleteAccount();
    }, 2000);
  }, [onDeleteAccount]);

  return { isDeleteModalOpen, setIsDeleteModalOpen, isDeleting, handleAccountDeletion };
};