import {useContext} from 'react';
import {ToastContext} from '../../context/ToastContext';
export function useToast() {
  const toast = useContext(ToastContext);
  return toast;
}
