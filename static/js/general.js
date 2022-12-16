// Инициализация документа.
$(() => {
    initSpoilerHandlers();
    initFromHandlers();
});


// Инициализация слушателей спойлеров.
function initSpoilerHandlers() {
    var spoiler_handlers = Array.from($('.spoiler__handler'));      // Получение списка слушателей.

    spoiler_handlers.forEach(spoiler_handler => {                   // Перебор слушателей.
        $(spoiler_handler).click(() => {                            // Назначение события на слушатель.
            var spoiler = $(spoiler_handler).parent();              // Получение родителя слушателя.
            var spoiler__body = $(spoiler).find('.spoiler__body');  // Получение тела/контента спойлера.

            spoiler__body.slideToggle(100);                         // Плавное переключение видимости.
        });
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


function ajaxResponse(response) {
    if (!response || !response['status']) { return false }

    if (response['type'] == 'add_admin') {
        $('#admin-list').children('.card__body').append(`<div class="card__item item"><div class="item__title">${response['name']}</div></div>`)
    }
}


// function initContextMenu(selector) {
//     $(selector).contextmenu((event) => {
//         event.preventDefault();
//         var top = event.offsetY;
//         var left = event.offsetX;

//         $('.context').fadeIn(0);
//         var contextBodyWidth = $('.context__body').width();
//         var contextBodyHeight = $('.context__body').height();

//         top -= (contextBodyHeight / 2)
//         left -= (contextBodyWidth / 2)

//         $('.context__body').css('marginTop', `${top}px`);
//         $('.context__body').css('marginLeft', `${left}px`);

//         $('.context').click((event) => {
//             $('.context').fadeOut(0);
//         });
//     })
// }