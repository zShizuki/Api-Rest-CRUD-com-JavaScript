import queryPromise from "../utils/queryPromise.js";

export default function videosController(){
    const { constructPromise } = queryPromise();
    
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
            const response = await constructPromise(`SELECT * FROM informacoes WHERE id = ${[id]}`);

            if (!response || response.length === 0) {
                return res.status(404).json({ message: "Not Found" });
            }

            res.send(response)
        }
        catch (error) {
            console.error(error);
            res.status(500).send({ error: "Database query failed" });
        } 
    }

    const deleteVideoById = async (req, res) => {
        try {
            const { id } = req.params;
            const query = await constructPromise(`DELETE FROM informacoes WHERE id = '${id}';`)

            if (query.affectedRows > 0) {
                res.json({ message: "Video deleted successfully" });
            }else {
                throw new Error("Video not found or already deleted") 
            }
        } catch (error) {
            
            console.error(error);
            res.status(500).send({ error: "Video not found or already deleted" });
        }
    }

    const createVideo = async (req, res) => {
        try {
            const request = req.body;
            const responseVideos = [];
    
            for (const element of request) {
                const description = element.description || "Sem Descricao";
    
                // Insere o vídeo no banco de dados
                const insertResult = await constructPromise(
                    `INSERT INTO informacoes (titulo, descricao, url) VALUES ('${element.titulo}', '${description}', '${element.url}');`
                );
    
                // Obtém o ID do vídeo recém-inserido
                const newVideoId = insertResult.insertId;
    
                // Obtém o vídeo completo usando o ID
                const [newVideo] = await constructPromise(
                    `SELECT * FROM informacoes WHERE id = ${newVideoId};`
                );
    
                if (newVideo) {
                    responseVideos.push(newVideo);
                }
            }
    
            res.json(responseVideos);
        } catch (error) {
            console.error(error);
            res.status(500).send({ error: "Failure to Create in Database" });
        }
    };

    return {
        listAllVideos,
        getVideoById,
        deleteVideoById,
        createVideo,
    }
}