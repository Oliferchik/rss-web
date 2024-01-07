const UserDto = class {
  constructor({ email, password }) {
    this.email = { S: email };
    this.password = { S: password };
  }

  getDbData() {
    return {
      email: this.email,
      password: this.password,
    };
  }

  getData() {
    return {
      email: this.email.S,
      password: this.password.S,
    };
  }

  static mapArrayDbDataToData(data) {
    return data.map(this.mapDbDataToData);
  }

  static mapDbDataToData({
    email, password,
  }) {
    const dto = new UserDto({
      email: email.S,
      password: password.S,
    });

    return dto.getData();
  }

  static mapDataToDbData({ email, password }) {
    const dto = new UserDto({ email, password });

    return dto.getDbData();
  }
};

module.exports = UserDto;
