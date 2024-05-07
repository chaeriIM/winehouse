/* eslint-disable no-undef */
const jwt = require('jsonwebtoken');

module.exports = async (req, res, next) => {
const authorizationHeader = req.headers?.authorization;

if (!authorizationHeader || !authorizationHeader.startsWith('Bearer ')) {
    const e = new Error('토큰이 유효하지 않습니다.');
    e.status = 401;
    throw e;
}

const token = authorizationHeader.split(' ')[1];
const secretKey = process.env.JWT_SECRET_KEY;

try {
    const decoded = await jwt.verify(token, secretKey);
    req.userId = decoded.userId;
    next();
} catch (error) {
    const e = new Error(`인증 실패: ${error.message}`);
    e.status = 401;
    throw e;
}
};