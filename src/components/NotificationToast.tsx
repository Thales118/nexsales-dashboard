import React, { useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { removeNotification } from '@/store/slices/notificationSlice';
import { X, CheckCircle, AlertCircle, AlertTriangle, Info } from 'lucide-react';
import { cn } from '@/lib/utils';

const NotificationToast: React.FC = () => {
  const notifications = useAppSelector((state) => state.notifications.notifications);
  const dispatch = useAppDispatch();

  useEffect(() => {
    const timers: NodeJS.Timeout[] = [];

    notifications.forEach((notification) => {
      const timer = setTimeout(() => {
        dispatch(removeNotification(notification.id));
      }, 5000);
      timers.push(timer);
    });

    return () => {
      timers.forEach(clearTimeout);
    };
  }, [notifications, dispatch]);

  const getIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-success" />;
      case 'error':
        return <AlertCircle className="w-5 h-5 text-destructive" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-warning" />;
      default:
        return <Info className="w-5 h-5 text-info" />;
    }
  };

  const getBorderColor = (type: string) => {
    switch (type) {
      case 'success':
        return 'border-l-success';
      case 'error':
        return 'border-l-destructive';
      case 'warning':
        return 'border-l-warning';
      default:
        return 'border-l-info';
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2 max-w-sm">
      {notifications.map((notification) => (
        <div
          key={notification.id}
          className={cn(
            'flex items-start gap-3 p-4 bg-card border border-border rounded-lg shadow-lg animate-slide-in-right border-l-4',
            getBorderColor(notification.type)
          )}
        >
          {getIcon(notification.type)}
          <div className="flex-1 min-w-0">
            <p className="font-medium text-sm">{notification.title}</p>
            <p className="text-sm text-muted-foreground truncate">{notification.message}</p>
          </div>
          <button
            onClick={() => dispatch(removeNotification(notification.id))}
            className="p-1 rounded hover:bg-secondary transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
};

export default NotificationToast;
