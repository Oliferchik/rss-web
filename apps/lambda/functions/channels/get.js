const get = (req) => {
  const { user } = req.state;

  return Object.keys(user.chanelToLastMessage).map(
    (channelId) => ({ channelId, lastMessage: user.chanelToLastMessage[channelId] }),
  );
};

module.exports = get;
