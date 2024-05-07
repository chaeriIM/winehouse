// 페이지 로드 시 실행
document.addEventListener('DOMContentLoaded', async function (event) {
    event.preventDefault();

    const token = localStorage.getItem('token');
    const userInfo = await fetchUserInfo(token);

    initializeUserInfo(userInfo);

    // 사용자 정보 수정 버튼 클릭 시
    const editProfileButton = document.getElementById('editProfileButton');
    editProfileButton.addEventListener('click', (event) => {
        event.preventDefault();
        // 사용자 정보 수정 함수 호출
        editProfile(userInfo, token);
        window.location.href = '/mypage';
    });

    // 사용자 탈퇴 버튼 클릭 시
    const withdrawButton = document.getElementById('withdrawButton');
    withdrawButton.addEventListener('click', () => {
        // 사용자 탈퇴 함수 호출
        withdraw(userInfo, token);
        window.location.href = '/';
    });
});

async function fetchUserInfo(token) {
    const apiUrl = '/user';

    try {
        console.log('token');
        if (!token) {
            // 토큰이 없으면 로그인 페이지로 이동
            window.location.href = '/login';
            return null;
        }

        const response = await fetch(apiUrl, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`, // 토큰 추가
            },
        });

        if (response.status === 200) {
            const userInfo = await response.json();
            document.getElementById('nameInput').value = userInfo.data.name;
            document.getElementById('emailInput').value = userInfo.data.email;
            document.getElementById('ageInput').value = userInfo.data.age;
            document.getElementById('telInput').value = userInfo.data.tel;
            document.getElementById('addressInput').value = userInfo.data.address;
            return userInfo; // 사용자 정보 반환
        } else {
            console.error(
                '사용자 정보를 가져오지 못했습니다. 상태 코드:',
                response.status
            );
            return null;
        }
    } catch (error) {
        console.error('에러:', error);
        return null;
    }
}

// 화면 초기화 예시
function initializeUserInfo(userInfo) {
    const nameInput = document.getElementById('nameInput');
    const emailInput = document.getElementById('emailInput');
    const phoneNumberInput = document.getElementById('telInput');
    const ageInput = document.getElementById('ageInput');
    const addressInput = document.getElementById('addressInput');

    nameInput.value = userInfo.data.name;
    emailInput.value = userInfo.data.email;
    phoneNumberInput.value = userInfo.data.tel;
    ageInput.value = userInfo.data.age;
    addressInput.value = userInfo.data.address;
}

// 사용자 정보 수정 함수
async function editProfile(userInfo, token) {
    const apiUrl = `/user`;

    const passwordInput = document.getElementById('passwordInput');
    const confirmPasswordInput = document.getElementById('confirmPasswordInput');
    const nameInput = document.getElementById('nameInput');
    const emailInput = document.getElementById('emailInput');
    const phoneNumberInput = document.getElementById('telInput');
    const ageInput = document.getElementById('ageInput');
    const addressInput = document.getElementById('addressInput');

    const passwordsMatch = passwordInput.value === confirmPasswordInput.value;
    const isValidName = /^[가-힣]+$/.test(nameInput.value);
    const isValidEmail = /^[a-z0-9]+@[a-z]+\.[a-z]{2,3}$/i.test(emailInput.value);
    const isValidPhoneNumber = /^01[0-9]-\d{4}-\d{4}$/.test(
        phoneNumberInput.value
    );
    const isNumericAge = /^\d+$/.test(ageInput.value);
    const passwordMismatch = passwordInput.value === confirmPasswordInput.value;

    if (!passwordsMatch || !passwordMismatch) {
        alert('비밀번호가 일치하지 않습니다. 다시 확인해주세요.');
        return;
    } else if (!isValidName) {
        alert('이름을 입력해주세요.');
        return;
    } else if (!isValidEmail) {
        alert('이메일 주소를 입력해주세요.');
        return;
    } else if (!isValidPhoneNumber) {
        alert('올바른 전화번호 형식을 입력해주세요.');
        return;
    } else if (!isNumericAge) {
        alert('나이는 숫자로만 입력해주세요.');
        return;
    }

    try {
        const response = await fetch(apiUrl, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
                name: nameInput.value,
                email: emailInput.value,
                password: passwordInput.value,
                address: addressInput.value, // 이부분은 필요에 따라 추가
                age: ageInput.value,
                tel: phoneNumberInput.value,
            }),
        });

        if (response.status === 200) {
            alert('수정이 완료되었습니다.');
        } else {
            alert('수정에 실패했습니다. 다시 시도해주세요.');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('서버와의 통신 중 오류가 발생했습니다.');
    }
}

// 사용자 탈퇴 함수
async function withdraw(userInfo, token) {
    const confirmWithdraw = confirm('정말로 탈퇴하시겠습니까?');
    if (confirmWithdraw) {
        const apiUrl = `/user`;

        try {
            const response = await fetch(apiUrl, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.status === 200) {
                localStorage.removeItem('token');
                alert('탈퇴가 완료되었습니다.');
            } else {
                alert('탈퇴에 실패했습니다. 다시 시도해주세요.');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('서버와의 통신 중 오류가 발생했습니다.');
        }
    }
}
