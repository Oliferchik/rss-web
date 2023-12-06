import config from 'config';
import mixpanel from 'mixpanel-browser';

export const init = () => {
  mixpanel.init(config.MIXPANEL_API_KEY ?? '', { debug: config.IS_DEV });
};

export const setUser = (user: any) => {
  mixpanel.identify(user?._id);

  if (user) {
    mixpanel.people.set({
      firstName: user.firstName,
      lastName: user.lastName,
    });
  }
};

export const track = (event: string, data = {}) => {
  try {
    mixpanel.track(event, data);
  } catch (e) {
    console.error(e); //eslint-disable-line
  }
};