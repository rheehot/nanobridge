const config = require('./config');

const EventEmitter = require('events');
const {MongoClient} = require('mongodb');

class Database extends EventEmitter {
	constructor() {
		super();
		this.initialized = false;
	}

	async init() {
		this.db = await MongoClient.connect(
			`mongodb://${config.store.dburl}:${config.store.dbport}/${config.store.dbname}`
		);

		this.initialized = true;
		this.emit('init');
	}
};

const database = new Database();
module.exports = {
	database,
	db() {
		return database.db;
	}
};