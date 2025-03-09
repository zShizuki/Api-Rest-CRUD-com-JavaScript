/* eslint-disable global-require */
/* eslint-disable import/no-extraneous-dependencies */
import mysql from 'mysql';

export default function db() {
  const con = mysql.createConnection({
    host: 'localhost',
    user: 'shine',
    password: '123',
    database: 'videosdb',
    charset: 'utf8', // ou 'utf8'
  });

  con.connect((err) => {
    if (err) throw err;
  });

  return { con };
}
