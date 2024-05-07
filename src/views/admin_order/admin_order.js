// // 삭제 버튼
// document.addEventListener("DOMContentLoaded", function () {
//   const cancelButtons = document.querySelectorAll(".cancelBtn");

//   // forEach를 사용하여 각 버튼에 클릭 이벤트를 추가합니다.
//   cancelButtons.forEach(function (button, index) {
//     button.addEventListener("click", function () {
//       // 사용자에게 확인 메시지를 표시합니다.
//       const result = confirm("주문취소 하시겠습니까?");

//       // 사용자가 '예'를 선택한 경우
//       if (result) {
//         // 클래스명이 'card'인 요소의 인덱스에 해당하는 요소를 삭제합니다.
//         const box = document.querySelectorAll(".box");
//         if (box.length > index) {
//           box[index].remove(); // 삭제
//         } else {
//           alert("더이상 취소할 상품이 존재하지 않습니다.");
//         }
//       }
//     });
//   });
// });

document.addEventListener("DOMContentLoaded", async () => {
  try {
    // 관리자 로그인 토큰
    const token = localStorage.getItem('token') || '';
    const cancelButtons = document.querySelectorAll('#product-pay-cancel');
    
    // 카테고리 api
    const response = await fetch('/product');

    const productData = await response.json();
    //console.log(productData);

    const products = productData.data;
    
    // 관리자 주문 api
    const res = await fetch('/api-order', {
      method: 'GET',
      headers: {
        authorization: `Bearer ${token}`
      },
    });

    const data = await res.json();
    const orders = data.data;
    //console.log(orders)

    const adminOrderContainer = document.querySelector('.order-container');
    orders.forEach(async order => {
      const orderElement = document.createElement('div');
      orderElement.classList.add('container');

      // 각 주문의 배송상태 가져오기
      const resDelivery = await fetch(`/api-order/status/${order._id}`, {
        headers: {
          authorization: `Bearer ${token}`}});
      const delData = await resDelivery.json();
      const delivery = delData.data;
      //console.log(delivery)
      
      // 주문 리스트 하나 가져오기
      const resOrderlist = await fetch(`/api-order/info/${order._id}`, {
        headers: {
          authorization: `Bearer ${token}`}});
      const olData = await resOrderlist.json();
      const orderlist = olData.data;
      console.log(orderlist)

      // 가져온 주문 리스트 상품의 이미지 가져오기
      const resImage = await fetch(`/product/info/${orderlist[0].product_id}`, {
        headers: {
          authorization: `Bearer ${token}`}
      });
      const image = await resImage.json();
      console.log(image);
      const imgSrc = image.data.image;

      orderElement.innerHTML += `
      <div class="box">
        <span id="photo">${imgSrc}</span>

        <div class="infoBox">
          <div>
            <label for="order-delivery">배송 상태</label>
            <label id="order-delivery">${delivery.delivery_status}</label>
          </div>
          <div>
            <label for="order-date">주문 일자</label>
            <label id="order-date">${order.createdAt}</label>
          </div>
          <div>
            <label for="order-count">전체 개수</label>
            <label id="order-count">${order.order_count}</label>
          </div>
          <div>
            <label for="order-pay">결제 금액</label>
            <label id="order-pay">${order.order_price}</label>
          </div>
          </div>

          <div id="buttonBox">
            <button id="order-pay-cancel" class="button is-primary mt-3">주문 취소</button>
          </div>
      </div>
      `;
      adminOrderContainer.appendChild(orderElement);

      const cancelButtons = document.querySelectorAll('#order-pay-cancel');
      // 각각의 주문의 주문취소 버튼
    cancelButtons.forEach(function (button) {
      button.addEventListener('click', async function () {
        const orderDetails = this.closest('.container');
        const cancelOrder = await fetch(`/order/${orderDetails._id}?authorization=Bearer ${token}`);
        if (cancelOrder) {
          orderDetails.remove();
          alert('주문이 취소되었습니다.');
        }
      });
    });
    });
   
  } catch (err) {
    console.log(err);
  }
});