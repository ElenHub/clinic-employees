export interface Position {
  value: string
  type: string; 
  label: string
}
export interface Department {
  value: string
  label: string
}

export interface ApiResponse<T> {
    data: T;
  }

export interface ButtonStyleProps {
    variant?: 'primary' | 'secondary' | 'third';
    size?: 'small' | 'medium' | 'large' | 'big';
  }

  export interface FormDataState {
    name: string;
    surname: string;
    patronymic: string;
    email: string;
    phone: string;
    department: Department | null;
    administrative_position: Position | null;
    medical_position: Position | null;
    hiredAt: string; 
  }

export interface Employee {
  id: number; 
  name: string;
  surname: string;
  patronymic: string;
  email: string;
  phone: string;
  department: Department | null; 
  administrative_position: Position | null; 
  medical_position: Position | null;
  hired_at: number;
  fired_at?: number | null; 
  status: { value: string; label: string }; 
  is_simple_digital_sign_enabled: boolean; 
  created_at?: number; 
  updated_at?: number; 
  email_verified_at?: number; 
  roles?: any[]; 
}

export interface CreateEmployeeData {
  name: string;
  surname: string;
  patronymic: string | null; 
  email: string;
  phone: string | null; 
  department: string | null; 
  administrative_position: string | null; 
  medical_position: string | null; 
  hired_at: number | null;
  is_simple_digital_sign_enabled: boolean; 
}

export interface UpdateEmployeeData {
  name: string;
  surname: string;
  patronymic: string | null;
  email: string;
  phone: string | null;
  department: string | null;
  administrative_position: string | null;
  medical_position: string | null;
  hired_at: number | null;
  is_simple_digital_sign_enabled: boolean; 
  status: { value: string; label: string }; 
}

export interface ModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
}
