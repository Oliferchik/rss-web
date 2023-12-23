export const getNotificationStyles = (colorScheme: any) => ({
  root: {
    color: `${colorScheme[5]} !important`,
    backgroundColor: colorScheme[0],
    borderColor: colorScheme[0],
  },
  description: {
    color: colorScheme[6],
    fontWeight: 500,
    fontSize: 14,
  },
  closeButton: {
    width: 18,
    color: colorScheme[5],

    '&:hover': {
      background: colorScheme[2],
      color: colorScheme[5],
    },
    '&:active': {
      background: colorScheme[2],
      color: colorScheme[6],
    },
  },
  icon: {
    color: `${colorScheme[6]} !important`,
    backgroundColor: 'transparent !important',
  },
});
