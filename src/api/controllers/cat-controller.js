import {
  listAllCats,
  findCatById,
  findCatsByUserId,
  addCat,
  modifyCat,
  removeCat
} from '../models/cat-model.js';

const getCat = async (req, res) => {
  try {
    const cats = await listAllCats();
    res.json(cats);
  } catch (error) {
    res.status(500).json({message: error.message});
  }
};

const getCatById = async (req, res) => {
  try {
    const cat = await findCatById(req.params.id);
    if (cat) {
      res.json(cat);
    } else {
      res.status(404).json({message: 'Cat not found'});
    }
  } catch (error) {
    res.status(500).json({message: error.message});
  }
};

const getCatsByUserId = async (req, res) => {
  try {
    const cats = await findCatsByUserId(req.params.userId);
    res.json(cats);
  } catch (error) {
    res.status(500).json({message: error.message});
  }
};

const postCat = async (req, res) => {
  console.log(req.body)
  try {
    const cat = {
      ...req.body,
      filename: req.file?.filename || null
    };
    
    const result = await addCat(cat);
    
    res.status(201).json({message: 'New cat added.', result});
  } catch (error) {
    res.status(500).json({message: error.message});
  }
};

const putCat = async (req, res) => {
  try {
    const success = await modifyCat(req.body, req.params.id);
    if (success) {
      res.json({message: 'Cat updated.'});
    } else {
      res.status(404).json({message: 'Cat not found'});
    }
  } catch (error) {
    res.status(500).json({message: error.message});
  }
};

const deleteCat = async (req, res) => {
  const { id } = req.params;
  const { user_id, role } = res.locals.user;

  try {
    const success = await removeCat(id, user_id, role);
    if (!success) {
      return res.status(404).json({ message: 'Cat not found or unauthorized' });
    }
    res.json({ message: 'Cat deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
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