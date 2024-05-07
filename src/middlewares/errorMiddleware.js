/* eslint-disable no-undef */
// eslint-disable-next-line no-unused-vars
module.exports = (err, req, res, next) => {
  const errStatus = err.statusCode || 500;
  const errMsg = err.message || '예상하지 못한 오류가 발생했습니다.';
  res.status(errStatus).json({
    success: false,
    status: errStatus,
    message: errMsg,
    stack: process.env.NODE_ENV === 'development' ? err.stack : {},
  });
};
