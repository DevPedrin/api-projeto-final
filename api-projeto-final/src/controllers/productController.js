import {
  getAllProductsService,
  getProductService,
  createProductService,
  updateProductService,
  deleteProductService
} from "../services/productService.js";

export async function getAllProductsController(req, res, next) {
  try {
    const currentUserId = req.user.id;
    const result = await getAllProductsService(currentUserId);
    res.status(200).json({
      success: true,
      data: result
    });
  } catch(error) {
    next(error);
  }
}

export async function getProductController(req, res, next) {
  try {
    const currentUserId = req.user.id;
    const { id } = req.params;
    const result = await getProductService(currentUserId, id);

    res.status(200).json({
      success: true,
      data: result
    });
  } catch(error) {
    next(error);
  }
}

export async function createProductController(req, res, next) {
  try {
    const currentUserId = req.user.id;
    const data = req.body;
    const result = await createProductService(currentUserId, data);
    
    res.status(201).json({
      success: true,
      data: result
    });

  } catch(error) {
    next(error);
  }
}

export async function updateProductController(req, res, next) {
  try {
    const currentUserId = req.user.id;
    const { id } = req.params;
    const data = req.body;
    const result = await updateProductService(currentUserId, id, data);

    res.status(200).json({
      success: true,
      data: result
    });
  } catch(error) {
    next(error);
  }
}

export async function deleteProductController(req, res, next) {
  try {
    const currentUserId = req.user.id;
    const { id } = req.params;
    const result = await deleteProductService(currentUserId, id);

    res.status(200).json({
      success: true,
      data: result
    });
  } catch(error) {
    next(error);
  }
}