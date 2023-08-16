// Update with your config settings.

module.exports = {
  development: {
    client: 'mysql',
    connection: {
      database: 'gcpl',
      user:     'root',
      password: 'password'
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      directory: './src/js/migration/'
    }
  }
};
