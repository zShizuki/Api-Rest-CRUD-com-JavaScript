/* eslint-disable import/no-extraneous-dependencies */
import mysql from 'mysql';

export default function db() {
  const con = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'videosdb',

  });

  con.connect((err) => {
    if (err) throw err;
  });

  return { con };
}
