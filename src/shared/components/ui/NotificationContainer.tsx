import React from "react";
import { AnimatePresence } from "framer-motion";
import { useNotification } from "./useNotification";
import NotificationComponent from "./Notification";

const NotificationContainer: React.FC = () => {
  const { notifications, removeNotification } = useNotification();

  return (
    <div className="fixed top-4 right-4 z-[100] flex flex-col gap-3 w-full max-w-sm">
      <AnimatePresence>
        {notifications.map((notification, index) => (
          <NotificationComponent
            key={notification.id}
            notification={notification}
            onRemove={removeNotification}
            index={index}
          />
        ))}
      </AnimatePresence>
    </div>
  );
};

export default NotificationContainer;
