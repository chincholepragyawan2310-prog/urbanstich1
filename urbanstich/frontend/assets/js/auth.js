// Auth State Management
let authToken = localStorage.getItem('authToken');
let currentUser = authToken ? JSON.parse(localStorage.getItem('currentUser')) : null;

export function getAuthToken() {
    return authToken;
}

export function getCurrentUser() {
    return currentUser;
}

export function setAuth(token, user) {
    authToken = token;
    currentUser = user;
    if (token) {
        localStorage.setItem('authToken', token);
        localStorage.setItem('currentUser', JSON.stringify(user));
    } else {
        localStorage.removeItem('authToken');
        localStorage.removeItem('currentUser');
    }
}

export function logout() {
    authToken = null;
    currentUser = null;
    localStorage.removeItem('authToken');
    localStorage.removeItem('currentUser');
}

export function updateAuthUI() {
    const loginButton = document.getElementById('loginButton');
    const userIcon = document.getElementById('userIcon');
    const userSection = document.querySelector('.user-section');
    
    if (currentUser && userSection) {
        const loginBtnParent = loginButton?.parentElement;
        if (loginBtnParent) loginBtnParent.classList.add('hidden');
        if (userIcon) {
            userIcon.classList.remove('hidden');
            userIcon.title = currentUser.name || currentUser.email;
            userIcon.onclick = (e) => {
                e.preventDefault();
                if (confirm('Do you want to logout?')) {
                    logout();
                    updateAuthUI();
                    alert('Logged out successfully!');
                }
            };
        }
    } else {
        const loginBtnParent = loginButton?.parentElement;
        if (loginBtnParent) loginBtnParent.classList.remove('hidden');
        if (userIcon) userIcon.classList.add('hidden');
    }
}

