// Курс определяется параметром ?course= в ссылке — так один движок обслуживает все базы данных
const COURSE_DATA = {
    helpdesk: './data/helpdesk-lessons.json',
    operator: './data/operator-lessons.json',
    design: './data/design-lessons.json'
};

async function loadLesson() {
    // 1. Получаем курс и ID урока из ссылки (например, ?course=operator&id=1)
    const urlParams = new URLSearchParams(window.location.search);
    const course = urlParams.get('course') || 'helpdesk';
    const DATA_URL = COURSE_DATA[course] || COURSE_DATA.helpdesk;
    const lessonId = urlParams.get('id');

    if (!lessonId) {
        document.getElementById('lesson-content').innerHTML = "<p>Xəta: Dərs seçilməyib. Zəhmət olmasa kursun səhifəsindən dərsə keçid edin.</p>";
        document.getElementById('lesson-title').innerText = "Dərs tapılmadı";
        return;
    }

    try {
        // 2. Скачиваем нашу базу данных JSON
        const response = await fetch(DATA_URL);
        const lessons = await response.json();

        // 3. Ищем урок с нужным ID
        const currentLesson = lessons.find(lesson => lesson.id == lessonId);

        if (currentLesson) {
            // 4. Вставляем данные из JSON в наш HTML-каркас
            document.title = currentLesson.title + " | A.İbadov IT-Edu";
            document.getElementById('lesson-module').innerText = currentLesson.module;
            document.getElementById('lesson-title').innerText = currentLesson.title;
            document.getElementById('lesson-author').innerText = "Müəllif: " + currentLesson.author;
            document.getElementById('lesson-content').innerHTML = currentLesson.content;
        } else {
            // Если номер урока есть в ссылке, но его нет в базе
            document.getElementById('lesson-title').innerText = "Xəta 404";
            document.getElementById('lesson-content').innerHTML = "<p>Təəssüf ki, belə bir dərs bazada tapılmadı.</p>";
        }

    } catch (error) {
        console.error("Məlumat bazasına qoşulmada xəta:", error);
        document.getElementById('lesson-content').innerHTML = "<p>Xəta: Dərslər yüklənmədi. İnternet bağlantınızı yoxlayın və ya serverin işlədiyinə əmin olun.</p>";
    }
}

// Запускаем функцию при открытии страницы
loadLesson();