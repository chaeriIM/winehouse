/* eslint-disable no-unused-vars */
/* eslint-disable no-return-await */
// 불러오기
const Image = require('../db/models/image');
const multer = require('multer');
const storage = multer.memoryStorage()
const upload = multer({storage:storage});

class ImageService {
  constructor() {
    this.Image = Image;
  }

  // 이미지 ID에 맞는 이미지 조회
  async getImageOfImage(imageId) {
    const image = await this.Image.find({ _id: imageId });
    return `<img src="data:image/${image[0].contentType};base64,${image[0].data.toString('base64')}">`;
  }

  // 상품 ID에 맞는 이미지 조회
  async getImageOfProduct(productId) {
    const image = await this.Image.find({ product_id: productId });
    return `<img src="data:image/${image[0].contentType};base64,${image[0].data.toString('base64')}">`;
  }

  // 이미지 업로드 진행
  async uploadProductImage(productId, reqFile) {
    const image = new Image({
        product_id: productId,
        data: reqFile.buffer,
        contentType: reqFile.mimetype,
    });
    return await image.save();
  }

  // 이미지 삭제 진행
  async deleteProductImage(imageId) {
    return await this.Image.deleteOne({ _id: imageId });
  }
}

module.exports = new ImageService();