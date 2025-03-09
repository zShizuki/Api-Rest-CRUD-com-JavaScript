/* eslint-disable global-require */
/* eslint-disable import/no-extraneous-dependencies */
import mysql from 'mysql2';

export default function db() {
  const con = mysql.createConnection({
    host: 'localhost',
    user: 'shine',
    password: '123',
    database: 'videosdb',
  });

  con.connect((err) => {
    if (err) throw err;
  });

  return { con };
}
