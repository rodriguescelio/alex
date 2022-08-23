const axios = require('axios');

const dashboardRoutes = (app, client) => {

  app.get('/:id/audios', async ({ params: { id } }, res) => {
    const session = client.sessionHolderService.get(id);

    if (!session) {
      return res.status(403).send({ message: 'Invalid session' });
    }

    const commands = await client.databaseService.models.command.findAll({
      where: { playAudio: true },
    });

    const favorites = await client.databaseService.models.favorite.findAll({
      where: { userId: session.event.author.id },
    });

    res.send({
      favorites: favorites.map(it => it.commandId),
      commands: commands.map(it => ({ id: it.id, command: it.command })),
    });
  });

  app.post('/:idSession/play/:idAudio', async ({ params: { idSession, idAudio } }, res) => {
    const session = client.sessionHolderService.get(idSession);

    if (!session) {
      return res.status(403).send({ message: 'Invalid session' });
    }

    const command = await client.databaseService.models.command.findOne({
      where: { id: idAudio },
    });

    if (command) {
      await client.databaseService.models.commandsStatistic.create({
        user: session.event.author.id,
        command: command.command,
      });

      const audio = await axios.get(command.audio, { responseType: 'arraybuffer' }).then(res => res.data);
      await client.voiceService.stream(session.event, audio);
    }

    res.status(200).send();
  });

  app.post('/:idSession/favorite/:idAudio', async ({ params: { idSession, idAudio } }, res) => {
    const session = client.sessionHolderService.get(idSession);

    if (!session) {
      return res.status(403).send({ message: 'Invalid session' });
    }

    const command = await client.databaseService.models.command.findOne({
      where: { id: idAudio },
    });

    if (command) {
      const fav = await client.databaseService.models.favorite.findOne({
        where: { userId: session.event.author.id, commandId: idAudio }
      });

      if (fav) {
        await fav.destroy();
      } else {
        await client.databaseService.models.favorite.create({
          userId: session.event.author.id,
          commandId: idAudio,
        });
      }
    }

    res.status(200).send();
  });

};

module.exports = dashboardRoutes;
