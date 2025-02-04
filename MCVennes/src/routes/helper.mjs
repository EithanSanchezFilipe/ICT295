const success = (message, data) => {
  return {
    data: data,
    message: message,
  };
};

const error = (message, res, status) => {
  res.status(status).json({
    status: status,
    message: message,
  });
};

export { success, error };
