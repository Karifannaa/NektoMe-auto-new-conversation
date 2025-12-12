// Popup script for NektoMe Auto Search

document.addEventListener('DOMContentLoaded', function () {
    const toggleSwitch = document.getElementById('toggleSwitch');
    const statusDiv = document.getElementById('status');

    // Загружаем текущее состояние
    chrome.storage.local.get(['autoSearchEnabled'], function (result) {
        const isEnabled = result.autoSearchEnabled !== false; // По умолчанию включено
        toggleSwitch.checked = isEnabled;
        updateStatus(isEnabled);
    });

    // Обработчик переключения
    toggleSwitch.addEventListener('change', function () {
        const isEnabled = toggleSwitch.checked;

        // Сохраняем состояние
        chrome.storage.local.set({ autoSearchEnabled: isEnabled }, function () {
            updateStatus(isEnabled);
            console.log('Авто-поиск:', isEnabled ? 'включён' : 'выключен');
        });
    });

    // Обновление статуса в UI
    function updateStatus(isEnabled) {
        if (isEnabled) {
            statusDiv.className = 'status active';
            statusDiv.textContent = '✓ Автопоиск включён';
        } else {
            statusDiv.className = 'status inactive';
            statusDiv.textContent = '✗ Автопоиск выключен';
        }
    }
});
