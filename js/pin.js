'use strict';

window.pin = (function () {
  return {
    /**
     * Создание DOM элемента по шаблону #pin на основе JS объекта
     * @param  {Array} card - массив объектов, содержащий сгенерированные данные для пина
     * @return {Object} cardElement - клон элемента map__pin с содержимым из массива card
     */
    renderPin: function (card) {
      var cardTemplate = document.querySelector('#pin')
      .content
      .querySelector('.map__pin');
      var cardElement = cardTemplate.cloneNode(true);
      cardElement.setAttribute('data-index', card.index);
      cardElement.style = 'left: ' + card.location.x + 'px; top: ' + card.location.y + 'px;';
      cardElement.children[0].src = card.author.avatar;
      cardElement.children[0].alt = card.offer.title;
      cardElement.children[0].setAttribute('data-index', card.index);
      return cardElement;
    }
  };
})();
