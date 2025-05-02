export interface Position {
  value: string
  label: string
}
export interface Department {
  value: string
  label: string
}

interface Employee {
    id: number;
    name: string;
    surname: string;
    patronymic?: string;
    email: string;
    phone: string;
    department?: Department;
    administrative_position?: Position;
    medical_position?: Position;
    status?: string;
    hiredAt: number;
    firedAt?: number | null;
    is_simple_digital_sign_enabled?: boolean;
  }

export interface ModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
}
