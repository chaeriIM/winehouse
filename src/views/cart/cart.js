// 수량 조절 함수
function adjustProductQuantity(type, productIndex) {
  const quantityElements = document.querySelectorAll('.quantity');
  const quantityElement = quantityElements[productIndex];

  let currentQuantity = parseInt(quantityElement.innerText);

  if (type === 'plus') {
    currentQuantity += 1;
  } else if (type === 'minus') {
    if (currentQuantity >= 2) {
      currentQuantity -= 1;
    } else {
      currentQuantity = 1;
    }
  }

  quantityElement.innerText = currentQuantity;

  // 수량 변경 시 가격 업데이트
  updateTotalPrice();
}

const cartContainer = document.querySelector('#cart-items');

// 플러스 버튼
cartContainer.addEventListener('click', (event) => {
  if (event.target && event.target.classList.contains('quantity-plus-btn')) {
    const index = Array.from(cartContainer.querySelectorAll('.quantity-plus-btn')).indexOf(event.target);
    adjustProductQuantity('plus', index);
  }
});

// 마이너스 버튼
cartContainer.addEventListener('click', (event) => {
  if (event.target && event.target.classList.contains('quantity-minus-btn')) {
    const index = Array.from(cartContainer.querySelectorAll('.quantity-minus-btn')).indexOf(event.target);
    adjustProductQuantity('minus', index);
  }
});

///////////////////////////////////////////////////

// 페이지 로드 시 IndexedDB 초기화 함수 호출
window.onload = () => {
  initializeIndexedDB();
};

// IndexedDB 초기화 함수
function initializeIndexedDB() {
  if (window.indexedDB) {
    const request = window.indexedDB.open('winehouse');

    request.onerror = (event) => {
      console.log(event.target.errorCode);
    };

    request.onsuccess = () => {
      // 장바구니 상품 출력
      displayCartItems();
    };
  }
}

// 장바구니 상품을 화면에 표시하는 함수
function displayCartItems() {
  const request = window.indexedDB.open('winehouse');
  let db;

  request.onsuccess = (event) => {
    db = event.target.result;
    const transaction = db.transaction(['cart'], 'readonly');
    const store = transaction.objectStore('cart');

    const requestGetItems = store.getAll();

    requestGetItems.onsuccess = (event) => {
      const cartItems = event.target.result;
      const cartContainer = document.querySelector('#cart-items');
      cartContainer.innerHTML = ''; // 기존 내용을 지우고 다시 표시

      if (cartItems.length > 0) {
        // 장바구니에 상품이 있으면 notice 숨기기
        document.querySelector('.notice').style.display = 'none';

        cartItems.forEach((item) => {
          const card = createCardElement(item);
          cartContainer.appendChild(card);
        });
      } else {
        // 장바구니에 상품이 없으면 notice 보이기
        document.querySelector('.notice').style.display = 'flex';
      }

      updateTotalPrice();
    };
  };
}

// 상품 카드 요소를 생성하는 함수
function createCardElement(item) {
  const card = document.createElement('div');
  card.classList.add('card', 'mb-5');

  card.innerHTML = `
    <div class="card-content">
      <div class="content">
        <div class="is-flex is-align-items-center">
          <label class="checkbox">
            <input type="checkbox" name="${item.id}" checked>
          </label>
          <div class="product-image m-2">
            <img src="${item[0].product_image}" id="${item[0].product_id}" alt="Product Image" />
          </div>
          <div class="product-info">
            <div class="product-name">
              <p>${item[0].product_name}</p>
            </div>
            <div class="product-price">
              <p>${item[0].product_price}원</p>
            </div>
          </div>
        </div>
        <div class="count-button">
          <button class="quantity-minus-btn">-</button>
          <span class="quantity">${item[0].product_num}</span>
          <button class="quantity-plus-btn">+</button>
        </div>
      </div>
    </div>`;

  return card;
}

// 선택 삭제 버튼 클릭 시
const deleteSelectedButton = document.querySelector('#delete-selected-button');

deleteSelectedButton.addEventListener('click', () => {
  const checkedItems = document.querySelectorAll('#cart-items input[type="checkbox"]:checked');

  // 확인 메시지 표시
  if (checkedItems.length > 0) {
    const confirmDelete = confirm('선택한 상품을 삭제하시겠습니까?');
    if (confirmDelete) {
      checkedItems.forEach((item) => {
        const itemId = parseInt(item.name);
        deleteCartItem(itemId);
      });

      displayCartItems();
      alert('선택한 상품이 삭제되었습니다.');
    }
  } else {
    alert('삭제할 상품을 선택해주세요.');
  }
});

// 장바구니 상품 선택 삭제 함수
function deleteCartItem(itemId) {
  const request = window.indexedDB.open('winehouse');
  let db;

  request.onsuccess = (event) => {
    db = event.target.result;
    const transaction = db.transaction(['cart'], 'readwrite');
    const store = transaction.objectStore('cart');

    store.delete(itemId);
  };
}

// 전체 삭제 버튼 클릭 시
const deleteAllButton = document.querySelector('#delete-all-button');

deleteAllButton.addEventListener('click', () => {
  const cartItems = document.querySelectorAll('#cart-items .card');

  // 장바구니에 상품이 없으면 알림창 띄우기
  if (cartItems.length === 0) {
    alert('장바구니에 담긴 상품이 없습니다.');
    return;
  }

  const confirmDelete = confirm('장바구니에 담긴 모든 상품을 삭제하시겠습니까?');
  if (confirmDelete) {
    deleteAllCartItems();
    displayCartItems();
    alert('장바구니에 담긴 모든 상품이 삭제되었습니다.');
  }
});

// 모든 장바구니 상품 삭제 함수
function deleteAllCartItems() {
  const request = window.indexedDB.open('winehouse');
  let db;

  request.onsuccess = (event) => {
    db = event.target.result;
    const transaction = db.transaction(['cart'], 'readwrite');
    const store = transaction.objectStore('cart');

    store.clear();
  };
}

// 선택된 상품의 가격 합산 함수
function calculateCheckedItemsTotal() {
  const cartItems = document.querySelectorAll('#cart-items input[type="checkbox"]:checked');
  let checkedItemsTotal = 0;

  cartItems.forEach((checkbox) => {
    const itemCard = checkbox.closest('.card');
    const itemPriceElement = itemCard.querySelector('.product-price p');
    const itemPrice = parseInt(itemPriceElement.innerText.replace('원', ''));
    const itemQuantity = parseInt(itemCard.querySelector('.quantity').innerText);
    checkedItemsTotal += itemPrice * itemQuantity;
  });

  return checkedItemsTotal;
}

// 총 상품 가격 업데이트 함수
function updateTotalPrice() {
  const checkedItemsTotal = calculateCheckedItemsTotal();
  const shippingCost = checkedItemsTotal > 0 ? (checkedItemsTotal >= 50000 ? 0 : 5000) : 0;
  const totalPayment = checkedItemsTotal + shippingCost;

  const priceInfoContainer = document.querySelector('.price-info');
  priceInfoContainer.innerHTML = `
    <p>총 상품 금액: ${checkedItemsTotal}원 +</p>
    <p>배송비: ${shippingCost}원 =</p>
    <p>총 결제 금액: ${totalPayment}원</p>
  `;

  const paymentButtonContainer = document.querySelector('#payment-button');
  paymentButtonContainer.innerHTML = `${totalPayment}원 결제하기`;
}

// 체크박스 변경 시 총 상품 가격 업데이트
document.addEventListener('change', (event) => {
  const target = event.target;
  if (target && target.type === 'checkbox') {
    updateTotalPrice();
  }
});

// 결제 버튼 클릭 시 order objectStore에 결제 상품 추가
const paymentButton = document.querySelector('#payment-button');
paymentButton.addEventListener('click', () => {
  const checkedItems = document.querySelectorAll('#cart-items input[type="checkbox"]:checked');

  const request = window.indexedDB.open('winehouse');
  console.log('1');

  request.onsuccess = (event) => {
    const db = event.target.result;
    const transaction = db.transaction(['order'], 'readwrite');
    const store = transaction.objectStore('order');

    // 확인 메시지 표시
    if (checkedItems.length > 0) {
      const confirmDelete = confirm('선택한 상품을 결제하시겠습니까?');
      if (confirmDelete) {
        const items = [];

        checkedItems.forEach((checkbox) => {
          const itemCard = checkbox.closest('.card');
          // 아이디
          const itemId = itemCard.querySelector('img').id;
          // 사진
          const itemImage = itemCard.querySelector('img').src;
          // 이름
          const itemName = itemCard.querySelector('.product-name').innerText;
          // 가격
          const itemPriceElement = itemCard.querySelector('.product-price p');
          const itemPrice = parseInt(itemPriceElement.innerText.replace('원', ''));
          // 수량
          const itemQuantity = parseInt(itemCard.querySelector('.quantity').innerText);

          items.push({
            product_id: itemId,
            product_name: itemName,
            product_price: itemPrice,
            product_num: itemQuantity,
            product_image: itemImage,
          });

        });
        store.add(items);

        window.location.href = '/order';
      }
    } else {
      alert('결제할 상품을 선택해주세요.');
    }
  };
});
