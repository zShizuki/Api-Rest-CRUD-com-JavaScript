/* eslint-disable import/extensions */
import db from '../Config/db.js';

class QueryPromise {
  static con = db().con; // 🔹 Define a conexão como um atributo estático

  static constructPromise = (query, values) => {
    try {
      const result = new Promise((resolve, reject) => {
        this.con.query(query, values, (err, rows) => {
          if (err) reject(err);
          else resolve(JSON.parse(JSON.stringify(rows)));
        });
      });

      return result;
    } catch (e) {
      console.log(e);
      return e;
    }
  };

  static selectFromId = async (id, tabela) => {
    const response = await this.constructPromise(`SELECT * FROM ${tabela} WHERE id = ${id}`);

    return response;
  };

  static existsById = async (id, tabela) => {
    const query = await this.constructPromise(`SELECT EXISTS(select * from ${tabela} where id = ${id})`);
    const key = Object.keys(query[0])[0];
    const valor = query[0][key];
    return valor;
  };

  static deleteFromId = async (id, tabela) => {
    const query = await this.constructPromise(`DELETE FROM ${tabela} WHERE id = '${id}';`);

    if (query.affectedRows > 0) {
      return ({ message: 'deleted successfully' });
    }

    throw new Error('not found or already deleted');
  };

  static selectAll = async (tabela) => {
    const response = await this.constructPromise(`SELECT * FROM ${tabela};`);

    return response;
  };
}

export default QueryPromise;
