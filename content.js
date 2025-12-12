// NektoMe Auto Search - Content Script
// Автоматически нажимает кнопку "Начать поиск собеседника" после завершения разговора

(function () {
    'use strict';

    let isEnabled = true;
    let checkInterval = null;
    const BUTTON_SELECTOR = 'button.callScreen__findBtn.btn.green.filled';
    const CHECK_DELAY = 1000; // Проверка каждую секунду
    const CLICK_DELAY = 500; // Задержка перед кликом (чтобы не было слишком быстро)

    // Загружаем состояние из storage
    function loadState() {
        chrome.storage.local.get(['autoSearchEnabled'], function (result) {
            isEnabled = result.autoSearchEnabled !== false; // По умолчанию включено
            console.log('[NektoMe Auto] Состояние загружено:', isEnabled ? 'включено' : 'выключено');
            if (isEnabled) {
                startWatching();
            }
        });
    }

    // Слушаем изменения настроек
    chrome.storage.onChanged.addListener(function (changes, namespace) {
        if (namespace === 'local' && changes.autoSearchEnabled) {
            isEnabled = changes.autoSearchEnabled.newValue;
            console.log('[NektoMe Auto] Состояние изменено:', isEnabled ? 'включено' : 'выключено');

            if (isEnabled) {
                startWatching();
            } else {
                stopWatching();
            }
        }
    });

    // Функция для поиска и клика по кнопке
    function findAndClickButton() {
        if (!isEnabled) return;

        const button = document.querySelector(BUTTON_SELECTOR);

        if (button && button.offsetParent !== null) {
            // Проверяем, что кнопка видима и содержит нужный текст
            const buttonText = button.textContent.trim();

            if (buttonText.includes('Начать поиск собеседника')) {
                console.log('[NektoMe Auto] Найдена кнопка поиска! Нажимаю через', CLICK_DELAY, 'мс...');

                setTimeout(() => {
                    if (isEnabled) {
                        button.click();
                        console.log('[NektoMe Auto] ✓ Кнопка нажата! Поиск начат.');
                    }
                }, CLICK_DELAY);
            }
        }
    }

    // Запуск отслеживания
    function startWatching() {
        if (checkInterval) return; // Уже запущено

        console.log('[NektoMe Auto] Начинаю отслеживание страницы...');

        // Периодическая проверка
        checkInterval = setInterval(findAndClickButton, CHECK_DELAY);

        // Также используем MutationObserver для более быстрой реакции
        const observer = new MutationObserver((mutations) => {
            if (isEnabled) {
                findAndClickButton();
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true,
            attributes: true,
            attributeFilter: ['class', 'style']
        });
    }

    // Остановка отслеживания
    function stopWatching() {
        if (checkInterval) {
            clearInterval(checkInterval);
            checkInterval = null;
            console.log('[NektoMe Auto] Отслеживание остановлено.');
        }
    }

    // Инициализация
    console.log('[NektoMe Auto] Расширение загружено на', window.location.href);
    loadState();
})();
