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
};

// Lightbox для галереи отзывов
(function initReviewLightbox() {
    // Ждем полной загрузки страницы
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initReviewLightbox);
        return;
    }
    
    console.log('Инициализация lightbox для отзывов');
    
    const lightbox = document.getElementById('reviewLightbox');
    const lightboxImage = document.getElementById('lightboxImage');
    const closeBtn = document.querySelector('.lightbox-close');
    const prevBtn = document.querySelector('.lightbox-prev');
    const nextBtn = document.querySelector('.lightbox-next');
    const reviewItems = document.querySelectorAll('.review-item img');
    
    console.log('Найдено изображений отзывов:', reviewItems.length);
    console.log('Lightbox элемент:', lightbox ? 'найден' : 'не найден');
    
    if (!lightbox || !lightboxImage || !closeBtn || !prevBtn || !nextBtn) {
        console.error('Не найдены элементы lightbox');
        return;
    }
    
    if (reviewItems.length === 0) {
        console.error('Не найдены изображения отзывов');
        return;
    }
    
    let currentImageIndex = 0;
    const images = Array.from(reviewItems).map(img => img.src);
    
    console.log('Загружено изображений:', images.length);
    
    // Открыть lightbox при клике на изображение
    reviewItems.forEach((img, index) => {
        img.style.cursor = 'pointer';
        img.addEventListener('click', function(e) {
            console.log('Клик по изображению', index);
            e.preventDefault();
            e.stopPropagation();
            currentImageIndex = index;
            openLightbox(this.src);
        });
    });
    
    function openLightbox(src) {
        console.log('Открытие lightbox с изображением:', src);
        lightbox.style.display = 'flex';
        lightboxImage.src = src;
        document.body.style.overflow = 'hidden';
        
        setTimeout(() => {
            lightbox.classList.add('active');
        }, 10);
    }
    
    function closeLightbox() {
        console.log('Закрытие lightbox');
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
        
        setTimeout(() => {
            lightbox.style.display = 'none';
        }, 300);
    }
    
    // Закрыть lightbox
    closeBtn.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        closeLightbox();
    });
    
    // Закрыть при клике на фон
    lightbox.addEventListener('click', function(e) {
        if (e.target === lightbox) {
            closeLightbox();
        }
    });
    
    // Навигация - предыдущее изображение
    prevBtn.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        currentImageIndex = (currentImageIndex - 1 + images.length) % images.length;
        lightboxImage.src = images[currentImageIndex];
    });
    
    // Навигация - следующее изображение
    nextBtn.addEventListener('click', function(e) {
        e.preventDefault();
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
            nextBtn.click();
        }
        if (touchEndX > touchStartX + 50) {
            prevBtn.click();
        }
    }
})();