import queryPromise from "../utils/queryPromise.js";

export default function videosController(){
    const { constructPromise, selectFromId, existsById } = queryPromise();
    
    const listAllVideos = async (req, res) => {
        try {
            
            const response = await constructPromise("SELECT * FROM informacoes;");
            res.send(response);
        } catch (error) {
            console.error(error);
            res.status(500).send({ error: "Database query failed" });
        }
    };

    const getVideoById = async (req,res) => {
        try {
            const { id } = req.params; // Extrai o id da URL
            const response = await selectFromId(id)

            const idExists = await existsById(id)

            if(!idExists){
                throw new Error("Video not found or not exists");
            }

            res.send(response)
        }
        catch (error) {
            console.error(error);
            res.status(500).send({ error: error.message || "Database query failed" });
        } 
    }

    const deleteVideoById = async (req, res) => {
        try {
            const { id } = req.params;

            const idExists = await existsById(id)
            console.log(idExists)

            if(!idExists){
                throw new Error("Video not found or already deleted")
            }
            
            const query = await constructPromise(`DELETE FROM informacoes WHERE id = '${id}';`)

            if (query.affectedRows > 0) {
                res.json({ message: "Video deleted successfully" });
            }
        } catch (error) {
            
            console.error(error);
            res.status(404).send({ error: "Video not found or already deleted" });
        }
    }

    const createVideo = async (req, res) => {
        try {
            const request = req.body;
    
            // Verifica se o req.body está vazio ou não é um array
            if (!request || request.length === 0) {
                throw new Error("The body of request is empty");
            }
    
            if(Array.isArray(request)){
                const responseVideos = [];
    
                for (const element of request) {
                    // Verifica se o objeto atual tem os campos obrigatórios
                    if (!element.titulo || !element.url) {
                        console.warn("Objeto ignorado: falta 'titulo' ou 'url'", element);
                        continue; // Ignora este objeto e passa para o próximo
                    }
        
                    const descricao = element.descricao || "Sem Descricao";
        
                    // Insere o vídeo no banco de dados
                    const insertResult = await constructPromise(
                        `INSERT INTO informacoes (titulo, descricao, url) VALUES ('${element.titulo}', '${descricao}', '${element.url}');`
                    );
        
                    // Obtém o ID do vídeo recém-inserido
                    const newVideoId = insertResult.insertId;
        
                    // Obtém o vídeo completo usando o ID
                    const [newVideo] = await selectFromId(newVideoId);
        
                    if (newVideo) {
                        responseVideos.push(newVideo);
                    }
                }
        
                // Verifica se algum vídeo foi adicionado
                if (responseVideos.length === 0) {
                    throw new Error("Any videos add");
                }
                
                res.json(responseVideos);
            }
            else {
                if (!request.titulo || !request.url) {
                    throw new Error("Missing titulo and url")
                }
    
                
                const descricao = request.descricao || "Sem Descricao";
    
                const insertResult = await constructPromise(
                    `INSERT INTO informacoes (titulo, descricao, url) VALUES ('${request.titulo}', '${descricao}', '${request.url}');`
                );

                const newVideoId = insertResult.insertId;
                const newVideo = await selectFromId(newVideo);
                res.json(newVideo)
            }


            
        } catch (error) {
            console.error(error);
            res.status(500).send({ error: error.message || "Failure to Create in Database" });
        }
    };


    const patchVideo = async (req, res) => {
        try {
            const request = req.body;
            const { id } = req.params;
            
            const idExists = await existsById(id)

            if(!idExists){
                throw new Error("ID not found in database")
            }

    
            if (!request || Object.keys(request).length === 0) {
                throw new Error("The body of request is empty");
            }

            if(Array.isArray(request)){
                throw new Error("Use an object instead of a array");
            }
    
            // Definindo os campos esperados
            const camposEsperados = ["titulo", "descricao", "url"];
    
            // Filtrando os campos presentes no request
            const camposPresentes = camposEsperados.filter(campo => request[campo] !== undefined);
    
            if (camposPresentes.length === 0) {
                throw new Error("Any field with title, descricao or url");
            }
    
            // Pegando os valores presentes
            const dadosAtualizados = {};

            camposPresentes.forEach(campo => {
                constructPromise(`UPDATE informacoes SET ${campo} = '${request[campo]}' where ID = ${id};`)
            });
            
            const response = await selectFromId(id)
            res.status(200).json(response);
    
        } catch (error) {
            console.error(error);
            res.status(400).send({ error: error.message || "Cant update video" });
        }
    };

    return {
        listAllVideos,
        getVideoById,
        deleteVideoById,
        createVideo,
        patchVideo
    }
}