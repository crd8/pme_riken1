const MySQLEvents = require('@rodrigogs/mysql-events');

module.exports = async function setupRealtime(io) {
  const instance = new MySQLEvents({
    host: process.env.DB_HOST,
    user: process.env.BINLOG_USER,
    password: process.env.BINLOG_PASS,
  }, { startAtEnd: true });

  await instance.start();
  instance.addTrigger({
    name: 'watch data_realtime',
    expression: `${process.env.DB_NAME}.data_realtime`,
    statement: MySQLEvents.STATEMENTS.ALL,
    onEvent: (evt) => {
      evt.rows.forEach(row => {
        const data = row.after || row; 
        io.emit('new-data', data);
      });
    },
  });
};
