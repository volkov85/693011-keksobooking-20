'use strict';

window.move = (function () {
  var MainPinSize = {
    WIDTH: 65,
    HEIGHT: 65,
    TRIANGLE_HEIGHT: 22
  };
  var MapSize = {
    WIDTH_MIN: 0,
    WIDTH_MAX: 1200,
    HEIGHT_MIN: 130,
    HEIGHT_MAX: 630
  };
  var mapPinMain = document.querySelector('.map__pin--main');
  var inputAddress = document.querySelector('#address');
  return {

    qqq: function (evt) {
      evt.preventDefault();
      var startCoords = {
        x: evt.clientX,
        y: evt.clientY
      };

      /**
       * Измененяет местоположение пина при движении мышью с зажатой клавишей
       * @param {Object} moveEvt событие при движении мышью
       */
      var onMouseMove = function (moveEvt) {
        moveEvt.preventDefault();

        var shift = {
          x: startCoords.x - moveEvt.clientX,
          y: startCoords.y - moveEvt.clientY
        };
        var currentX = window.pin.getMainPinPositionX(mapPinMain);
        var currentY = window.pin.getMainPinPositionY(mapPinMain);

        startCoords = {
          x: moveEvt.clientX,
          y: moveEvt.clientY
        };

        if (currentX > MapSize.WIDTH_MAX) {
          mapPinMain.style.left = (MapSize.WIDTH_MAX - Math.ceil(MainPinSize.WIDTH / 2)) + 'px';
        } else if (currentX < MapSize.WIDTH_MIN) {
          mapPinMain.style.left = (MapSize.WIDTH_MIN - Math.ceil(MainPinSize.WIDTH / 2)) + 'px';
        } else {
          mapPinMain.style.left = (mapPinMain.offsetLeft - shift.x) + 'px';
        }

        if (currentY > MapSize.HEIGHT_MAX) {
          mapPinMain.style.top = (MapSize.HEIGHT_MAX - MainPinSize.HEIGHT - MainPinSize.TRIANGLE_HEIGHT) + 'px';
        } else if (currentY < MapSize.HEIGHT_MIN) {
          mapPinMain.style.top = (MapSize.HEIGHT_MIN - MainPinSize.HEIGHT - MainPinSize.TRIANGLE_HEIGHT) + 'px';
        } else {
          mapPinMain.style.top = (mapPinMain.offsetTop - shift.y) + 'px';
        }

        inputAddress.value = currentX + ', ' + currentY;
      };

      /**
       * При отпускании клавиши мыши удаляет слушатели событий
       * @param {Object} upEvt событие при отпускании клавиши мыши
       */
      var onMouseUp = function (upEvt) {
        upEvt.preventDefault();
        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('mouseup', onMouseUp);
      };

      document.addEventListener('mousemove', onMouseMove);
      document.addEventListener('mouseup', onMouseUp);
    },
  };
})();
