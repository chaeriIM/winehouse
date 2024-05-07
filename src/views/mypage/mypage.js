document.addEventListener('DOMContentLoaded', async () =>  {
  try {
    const token = localStorage.getItem('token') || '';
    const cancelButtons = document.querySelectorAll('#product-pay-cancel');
    
    // 유저 주문 로딩
    const resOrder = await fetch('/api-order/user', {
      headers: {
        authorization: `Bearer ${token}`}})
    const resArray = await resOrder.json();
    const orderlist = await resArray.data;

    // 유저 주문 목록 띄우기
    const userOrderContainer = document.querySelector('.order-container');
    orderlist.forEach(async order => {
      const orderElement = document.createElement('div');
      orderElement.classList.add('order-details');

      // 각 주문의 배송상태 가져오기
      const resDelivery = await fetch(`/api-order/status/${order._id}`, {
        headers: {
          authorization: `Bearer ${token}`}});
      const delData = await resDelivery.json();
      const delivery = delData.data;
      // 주문 리스트 하나 가져오기
      const resOrderlist = await fetch(`/api-order/info/${order._id}`, {
        headers: {
          authorization: `Bearer ${token}`}});
      const olData = await resOrderlist.json();
      const orderlist = olData.data;
      // 가져온 주문 리스트 상품의 이미지 가져오기
      const resImage = await fetch(`/product/info/${orderlist[0].product_id}`, {
        headers: {
          authorization: `Bearer ${token}`}
      });
      const image = await resImage.json();
      const imgSrc = image.data.image;

      orderElement.innerHTML += `
        <div class="images">
          ${imgSrc}
        </div>
        <div class="delivery multi-line">
          <label for="order-delivery">배송 상태</label>
          <hr />
          <label id="order-delivery">${delivery.delivery_status}</label>
        </div>
        <div class="date multi-line">
          <label for="order-date">주문 일자</label>
          <hr />
          <label id="order-date">${order.createdAt}</label>
        </div>
        <div class="count multi-line">
          <label for="order-count">전체 개수</label>
          <hr />
          <label id="order-count">${order.order_count}</label>
        </div>
        <div class="pay multi-line">
          <label for="order-pay">결제 금액</label>
          <hr />
          <label id="order-pay">${order.order_price}</label>
        </div>
        <div class="pay multi-line">
          <label for="order-pay-cancel">주문 취소</label>
          <hr />
          <button id="order-pay-cancel" class="button is-primary mt-3">
            취소하기
          </button>
      `;
      userOrderContainer.appendChild(orderElement);
    })

    // 각각의 주문의 주문취소 버튼
    cancelButtons.forEach(function (button) {
      button.addEventListener('click', async function () {
        const orderDetails = this.closest('.order-details');
        const cancelOrder = await fetch(`/order/${orderDetails._id}?authorization=Bearer ${token}`);
        if (cancelOrder) {
          orderDetails.remove();
          alert('주문이 취소되었습니다.');
        }
      });
    });

    // 회원정보 수정하기 버튼
    document
      .getElementById('update-button')
      .addEventListener('click', function () {
        window.location.href = '/update';
      });
  } catch (err) {
    console.log(err);
  }
});
