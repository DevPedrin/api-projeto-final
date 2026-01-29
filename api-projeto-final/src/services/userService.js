import { AppError } from "../errors/AppError.js";
import pool from '../db/connection.js';
import {
  createUser,
  getUserById,
  getAllUsers,
  updateUserInfos,
  deleteUser,
  getUserPermissions
} from "../models/userModel.js";
import bcrypt from "bcrypt";
import { gerarMatricula } from "../utils/gerarMatricula.js";

export async function registerService(currentUserId, data) {
  try {
    const perms = await getUserPermissions(currentUserId);
    const can = perms.some(p=>p.key==="create_user");

    if(!can) {
      throw new AppError({
        message:"UNAUTHORIZED",
        publicMessage:"Unauthorized, usuário não autorizado.",
        status:401,
        code:"UNAUTHORIZED"
      });
    }

    const defaultPassword = "Mudar@1234";
    const hashed = await bcrypt.hash(defaultPassword,10);

    const newUser = await createUser({
      ...data,
      matricula: gerarMatricula(data.cpf),
      password: hashed
    });

    return {
      matricula: newUser.matricula,
      password: defaultPassword
    };

  } catch(error) {
    if(error instanceof AppError) throw error;

    throw new AppError({
      message:`INTERNAL_ERROR: ${error}`,
      publicMessage:"Erro interno do servidor.",
      status:500,
      code:"INTERNAL_ERROR"
    });
  }
}

export async function getUserByIdService(currentUserId, targetUserId) {
  try {
    const user = await getUserById(targetUserId);
    if(!user) {
      throw new AppError({
        message:"NOT_FOUND",
        publicMessage:"Usuário não encontrado.",
        status:404,
        code:"NOT_FOUND"
      });
    }

    if(currentUserId!==targetUserId) {
      const perms = await getUserPermissions(currentUserId);
      const can = perms.some(p=>p.key==="view_users");

      if(!can) {
        throw new AppError({
          message:"UNAUTHORIZED",
          publicMessage:"Acesso não autorizado.",
          status:401,
          code:"UNAUTHORIZED"
        });
      }
    }

    return user;

  } catch(error) {
    if(error instanceof AppError) throw error;

    throw new AppError({
      message:`INTERNAL_ERROR: ${error}`,
      publicMessage:"Erro interno do servidor.",
      status:500,
      code:"INTERNAL_ERROR"
    });
  }
}

export async function getAllUsersService(currentUserId) {
  try {
    const perms = await getUserPermissions(currentUserId);
    const can = perms.some(p=>p.key==="view_users");

    if(!can) {
      throw new AppError({
        message:"UNAUTHORIZED",
        publicMessage:"Usuário não autorizado.",
        status:401,
        code:"UNAUTHORIZED"
      });
    }

    return await getAllUsers();

  } catch(error) {
    if(error instanceof AppError) throw error;

    throw new AppError({
      message:`INTERNAL_ERROR: ${error}`,
      publicMessage:"Erro interno do servidor.",
      status:500,
      code:"INTERNAL_ERROR"
    });
  }
}

export async function updateUserService(currentUserId, targetUserId, data) {
  try {
    const isSelf = currentUserId===targetUserId;

    const targetUser = await getUserById(targetUserId);
    if(!targetUser) {
      throw new AppError({
        message:"NOT_FOUND",
        publicMessage:"Usuário não encontrado.",
        status:404,
        code:"NOT_FOUND"
      });
    }

    if(isSelf) {
      const { role_id, active, ...safeData } = data;

      return await updateUserInfos(targetUserId,{
        first_name: safeData.first_name ?? targetUser.first_name,
        last_name: safeData.last_name ?? targetUser.last_name,
        cpf: safeData.cpf ?? targetUser.cpf,
        telefone: safeData.telefone ?? targetUser.telefone,
        email: safeData.email ?? targetUser.email,
        obs: safeData.obs ?? targetUser.obs,
        active: targetUser.active,
        role_id: targetUser.role_id,
        updated_by: currentUserId
      });
    }

    const perms = await getUserPermissions(currentUserId);
    const canEditUser = perms.some(p=>p.key==="edit_user");

    if(!canEditUser) {
      throw new AppError({
        message:"UNAUTHORIZED",
        publicMessage:"Acesso não autorizado.",
        status:401,
        code:"UNAUTHORIZED"
      });
    }

    const { role_id, active, ...safeData } = data;

    return await updateUserInfos(targetUserId,{
      first_name: safeData.first_name ?? targetUser.first_name,
      last_name: safeData.last_name ?? targetUser.last_name,
      cpf: safeData.cpf ?? targetUser.cpf,
      telefone: safeData.telefone ?? targetUser.telefone,
      email: safeData.email ?? targetUser.email,
      obs: safeData.obs ?? targetUser.obs,
      active: active ?? targetUser.active,
      role_id: role_id ?? targetUser.role_id,
      updated_by: currentUserId
    });

  } catch(error) {
    if(error instanceof AppError) throw error;

    throw new AppError({
      message:`INTERNAL_ERROR: ${error}`,
      publicMessage:"Erro interno do servidor.",
      status:500,
      code:"INTERNAL_ERROR"
    });
  }
}

export async function deleteUserService(currentUserId,targetUserId) {
  try {
    if(currentUserId===targetUserId) {
      throw new AppError({
        message:"FORBIDDEN",
        publicMessage:"Você não pode se auto-apagar.",
        status:403,
        code:"FORBIDDEN"
      });
    }

    const perms = await getUserPermissions(currentUserId);
    const can = perms.some(p=>p.key==="delete_user");

    if(!can) {
      throw new AppError({
        message:"UNAUTHORIZED",
        publicMessage:"Acesso não autorizado.",
        status:401,
        code:"UNAUTHORIZED"
      });
    }

    const exists = await getUserById(targetUserId);
    if(!exists) {
      throw new AppError({
        message:"NOT_FOUND",
        publicMessage:"Usuário não encontrado.",
        status:404,
        code:"NOT_FOUND"
      });
    }

    await deleteUser(targetUserId);

    return { success:true };

  } catch(error) {

    if(error.code==="23503") {
      await pool.query(`
        UPDATE users
        SET active=false, updated_at=NOW(), updated_by=$2
        WHERE id=$1
      `,[targetUserId,currentUserId]);

      return {
        success:false,
        message:"Usuário não pode ser deletado pois está associado a produtos. Foi desativado."
      };
    }

    if(error instanceof AppError) throw error;

    throw new AppError({
      message:`INTERNAL_ERROR: ${error}`,
      publicMessage:"Erro interno do servidor.",
      status:500,
      code:"INTERNAL_ERROR"
    });
  }
}