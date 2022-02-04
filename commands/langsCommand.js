class LangsCommand {
  constructor(client) {
    this.client = client;
    this.command = 'langs';
  }

  async exec(event) {
    const voices = this.client.speechService.getVoices();
    const voicesMap = voices.map(it => `(${it.language}) - ${it.description}`);
    const mid = Math.ceil(voicesMap.length / 2);

    var red = (arr, start) => arr.reduce((r, v, i) => `${r}${i + start} - ${v}\n`, '');

    var a = Array.from(Array(mid), (_, k) => voicesMap[k]);
    var b = Array.from(Array(voicesMap.length - mid), (_, k) => voicesMap[k + mid]);

    await event.channel.send(red(a, 1));
    await event.channel.send(red(b, mid + 1));
  }
}

module.exports = LangsCommand;
