// 페이지가 로드될 때 헤더 렌더링
document.addEventListener('DOMContentLoaded', async () => {
  const headerContainer = document.getElementById('admin-header-container');

  const updateHeader = () => {
    if (localStorage.getItem('token')) {
      headerContainer.innerHTML = `
        <nav class="navbar is-light">
          <div class="navbar-brand is-justify-content-space-between">
            <a class="navbar-item" href="/admin_order">
              <p>WINEHOUSE-ADMIN</p>
            </a>
            <div class="navbar-end">
              <div class="navbar-item">
                <a class="button" id="logoutBtn"><strong>로그아웃</strong></a>
              </div>
            </div>
          </div>
        </nav>
      `;
      // 로그아웃 버튼에 이벤트 리스너 추가
      document.getElementById('logoutBtn').addEventListener('click', () => {
        alert('로그아웃 되었습니다.');
        window.location.href = '/admin_login';
        localStorage.removeItem('token'); // 토큰 삭제
        updateHeader(); // 헤더 업데이트
      });

    } else {
      headerContainer.innerHTML = `
        <nav class="navbar is-light">
          <div class="navbar-brand is-justify-content-space-between">
            <a class="navbar-item" href="/admin_order">
              <p>WINEHOUSE-ADMIN</p>
            </a>
            <div class="navbar-end">
              <div class="navbar-item">
                <a class="button" href="/admin_login" id="loginBtn"><strong>로그인</strong></a>
              </div>
            </div>
          </div>
        </nav>
      `;
    }
  };
  
  updateHeader();
});
