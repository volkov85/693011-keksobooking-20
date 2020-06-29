'use strict';

(function () {
  var ADVERTS_AMOUNT = 8;
  var MainPinSize = {
    WIDTH: 65,
    HEIGHT: 65,
    TRIANGLE_HEIGHT: 22
  };

  /**
   * Акивирует страницу при клике левой кнопкой мыши
   * @param {Object} evt - Событие при клике мыши
   */
  var onMousePressActivate = function (evt) {
    if (evt.button === 0) {
      setActiveState(true);
    }
  };

  /**
   * Акивирует страницу при нажатии клавиши Enter
   * @param {Object} evt - Событие при нажатии клавиши
   */
  var onKeyPressActivate = function (evt) {
    if (evt.key === 'Enter') {
      setActiveState(true);
    }
  };

  /**
   * Переключает страницу из неактивного состояния в активное и наоборот
   * @param  {boolean} flag - true - активировать страницу, false - деактивировать
   */
  var setActiveState = function (flag) {
    var map = document.querySelector('.map');
    var adForm = document.querySelector('.ad-form');
    var mapFilter = document.querySelectorAll('.map__filter');
    var mapFeatures = document.querySelector('.map__features');
    var adFormHeader = document.querySelector('.ad-form-header');
    var adFormElement = document.querySelectorAll('.ad-form__element');
    var mapPinMain = document.querySelector('.map__pin--main');
    var inputAddress = document.querySelector('#address');
    var activeX = Math.round(Number(mapPinMain.style.left.slice(0, mapPinMain.style.left.length - 2)) + MainPinSize.WIDTH / 2);
    var activeY = Math.round(Number(mapPinMain.style.top.slice(0, mapPinMain.style.top.length - 2)) + MainPinSize.TRIANGLE_HEIGHT);
    var noneActiveY = Math.round(Number(mapPinMain.style.top.slice(0, mapPinMain.style.top.length - 2)) - MainPinSize.HEIGHT / 2);
    var inputRoomNumber = document.querySelector('#room_number');
    var inputRoomType = document.querySelector('#type');
    var inputTimeIn = document.querySelector('#timein');
    var inputTimeOut = document.querySelector('#timeout');
    if (flag) {
      var adverts = window.data.generateAdverts(ADVERTS_AMOUNT);
      window.map.pushPins(adverts);
      window.form.setValidation(inputRoomNumber, true);
      window.form.setValidation(inputRoomType, true);
      window.form.setValidation(inputTimeIn, true);
      window.map.pushCard(adverts);

      var cards = document.querySelectorAll('.map__card');
      var popupClose = document.querySelectorAll('.popup__close');
      var pins = document.querySelectorAll('.map__pin--main ~ .map__pin');

      /**
       * Скрытие окна-попапа и удаление слушателя событий
       * @param {Object} items - коллекция всех карточек-попапов
       */
      var closePopup = function (items) {
        items.forEach(function (item) {
          if (item.style.visibility === 'visible') {
            item.style.visibility = 'hidden';
          }
        });
        document.removeEventListener('keydown', onPopupEscPress);
      };

      /**
       * Проверка на клавишу ESC и запуск функции скрытия окна
       * @param {Object} evt - нажатая клавиша
       */
      var onPopupEscPress = function (evt) {
        if (evt.key === 'Escape') {
          evt.preventDefault();
          closePopup(cards);
        }
      };

      /**
       * Поиск нужной карточки, открытие и запуск слушателя событий на ESC
       * @param {Object} items - коллекция всех карточек-попапов
       * @param {Object} evt - нажатый пин для сравнения индексов
       */
      var openPopup = function (items, evt) {
        items.forEach(function (item) {
          if (item.dataset.index === evt.target.dataset.index) {
            item.style.visibility = 'visible';
          } else {
            item.style.visibility = 'hidden';
          }
        });
        document.addEventListener('keydown', onPopupEscPress);
      };

      popupClose.forEach(function (popup) {
        popup.addEventListener('mousedown', function (evt) {
          if (evt.button === 0) {
            closePopup(cards);
          }
        });
        popup.addEventListener('keydown', function (evt) {
          if (evt.key === 'Enter') {
            closePopup(cards);
          }
        });
      });

      pins.forEach(function (pin) {
        pin.addEventListener('mousedown', function (evt) {
          if (evt.button === 0) {
            openPopup(cards, evt);
          }
        });
        pin.addEventListener('keydown', function (evt) {
          if (evt.key === 'Enter') {
            openPopup(cards, evt);
          }
        });
      });

      map.classList.remove('map--faded');
      adForm.classList.remove('ad-form--disabled');
      mapFeatures.removeAttribute('disabled');
      adFormHeader.removeAttribute('disabled');
      inputAddress.value = activeX + ', ' + activeY;
      mapFilter.forEach(function (item) {
        item.removeAttribute('disabled');
      });
      adFormElement.forEach(function (item) {
        item.removeAttribute('disabled');
      });
      inputAddress.setAttribute('readonly', true);
      mapPinMain.removeEventListener('mousedown', onMousePressActivate);
      mapPinMain.removeEventListener('keydown', onKeyPressActivate);
      inputRoomNumber.addEventListener('change', window.form.setValidation);
      inputRoomType.addEventListener('change', window.form.setValidation);
      inputTimeIn.addEventListener('change', window.form.setValidation);
      inputTimeOut.addEventListener('change', window.form.setValidation);
    } else {
      map.classList.add('map--faded');
      adForm.classList.add('ad-form--disabled');
      mapFeatures.setAttribute('disabled', true);
      adFormHeader.setAttribute('disabled', true);
      inputAddress.value = activeX + ', ' + noneActiveY;
      mapFilter.forEach(function (item) {
        item.setAttribute('disabled', true);
      });
      adFormElement.forEach(function (item) {
        item.setAttribute('disabled', true);
      });
      pins = document.querySelectorAll('.map__pin--main ~ .map__pin');
      pins.forEach(function (item) {
        item.remove();
      });
      cards = document.querySelectorAll('.map__card');
      cards.forEach(function (item) {
        item.remove();
      });
      mapPinMain.addEventListener('mousedown', onMousePressActivate);
      mapPinMain.addEventListener('keydown', onKeyPressActivate);
      document.removeEventListener('keydown', onPopupEscPress);
    }
  };

  setActiveState(false);
})();
