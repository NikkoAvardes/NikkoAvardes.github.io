// Получаем элементы
const modal = document.getElementById('addressModal');
const btn = document.getElementById('addressBtn');
const closeBtn = document.getElementById('closeAddress');

// Открыть модальное окно
btn.onclick = function(e) {
    e.preventDefault();
    modal.classList.add('show');
}

// Закрыть при клике на X
closeBtn.onclick = function() {
    modal.classList.remove('show');
}

// Закрыть при клике вне окна
window.onclick = function(event) {
    if (event.target == modal) {
        modal.classList.remove('show');
    }
    if (event.target == certificatesModal) {
        certificatesModal.classList.remove('show');
    }
    if (event.target == servicesModal) {
        servicesModal.classList.remove('show');
    }
    if (event.target == aboutModal) {
        aboutModal.classList.remove('show');
    }
}

// Модальное окно "Обо мне"
const aboutModal = document.getElementById('aboutModal');
const aboutBtn = document.getElementById('aboutBtn');
const closeAboutBtn = document.getElementById('closeAbout');

aboutBtn.onclick = function(e) {
    e.preventDefault();
    aboutModal.classList.add('show');
}

closeAboutBtn.onclick = function() {
    aboutModal.classList.remove('show');
}

// Модальное окно для услуг и стоимости
const servicesModal = document.getElementById('servicesModal');
const servicesBtn = document.getElementById('servicesBtn');
const closeServicesBtn = document.getElementById('closeServices');

servicesBtn.onclick = function(e) {
    e.preventDefault();
    servicesModal.classList.add('show');
}

closeServicesBtn.onclick = function() {
    servicesModal.classList.remove('show');
}

// Галерея сертификатов
const certificates = [
    './sertif/Alexandr certificat.jpg',
    './sertif/Certificat Alexandr.jpg',
    './sertif/Certificat Alexandre.jpg',
    './sertif/Certificat professionall.jpg'
];

let currentCertificate = 0;
const certificatesModal = document.getElementById('certificatesModal');
const certificatesBtn = document.getElementById('certificatesBtn');
const closeCertificatesBtn = document.getElementById('closeCertificates');
const certificateImg = document.getElementById('certificateImg');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const counter = document.getElementById('counter');

function updateCertificate() {
    certificateImg.src = certificates[currentCertificate];
    counter.textContent = `${currentCertificate + 1} / ${certificates.length}`;
    prevBtn.disabled = currentCertificate === 0;
    nextBtn.disabled = currentCertificate === certificates.length - 1;
}

certificatesBtn.onclick = function(e) {
    e.preventDefault();
    currentCertificate = 0;
    updateCertificate();
    certificatesModal.classList.add('show');
}

closeCertificatesBtn.onclick = function() {
    certificatesModal.classList.remove('show');
}

prevBtn.onclick = function() {
    if (currentCertificate > 0) {
        currentCertificate--;
        updateCertificate();
    }
}

nextBtn.onclick = function() {
    if (currentCertificate < certificates.length - 1) {
        currentCertificate++;
        updateCertificate();
    }
}

// Система отзывов с авторизацией через Яндекс
const reviewModal = document.getElementById('reviewModal');
const addReviewBtn = document.getElementById('addReviewBtn');
const closeReviewBtn = document.getElementById('closeReview');
const authSection = document.getElementById('authSection');
const reviewFormSection = document.getElementById('reviewFormSection');
const successMessage = document.getElementById('successMessage');
const yandexAuthBtn = document.getElementById('yandexAuthBtn');
const logoutBtn = document.getElementById('logoutBtn');
const reviewForm = document.getElementById('reviewForm');
const starRating = document.getElementById('starRating');
const ratingInput = document.getElementById('rating');

// Данные пользователя (сохраняются в localStorage)
let currentUser = JSON.parse(localStorage.getItem('yandexUser')) || null;

// Яндекс OAuth настройки (ЗАМЕНИТЕ на ваши реальные данные)
const YANDEX_CLIENT_ID = 'YOUR_YANDEX_CLIENT_ID'; // Получите на https://oauth.yandex.ru/
const REDIRECT_URI = window.location.origin + window.location.pathname;

// Открытие модального окна для отзыва
addReviewBtn.onclick = function(e) {
    e.preventDefault();
    reviewModal.classList.add('show');
    
    if (currentUser) {
        showReviewForm();
    } else {
        showAuthSection();
    }
}

closeReviewBtn.onclick = function() {
    reviewModal.classList.remove('show');
    resetModal();
}

// Авторизация через Яндекс
yandexAuthBtn.onclick = function() {
    // Для демонстрации - имитация авторизации
    // В реальности нужно использовать Яндекс OAuth API
    
    // Проверяем, если это демо-режим (без настроенного CLIENT_ID)
    if (YANDEX_CLIENT_ID === 'YOUR_YANDEX_CLIENT_ID') {
        // Демо-режим: просто запрашиваем имя
        const userName = prompt('Введите ваше имя для демонстрации:');
        if (userName && userName.trim()) {
            currentUser = {
                name: userName.trim(),
                id: 'demo_' + Date.now()
            };
            localStorage.setItem('yandexUser', JSON.stringify(currentUser));
            showReviewForm();
        }
    } else {
        // Реальная авторизация через Яндекс OAuth
        const authUrl = `https://oauth.yandex.ru/authorize?response_type=token&client_id=${YANDEX_CLIENT_ID}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}`;
        window.location.href = authUrl;
    }
}

// Проверка токена при загрузке страницы (для реального OAuth)
window.addEventListener('load', function() {
    const hash = window.location.hash.substring(1);
    const params = new URLSearchParams(hash);
    const accessToken = params.get('access_token');
    
    if (accessToken) {
        // Получаем информацию о пользователе от Яндекса
        fetch('https://login.yandex.ru/info', {
            headers: {
                'Authorization': `OAuth ${accessToken}`
            }
        })
        .then(response => response.json())
        .then(data => {
            currentUser = {
                name: data.real_name || data.display_name || 'Пользователь',
                id: data.id
            };
            localStorage.setItem('yandexUser', JSON.stringify(currentUser));
            window.location.hash = '';
        })
        .catch(error => {
            console.error('Ошибка получения данных пользователя:', error);
        });
    }
});

// Выход из аккаунта
logoutBtn.onclick = function() {
    currentUser = null;
    localStorage.removeItem('yandexUser');
    showAuthSection();
}

// Показать форму отзыва
function showReviewForm() {
    authSection.style.display = 'none';
    reviewFormSection.style.display = 'block';
    successMessage.style.display = 'none';
    
    document.getElementById('userName').textContent = currentUser.name;
    document.getElementById('userAvatar').textContent = currentUser.name.charAt(0).toUpperCase();
}

// Показать секцию авторизации
function showAuthSection() {
    authSection.style.display = 'block';
    reviewFormSection.style.display = 'none';
    successMessage.style.display = 'none';
}

// Сброс модального окна
function resetModal() {
    reviewForm.reset();
    ratingInput.value = '5';
    updateStars(5);
    successMessage.style.display = 'none';
}

// Рейтинг звёздами
let selectedRating = 5;
starRating.querySelectorAll('.star').forEach(star => {
    star.addEventListener('click', function() {
        selectedRating = parseInt(this.dataset.rating);
        ratingInput.value = selectedRating;
        updateStars(selectedRating);
    });
    
    star.addEventListener('mouseenter', function() {
        const hoverRating = parseInt(this.dataset.rating);
        updateStars(hoverRating);
    });
});

starRating.addEventListener('mouseleave', function() {
    updateStars(selectedRating);
});

function updateStars(rating) {
    starRating.querySelectorAll('.star').forEach((star, index) => {
        star.textContent = index < rating ? '★' : '☆';
    });
}

// Отправка формы отзыва
reviewForm.onsubmit = function(e) {
    e.preventDefault();
    
    const reviewText = document.getElementById('reviewText').value.trim();
    const rating = ratingInput.value;
    
    if (!reviewText) {
        alert('Пожалуйста, напишите отзыв');
        return;
    }
    
    // Создаём новый отзыв
    const newReview = {
        name: currentUser.name,
        rating: parseInt(rating),
        text: reviewText,
        date: new Date().toISOString()
    };
    
    // Сохраняем отзыв в localStorage
    let reviews = JSON.parse(localStorage.getItem('userReviews')) || [];
    reviews.unshift(newReview);
    localStorage.setItem('userReviews', JSON.stringify(reviews));
    
    // Добавляем отзыв на страницу
    addReviewToPage(newReview);
    
    // Показываем сообщение об успехе
    reviewFormSection.style.display = 'none';
    successMessage.style.display = 'block';
    
    // Закрываем модальное окно через 2 секунды
    setTimeout(() => {
        reviewModal.classList.remove('show');
        resetModal();
        if (currentUser) {
            showReviewForm();
        }
    }, 2000);
}

// Добавление отзыва на страницу
function addReviewToPage(review) {
    const reviewsSection = document.querySelector('.reviews-section');
    const addButton = document.getElementById('addReviewBtn');
    
    const reviewCard = document.createElement('div');
    reviewCard.className = 'review-card new-review';
    reviewCard.style.opacity = '0';
    reviewCard.style.animation = 'fadeInUp 0.5s ease-out forwards';
    
    const stars = '⭐'.repeat(review.rating);
    
    reviewCard.innerHTML = `
        <div class="review-header">
            <div class="review-avatar">${review.name.charAt(0).toUpperCase()}</div>
            <div class="review-info">
                <h3 class="review-name">${review.name}</h3>
                <div class="review-stars">${stars}</div>
            </div>
        </div>
        <p class="review-text">${review.text}</p>
    `;
    
    // Вставляем перед кнопкой "Оставить отзыв"
    reviewsSection.insertBefore(reviewCard, addButton);
}

// Загрузка сохранённых отзывов при загрузке страницы
window.addEventListener('DOMContentLoaded', function() {
    const savedReviews = JSON.parse(localStorage.getItem('userReviews')) || [];
    savedReviews.forEach(review => {
        addReviewToPage(review);
    });
});

// Закрытие модального окна отзыва при клике вне окна
window.addEventListener('click', function(event) {
    if (event.target == reviewModal) {
        reviewModal.classList.remove('show');
        resetModal();
    }
});
// Lightbox для галереи отзывов
document.addEventListener('DOMContentLoaded', function() {
    const lightbox = document.getElementById('reviewLightbox');
    const lightboxImage = document.getElementById('lightboxImage');
    const closeBtn = document.querySelector('.lightbox-close');
    const prevBtn = document.querySelector('.lightbox-prev');
    const nextBtn = document.querySelector('.lightbox-next');
    const reviewItems = document.querySelectorAll('.review-item img');
    
    let currentImageIndex = 0;
    const images = Array.from(reviewItems).map(img => img.src);
    
    // Открыть lightbox при клике на изображение
    reviewItems.forEach((img, index) => {
        img.addEventListener('click', function() {
            currentImageIndex = index;
            openLightbox(this.src);
        });
    });
    
    function openLightbox(src) {
        lightbox.style.display = 'flex';
        lightboxImage.src = src;
        document.body.style.overflow = 'hidden'; // Отключить прокрутку страницы
        
        // Анимация появления
        setTimeout(() => {
            lightbox.classList.add('active');
        }, 10);
    }
    
    function closeLightbox() {
        lightbox.classList.remove('active');
        document.body.style.overflow = ''; // Включить прокрутку страницы
        
        setTimeout(() => {
            lightbox.style.display = 'none';
        }, 300);
    }
    
    // Закрыть lightbox
    closeBtn.addEventListener('click', closeLightbox);
    
    // Закрыть при клике на фон
    lightbox.addEventListener('click', function(e) {
        if (e.target === lightbox) {
            closeLightbox();
        }
    });
    
    // Навигация - предыдущее изображение
    prevBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        currentImageIndex = (currentImageIndex - 1 + images.length) % images.length;
        lightboxImage.src = images[currentImageIndex];
    });
    
    // Навигация - следующее изображение
    nextBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        currentImageIndex = (currentImageIndex + 1) % images.length;
        lightboxImage.src = images[currentImageIndex];
    });
    
    // Клавиатурная навигация
    document.addEventListener('keydown', function(e) {
        if (lightbox.style.display === 'flex') {
            if (e.key === 'Escape') {
                closeLightbox();
            } else if (e.key === 'ArrowLeft') {
                prevBtn.click();
            } else if (e.key === 'ArrowRight') {
                nextBtn.click();
            }
        }
    });
    
    // Поддержка свайпов на мобильных устройствах
    let touchStartX = 0;
    let touchEndX = 0;
    
    lightboxImage.addEventListener('touchstart', function(e) {
        touchStartX = e.changedTouches[0].screenX;
    });
    
    lightboxImage.addEventListener('touchend', function(e) {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    });
    
    function handleSwipe() {
        if (touchEndX < touchStartX - 50) {
            // Свайп влево - следующее изображение
            nextBtn.click();
        }
        if (touchEndX > touchStartX + 50) {
            // Свайп вправо - предыдущее изображение
            prevBtn.click();
        }
    }
});