$(() => {
    const spoiler_handlers = Array.from($('.spoiler__handler'));
    initSpoilerHandlers(spoiler_handlers);
});


// Инициализация слушателей спойлеров.
function initSpoilerHandlers(spoiler_handlers) {
    spoiler_handlers.forEach(spoiler_handler => {
        $(spoiler_handler).click(() => {
            var spoiler = $(spoiler_handler).parent();
            var spoiler__body = $(spoiler).find('.spoiler__body');
            spoiler__body.slideToggle(100);
        });
    });
}