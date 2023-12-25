import { showNotification } from '@mantine/notifications';

import { getNotificationStyles } from './styles';

const notificationService = {
  showSuccess: (message: string) => {
    showNotification({
      title: ' ',
      message,
      icon: <div />,
      styles: (theme) => getNotificationStyles(theme.colors.green),
    });
  },

  showError: (message: string) => {
    showNotification({
      title: 'Error',
      message,
      color: 'red',
    });

    showNotification({
      title: ' ',
      message,
      icon: <div />,
      styles: (theme) => getNotificationStyles(theme.colors.red),
    });
  },
};

export default notificationService;
