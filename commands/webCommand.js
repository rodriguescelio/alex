class WebCommand {

  constructor(client) {
    this.client = client;
    this.i18n = client.i18n.web;
    this.command = this.i18n.command;
  }

  async exec(event) {
    const session = this.client.sessionHolderService.newSession(event);
    await event.author.send(`${process.env.WEB_DASHBOARD_URL}/?id=${session}`);
  }

}

module.exports = WebCommand;
