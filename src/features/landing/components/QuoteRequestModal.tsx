import Modal from "../../../shared/components/ui/Modal";
import { QuoteRequestForm } from "@/shared/components";

interface QuoteRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const QuoteRequestModal: React.FC<QuoteRequestModalProps> = ({
  isOpen,
  onClose,
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <QuoteRequestForm onClose={onClose} />
    </Modal>
  );
};

export default QuoteRequestModal;
