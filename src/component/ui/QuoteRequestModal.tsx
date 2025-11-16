import Modal from './Modal';
import QuoteRequestForm from './QuoteRequestForm';

interface QuoteRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const QuoteRequestModal: React.FC<QuoteRequestModalProps> = ({ isOpen, onClose }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose}><QuoteRequestForm onClose={onClose} /></Modal>
  );
};

export default QuoteRequestModal;