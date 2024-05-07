/* eslint-disable no-unused-vars */
const { Router } = require('express');

// 서비스 호출
const OrderService = require('../services/orderService');
const OrderlistService = require('../services/orderlistService');
const DeliveryService = require('../services/deliveryService');
const UserService = require('../services/userService');

// 미들웨어 호출
const asyncHandler = require('../middlewares/asyncHandler');
const authAdminMiddleware = require('../middlewares/authAdminMiddleware');
const authMiddleware = require('../middlewares/authMiddleware');

// 모델 호출
const Order = require('../db/models/order');
const Orderlist = require('../db/models/orderlist');
const Delivery = require('../db/models/delivery');
const User = require('../db/models/user');

const orderRouter = Router();

// 전체 주문 목록 가져오기
orderRouter.get('/',
  authAdminMiddleware,
  asyncHandler(async (req, res, next) => {
  // 전체 주문 목록 호출
  const orderList = await OrderService.getOrderList();
  // 성공 상태 핸들링
  res.status(200).json({
    status: 200,
    message: '전체 주문 목록 조회 성공',
    data: orderList,
  });
}));

// 특정 유저 주문 목록 확인
orderRouter.get('/user/',
  authMiddleware,
  asyncHandler(async (req, res, next) => {
  // 유효한 유저인지 확인
  await UserService.getUserInfo(req.userId);
  // 특정 유저 주문 호출
  const orderListOfUser = await OrderService.getOrderListOfUser(req.userId);
  // 성공 상태 핸들링
  res.status(200).json({
    status: 200,
    message: '유저별 주문 목록 조회 성공',
    data: orderListOfUser,
  });
}));

// 특정 주문의 상품 목록 확인
orderRouter.get('/info/:orderId',
  authMiddleware,
  asyncHandler(async (req, res, next) => {
  const { orderId } = req.params;
  // 주문 유무 확인
  await OrderService.checkOrderId(orderId);
  // 상품 목록 호출
  const orderlistOfOrder = await OrderlistService.getOrderlistOfOrder(orderId);
  // 성공 상태 핸들링
  res.status(200).json({
      status: 200,
      message: '주문내 상품 목록 조회 성공',
      data: orderlistOfOrder,
  });
}))

// 특정 주문의 배송 상태 확인
orderRouter.get('/status/:orderId',
  authMiddleware,
  asyncHandler(async (req, res, next) => {
  const { orderId } = req.params;
  // 배송 상태 호출
  const getDeliveryOfOrder = await DeliveryService.getDeliveryOfOrder(orderId);
  // 성공 상태 핸들링
  res.status(200).json({
      status: 200,
      message: '배송 상태 조회 성공',
      data: getDeliveryOfOrder,
  });
}))

// 주문 추가
orderRouter.post('/',
  authMiddleware,
  asyncHandler(async (req, res, next) => {
  const { productArray } = req.body;
  // 주문 빈 필드 확인
  await OrderService.checkOrderField(req.body);
  // orderSchema 추가 (임시)
  const addOrder = await OrderService.addOrder(req.userId);
  // 받아온 상품 목록대로 orderlistSchema 추가
  productArray.forEach(async productOrder => {
    await OrderlistService.addOrderlist(addOrder._id, productOrder);
  });
  // deliverySchema 추가
  const addDelivery = await DeliveryService.addDelivery(req.userId, addOrder._id);
  // 상품 총 수량 및 금액 계산
  const getOrderQuntity = await OrderlistService.getOrderQuntity(addOrder._id);
  // orderSchmea에 총 가격 및 수량 기입
  const setOrder = await OrderService.setOrder(addOrder._id, getOrderQuntity.orderPrice, getOrderQuntity.orderNum);
  // 성공 상태 핸들링
    res.status(201).json({
    status: 201,
    message: '주문 추가 성공',
    data: {
        order: addOrder,
        delivery: addDelivery,
        setorder: setOrder,
    }
  });
}));

// 관리자 배송 상태 수정
orderRouter.patch('/delivery/:deliveryId',
  authAdminMiddleware,
  asyncHandler(async (req, res, next) => {
  const { deliveryId } = req.params;
  // 배송 상태 수정 함수 호출
  const updateDelivery = await DeliveryService.setDelivery(deliveryId, req.body);
  // 성공 상태 핸들링
  res.status(200).json({
      status: 200,
      message: '주문 수정 완료',
      data: updateDelivery,
  });
}))

// 사용자 주문 수정
orderRouter.patch('/:orderId',
  authMiddleware,
  asyncHandler(async (req, res, next) => {
  const { orderId } = req.params;
  const { productArray } = req.body;
  // 주문 유무 확인
  await OrderService.checkOrderId(orderId);
  // 배송 상태 확인
  await DeliveryService.getDeliveryOfOrder(orderId);
  // 기존 orderSchema 전체 삭제
  const deleteOrderlist = await OrderlistService.deleteOrderlist(orderId);
  // 신규 orderSchmea 작성
  productArray.forEach(async productOrder => {
    await OrderlistService.addOrderlist(orderId, productOrder);
  })
  // 변경된 orderSchema에 따른 수량 및 가격 계산
  const getOrderQuntity = await OrderlistService.getOrderQuntity(orderId);
  // 계산된 값 orderSchema에 기록
  const setOrder = await OrderService.setOrder(orderId, getOrderQuntity.orderPrice, getOrderQuntity.orderNum);
  // 성공 상태 핸들링
  res.status(200).json({
    status: 200,
    message: '주문 수정 완료',
    data: {
        x_orderlist: deleteOrderlist,
        order: setOrder,
    }
  });
}));

// 주문 삭제
orderRouter.delete('/:orderId',
  authMiddleware,
  asyncHandler(async (req, res, next) => {
  const { orderId } = req.params;
  // 주문 유무 확인
  await OrderService.checkOrderId(orderId);
  // 배송 내역 삭제
  const deleteDelivery = await DeliveryService.deleteDelivery(orderId);
  // 주문 목록 내역 삭제
  const deleteOrderlist = await OrderlistService.deleteOrderlist(orderId);
  // 주문 내역 삭제
  const deleteOrder = await OrderService.deleteOrder(orderId);
  // 성공 상태 핸들링
  res.status(200).json({
    status: 200,
    message: '주문 삭제 완료',
    data: {
        order: deleteOrder,
        orderlist: deleteOrderlist,
        delivery: deleteDelivery,
    }
  });
}));

module.exports = orderRouter;