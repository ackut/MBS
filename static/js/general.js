// Инициализация документа.
$(() => {
    initSpoilerHandlers();
    initFromHandlers();
});


// Инициализация слушателей спойлеров.
function initSpoilerHandlers() {
    var spoiler_handlers = Array.from($('.spoiler__handler'));                          // Получение списка слушателей.

    spoiler_handlers.forEach(spoiler_handler => {                                       // Перебор слушателей.
        $(spoiler_handler).click((event) => {                                           // Назначение события на слушатель.
            var spoiler = $(spoiler_handler).parent();                                  // Получение родителя слушателя.
            var spoiler__body = $(spoiler).find('.spoiler__body');                      // Получение тела/контента спойлера.
            var spoiler_items = Array.from($(spoiler__body).children('.spoiler__item')) // Получение списка элементов спойлера.

            if (!spoiler_items.length) {                                                // Проверка существования элементов в теле спойлера.
                var clickOffset = [event.pageY, event.pageX];                           // Получение позиции курсора, относительно страницы.
                return displayHint(clickOffset, 'В этом блоке нет элементов');          // Отображение подсказки, если спойлер пустой.
            }
            spoiler__body.slideToggle(100);                                             // Если элементы есть, плавное переключение видимости.
        });
    });
}


// Отображение всплывающих подсказок.
function displayHint(offset, text) {
    $('#hint').remove();                    // Удаление существующих подсказок.
    var hint = $('<div id="hint"></div>')   // Создание элемента.
    hint.text(text);                        // Добавление текста к элементу.
    hint.css({                              // Присвоение элементу CSS свойств/стилей.
        display: 'none',
        position: 'absolute',
        top: `${offset[0]}px`,
        left: `${offset[1]}px`,
        width: 'fit-content',
        padding: '20px',
        borderRadius: '16px',
        backgroundColor: 'hsl(220, 10%, 25%)',
        fontSize: 'medium',
        fontWeight: '500'
    })
    $('body').append(hint);                             // Добавление элемента на страницу.
    $(hint).fadeIn(100).delay(800).fadeOut(100, () => { // Анимация появления/исчезания подсказки.
        $('#hint').remove();                            // Удаление подсказки, после исчезновения.
    });
}


// Инициализация AJAX форм.
function initFromHandlers() {
    var form_handlers = Array.from($('.form__handler'));                                        // Получение списка слушателей/кнопок форм.

    form_handlers.forEach(form_handler => {                                                     // Перебор слушателей.
        $(form_handler).click((event) => {                                                      // Назначение события на слушатель.
            var formData = {'type': $(form_handler).parent().attr('name')};                     // Переменнная для записи в неё данных с формы.
            var form_inputs = Array.from($(form_handler).parent().children('.form__input'));    // Получение полей формы.

            form_inputs.forEach(form_input => {                             // Перебор полей ввода.
                formData[$(form_input).attr('name')] = $(form_input).val(); // Запись имени и значения поля ввода.
                $(form_input).val('')                                       // Очистка полей формы.
            });

            $.ajax({                                // Отправка формы на сервер.
                type: 'get',                        // Тип запроса к серверу POST / GET.
                url: '',                            // Адрес, на который отправляется запрос. Если пусто - на страницу с формой.
                data: formData,                     // Переменная с данными формы.
                dataType: 'json',                   // Тип данных.
                contentType: 'application/json',    // Говорим серверу что запрос от нашего сайта.
                success: function (response) {      // Выполняется при успешной отправке.
                    ajaxResponse(response);         // Так как ajax не позволяет return, перекидываем результат в функцию.
                }
            });
        });
    });
}


// Обработка результата AJAX запроса.
function ajaxResponse(response) {
    if (!response || !response['status']) { return false }

    if (response['type'] == 'add_admin') {
        $('#admin-list').children('.card__body').append(`<div class="card__item item"><div class="item__title">${response['name']}</div></div>`)
    }
}