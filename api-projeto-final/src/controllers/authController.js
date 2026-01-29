import {loginService, changePasswordService, resetPasswordService} from "../services/authService.js";
import {DatabaseError} from 'pg';
import { AppError } from "../errors/AppError.js";

export async function loginController(req, res, next) {
  try {
    const { matricula, password } = req.body;
    const result = await loginService(matricula, password);

    res.status(200).json({
      success: true,
      data: result
    });
  } catch(error) {
    next(error)
  }
}

export async function changePasswordController(req, res, next) {
    try {
      const { matricula, old_password, new_password } = req.body;
      const result = await changePasswordService({ matricula, old_password, new_password });

      res.status(200).json({
          success: true,
          data: result
      });
    } catch(error) {
      next(error);
    }
}

export async function resetPasswordController(req, res, next) {
    try {
      const currentUser = req.user; 
      const { matricula } = req.body;
      const result = await resetPasswordService(currentUser, {matricula});

      res.status(200).json({
          success: true,
          data: result
      });
    } catch(error) {
      next(error);
    }
}