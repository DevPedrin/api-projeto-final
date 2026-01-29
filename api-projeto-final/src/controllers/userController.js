import {
  registerService,
  getUserByIdService,
  getAllUsersService,
  updateUserService,
  deleteUserService
} from '../services/userService.js';


export async function createUserController(req, res, next) {
  try {
    const result = await registerService(req.user.id, req.body);
    res.status(201).json({
      success: true,
      data: result 
    });
  } catch(error) {
    next(error)
  }
}

export async function getUserController(req, res, next) {
  try {
    const result = await getUserByIdService(req.user.id, Number(req.params.id));

    res.status(200).json({
      success: true,
      data: result 
    });
  } catch(error) {
    next(error);
  }
}

export async function getMeController(req, res, next) {
  try {
    const result = await getUserByIdService(req.user.id, req.user.id);

    res.status(200).json({
      success: true,
      data: result 
    });
  } catch(error) {
    next(error);
  }
}

export async function getAllUsersController(req, res, next) {
  try {
    const result = await getAllUsersService(req.user.id);

    return res.status(200).json({
      success: true,
      data: result,
    });

  } catch(error) {
    next(error);
  }
}

export async function updateUserController(req, res, next) {
  try {
    const result = await updateUserService(req.user.id, Number(req.params.id), req.body);

    res.status(200).json({
      success: true,
      data: result 
    });
  } catch (error) {
    next(error);
  }
}

export async function deleteUserController(req, res, next) {
  try {
    const result = await deleteUserService(req.user.id, Number(req.params.id));

    res.status(200).json({
      success: true,
      data: result 
    });
  } catch (error) {
    next(error);
  }
}