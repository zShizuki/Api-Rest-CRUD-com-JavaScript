
import mysql from 'mysql'

export default function db (){
  var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "videosdb",
  });
  
  con.connect(function(err) {
    if (err) throw err;
      
    console.log("Conectado Ao Banco de Dados!");
  });

  return {con}
}
