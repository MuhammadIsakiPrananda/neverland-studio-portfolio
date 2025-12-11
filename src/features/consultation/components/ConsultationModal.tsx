import { Modal, ConsultationForm } from "@/shared/components";

interface ConsultationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ConsultationModal: React.FC<ConsultationModalProps> = ({
  isOpen,
  onClose,
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ConsultationForm onClose={onClose} />
    </Modal>
  );
};

export default ConsultationModal;
