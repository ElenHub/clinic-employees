export interface Position {
  value: string
  label: string
}
export interface Department {
  value: string
  label: string
}

export interface FormData {
    name: string;
    surname: string;
    patronymic?: string;
    email: string;
    phone: string;
    department: string;
    administrative_position: string;
    medical_position: string;
    hiredAt: string;
    is_simple_digital_sign_enabled: boolean;
  }

export interface Employee {
    id: number;
    name: string;
    surname: string;
    patronymic?: string;
    email: string;
    phone: string;
    department?: Department | null;
    administrative_position?: Position | null;
    medical_position?: Position | null;
    status?: { value: string; label: string };
    hiredAt: number; 
    firedAt?: number | null; 
    is_simple_digital_sign_enabled?: boolean;
  }

export interface ModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
}
