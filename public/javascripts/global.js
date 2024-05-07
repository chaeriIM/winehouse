// 헤더와 푸터를 렌더링하는 함수
async function renderHeaderAndFooter() {
  // 헤더 추가
  const headerContainer = document.getElementById('header-container');

  const updateHeader = () => {
    if (localStorage.getItem('token')) {
      headerContainer.innerHTML = `
        <nav class="navbar has-shadow ${window.location.pathname === '/' ? 'is-fixed-top' : ''
        }">
          <div class="navbar-brand">
            <a class="navbar-item" href="/">
              <img src="/images/winehouse_logo.png" alt="winehouse-logo">
            </a>
            <a class="navbar-burger" id="burger">
              <span></span>
              <span></span>
              <span></span>
            </a>
          </div>
          <div class="navbar-menu" id="nav-links">
            <div class="navbar-start ml-2"><!-- 카테고리(타입) --></div>
            <div class="navbar-end">
              <div class="navbar-item">
                <div class="buttons">
                  <a class="cart-icon" href="/cart">
                    <i class="fa-solid fa-cart-shopping"></i>
                  </a>
                  <a class="cart-icon" href="/mypage">
                    <i class="fa-solid fa-user"></i>
                  </a>
                  <a class="button is-light" id="logoutBtn"><strong>로그아웃</strong></a>
                </div>
              </div>
            </div>
          </div>
        </nav>
      `;
      // 로그아웃 버튼에 이벤트 리스너 추가
      document.getElementById('logoutBtn').addEventListener('click', () => {
        const confirmLogout = window.confirm('로그아웃 하시겠습니까?');
        if (confirmLogout) {
          localStorage.removeItem('token'); // 토큰 삭제
          window.location.href = '/'; // 로그아웃 후 로그인 페이지로 이동
        }
      });
    } else {
      headerContainer.innerHTML = `
        <nav class="navbar has-shadow ${window.location.pathname === '/' ? 'is-fixed-top' : ''
        }">
          <div class="navbar-brand">
            <a class="navbar-item" href="/">
              <img src="/images/winehouse_logo.png" alt="winehouse-logo">
            </a>
            <a class="navbar-burger" id="burger">
              <span></span>
              <span></span>
              <span></span>
            </a>
          </div>
          <div class="navbar-menu" id="nav-links">
            <div class="navbar-start ml-2"><!-- 카테고리(타입) --></div>
            <div class="navbar-end">
              <div class="navbar-item">
                <div class="buttons">
                  <a class="cart-icon" href="/cart">
                    <i class="fa-solid fa-cart-shopping"></i>
                  </a>
                  <a class="cart-icon" href="/mypage">
                    <i class="fa-solid fa-user"></i>
                  </a>
                  <a class="button is-light" href="/login"><strong>로그인</strong></a>
                </div>
              </div>
            </div>
          </div>
        </nav>
      `;
    }
  };

  updateHeader();

  // 푸터 추가
  const footerContainer = document.getElementById('footer-container');
  if (footerContainer) {
    footerContainer.innerHTML = `
      <footer class="footer">
        <div class="footer-container">
          <div class="company-name">
            <p>WineHouse</p>
          </div>
          <div class="company-info">
            <p class="info-title">회사 정보</p>
            <p>(주)WineHouse | 대표 엘리스</p>
            <p>서울특별시 강남구 선릉로 433, 신관 6층</p>
          </div>
          <div class="customer-service">
            <p class="info-title">고객 센터</p>
            <p>070-4633-2017</p>
            <p>OPEN 10:00-18:00(BREAK 12:00-13:00)</p>
          </div>
        </div>
      </footer>
    `;
  }
}

// 페이지가 로드될 때 헤더와 푸터 렌더링
document.addEventListener('DOMContentLoaded', async () => {
  renderHeaderAndFooter();

  // burger-menu
  const burgerIcon = document.querySelector('#burger');
  const navbarMenu = document.querySelector('#nav-links');

  burgerIcon.addEventListener('click', () => {
    navbarMenu.classList.toggle('is-active');
  });

  // 카테고리 가져오기
  try {
    const res = await fetch('/category');
    const data = await res.json();

    if (data.status !== 200) {
      throw new Error('카테고리 목록을 가져오는데 실패했습니다.');
    }

    const categories = data.data;
    const menuElement = document.querySelector('.navbar-start');

    // 카테고리 목록을 메뉴에 추가
    categories.forEach((category) => {
      menuElement.innerHTML += `
        <a class="navbar-item" href="/list?categoryId=${category._id}">${category.category_name}</a>
      `;
    });
  } catch (error) {
    console.error('카테고리 불러오기 오류:', error);
  }

  // 장바구니 indexedDB 생성
  if (window.indexedDB) {
    const request = window.indexedDB.open('winehouse');
    let db;

    request.onupgradeneeded = (event) => {
      db = event.target.result;

      db.createObjectStore('cart', {
        keyPath: 'id',
        autoIncrement: true,
      });

      db.createObjectStore('order', {
        keyPath: 'id',
        autoIncrement: true,
      });
      
    };

    request.onerror = (event) => {
      console.log(event.target.errorCode);
    };
  }
});
