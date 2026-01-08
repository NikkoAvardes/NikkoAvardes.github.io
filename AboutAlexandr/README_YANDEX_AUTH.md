# Настройка авторизации через Яндекс

## Текущее состояние
Система отзывов работает в **демо-режиме**. Пользователи могут вводить своё имя вручную для добавления отзывов.

## Для активации реальной авторизации через Яндекс:

### 1. Получите Client ID от Яндекса

1. Перейдите на [Яндекс OAuth](https://oauth.yandex.ru/)
2. Войдите в свой аккаунт Яндекса
3. Нажмите "Зарегистрировать новое приложение"
4. Заполните форму:
   - **Название**: Название вашего сайта (например, "Массаж Александр Игоревич")
   - **Платформа**: Веб-сервисы
   - **Redirect URI**: URL вашего сайта (например, `https://yourdomain.com/index.html`)
   - **Доступы**: Отметьте "Доступ к логину, имени и фамилии, полу"

### 2. Обновите код в script.js

Откройте файл `script.js` и найдите строку:
```javascript
const YANDEX_CLIENT_ID = 'YOUR_YANDEX_CLIENT_ID';
```

Замените `'YOUR_YANDEX_CLIENT_ID'` на полученный Client ID:
```javascript
const YANDEX_CLIENT_ID = 'ваш_реальный_client_id';
```

### 3. Настройте Redirect URI

Убедитесь, что `REDIRECT_URI` в `script.js` соответствует URL, указанному при регистрации приложения в Яндекс OAuth.

## Как работает демо-режим

В демо-режиме (пока `YANDEX_CLIENT_ID = 'YOUR_YANDEX_CLIENT_ID'`):
- При нажатии "Войти через Яндекс" появится простой prompt с запросом имени
- Введённое имя используется для отзыва
- Данные сохраняются в localStorage браузера
- Отзывы отображаются на странице

## Хранение данных

**Важно**: В текущей реализации отзывы хранятся только в localStorage браузера пользователя. 

Для реального использования рекомендуется:
- Создать backend-сервер (Node.js, PHP, Python и т.д.)
- Настроить базу данных для хранения отзывов
- Добавить API для отправки и получения отзывов
- Реализовать модерацию отзывов

## Пример backend интеграции (опционально)

### Node.js + Express пример:
```javascript
// В script.js замените сохранение в localStorage на:
fetch('/api/reviews', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify({
        name: currentUser.name,
        rating: rating,
        text: reviewText
    })
})
.then(response => response.json())
.then(data => {
    // Обработка успешного сохранения
})
```

### Простой PHP backend:
```php
<?php
// api/reviews.php
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);
    
    // Сохранение в базу данных
    // ... ваш код для MySQL/PostgreSQL
    
    echo json_encode(['success' => true]);
}
?>
```

## Безопасность

При настройке реального backend убедитесь:
- ✅ Валидация всех входящих данных
- ✅ Защита от XSS атак (экранирование HTML)
- ✅ Rate limiting для предотвращения спама
- ✅ HTTPS соединение
- ✅ CORS настройки

## Поддержка

Если у вас возникли вопросы по настройке, обратитесь к:
- [Документация Яндекс OAuth](https://yandex.ru/dev/oauth/doc/dg/concepts/about.html)
- [Документация Яндекс API](https://yandex.ru/dev/id/doc/ru/)
