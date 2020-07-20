'use strict';

(function () {

  var Key = {
    ESC: 'Escape',
    ENTER: 'Enter'
  };
  var LEFT_MOUSE_BUTTON_CODE = 0;
  var DEFAULT_PIN_NUMBERS = 5;
  var DEFAULT_FILTER_VALUE = 'any';
  var DEFAULT_AVATAR_IMAGE = 'img/muffin-grey.svg';
  var FilterPrice = {
    MIN: 10000,
    MAX: 50000
  };
  var PriceValue = {
    LOW: 'low',
    HIGH: 'high',
    MIDDLE: 'middle'
  };
  var adForm = document.querySelector('.ad-form');
  var mapPinMain = document.querySelector('.map__pin--main');
  var defaultMainPinPosition = mapPinMain.style.cssText;
  var inputRoomNumber = document.querySelector('#room_number');
  var defaultInputRoomNumber = inputRoomNumber.value;
  var inputTimeIn = document.querySelector('#timein');
  var defaultInputTimeIn = inputTimeIn.value;
  var inputTimeOut = document.querySelector('#timeout');
  var defaultInputTimeOut = inputTimeOut.value;
  var inputRoomType = document.querySelector('#type');
  var defaultInputRoomType = inputRoomType.value;
  var inputHousingType = document.querySelector('#housing-type');
  var inputHousingPrice = document.querySelector('#housing-price');
  var inputHousingRooms = document.querySelector('#housing-rooms');
  var inputHousingGuests = document.querySelector('#housing-guests');
  var inputFeatures = document.querySelectorAll('input[name="features"]');

  /**
   * Акивирует страницу при клике левой кнопкой мыши
   * @param {Object} evt - Событие при клике мыши
   */
  var onMousePressActivate = function (evt) {
    if (evt.button === LEFT_MOUSE_BUTTON_CODE) {
      setActiveState(true);
    }
  };

  /**
   * Акивирует страницу при нажатии клавиши Enter
   * @param {Object} evt - Событие при нажатии клавиши
   */
  var onKeyPressActivate = function (evt) {
    if (evt.key === Key.ENTER) {
      setActiveState(true);
    }
  };

  /**
   * Вызывает функцию отправки данных на сервер
   * @param {Object} evt - событие submit
   */
  var onSubmitPress = function (evt) {
    window.backend.save(new FormData(adForm), function () {
      setActiveState(false);
      renderSuccessWindow();
    }, errorHandler);
    evt.preventDefault();
  };

  /**
   * Вызывает функцию сброса страницы в начальное состояние
   * @param {Object} evt - событие reset
   */
  var onResetPress = function () {
    setActiveState(false);
  };

  /**
   * Формирование и вывод сообщения об ошибке
   */
  var errorHandler = function () {
    renderErrorWindow();
  };

  /**
   * Закрытие окна успешной отправки или ошибки во время отправки данных
   * @param {boolean} flag - true - закрытие окна успешной отправки, false - закрытие окна с ошибкой
   */
  var closeEventPopup = function (flag) {
    if (flag) {
      document.querySelector('.success').remove();
      document.removeEventListener('keydown', onPopupDataEscPress);
    } else {
      document.querySelector('.error').remove();
      document.removeEventListener('keydown', onPopupDataEscPress);
    }
    document.removeEventListener('mousedown', onPopupMousePress);
  };

  /**
   * Проверка на клавишу ESC и запуск функции скрытия окна ошибки или окна успешной отправки
   * @param {Object} evt - нажатая клавиша
   */
  var onPopupDataEscPress = function (evt) {
    if (evt.key === Key.ESC && document.querySelector('.success') !== null) {
      evt.preventDefault();
      closeEventPopup(true);
    } else if (evt.key === Key.ESC && document.querySelector('.error') !== null) {
      closeEventPopup(false);
    }
  };

  /**
   * Проверка на левую кнопку мыши и запуск функции скрытия окна успешной отправки или ошибки
   * @param {Object} evt - нажатая кнопка мыши
   */
  var onPopupMousePress = function (evt) {
    if (evt.button === LEFT_MOUSE_BUTTON_CODE && document.querySelector('.success') !== null) {
      closeEventPopup(true);
    } else if (evt.button === LEFT_MOUSE_BUTTON_CODE && evt.target.classList.value !== 'error__message' && document.querySelector('.error') !== null) {
      closeEventPopup(false);
    }
  };

  /**
   * Вызов окна успешной отправки данных
   */
  var renderSuccessWindow = function () {
    var successWindowTemplate = document.querySelector('#success').content.querySelector('.success');
    var successWindowElement = successWindowTemplate.cloneNode(true);
    var main = document.querySelector('main');
    main.appendChild(successWindowElement);
    document.addEventListener('keydown', onPopupDataEscPress);
    document.addEventListener('mousedown', onPopupMousePress);
  };

  /**
   * Вызов окна ошибки отправки данных
   */
  var renderErrorWindow = function () {
    var errorWindowTemplate = document.querySelector('#error').content.querySelector('.error');
    var errorWindowElement = errorWindowTemplate.cloneNode(true);
    var main = document.querySelector('main');
    main.appendChild(errorWindowElement);
    var errorButton = document.querySelector('.error__button');
    errorButton.addEventListener('mousedown', function (evt) {
      if (evt.button === LEFT_MOUSE_BUTTON_CODE) {
        document.querySelector('.error').remove();
        document.removeEventListener('mousedown', onPopupMousePress);
        document.removeEventListener('keydown', onPopupDataEscPress);
      }
    });
    document.addEventListener('keydown', onPopupDataEscPress);
    document.addEventListener('mousedown', onPopupMousePress);
  };

  /**
   * Вызов и удаление событий карточки и пинов
   */
  var popupEvents = function () {
    var mapCards = document.querySelectorAll('.map__card');
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
      if (evt.key === Key.ESC) {
        evt.preventDefault();
        closePopup(mapCards);
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
        if (evt.button === LEFT_MOUSE_BUTTON_CODE) {
          closePopup(mapCards);
        }
      });
      popup.addEventListener('keydown', function (evt) {
        if (evt.key === Key.ENTER) {
          closePopup(mapCards);
        }
      });
    });

    pins.forEach(function (pin) {
      pin.addEventListener('mousedown', function (evt) {
        if (evt.button === LEFT_MOUSE_BUTTON_CODE) {
          openPopup(mapCards, evt);
        }
      });
      pin.addEventListener('keydown', function (evt) {
        if (evt.key === Key.ENTER) {
          openPopup(mapCards, evt);
        }
      });
    });
  };

  /**
   * Возвращает булевское значение для передачи в метод filter()
   * @param {Object} items - объекты, которые нужно отфильтровать
   * @return {boolean} - результат фильтрации
   */
  var getCheckedFilters = function (items) {
    var filterType = true;
    var filterPrice = true;
    var filterRooms = true;
    var filterGuests = true;
    var filterFeatures = true;

    if (inputHousingType.value !== DEFAULT_FILTER_VALUE) {
      filterType = items.offer.type === inputHousingType.value;
    }

    if (inputHousingPrice.value !== DEFAULT_FILTER_VALUE) {
      var selectedPrice;
      if (items.offer.price <= FilterPrice.MAX && items.offer.price >= FilterPrice.MIN) {
        selectedPrice = PriceValue.MIDDLE;
      } else if (items.offer.price < FilterPrice.MIN) {
        selectedPrice = PriceValue.LOW;
      } else {
        selectedPrice = PriceValue.HIGH;
      }
      filterPrice = selectedPrice === inputHousingPrice.value;
    }

    if (inputHousingRooms.value !== DEFAULT_FILTER_VALUE) {
      filterRooms = items.offer.rooms.toString() === inputHousingRooms.value;
    }

    if (inputHousingGuests.value !== DEFAULT_FILTER_VALUE) {
      filterGuests = items.offer.guests.toString() === inputHousingGuests.value;
    }

    var checkedFeatures = document.querySelectorAll('input[name="features"]:checked');
    if (checkedFeatures.length) {
      checkedFeatures.forEach(function (item) {
        if (items.offer.features.indexOf(item.value) === -1) {
          filterFeatures = false;
        }
      });
    }

    return filterType && filterPrice && filterRooms && filterGuests && filterFeatures;
  };

  /**
   * Заполнение DOM-элементами при успешном получении данных
   * @param  {Array} cards - массив, содержащий загруженные данные
   */
  var successHandler = function (cards) {
    var inputFilters = document.querySelector('.map__filters');

    window.map.pushCardsPins(cards.slice(0, DEFAULT_PIN_NUMBERS));
    popupEvents();
    inputFilters.addEventListener('change', window.debounce(function () {
      window.map.pushCardsPins(cards.filter(getCheckedFilters).slice(0, DEFAULT_PIN_NUMBERS));
      popupEvents();
    }));
  };

  /**
   * Переключает страницу из неактивного состояния в активное и наоборот
   * @param  {boolean} flag - true - активировать страницу, false - деактивировать
   */
  var setActiveState = function (flag) {
    var map = document.querySelector('.map');
    var mapFilter = document.querySelectorAll('.map__filter');
    var mapFeatures = document.querySelector('.map__features');
    var adFormHeader = document.querySelector('.ad-form-header');
    var adFormElement = document.querySelectorAll('.ad-form__element');
    var inputAddress = document.querySelector('#address');
    var inputTitle = document.querySelector('#title');
    var inputPrice = document.querySelector('#price');
    var inputDescription = document.querySelector('#description');
    var inputCheckbox = document.querySelectorAll('.feature__checkbox');
    var previewAvatar = document.querySelector('.ad-form-header__preview img');
    var previewPhoto = document.querySelector('.ad-form__photo');

    if (flag) {
      window.backend.load(successHandler, errorHandler);

      window.form.setValidation(inputRoomNumber, true);
      window.form.setValidation(inputRoomType, true);

      map.classList.remove('map--faded');
      adForm.classList.remove('ad-form--disabled');
      mapFeatures.removeAttribute('disabled');
      adFormHeader.removeAttribute('disabled');
      inputAddress.value = window.pin.getMainPinPositionX(mapPinMain) + ', ' + window.pin.getMainPinPositionY(mapPinMain);
      mapFilter.forEach(function (item) {
        item.removeAttribute('disabled');
      });
      adFormElement.forEach(function (item) {
        item.removeAttribute('disabled');
      });
      inputAddress.setAttribute('readonly', 'true');
      mapPinMain.removeEventListener('mousedown', onMousePressActivate);
      mapPinMain.removeEventListener('keydown', onKeyPressActivate);
      mapPinMain.addEventListener('mousedown', window.move.onPinMouseMove);
      inputRoomNumber.addEventListener('change', window.form.setValidation);
      inputRoomType.addEventListener('change', window.form.setValidation);
      inputTimeIn.addEventListener('change', window.form.setValidation);
      inputTimeOut.addEventListener('change', window.form.setValidation);

      adForm.addEventListener('submit', onSubmitPress);
      adForm.addEventListener('reset', onResetPress);
    } else {
      inputHousingType.value = DEFAULT_FILTER_VALUE;
      inputHousingPrice.value = DEFAULT_FILTER_VALUE;
      inputHousingRooms.value = DEFAULT_FILTER_VALUE;
      inputHousingGuests.value = DEFAULT_FILTER_VALUE;
      inputFeatures.forEach(function (item) {
        item.checked = false;
      });
      previewPhoto.style = '';
      previewAvatar.src = DEFAULT_AVATAR_IMAGE;
      inputTitle.value = '';
      inputPrice.value = '';
      inputDescription.value = '';
      mapPinMain.style.cssText = defaultMainPinPosition;
      inputRoomNumber.value = defaultInputRoomNumber;
      inputRoomType.value = defaultInputRoomType;
      inputTimeIn.value = defaultInputTimeIn;
      inputTimeOut.value = defaultInputTimeOut;
      map.classList.add('map--faded');
      adForm.classList.add('ad-form--disabled');
      mapFeatures.setAttribute('disabled', 'true');
      adFormHeader.setAttribute('disabled', 'true');
      inputAddress.value = window.pin.getMainPinPositionX(mapPinMain) + ', ' + window.pin.getMainPinNoneAtiveY(mapPinMain);
      inputCheckbox.forEach(function (item) {
        item.checked = false;
      });
      mapFilter.forEach(function (item) {
        item.setAttribute('disabled', 'true');
      });
      adFormElement.forEach(function (item) {
        item.setAttribute('disabled', 'true');
      });
      var pins = document.querySelectorAll('.map__pin--main ~ .map__pin');
      pins.forEach(function (item) {
        item.remove();
      });
      var cards = document.querySelectorAll('.map__card');
      cards.forEach(function (item) {
        item.remove();
      });
      window.form.setValidation(inputRoomNumber, true);
      window.form.setValidation(inputRoomType, true);
      mapPinMain.removeEventListener('mousedown', window.move.onPinMouseMove);
      mapPinMain.addEventListener('mousedown', onMousePressActivate);
      mapPinMain.addEventListener('keydown', onKeyPressActivate);
      adForm.removeEventListener('submit', onSubmitPress);
      adForm.removeEventListener('reset', onResetPress);
    }
  };

  setActiveState(false);
})();
