class ComandosCommand {
  constructor(client) {
    this.client = client;
    this.i18n = client.i18n.comandos;
    this.command = this.i18n.command;
  }

  tipoComando (comando) {
    let retorno = this.i18n.undefined;
    if (comando) {
      if (comando.text) {
        retorno = this.i18n.text;
      } else if (comando.image) {
        retorno = this.i18n.image;
      } else if (comando.video) {
        retorno = this.i18n.video;
      } else if (comando.audio) {
        retorno = this.i18n.audio;
      } 
    }
    return retorno;
  }

  async exec(event) {
    const teste = await this.client.databaseService.models.command.findAll();
    
    let todosComandos = '';

    await teste.forEach(comando => todosComandos += `!${comando.command} - ${this.i18n.type}: ${this.tipoComando(comando)}\n`);

    event.channel.send(todosComandos ? this.i18n.result.replace('{{LISTA_COMANDOS}}', todosComandos) : this.i18n.empty);
  }
}

module.exports = ComandosCommand;
