const { Router } = require('express');
const UserService = require('../services/userService');
const authMiddleware = require('../middlewares/authMiddleware');
const asyncHandler = require('../middlewares/asyncHandler');

const userRouter = Router();

// 회원가입
userRouter.post('/signup', asyncHandler(async (req, res, next) => {
  try {
    const createdUser = await UserService.createUser(req.body);
    // 성공 상태 핸들링
    res.status(201).json({
      status: 201,
      message: '회원가입 성공',
      data: createdUser,
    });
  } catch (error) {
    console.error('Error during signup:', error);
    next(error);  // 에러를 다음 미들웨어로 전달
  }
}));

// 회원정보 조회
userRouter.get('/:userId', asyncHandler(async (req, res, next) => {
  const { userId } = req.params;
  // 회원정보 조회
  const userInfo = await UserService.getUserInfo(userId);
  // 성공 상태 핸들링
  res.status(200).json({
    status: 200,
    message: '유저 정보 조회 성공',
    data: userInfo,
  });
})
);

// 회원정보 수정
userRouter.patch('/:userId', asyncHandler(async (req, res, next) => {
  const { userId } = req.params;
  // 유저 ID 확인
  await UserService.getUserInfo(userId);
  // 수정 진행
  const isUpdated = await UserService.updateUserInfo(userId, req.body);
  // 성공 상태 핸들링
  res.status(200).json({
    status: 200,
    message: '유저 정보 수정 성공',
    data: isUpdated,
  });
})
);

// 회원탈퇴
userRouter.delete('/:userId', asyncHandler(async (req, res, next) => {
  const { userId } = req.params;
  // 유저 ID 확인
  await UserService.getUserInfo(userId);
  // 회원 탈퇴 진행
  const isDeleted = await UserService.deleteUser(userId);
  // 성공 상태 핸들링
  res.status(200).json({
    status: 200,
    message: '유저 탈퇴 성공',
    data: isDeleted,
  });
})
);

// 로그인
userRouter.post('/login', asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;
  // 로그인 정보 확인
  const userToken = await UserService.getUserToken(email, password);
  // 성공 상태 핸들링
  res.status(200).json({
    status: 200,
    message: '유저 로그인 성공',
    data: userToken,
  });
}));

//관리자 로그인
userRouter.post('/role', asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;
  // 로그인 정보 확인
  const adminToken = await UserService.getAdminToken(email, password);
  // 성공 상태 핸들링
  res.status(200).json({
    status: 200,
    message: '관리자 로그인 성공',
    data: adminToken,
  });
}))

module.exports = userRouter;
