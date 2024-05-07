const { Router } = require('express');
const ProductService = require('../services/productService');
const asyncHandler = require('../middlewares/asyncHandler');

const { Product } = require('../db/models/product');
const { Category } = require('../db/models/category');

const adminRouter = Router();

// 상품 목록 가져오기
adminRouter.get('/', asyncHandler(async (req, res) => {
    if(req.query.edit){
        // res.render('postEdit') // frontend 작성한 관리자용 상품 수정 페이지로 rendering
        res.send('OK');
        return;
    }

    const products = await ProductService.getProducts();
    res.json(products);
    // res.render('adminProduct', {products}); // frontend 작성한 관리자용 상품페이지로 rendering
}));




// 상품 수정
adminRouter.patch('/product/:productId', asyncHandler(async(req, res) => {
    const { productId } = req.params;
    const { productName, 
        productPrice,
        categoryId,
        productCountry, 
        productGrape, 
        productMadeyear, 
        productSweetrate, 
        productSourrate, 
        productBodyrate,
        updatedAt, 
    } = req.body;
    
    // console.log(productName);

    const updatedProduct = await ProductService.updateProduct(productId,
        productName, 
        productPrice,
        categoryId,
        productCountry, 
        productGrape, 
        productMadeyear, 
        productSweetrate, 
        productSourrate, 
        productBodyrate,  
    )

    console.log(updatedAt);

    res.json(updatedProduct);
    // res.send('updated');
    // 상품 생성 성공 시 응답
    // res.redirect('/admin/product');
}))

// 상품 추가
adminRouter.post('/product', asyncHandler(async(req, res) => {
    const { productName, 
        productPrice,
        categoryId,
        productCountry, 
        productGrape, 
        productMadeyear, 
        productSweetrate, 
        productSourrate, 
        productBodyrate,
    } = req.body;

        // console.log(productName);

        // 빈값 확인하는 함수
        function isEmpty(value) {
            return value == null || value === '';
        }

        // 빈값 여부 확인
        if (Object.values(req.body).some(isEmpty)) {
            // 빈값이 있다면 에러를 출력
            res.status(400).send('모든 데이터를 입력해야 합니다.');
            return;
        }

        const product = await ProductService.createProduct(
            productName, 
            productPrice,
            categoryId,
            productCountry, 
            productGrape, 
            productMadeyear, 
            productSweetrate, 
            productSourrate, 
            productBodyrate,
        );
        
        // console.log(product);
        res.json(product);

        // res.redirect('/admin/product');
}))

// 상품 삭제
adminRouter.delete('/product/:productId', asyncHandler(async (req, res) => {
    const { productId } = req.params;
    console.log(shortId);
    await ProductService.deleteProduct({ productId });
    res.send('delete');
}))

module.exports = adminRouter;
