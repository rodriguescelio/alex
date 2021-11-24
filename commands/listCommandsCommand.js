const { Command } = require('discord-akairo');

class ListCommandCommandsCommand extends Command {
  constructor() {
    super('comandos', {
      aliases: ['command', 'comandos'],
    });
  }

  tipoComando (comando) {
    let retorno = 'tipo não definido';
    if (comando) {
      if (comando.text) {
        retorno = 'Texto';
      } else if (comando.image) {
        retorno = 'Imagem';
      } else if (comando.video) {
        retorno = 'Vídeo';
      } else if (comando.audio) {
        retorno = 'Áudio';
      } 
    }
    return retorno;
  }

  async exec(event) {
    const teste = await this.client.databaseService.models.command.findAll();
    
    let todosComandos = '';

    await teste.forEach(comando => todosComandos += `!${comando.command} - Tipo: ${this.tipoComando(comando)}\n`);

    event.channel.send(todosComandos ? "Lista de comandos registrados:\n```" + todosComandos + "```" : 'Nenhum comando registrado!');
  }
}

module.exports = ListCommandCommandsCommand;
