// /* eslint-disable import/extensions */
// // eslint-disable-next-line import/no-extraneous-dependencies
// import { Router } from 'express';
// import videosController from '../Controllers/videosController.js';
// import categoryController from '../Controllers/categoryController.js';

// export default function router() {
//   const {
//     listAllVideos, getVideoById, deleteVideoById, createVideo, patchVideo,
//   } = videosController();

//   const {
//     getCategory, getCategoryById, deleteCategory, postCategory, patchCategory, getVideoByCategory,
//   } = categoryController();
//   const route = Router();

//   // Rotas dos Videos
//   route.get('/videos', listAllVideos); // Lista todos os videos ou busca pelo search
//   route.get('/videos/:id', getVideoById); // Pega os videos por ID
//   route.delete('/videos/:id', deleteVideoById); // Deleta video por ID
//   route.post('/videos', createVideo); // Cria um novo video novo por array ou objeto
//   route.patch('/videos/:id', patchVideo); // Atualiza um video por ID

//   // Rotas das Categorias
//   route.get('/categorias', getCategory);// Lista todas as categorias
//   route.get('/categorias/:id', getCategoryById); // Pega a categoria por ID
//   route.delete('/categorias/:id', deleteCategory); // Deleta categoria por ID
//   route.post('/categorias', postCategory); // Cria uma Nova Categoria Por Objeto
//   route.patch('/categorias/:id', patchCategory); // Atualiza informações de uma categoria

//   // Mix Video e Categoria
//   route.get('/categorias/:id/videos/', getVideoByCategory); // Pegas os videos que Contem o ID da categoria

//   return route;
// }
