'use strict';

window.form = (function () {
  var OfferPrice = {
    PALACE: 10000,
    FLAT: 1000,
    HOUSE: 5000,
    BUNGALO: 0
  };
  var OFFER_CHECKIN_OUT = [
    '12:00',
    '13:00',
    '14:00'
  ];
  var RoomsMapper = {
    '1': ['1'],
    '2': ['1', '2'],
    '3': ['1', '2', '3'],
    '100': ['0']
  };

  /**
   * Синхронизация значений полей комнат и гостей
   * @param {Object} node - параметр либо node.value для стартовой синхронизации, либо node.target.value при изменении значения поля
   */
  var checkValidationRooms = function (node) {
    var inputCapacity = document.querySelector('#capacity');
    var capacity = document.querySelectorAll('#capacity > option');
    Object.keys(RoomsMapper).forEach(function (item) {
      if (item === node) {
        capacity.forEach(function (guest) {
          if (RoomsMapper[item].indexOf(guest.value) !== -1) {
            guest.removeAttribute('disabled');
            inputCapacity.value = (item === '100') ? RoomsMapper[item] : item;
          } else {
            guest.setAttribute('disabled', true);
          }
        });
      }
    });
  };

  /**
   * Синхронизация значений полей типа жилья и цены
   * @param {Object} node - параметр либо node.value для стартовой синхронизации, либо node.target.value при изменении значения поля
   */
  var checkValidationPrice = function (node) {
    var inputPrice = document.querySelector('#price');
    Object.keys(OfferPrice).forEach(function (item) {
      if (item.toLowerCase() === node) {
        inputPrice.placeholder = OfferPrice[item];
        inputPrice.min = OfferPrice[item];
      }
    });
  };

  /**
   * Синхронизация значений полей время заезда и выезда
   * @param {Object} node - параметр либо node.value для стартовой синхронизации, либо node.target.value при изменении значения поля
   * @param {boolean} flag - флаг, отвечающий за изменение времени заезда, либо времени выезда
   */
  var checkValidationTime = function (node, flag) {
    var inputTimeOut = document.querySelector('#timeout');
    var inputTimeIn = document.querySelector('#timein');
    OFFER_CHECKIN_OUT.forEach(function (item) {
      if (item === node) {
        if (flag) {
          inputTimeOut.value = item;
        } else {
          inputTimeIn.value = item;
        }
      }
    });
  };

  return {
    /**
     * Запускает валидацию либо при активации страницы, либо при изменении поля
     * @param {Object} node - поле, которое нужно валидировать
     * @param {boolean} submit - флаг для валидации либо при активации страницы, либо при изменении поля
     */
    setValidation: function (node, submit) {
      if (!submit) {
        checkValidationRooms(node.target.value);
        checkValidationPrice(node.target.value);
        if (document.activeElement.id === 'timein') {
          checkValidationTime(node.target.value, true);
        } else {
          checkValidationTime(node.target.value, false);
        }
      } else {
        checkValidationRooms(node.value);
        checkValidationPrice(node.value);
        checkValidationTime(node.value, true);
      }
    }
  };
})();
