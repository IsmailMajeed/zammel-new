export const successResponse = (message, data = null, status = 200) => ({
  success: true,
  status,
  message,
  data,
});

export const errorResponse = (message, status = 400, details) => ({
  success: false,
  status,
  message,
  details,
});


