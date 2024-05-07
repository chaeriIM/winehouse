document.addEventListener('DOMContentLoaded', async () => {
  try {
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('productId');

    const res = await fetch(`/product/info/${productId}`);
    const data = await res.json();

    const image = data.data.image;
    const products = data.data.info;
    console.log(products);

    // 사진 출력
    const imageContainer = document.querySelector('.left');
    imageContainer.innerHTML = image;

    // 상품 이름, 가격, 수량 출력
    const productsContainer = document.querySelector('.detailDiv');
    productsContainer.innerHTML = ''; // 기존 상품 목록 초기화

    const productElement = document.createElement('div');
    productElement.classList.add('detailBox');

    productElement.innerHTML += `
        <div class="detailRow">
          <a id="detailFont">이름</a>
          <a id="data-name">${products.product_name}</a>
        </div>
        <div class="detailRow">
          <a id="detailFont">가격</a>
          <a id="data-price">${products.product_price}원</a>
        </div>
        <hr class="hr">
        <div class="detailRow" id="quantity">
          <a id="detailFont">수량</a>
        <div>
          <button id="minus" class="quantityBtn">-</button>
           <a id='result'>1</a>
          <button id="plus" class="quantityBtn">+</button>
          </div>
        </div>
        <div class="detailRow">
          <a id="detailFont">총가격</a>
          <a id="data-totalPrice">${products.product_price}원</a>
        </div>
        <div class="buttonDiv">
          <button class="button is-light is-fullwidth mt-5" id="cartBtn">장바구니</button>
          <button class="button is-primary is-fullwidth mt-5" id="payBtn">결제하기</button>
        </div>
    `;
    productsContainer.appendChild(productElement);

    // 상품 상세 정보 출력
    const infoContainer = document.querySelector('.bottomBox');
    infoContainer.innerHTML = ''; // 기존 상품 목록 초기화

    const infoElement = document.createElement('div');
    infoElement.classList.add('bottomRow');

    infoElement.innerHTML += `
      <div class="detailRow">
        <a id="detailFont">국가</a>
        <a id="data-name">${products.product_country}</a>
      </div>
      <div class="detailRow">
        <a id="detailFont">포도 품종</a>
        <a id="data-name">${products.product_grape}</a>
      </div>
      <div class="detailRow">
        <a id="detailFont">생산 연도</a>
        <a id="data-name">${products.product_madeyear}</a>
      </div>
      <hr class="hr">
      <div class="detailRow">
        <a id="detailFont">산도</a>
        <div class="is-flex is-align-items-center">
          <a id="data-name">${products.product_sourrate}</a>
          <progress class="progress is-small" value="${products.product_sourrate}" max="5"></progress>
          <p>5</p>
        </div>
      </div>
      <div class="detailRow">
        <a id="detailFont">당도</a>
        <div class="is-flex is-align-items-center">
          <a id="data-name">${products.product_sweetrate}</a>
          <progress class="progress is-small" value="${products.product_sweetrate}" max="5"></progress>
          <p>5</p>
        </div>
      </div>
      <div class="detailRow">
        <a id="detailFont">바디</a>
        <div class="is-flex is-align-items-center">
          <a id="data-name">${products.product_bodyrate}</a>
          <progress class="progress is-small" value="${products.product_bodyrate}" max="5"></progress>
          <p>5</p>
        </div>
      </div>
  `;
    infoContainer.appendChild(infoElement);

    // 마이너스 플러스 버튼
    let resultElement = document.getElementById('result');
    let resultValue = parseInt(resultElement.innerText);
    let totalPriceElement = document.getElementById('data-totalPrice');

    document.getElementById('plus').addEventListener('click', function () {
      // resultValue 값을 1씩 증가시킵니다.
      resultValue++;
      resultElement.innerText = resultValue;
      totalPriceElement.innerHTML = `${products.product_price * resultValue}원`;
    });

    document.getElementById('minus').addEventListener('click', function () {
      // resultValue 값이 1보다 큰 경우에만 감소
      if (resultValue > 1) {
        resultValue--;
        resultElement.innerText = resultValue;
        totalPriceElement.innerHTML = products.product_price * resultValue;
      }
    });

    // 장바구니 버튼 클릭 시
    document.getElementById('cartBtn').addEventListener('click', function (event) {
      const request = window.indexedDB.open('winehouse');

      request.onsuccess = (event) => {
        const db = event.target.result;
        const transaction = db.transaction(['cart'], 'readwrite');
        const store = transaction.objectStore('cart');

        // 상품 아이디
        const urlParams = new URLSearchParams(window.location.search);
        const productId = urlParams.get('productId');

        // 상품 이름
        const nameElement = document.getElementById('data-name');
        const productName = nameElement.innerText;

        // 상품 사진
        const imageElement = document.querySelector('.left img');
        const productImage = imageElement.src;

        // 수량
        const quantityElement = document.getElementById('result');
        const productQuantity = parseInt(quantityElement.innerText);

        // 가격
        const priceElement = document.getElementById('data-price');
        const productPrice = parseInt(priceElement.innerText.replace('원', ''));

        const products = [
          {
            product_id: productId,
            product_name: productName,
            product_image: productImage,
            product_price: productPrice,
            product_num: productQuantity,
          },
        ];
        store.add(products);

        transaction.oncomplete = () => {
          console.log('상품 데이터가 IndexedDB에 추가되었습니다.');
        };

        transaction.onerror = (event) => {
          console.error(event.target.errorCode);
        };
      };

      // 사용자에게 확인 메시지를 띄움
      const result = confirm('장바구니에 담겼습니다. 장바구니 페이지로 이동하시겠습니까?');
      // 사용자가 확인을 선택한 경우
      if (result) {
        // 장바구니 페이지로 이동
        window.location.href = '/cart';
      } else {
        // 아무런 동작도 하지 않음
        event.preventDefault();
      }
    });

    // 결제하기 버튼
    document.getElementById('payBtn').addEventListener('click', function () {
      // 상품 아이디
      const urlParams = new URLSearchParams(window.location.search);
      const productId = urlParams.get('productId');

      // 수량
      const resultElement = document.getElementById('result');
      const resultValue = parseInt(resultElement.innerText);

      // 가격
      const priceElement = document.getElementById('data-totalPrice');
      const price = parseInt(priceElement.innerText.replace('원', ''));

      window.location.href = `/order?productId=${productId}?quantity=${resultValue}?price=${price}`;
    });
  } catch (err) {
    console.log(err);
  }
});
