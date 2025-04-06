import {
  listAllCats,
  findCatById,
  findCatsByUserId,
  addCat,
  modifyCat,
  removeCat
} from '../models/cat-model.js';

const getCat = async (req, res, next) => {
  try {
    const cats = await listAllCats();
    res.json(cats);
  } catch (error) {
    next(error);
  }
};

const getCatById = async (req, res, next) => {
  try {
    const cat = await findCatById(req.params.id);
    if (cat) {
      res.json(cat);
    } else {
      const error = new Error('Cat not found');
      error.status = 404;
      next(error);
    }
  } catch (error) {
    next(error);
  }
};

const getCatsByUserId = async (req, res, next) => {
  try {
    const cats = await findCatsByUserId(req.params.userId);
    res.json(cats);
  } catch (error) {
    next(error);
  }
};

const postCat = async (req, res, next) => {
  try {
    if (!req.file) {
      const error = new Error('File is required');
      error.status = 400;
      throw error;
    }

    const cat = {
      ...req.body,
      filename: req.file.filename
    };
    
    const result = await addCat(cat);
    res.status(201).json({message: 'New cat added.', result});
  } catch (error) {
    next(error);
  }
};

const putCat = async (req, res, next) => {
  try {
    const success = await modifyCat(req.body, req.params.id);
    if (success) {
      res.json({message: 'Cat updated.'});
    } else {
      const error = new Error('Cat not found');
      error.status = 404;
      next(error);
    }
  } catch (error) {
    next(error);
  }
};

const deleteCat = async (req, res, next) => {
  const { id } = req.params;
  const { user_id, role } = res.locals.user;

  try {
    const success = await removeCat(id, user_id, role);
    if (!success) {
      const error = new Error('Cat not found or unauthorized');
      error.status = 404;
      throw error;
    }
    res.json({ message: 'Cat deleted' });
  } catch (error) {
    next(error);
  }
};

export {
  getCat,
  getCatById,
  getCatsByUserId,
  postCat,
  putCat,
  deleteCat
};