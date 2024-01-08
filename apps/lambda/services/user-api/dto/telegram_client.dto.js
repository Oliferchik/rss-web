const TelegramClientDto = class {
  constructor({
    apiId, apiHash, sessionKey,
  }) {
    this.apiId = { S: apiId };
    this.apiHash = { S: apiHash };
    this.sessionKey = { S: sessionKey };
  }

  getDbData() {
    return {
      apiId: this.apiId,
      apiHash: this.apiHash,
      sessionKey: this.sessionKey,
    };
  }

  getData() {
    return {
      apiId: this.apiId.S,
      apiHash: this.apiHash.S,
      sessionKey: this.sessionKey.S,
    };
  }

  static mapArrayDbDataToData(data) {
    return data.map(this.mapDbDataToData);
  }

  static mapDbDataToData({
    apiId, apiHash, sessionKey,
  }) {
    const dto = new TelegramClientDto({
      apiId: apiId.S,
      apiHash: apiHash.S,
      sessionKey: sessionKey.S,
    });

    return dto.getData();
  }

  static mapDataToDbData({
    apiId, apiHash, sessionKey,
  }) {
    const dto = new TelegramClientDto({ apiId, apiHash, sessionKey });

    return dto.getDbData();
  }
};

module.exports = TelegramClientDto;
