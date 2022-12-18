// Инициализация документа.
$(() => {
    initSpoilerHandlers();
    initFormHandlers();
    initModalMenuHandlers();
});


// Инициализация слушателей спойлеров.
// Добавить класс "spoiler__handler" на слушатель.
// Добавить класс "spoiler__body" на тело спойлера.
// Добавить класс "spoiler__item" на каждый элемент спойлера.
function initSpoilerHandlers() {
    var spoiler_handlers = Array.from($('.spoiler__handler'));                          // Получение списка слушателей.

    spoiler_handlers.forEach(spoiler_handler => {                                       // Перебор слушателей.
        $(spoiler_handler).click((event) => {                                           // Назначение события на слушатель.
            var spoiler = $(spoiler_handler).parent();                                  // Получение родителя слушателя.
            var spoiler__body = $(spoiler).find('.spoiler__body');                      // Получение тела/контента спойлера.
            var spoiler_items = Array.from($(spoiler__body).find('.spoiler__item')) // Получение списка элементов спойлера.

            if (!spoiler_items.length) {                                                // Проверка существования элементов в теле спойлера.
                var clickOffset = [event.pageY, event.pageX];                           // Получение позиции курсора, относительно страницы.
                return displayHint(clickOffset, 800, 'В этом блоке нет элементов');     // Отображение подсказки, если спойлер пустой.
            }
            spoiler__body.slideToggle(100);                                             // Если элементы есть, плавное переключение видимости.
        });
    });
}


// Отображение всплывающих подсказок.
function displayHint(offset, delay, text) {
    $('.hint').remove();                        // Удаление существующих подсказок.
    var hint = $('<div class="hint"></div>')    // Создание элемента.

    hint.text(text);                            // Добавление текста к элементу.
    hint.css({                                  // Назначение позиции элемента, относительно курсору.
        top: `${offset[0]}px`,
        left: `${offset[1]}px`
    })

    $('body').append(hint);                                 // Добавление элемента на страницу.
    if (!delay) { delay = 300000 }
    $(hint).fadeIn(100).delay(delay).fadeOut(100, () => {   // Анимация появления/исчезания подсказки.
        $('.hint').remove();                                // Удаление подсказки, после исчезновения.
    });

    $(hint).click(() => {
        $(hint).remove();
    });
}


// Инициализация AJAX форм.
// Добавить класс "form__handler" на кнопку отправки формы.
// Добавить класс "form__input" на поля формы.
// Добавить аттрибут "name" с типами данных, на поля формы. Данный аттрибут служит ключём словаря.
function initFormHandlers() {
    var form_handlers = Array.from($('.form__handler'));                        // Получение списка слушателей/кнопок форм.

    form_handlers.forEach(form_handler => {                                     // Перебор слушателей.
        $(form_handler).click((event) => {                                      // Назначение события на слушатель.
            var form = $($(form_handler).parent());                             // Получение формы.
            var formData = {'type': form.attr('name')};                         // Переменнная для записи в неё данных с формы.
            var form_inputs = Array.from(form.children('.form__input'));        // Получение полей формы.

            form_inputs.forEach(form_input => {                                 // Перебор полей ввода.
                formData[$(form_input).attr('name')] = $(form_input).val();     // Запись имени и значения поля ввода.
                $(form_input).val('')                                           // Очистка полей формы.
            });
            
            ajaxSend('get', '', formData); // Отправка формы на сервер.
        });
    });
}


// Отправка AJAX запроса на сервер.
function ajaxSend(type, url, data) {
    $.ajax({                                // Отправка запроса на сервер.
        type: type,                         // Тип запроса к серверу POST / GET.
        url: url,                           // Адрес, на который отправляется запрос. Если пусто - на страницу с формой.
        data: data,                         // Переменная с данными формы.
        dataType: 'json',                   // Тип данных.
        contentType: 'application/json',    // Говорим серверу что запрос от нашего сайта.
        success: function (response) {      // Выполняется при успешной отправке.
            ajaxHandler(response);          // Так как ajax не позволяет return, перекидываем результат в функцию.
        }
    });
}


// Обработка результата AJAX запроса.
function ajaxHandler(response) {
    if (!response) { return false }

    if (response['type'] == 'admin') {
        if (response['action'] == 'add') {
            return $('.card__body#admin-list').append(`
            <div class="card__item item">
                <span id="user-id" hidden>{{ user.id }}</span>
                <div class="item__title">${response['name']}</div>
            </div>`);
        }
    }

    console.log('Exception: ' + response.exception);
}


// Инициализация слушателей модальных окон.
function initModalMenuHandlers() {
    var modal_menu_handlers = Array.from($('.modal-menu__handler'));                // Получение слушателей модальных окон.

    modal_menu_handlers.forEach(modal_menu_handler => {                             // Перебор модальных окон.
        $(modal_menu_handler).click((event) => {                                    // Событие при клике на слушатель.
            event.stopPropagation();                                                // Остановка клика, если он был по дочернему элементу.
            var modal_menu = $(`.modal-menu#${$(modal_menu_handler).attr('id')}`);  // Получение модального окна.

            composeModalMenuContent(modal_menu);
            
            $(modal_menu).appendTo($('body'));                                      // Перемещение модального окна в body.
            $(modal_menu).fadeIn(100);                                              // Плавное отображение.
            $(modal_menu).css({                                                     // Назначение стилей.
                display: 'flex',
                flexDirection: 'column'
            });

            $(modal_menu).click((event) => {                                        // Событие при клике на модальное окно.
                if (event.target.className == $(modal_menu).attr('class')) {        // Если клик был именно по модальному окну.
                    return $(modal_menu).fadeOut(100);                              // Скрываем модальное окно.
                }
            });
        });
    });
}


function getUser(user_id) {
    ajaxSend('get', '', {'type': 'get_user', 'user_id': user_id});
}


function composeModalMenuContent(modal_menu) {
    var user_id = $($(modal_menu).find('#user-id'))
    var user_info__name = Array.from($(modal_menu).find('#user-info__name'));
    var user_info__login = Array.from($(modal_menu).find('#user-info__login'));

    user_info__name.forEach(name => { $(name).val('name asd'); });
    user_info__login.forEach(login => { $(login).val('login asd'); });
}

// 
// function initItemHandlers() {
// 
// }