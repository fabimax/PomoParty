import React from "react"
import { useSelector } from 'react-redux';
import styles from './ToastOverlay.module.css';

export default function ToastOverlay() {
  let type = useSelector(state => state.toast.type);
  let message = useSelector(state => state.toast.message);
  let id = useSelector(state => state.toast.id);

  if (!type || !message) {
    return null;
  }

  let toastStyles = {
    success: {
      backgroundColor: 'bg-green-600',
      textColor: 'text-white',
      charBefore: '✔',
    },
    error: {
      backgroundColor: 'bg-red-500',
      textColor: 'text-white',
      charBefore: '',
    },
  }

  return (
    <div className="fixed bottom-0 left-1/2 -translate-x-1/2 z-50" key={id}>
      <div 
        className={`
          ${toastStyles[type].backgroundColor} 
          ${toastStyles[type].textColor} 
          px-6 py-2 
          rounded-lg 
          shadow-lg
          ${styles.animate}
          whitespace-nowrap
        `}
      >
        <p>{toastStyles[type].charBefore} {message}</p>
      </div>
    </div>
  );
}