// 사진 업로드
const inputImage = document.querySelector('#input-img');
inputImage.addEventListener('change', previewFile);

function previewFile(event) {
  const reader = new FileReader();

  reader.onload = function (event) {
    const img = document.createElement('img');
    img.setAttribute('src', event.target.result);
    document.querySelector('#img-container').appendChild(img);
  };

  reader.readAsDataURL(event.target.files[0]);
}

// 카테고리 & 상품 정보 가져오기
document.addEventListener('DOMContentLoaded', async () => {
  try {
    //////// 카데고리 정보 가져오기
    const token = localStorage.getItem('token');

    const categoryRes= await fetch('/category', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          authorization: `Bearer ${token}`
        },
    });
    
    const categoryData = await categoryRes.json();

    if (categoryData.status !== 200) {
      throw new Error('카테고리 목록을 가져오는데 실패했습니다.');
    }

    const categories = categoryData.data;
    // console.log(categories);

    // 셀렉트 박스 생성
    const selectElement = document.querySelector('.field select[name="type"]');

    // 카테고리 목록을 셀렉트 박스에 추가
    categories.forEach(category => {
      const optionElement = document.createElement('option');
      optionElement.value = category._id;
      optionElement.textContent = category.category_name;
      selectElement.appendChild(optionElement);
    });

    //////// 상품 정보 가져오기
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('productId');
    // console.log(productId);

    const productRes = await fetch(`/product/info/${productId}`);
    const productData = await productRes.json();

    if (productData.status !== 200) {
      throw new Error('상품 정보를 가져오는데 실패했습니다.');
    }

    const product = productData.data;
    // console.log(product);

    // 폼에 상품 정보 넣기
    document.querySelector('#name').value = product.product_name;
    document.querySelector('#price').value = product.product_price;
    document.querySelector('#type').value = product.category_id;
    document.querySelector('#country').value = product.product_country;
    document.querySelector('#grape').value = product.product_grape;
    document.querySelector('#sweet').value = product.product_sweetrate;
    document.querySelector('#sour').value = product.product_sourrate;
    document.querySelector('#body').value = product.product_bodyrate;
    document.querySelector('#year').value = product.product_madeyear;

  } catch (err) {
    console.error(err);
  }
});

// 상품 수정
const form = document.querySelector('#form');
form.addEventListener('submit', async (e) => {
  e.preventDefault();

  try {
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('productId');

    const productName = document.querySelector('#name').value;
    const productPrice = document.querySelector('#price').value;
    const categoryId = document.querySelector('#type').value;
    const productCountry = document.querySelector('#country').value;
    const productGrape = document.querySelector('#grape').value;
    const productSweetrate = document.querySelector('#sweet').value;
    const productSourrate = document.querySelector('#sour').value;
    const productBodyrate = document.querySelector('#body').value;
    const productMadeyear = document.querySelector('#year').value;

    const formData = {
      productName,
      productPrice,
      categoryId,
      productCountry,
      productGrape,
      productSweetrate,
      productSourrate,
      productBodyrate,
      productMadeyear,
    };

    if (!productName || !productPrice || !categoryId || !productCountry
      || !productGrape || !productMadeyear || !productSweetrate 
      || !productSourrate || !productBodyrate) {
      return alert("모든 값을 입력해 주세요.");
    }

    const res = await fetch(`/product/${productId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formData)
    });

    if (!res.ok) {
      throw new Error('상품을 수정하는데 실패했습니다.');
    }

    alert('상품 수정이 완료되었습니다.');
    window.location.href = '/admin_product';

  } catch (err) {
    console.error('상품 수정 오류:', err);
  }
});
