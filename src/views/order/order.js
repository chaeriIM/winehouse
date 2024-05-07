// order.js 파일

document.addEventListener("DOMContentLoaded", async function (event) {
  event.preventDefault();
  const token = localStorage.getItem('token');
  const userInfo = await fetchUserInfo(token);

  async function fetchUserInfo(token) {
    const apiUrl = "/user";

    try {
      if (!token) {
        // 토큰이 없으면 로그인 페이지로 이동
        window.location.href = '/login';
        return null;
      }

      const response = await fetch(apiUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`, // 토큰 추가
        },
      });

      if (response.status === 200) {
        const userInfo = await response.json();
        document.getElementById('nameInput').value = userInfo.data.name;
        document.getElementById('telInput').value = userInfo.data.tel;
        document.getElementById('addressInput').value = userInfo.data.address;
        return userInfo; // 사용자 정보 반환
      } else {
        console.error('사용자 정보를 가져오지 못했습니다. 상태 코드:', response.status);
        return null;
      }
    } catch (error) {
      console.error('에러:', error);
      return null;
    }
  }

  const paymentButton = document.querySelector('#payButton');
  const paymentMethodRadios =document.querySelectorAll('radio');
  const paymentErrorMessage = document.querySelector('#paymentErrorMessage') ; 
  const termsErrorMessage = document.querySelector('#termsErrorMessage') ;
  const termsAgreeCheckbox = document.querySelector('#termsAgree') ;

  // 결제 버튼 클릭 제외하고 페이지를 새로고침하거나 나갈때 경고창 뜨는 함수
  window.addEventListener("beforeunload", function (event) {
    if (!paymentButtonClicked) {
      event.preventDefault();
      event.returnValue = "";
    }
  });

  // 결제 버튼 클릭에만 경고창이 안뜸
  let paymentButtonClicked = false;
  paymentButton.addEventListener("click", function () {
    paymentButtonClicked = true;
  });

  // 결제 수단 중 하나가 선택되었는지 확인하는 함수
  function isPaymentMethodSelected() {
    for (const radio of paymentMethodRadios) {
      if (radio.checked) {
        return true;
      }
    }
    return false;
  }

  // 약관 동의 체크 여부를 확인하는 함수
  function areTermsAgreed() {
    return termsAgreeCheckbox.checked;
  }

  // 결제 버튼 상태를 업데이트하는 함수
  function updatePaymentButtonState() {
    // 에러 메시지 숨기기
    paymentErrorMessage.style.display = "none";
    termsErrorMessage.style.display = "none";
    // paymentSuccessMessage.style.display = "none";

    // 결제 수단선택 안될 시
    if (!isPaymentMethodSelected()) {
      paymentErrorMessage.style.display = "block";
    }

    // 약관 동의선택 안될 시
    if (!areTermsAgreed()) {
      termsErrorMessage.style.display = "block";
    }
  }

  for (const radio of paymentMethodRadios) {
    radio.addEventListener("change", updatePaymentButtonState);
  }

  // 약관 동의 체크박스에 변경 이벤트 리스너 추가
  termsAgreeCheckbox.addEventListener("change", updatePaymentButtonState);

  // 결제 버튼 클릭
  paymentButton.addEventListener("click", function (event) {
    event.preventDefault();
    // 결제 수단이 선택안될 시 에러 메시지
    if (!isPaymentMethodSelected()) {
      paymentErrorMessage.style.display = "block";
    }

    // 약관에 동의 안할 시 에러 메시지
    if (!areTermsAgreed()) {
      termsErrorMessage.style.display = "block";
    }

    if (isPaymentMethodSelected() && areTermsAgreed()) {
      window.location.href = "/mypage";
    }
  });

  // 초기 상태 확인
  updatePaymentButtonState();
});


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

// 주문 페이지 로드 시 장바구니 상품 출력
async function displayCartItems() {
  const request = window.indexedDB.open('winehouse');
  let db;

  request.onsuccess = (event) => {
    db = event.target.result;
    const transaction = db.transaction(['cart'], 'readonly');
    console.log(transaction);
    const store = transaction.objectStore('cart');
    console.log(store);

    const requestGetItems = store.getAll();
    console.log(requestGetItems);

    requestGetItems.onsuccess = async (event) => {
      const cartItems = event.target.result;
      console.log(cartItems);
      const orderContainer = document.querySelector('#order-items'); // 주문 페이지에서 상품을 출력할 컨테이너

      orderContainer.innerHTML = ''; // 기존 내용을 지우고 다시 표시

      if (cartItems.length > 0) {
        // 장바구니에 상품이 있으면 notice 숨기기
        document.querySelector('.notice').style.display = 'none';

        cartItems.forEach((item) => {
          const card = createOrderCardElement(item);
          orderContainer.appendChild(card);
        });
      } else {
        // 장바구니에 상품이 없으면 notice 보이기
        document.querySelector('.notice').style.display = 'flex';
      }

      // 기타 필요한 작업 수행
      // 예: 총 가격 업데이트
      updateTotalPrice();
    };
  };
}

// 주문 페이지에서 상품 카드 요소를 생성하는 함수
function createOrderCardElement(item) {
  const orderItemCard = document.createElement('div');
  orderItemCard.classList.add('order-card', 'mb-5');

  orderItemCard.innerHTML = `
    <div class="order-card-content">
      <div class="content">
        <div class="is-flex is-align-items-center">
          <!-- 여기에서 item의 속성을 이용하여 상품 정보를 표시할 수 있음 -->
          <div class="order-product-image m-2">
            <img src="${item[0].product_image}" alt="Product Image" />
          </div>
          <div class="order-product-info">
            <div class="order-product-name">
              <p>${item[0].product_name}</p>
            </div>
            <div class="order-product-price">
              <p>${item[0].product_price}원</p>
            </div>
          </div>
        </div>
      </div>
    </div>`;

  return orderItemCard;
}

// 주문 페이지에서 상품 정보 출력 후에 호출되는 함수
function updateTotalPrice() {
  // 총 상품 가격 업데이트 등을 수행할 수 있음
}
