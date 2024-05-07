// 함수형 미들웨어
module.exports = (requestHandler) => async (req, res, next) => {
  try {
    await requestHandler(req, res); // 여기서 발생되는 에러들은 catch에서 잡힘
  } catch (err) {
    next(err);
  }
};
