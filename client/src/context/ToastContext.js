import React, {createContext, useState} from 'react';

export const ToastContext = createContext(null);

export const ToastProvider = props => {
  const [toastConfig, setToastConfig] = useState(null);
  const showToast = (type, message, duration = 2000) => {
    setToastConfig({type, message, duration});
  };
  const hideToast = () => {
    setToastConfig(null);
  };
  return (
    <ToastContext.Provider value={{toastConfig, showToast, hideToast}}>
      {props.children}
    </ToastContext.Provider>
  );
};
