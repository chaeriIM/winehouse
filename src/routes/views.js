const express = require('express');

const router = express.Router();
const path = require('path');

// views폴더 내의 ${resource} 폴더 내의 모든 파일을 웹에 띄우며,
// 이 때 ${resource}.html 을 기본 파일로 설정함.
function serveStatic(resource) {
  const resourcePath = path.join(__dirname, `../views/${resource}`);
  const option = { index: `${resource}.html` };

  return express.static(resourcePath, option);
}

router.use('/', serveStatic('home'));
router.use('/list', serveStatic('list'));
router.use('/detail', serveStatic('detail'));
router.use('/cart', serveStatic('cart'));
router.use('/order', serveStatic('order'));
router.use('/login', serveStatic('login'));
router.use('/mypage', serveStatic('mypage'));
router.use('/account', serveStatic('account'));
router.use('/update', serveStatic('update'));



router.use('/admin_login', serveStatic('admin_login'));
router.use('/admin_order', serveStatic('admin_order'));
router.use('/admin_update', serveStatic('admin_update'));
router.use('/admin_add', serveStatic('admin_add'));
router.use('/admin_category', serveStatic('admin_category'));
router.use('/admin_product', serveStatic('admin_product'));

module.exports = router;
