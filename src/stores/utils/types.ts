export interface Employee {
    id: number;
    name: string;
    surname: string;
    patronymic?: string;
    email: string;
    phone: string;
    position?: string; 
    status?: string; 
    hiredAt: number; 
    firedAt?: number | null; 
}

export interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
  }
  