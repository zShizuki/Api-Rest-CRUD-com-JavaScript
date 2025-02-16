
import db from "../Config/db.js"


export default function queryPromise (){
    const {con} = db()
    
    const constructPromise = (query) => {
        try {
            const result = new Promise((resolve, reject) => {
                con.query(query, (err, rows) => {
                    if (err) reject(err);
                    else resolve(JSON.parse(JSON.stringify(rows)));
                });
            });
    
            return result
        }catch(e){
          console.log(e)
        }    
    }

    const selectFromId = (id) => {
        const response = constructPromise(`SELECT * FROM informacoes WHERE id = ${id}`)

        return response;
    }

    const existsById = async (id) => {
        const query = await constructPromise("SELECT EXISTS(select * from informacoes where id = "+id+")")
        const key = Object.keys(query[0])[0]; 
        const valor = query[0][key];
        return valor
    }


    return {
        constructPromise,
        selectFromId,
        existsById
    }
}

