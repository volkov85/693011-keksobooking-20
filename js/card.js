'use strict';

window.card = (function () {
  /**
   * Функция плюрализации для русского языка
   * @param {number} n - число, после которого нужно склонять существительное
   * @param {Array} forms - массив окончаний для склоняемого существительного
   * @return {string} - необходимое окончание для существительного
   */
  function pluralizeRus(n, forms) {
    var ending = '';
    if (n % 10 === 1 && n % 100 !== 11) {
      ending = forms[0];
    } else if (n % 10 >= 2 && n % 10 <= 4 && (n % 100 < 10 || n % 100 >= 20)) {
      ending = forms[1];
    } else {
      ending = forms[2];
    }
    return ending;
  }

  return {
    /**
     * Создание DOM элемента по шаблону #card на основе JS объекта
     * @param  {Array} card - массив объектов, содержащий полученные данные для карточки
     * @return {Object} cardElement - клон элемента map__card с содержимым из массива card
     */
    render: function (card) {
      var OfferType = {
        PALACE: 'Дворец',
        FLAT: 'Квартира',
        HOUSE: 'Дом',
        BUNGALO: 'Бунгало'
      };
      var cardTemplate = document.querySelector('#card')
      .content
      .querySelector('.map__card');
      var cardElement = cardTemplate.cloneNode(true);

      var elemFeatures = cardElement.querySelectorAll('.popup__feature');
      card.offer.features.forEach(function (item) {
        for (var i = 0; i < elemFeatures.length; i++) {
          if (elemFeatures[i].classList.contains('popup__feature--' + item)) {
            elemFeatures[i].classList.toggle('holdIt');
          }
        }
      });
      elemFeatures.forEach(function (item) {
        if (!item.classList.contains('holdIt')) {
          item.remove();
        } else {
          item.classList.remove('holdIt');
        }
      });

      var elemPhoto = cardElement.querySelector('.popup__photo');
      var elemPhotos = cardElement.querySelector('.popup__photos');
      if (card.offer.photos) {
        elemPhoto.src = card.offer.photos[0];
        if (card.offer.photos.length !== 1) {
          elemPhoto.src = card.offer.photos[0];
          for (var i = 1; i < card.offer.photos.length; i++) {
            var clonePhoto = elemPhoto.cloneNode(true);
            clonePhoto.src = card.offer.photos[i];
            elemPhotos.appendChild(clonePhoto);
          }
        }
      } else {
        elemPhoto.remove();
      }

      cardElement.querySelector('.popup__avatar').src = card.author.avatar;
      cardElement.querySelector('.popup__title').textContent = card.offer.title;
      cardElement.querySelector('.popup__text--address').textContent = card.offer.address;
      cardElement.querySelector('.popup__text--price').textContent = '';
      cardElement.querySelector('.popup__text--price').insertAdjacentHTML('beforeend', card.offer.price + '&#x20bd;<span>/ночь</span>');
      cardElement.querySelector('.popup__type').textContent = OfferType[card.offer.type];
      if (card.offer.rooms !== 0) {
        cardElement.querySelector('.popup__text--capacity').textContent = card.offer.rooms + ' комнат' + pluralizeRus(card.offer.rooms, ['а', 'ы', '']) + ' для ' + card.offer.guests + ' гост' + pluralizeRus(card.offer.guests, ['я', 'ей', 'ей']);
      } else {
        cardElement.querySelector('.popup__text--capacity').remove();
      }
      cardElement.querySelector('.popup__text--time').textContent = 'Заезд после ' + card.offer.checkin + ', выезд до ' + card.offer.checkout;
      cardElement.querySelector('.popup__description').textContent = card.offer.description;
      cardElement.style = 'visibility: hidden;';
      cardElement.setAttribute('data-index', card.index);
      return cardElement;
    }
  };
})();
