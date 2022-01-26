import React, { useContext, useState } from 'react';

import { ToastContext } from './ToastQueueProvider';
import { ToastItem } from './ToastItem';

export const ToastManager = () => {
  const { toastList, removeToast } = useContext(ToastContext);
  const [listed, setListed] = useState<boolean>(false);

  return (
    <div className="bg-brown-600 p-0.5 text-white shadow-lg flex flex-col items-end mr-2 sm:block fixed top-20 left-2 z-50">
      {toastList.map(({ content, id }) => (
        <div className="relative" key={id}>
          {content}
        </div>
      ))}
    </div>
  );
};
