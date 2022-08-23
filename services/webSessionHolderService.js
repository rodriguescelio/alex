const { v4: uuid } = require('uuid');

class WebSessionHolderService {
  constructor() {
    this.sessions = [];
  }

  get(id) {
    return this.sessions.find(it => it.id === id);
  }

  newSession(event) {
    let session = this.sessions.find(it => it.event.author.id === event.author.id);

    if (!session) {
      session = { id: uuid(), event };
      this.sessions.push(session);
    }

    return session.id;
  }
}

module.exports = WebSessionHolderService;
