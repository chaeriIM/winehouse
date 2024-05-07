/* eslint-disable no-unused-vars */
const { Router } = require('express');
const ProductService = require('../services/productService');
const CategoryService = require('../services/categoryService');
const ImageService = require('../services/imageService');

// 미들웨어 호출
const asyncHandler = require('../middlewares/asyncHandler');
const authAdminMiddleware = require('../middlewares/authAdminMiddleware');
const imageMiddleware = require('../middlewares/imageMiddleware');

const Product = require('../db/models/product');
const Category = require('../db/models/category');
const Image = require('../db/models/image');
const { compareSync } = require('bcrypt');

const productRouter = Router();

// 상품 목록 가져오기
productRouter.get('/', asyncHandler(async (req, res, next) => {
  // 이미지가 없는 상품 삭제
  await ProductService.deleteProductWithNoImage();
  // 전체 상품 목록 호출
  const productList = await ProductService.getProductList();
  // 성공 상태 핸들링
  res.status(200).json({
    status: 200,
    message: '전체 상품 목록 조회 성공',
    data: productList,
  });
}));

// 특정 카테고리 상품 목록 확인
productRouter.get('/:categoryId', asyncHandler(async (req, res, next) => {
  const { categoryId } = req.params;
  // 카테고리 유무 확인
  await CategoryService.checkCategoryId(categoryId);
  // 이미지가 없는 상품 삭제
  await ProductService.deleteProductWithNoImage();
  // 해당 카테고리 상품 목록 호출
  const productListOfCategory = await ProductService.getProductListByCategory(categoryId);
  // 성공 상태 핸들링
  res.status(200).json({
    status: 200,
    message: '카테고리별 상품 목록 조회 성공',
    data: productListOfCategory,
  });
}));

// 이미지 ID로 이미지 확인
productRouter.get('/image/:imageId', asyncHandler(async (req, res, next) => {
  const { imageId } = req.params;
  // 이미지 호출
  const imageOfImageId = await ImageService.getImageOfImage(imageId);
  // 성공 상태 핸들링
  res.status(200).json({
    status: 200,
    message: '이미지 호출 성공',
    data: imageOfImageId,
  });
}));

// 상품 상세 페이지 열람
productRouter.get('/info/:productId', asyncHandler(async (req, res, next) => {
  const { productId } = req.params;
  // 상품 ID 확인
  await ProductService.checkProductId(productId);
  // 해당 상품 상세페이지 호출
  const productInfo = await ProductService.getProductInfo(productId);
  // 해당 상품 이미지 한개 호출
  const productImage = await ImageService.getImageOfProduct(productId);
  // 성공 상태 핸들링
  res.status(200).json({
    status: 200,
    message: '상품 상세페이지 조회 성공',
    data: {
      info: productInfo,
      image: productImage,
    }
  });
}));

// 상품 추가
productRouter.post('/',
  imageMiddleware,
  authAdminMiddleware,
  asyncHandler(async (req, res, next) => {
  const data = JSON.parse(req.body.product_data);
  await console.log(data);
  // 상품 빈 필드 확인
  await ProductService.checkProductField(data);
  // 카테고리 유무 확인
  await CategoryService.checkCategoryId(data.categoryId);
  // 상품 추가 진행
  const productAdding = await ProductService.addProduct(data);
  // 이미지 업로드 진행
  const image = await ImageService.uploadProductImage(productAdding._id, req.file);
  // 상품에 이미지 ID 정보 삽입
  const updatedProduct = await ProductService.setProduct(productAdding._id ,req.body, image._id);
  // 성공 상태 핸들링
  res.status(201).json({
    status: 201,
    message: '상품 추가 성공',
    data: {
      addedProdcut: updatedProduct,
      uploadedImage: image,
    }
  });
}));

// 상품 수정
productRouter.patch('/:productId',
  imageMiddleware,
  authAdminMiddleware,
  asyncHandler(async (req, res, next) => {
  const { productId } = req.params;
  // 상품 ID 확인
  await ProductService.checkProductId(productId);
  // 카테고리 유무 확인 (있다면)
  if (req.params.category_id) await CategoryService.checkCategoryId(req.params.category_id);
  // 이미지 수정 (있다면)
  let image = {};
  if (req.file) {
    await ImageService.deleteProductImage(productId.image_id);
    image = await ImageService.uploadProductImage(productId, req.file);
  }
  // 상품 수정 진행
  const updatedProduct = await ProductService.setProduct(productId,req.body, image._id);
  // 성공 상태 핸들링
  res.status(200).json({
    status: 200,
    message: '상품 수정 완료',
    data: updatedProduct,
  });
}));

// 상품 삭제
productRouter.delete('/:productId',
  authAdminMiddleware,
  asyncHandler(async (req, res, next) => {
  const { productId } = req.params;
  // 상품 ID 확인
  await ProductService.checkProductId(productId);
  // 상품 삭제 진행
  const deleteProduct = await ProductService.deleteProduct(productId);
  // 이미지 삭제 진행
  await ImageService.deleteProductImage(deleteProduct.image_id);
  // 성공 상태 핸들링
  res.status(200).json({
    status: 200,
    message: '상품 삭제 완료',
    data: deleteProduct,
  });
}));

module.exports = productRouter;