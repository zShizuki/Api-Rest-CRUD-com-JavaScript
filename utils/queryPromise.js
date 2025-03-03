/* eslint-disable import/extensions */
import db from '../Config/db.js';
import BadRequestError from '../classes/errors/badRequestError.js';
import NotFoundError from '../classes/errors/NotFoundError.js';

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
    } catch (error) {
      console.error('Erro in constrcutPromise queryPromimse', error);
      throw error;
    }
  };

  static selectFromId = async (id, tabela) => {
    try {
      const response = await this.constructPromise(`SELECT * FROM ${tabela} WHERE id = ${id}`);
      return response;
    } catch (error) {
      console.error('Erro in selectFromId queryPromise', error);
      throw error;
    }
  };

  static existsById = async (id, tabela) => {
    try {
      const query = await this.constructPromise(`SELECT EXISTS(select * from ${tabela} where id = ${id})`);
      const key = Object.keys(query[0])[0];
      const valor = query[0][key];
      return valor;
    } catch (error) {
      console.error('Erro in existsById queryPromise', error);
      throw error;
    }
  };

  static deleteFromId = async (id, tabela) => {
    try {
      if (Number(id) === 1) throw new BadRequestError('You cant delete id number 1');
      const query = await this.constructPromise(`DELETE FROM ${tabela} WHERE id = ?`, [id]);

      if (query.affectedRows > 0) {
        return ({ message: 'deleted successfully' });
      }

      throw new NotFoundError('Not found or already deleted');
    } catch (error) {
      console.error('Erro in deleteFromId queryPromise', error);
      throw error;
    }
  };

  static selectAll = async (tabela) => {
    try {
      const response = await this.constructPromise(`SELECT * FROM ${tabela};`);
      return response;
    } catch (error) {
      console.error('Erro in selectAll queryPromise', error);
      throw error;
    }
  };
}

export default QueryPromise;
