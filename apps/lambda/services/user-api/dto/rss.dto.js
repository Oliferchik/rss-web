const RssDto = class {
  constructor({
    url, lastMessage, userEmail, channelId,
  }) {
    this.url = { S: url };
    this.lastMessage = { N: String(lastMessage) };
    this.userEmail = { S: userEmail };
    this.channelId = { S: channelId };
  }

  getDbData() {
    return {
      url: this.url,
      lastMessage: this.lastMessage,
      userEmail: this.userEmail,
      channelId: this.channelId,
    };
  }

  getData() {
    return {
      url: this.url.S,
      lastMessage: Number(this.lastMessage.N),
      userEmail: this.userEmail.S,
      channelId: this.channelId.S,
    };
  }

  static mapArrayDbDataToData(data) {
    return data.map(this.mapDbDataToData);
  }

  static mapDbDataToData({
    url, lastMessage, userEmail, channelId,
  }) {
    const dto = new RssDto({
      url: url.S,
      lastMessage: lastMessage.N,
      userEmail: userEmail.S,
      channelId: channelId.S,
    });

    return dto.getData();
  }

  static mapDataToDbData({
    url, lastMessage, userEmail, channelId,
  }) {
    const dto = new RssDto({
      url, lastMessage, userEmail, channelId,
    });

    return dto.getDbData();
  }
};

module.exports = RssDto;
