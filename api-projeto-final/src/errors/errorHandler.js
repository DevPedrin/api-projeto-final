import { AppError } from '../errors/AppError.js';

export const errorHandler = (err, req, res, next) => {
  if(process.env.NODE_ENV == "development") {
    console.error(err);
  } 

  if (err instanceof AppError) {
    return res.status(err.status).json({
      success: false,
      status: err.status,
      message: err.publicMessage,
      error: {
        code: err.code
      },
    });
  }

  return res.status(500).json({
    success: false,
    status: 500,
    message: 'Erro interno do servidor',
    error: {
      code: 'INTERNAL_SERVER_ERROR'
    },
  });
};
