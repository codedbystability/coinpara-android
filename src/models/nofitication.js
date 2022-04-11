class NotificationModel {

  constructor(type, message) {
    this.id = Math.floor(Math.random() * (2000 - 1 + 1)) + 1;
    this.type = type;
    this.message = message;
  }

  getType() {
    return this.type;
  }

  getMessage() {
    return this.message;
  }

}

export default NotificationModel;
