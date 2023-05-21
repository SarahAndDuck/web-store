// если элемента с ключем 'goods' не существует
if (!localStorage.getItem("goods")) {
  // JSON.stringify() возвращает JavaScript-значение, преобразованное в JSON-строку
  //   setItem - устанавливает новое значение для ключа "goods"
  localStorage.setItem("goods", JSON.stringify([]));
}
document
  .querySelector("button.add_new")
  .addEventListener("click", function (e) {
    // записываем в переменные значения из полей ввода
    let name = document.getElementById("good_name").value;
    let price = document.getElementById("good_price").value;
    let count = document.getElementById("good_count").value;
    // если значения существуют
    if (name && price && count) {
      // чистим поля ввода
      document.getElementById("good_name").value = "";
      document.getElementById("good_price").value = "";
      document.getElementById("good_count").value = "1";
      //   JSON.parse конвертирует в массив
      let goods = JSON.parse(localStorage.getItem("goods"));
      goods.push(["goods_" + goods.length, name, price, count, 0, 0, 0]);
      localStorage.setItem("goods", JSON.stringify(goods));
      //   update_goods

      //   скрыть модальное окно
      let myModal = new bootstrap.Modal(
        document.getElementById("exampleModal"),
        // обьект параметров, закрывает модальный элемент по нажатию ESC = false
        { keyboard: false }
      );
      //   hide () функция из bootstrap
      myModal.hide();
    }
    //
    else {
      Swal.fire({
        icon: "error",
        title: "Ошибка",
        text: "Пожалуйста заполните все поля!",
      });
    }
  });
