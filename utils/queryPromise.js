
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

    return {
        constructPromise
    }
}

