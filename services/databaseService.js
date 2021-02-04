const { Sequelize } = require("sequelize");
const { readdirSync } = require('fs');
const { join } = require('path');

class DatabaseService {
  constructor() {
    this.commands = [];

    this.sequelize = new Sequelize(process.env.DATABASE_URL);
    this.models = this.sequelize.models;

    this.registerModels().then(() => this.loadCommands());
  }

  registerModels() {
    const dir = join(__dirname, '../models');
    readdirSync(dir).forEach(filename => require(join(dir, filename))(this.sequelize));
    return this.sequelize.sync({ alter: true });
  }

  async loadCommands() {
    const commands = await this.models.command.findAll();
    this.commands = commands.map(it => it.command);
  }
}

module.exports = DatabaseService;
