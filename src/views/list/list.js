document.addEventListener("DOMContentLoaded", async () => {
  // 카테고리 가져오기
  try {
    const urlParams = new URLSearchParams(window.location.search);
    const categoryId = urlParams.get('categoryId');

    const res = await fetch('/category');
    const data = await res.json();

    if (data.status !== 200) {
      throw new Error('카테고리 목록을 가져오는데 실패했습니다.');
    }

    const categories = data.data;

    const categoryElement = document.querySelector('.category-container');

    categories.forEach((category) => {
      if (category._id === categoryId)
      categoryElement.innerHTML += `
          <p class="listFont">
            <i class="fa-solid fa-wine-bottle"></i> 
            <span class="category-name">${category.category_name} 와인</span>
          </p>
        `;
    });
  } catch (error) {
    console.error('카테고리 불러오기 오류:', error);
  }

  // 카테고리별 상품 가져오기
  try {
    const urlParams = new URLSearchParams(window.location.search);
    const categoryId = urlParams.get('categoryId');
    
    const res = await fetch(`/product/${categoryId}`);
    const data = await res.json();
    // console.log(data);

    const products = data.data;
    // console.log(products);

    const productsContainer = document.querySelector('.productPhoto');
    productsContainer.innerHTML = ''; // 기존 상품 목록 초기화

    // products 배열을 순회하면서 각 상품의 정보를 dataRowDiv에 추가합니다.
    products.forEach(async product => {
      const imageId = product.image_id;

      const imgRes = await fetch(`/product/image/${imageId}`);
      const imgData = await imgRes.json();
      const imgSrc = imgData.data;

      const productElement = document.createElement('div');
      productElement.classList.add('photoBox');

      productElement.innerHTML += `
        <a href="/detail?productId=${product._id}">
          ${imgSrc}
        </a>
            <div class="dataBox">
              <div class="dataRow">
                <a id="data-name">${product.product_name}</a>
              </div>
              <div class="dataRow">
                <a id="data-price">${product.product_price} 원</a>
              </div>
            </div>
    `;
    productsContainer.appendChild(productElement);
    });
  } catch (err) {
    console.log(err);
  }
});
