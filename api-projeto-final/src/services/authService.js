import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import {
  findByMatricula,
  changePassword,
  resetPassword,
  getUserPermissions
} from "../models/userModel.js";
import { AppError } from "../errors/AppError.js";

export async function loginService(matricula, password) {
  try {
    if(!matricula || !password) {
      throw new AppError({
        message: "INVALID_DATA",
        publicMessage: "Matrícula e senha são obrigatórias.",
        status: 400,
        code: "INVALID_DATA"
      });
    }

    const user = await findByMatricula(matricula);
    if(!user) {
      throw new AppError({
        message: "INVALID_CREDENTIALS",
        publicMessage: "Usuário ou senha inválidos.",
        status: 401,
        code: "INVALID_CREDENTIALS"
      });
    }

    const match = await bcrypt.compare(password, user.password);
    if(!match) {
      throw new AppError({
        message: "INVALID_CREDENTIALS",
        publicMessage: "Usuário ou senha inválidos.",
        status: 401,
        code: "INVALID_CREDENTIALS"
      });
    }

    if(user.password_must_change) {
      throw new AppError({
        message: "PASSWORD_CHANGE_REQUIRED",
        publicMessage: "Você precisa alterar sua senha antes de acessar o sistema.",
        status: 403,
        code: "PASSWORD_CHANGE_REQUIRED",
        data: { user_id: user.id }
      });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "2h" }
    );

    return {
      token,
      expires_in: 7200,
      user: {
        id: user.id,
        email: user.email
      }
    };
  } catch(error) {
    if(error instanceof AppError) {
      throw error;
    }

    throw new AppError({
      message: `INTERNAL_ERROR: ${error}`,
      publicMessage: "Erro interno do servidor.",
      status: 500,
      code: "INTERNAL_ERROR"
    });
  }
}

export async function changePasswordService({ matricula, old_password, new_password }) {
  try {
    if(!matricula || !old_password || !new_password) {
      throw new AppError({
        message: "INVALID_DATA",
        publicMessage: "Dados obrigatórios não informados.",
        status: 400,
        code: "INVALID_DATA"
      });
    }

    const user = await findByMatricula(matricula);
    if(!user) {
      throw new AppError({
        message: "USER_NOT_FOUND",
        publicMessage: "Usuário não encontrado.",
        status: 404,
        code: "USER_NOT_FOUND"
      });
    }

    if(!user.password_must_change) {
      throw new AppError({
        message: "PASSWORD_CHANGE_NOT_ALLOWED",
        publicMessage: "Alteração de senha não permitida.",
        status: 401,
        code: "PASSWORD_CHANGE_NOT_ALLOWED"
      });
    }

    const passwordMatches = await bcrypt.compare(old_password, user.password);
    if(!passwordMatches) {
      throw new AppError({
        message: "INVALID_OLD_PASSWORD",
        publicMessage: "Senha atual incorreta.",
        status: 401,
        code: "INVALID_OLD_PASSWORD"
      });
    }

    const hashed = await bcrypt.hash(new_password, 10);
    await changePassword(matricula, hashed);

    return {message: "Senha alterada com sucesso, faça login."};
  } catch(error) {
    if(error instanceof AppError) {
      throw error;
    }

    throw new AppError({
      message: `INTERNAL_ERROR: ${error}`,
      publicMessage: "Erro interno do servidor.",
      status: 500,
      code: "INTERNAL_ERROR"
    });
  }
}

export async function resetPasswordService(currentUser, targetUser) {
  try {
    if(!targetUser?.matricula) {
      throw new AppError({
        message: "INVALID_DATA",
        publicMessage: "Matrícula do usuário alvo é obrigatória.",
        status: 400,
        code: "INVALID_DATA"
      });
    }

    const permissions = await getUserPermissions(currentUser.id);
    const hasPermission = permissions.some(p => p.key === "reset_other_password");

    if(!hasPermission) {
      throw new AppError({
        message: "UNAUTHORIZED",
        publicMessage: "Unauthorized, usuário não autorizado.",
        status: 401,
        code: "UNAUTHORIZED"
      });
    }

    const user = await findByMatricula(targetUser.matricula);
    if(!user) {
      throw new AppError({
        message: "USER_NOT_FOUND",
        publicMessage: "Usuário não encontrado.",
        status: 404,
        code: "USER_NOT_FOUND"
      });
    }

    const temporaryPassword = "Mudar@1234";
    const hashed = await bcrypt.hash(temporaryPassword, 10);

    await resetPassword(targetUser.matricula, hashed, currentUser.id);

    return {
      matricula: user.matricula,
      temporary_password: temporaryPassword
    };
  } catch(error) {
    if(error instanceof AppError) {
      throw error;
    }
    
    throw new AppError({
      message: `INTERNAL_ERROR: ${error}`,
      publicMessage: "Erro interno do servidor.",
      status: 500,
      code: "INTERNAL_ERROR"
    });
  }
}
