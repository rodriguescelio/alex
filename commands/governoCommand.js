const moment = require('moment');
const axios = require('axios');

class GovernoCommand {
  constructor(client) {
    this.client = client;
    this.i18n = client.i18n.governo;
    this.command = this.i18n.command;

    this.fimGoverno = moment("2023-01-01");
    this.eleicoes = moment("2022-10-02");
  }

  async getPart(part) {
    return await axios.get(part, { responseType: 'arraybuffer' }).then(res => res.data);
  }

  async exec(event) {
    const aguarde = await event.channel.send(this.i18n.loading);

    const diasFimGoverno = moment.duration(this.fimGoverno.diff(moment())).asDays().toFixed(0);
    const diasEleicoes = moment.duration(this.eleicoes.diff(moment())).asDays().toFixed(0);

    await this.client.voiceService.stream(event, Buffer.concat([
      await this.getPart(process.env.GOV_1),
      await this.client.speechService.convert(21, diasFimGoverno),
      await this.getPart(process.env.GOV_2),
      await this.client.speechService.convert(21, diasEleicoes),
      await this.getPart(process.env.GOV_3)
    ]));

    aguarde.delete();
  }
}

module.exports = GovernoCommand;

