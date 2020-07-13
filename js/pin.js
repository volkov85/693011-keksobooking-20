'use strict';

window.pin = (function () {
  var MainPinSize = {
    WIDTH: 65,
    HEIGHT: 65,
    TRIANGLE_HEIGHT: 22
  };

  return {
    /**
     * Создание DOM элемента по шаблону #pin на основе JS объекта
     * @param  {Array} card - массив объектов, содержащий полученные данные для пина
     * @return {Object} cardElement - клон элемента map__pin с содержимым из массива card
     */
    render: function (card) {
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
    },

    getMainPinPositionX: function (node) {
      var activeX = Math.round(Number(node.style.left.slice(0, node.style.left.length - 2)) + MainPinSize.WIDTH / 2);
      return activeX;
    },

    getMainPinPositionY: function (node) {
      var activeY = Math.round(Number(node.style.top.slice(0, node.style.top.length - 2)) + MainPinSize.HEIGHT + MainPinSize.TRIANGLE_HEIGHT);
      return activeY;
    },

    getMainPinNoneAtiveY: function (node) {
      var activeY = Math.round(Number(node.style.top.slice(0, node.style.top.length - 2)) - MainPinSize.HEIGHT / 2);
      return activeY;
    }
  };
})();
