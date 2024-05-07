document.addEventListener('DOMContentLoaded', async () => {
  try {
    const res = await fetch('/product');
    const data = await res.json();
    // console.log(data);

    const products = data.data.reverse().slice(0, 5); // 최신 5개 상품만
    // console.log(products);

    const recentlyProductsContainer = document.querySelector('.recently-container');

    products.forEach(async product => {
      const imageId = product.image_id;
      // console.log(imageId);

      const imgRes = await fetch(`/product/image/${imageId}`);
      const imgData = await imgRes.json();
      const imgSrc = imgData.data;

      const productElement = document.createElement('div');
      productElement.classList.add('products-container');

      productElement.innerHTML += `
        <a href="/detail?productId=${product._id}">
          ${imgSrc}
        </a>
        <span class="product-name">${product.product_name}</span>
        <span class="product-price">${product.product_price}</span>
      `;
      recentlyProductsContainer.appendChild(productElement);
    })

  } catch (err) {
    console.log(err);
  }

});
