// функция сортировки таблицы
function sortTable(colNum, type, id) {
  let elem = document.getElementById(id);
  let tbody = elem.querySelector("tbody");
  //   содержимое таблица в массив
  let rowsArray = Array.from(tbody.rows);
  //   переменная для хранения функции
  console.log("rowsArray", rowsArray);
  let compare;
  switch (type) {
    case "number":
      compare = function (rowA, rowB) {
        return rowA.cells[colNum].innerHTML - rowB.cells[colNum].innerHTML;
      };
      break;
    case "string":
      compare = function (rowA, rowB) {
        return rowA.cells[colNum].innerHTML > rowB.cells[colNum].innerHTML
          ? 1
          : -1;
      };
      break;
  }
  rowsArray.sort(compare);
  tbody.append(...rowsArray);
}
// сортировать первую таблицу
table1.onclick = function (e) {
  if (e.target.tagName != "TH") return;
  let th = e.target;
  sortTable(th.cellIndex, th.dataset.type, "table1");
};
// сортировать вторую таблицу
table2.onclick = function (e) {
  if (e.target.tagName != "TH") return;
  let th = e.target;
  sortTable(th.cellIndex, th.dataset.type, "table2");
};
// для работы библиотеки list -  для поиска
let options = {
  valueNames: ["name", "price"],
};
let userList;
// создание модального окна
let myModal = new bootstrap.Modal(
  document.getElementById("exampleModal"),
  // обьект параметров, закрывает модальный элемент по нажатию ESC = false
  { keyboard: false }
);
console.log("myModal", myModal);

// если элемента с ключем 'goods' не существует
if (!localStorage.getItem("goods")) {
  // JSON.stringify() возвращает JavaScript-значение, преобразованное в JSON-строку
  //   setItem - устанавливает новое значение для ключа "goods"
  localStorage.setItem("goods", JSON.stringify([]));
}
// нажатие на кнопку добавить
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

      //   заполняется графический интерфейс
      update_goods();

      //   скрыть модальное окно
      //   hide () функция из bootstrap
      myModal.hide();
    }
    // иначе сообщение об ошибке, используем библиотеку "Sweet Alert 2"
    else {
      Swal.fire({
        icon: "error",
        title: "Ошибка",
        text: "Пожалуйста заполните все поля!",
      });
    }
  });
//  при обновлении страници заполняется графический интерфейс
update_goods();

// функция заполнения таблиц в интерфейсе приложения
function update_goods() {
  let result_price = 0;
  let tbody = document.querySelector(".list");
  tbody.innerHTML = "";
  document.querySelector(".cart").innerHTML = "";
  let goods = JSON.parse(localStorage.getItem("goods"));
  //   если есть хотябы один элемент в массиве

  if (goods.length) {
    // id="table1" , можем обращаться к элементам если есть id
    table1.hidden = false;
    // id="table2"
    table2.hidden = false;

    for (let i = 0; i < goods.length; i++) {
      tbody.insertAdjacentHTML(
        "beforeend",
        `
        <tr class='alline-middle'>
        <td>${i + 1}</td>
        <td class='name'>${goods[i][1]}</td>
        <td class='price'>${goods[i][2]}</td>
        <td >${goods[i][3]}</td>
        <td ><button class="good_delete btn btn-danger" data-delete="${
          goods[i][0]
        }">&#10006;</button></td>
        <td ><button class="good_delete btn btn-primary" data-goods="${
          goods[i][0]
        }">&#10149;</button></td>
      </tr>
      `
      );
      // goods[i][3] - количество товаров в магазине
      // goods[i][4] - количество товаров в корзине
      // goods[i][2] - цена
      // goods[i][6] - цена с учетом скидки
      // goods[i][5] - размер скидки

      //   если количество товаров в корзине больше 0
      if (goods[i][4] > 0) {
        goods[i][6] =
          goods[i][4] * goods[i][2] -
          goods[i][4] * goods[i][2] * goods[i][5] * 0.01;
        //   итоговая цена
        result_price += goods[i][6];
        document.querySelector(".cart").insertAdjacentHTML(
          "beforeend",
          `
        <tr class='alline-middle'>
        <td>${i + 1}</td>
        <td class='price_name'>${goods[i][1]}</td>
        <td class='price_one'>${goods[i][2]}</td>
        <td class='price_count'>${goods[i][4]}</td>
        <td class='price_discount'><input data-goodid="${
          goods[i][0]
        }" type="text" value = "${goods[i][5]}" min="0' max="100"></td>
        <td>${goods[i][6]}</td>
        <td ><button class="good_delete btn btn-danger" data-delete="${
          goods[i][0]
        }">&#10006;</button></td>
              
      </tr>
              `
        );
      }
    }
    // для работы библиотеки list -  для поиска
    userList = new List("goods", options);
  } else {
    table1.hidden = true;
    table2.hidden = true;
  }
  document.querySelector(".price-result").innerHTML = result_price + " &#8381;";
}
// удалить из магазина товар
document.querySelector(".list").addEventListener("click", function (e) {
  // если клик был не по кнопки с атрибутом data-delete
  if (!e.target.dataset.delete) {
    return;
  }
  //  сообщение об ошибке, используем библиотеку "Sweet Alert 2"
  Swal.fire({
    title: "Are you sure?",
    text: "You won't be able to revert this!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes, delete it!",
  }).then((result) => {
    if (result.isConfirmed) {
      // goods массив товаров
      let goods = JSON.parse(localStorage.getItem("goods"));
      for (let i = 0; i < goods.length; i++) {
        // найти  товар для удаления в массиве
        if (goods[i][0] == e.target.dataset.delete) {
          // удалить  товар в массиве
          goods.splice(i, 1);
          //   записызаписать массив в хранилище
          localStorage.setItem("goods", JSON.stringify(goods));
          //   обновить интерфейс
          update_goods();
        }
      }
      Swal.fire("Deleted!", "Your file has been deleted.", "success");
    }
  });
});
// перенести товор в козину
document.querySelector(".list").addEventListener("click", function (e) {
  // если клик был не по кнопки с атрибутом data-delete
  if (!e.target.dataset.goods) {
    return;
  }
  let goods = JSON.parse(localStorage.getItem("goods"));
  for (let i = 0; i < goods.length; i++) {
    // найти  товар для перемещения  в корзину
    if (goods[i][3] > 0 && goods[i][0] == e.target.dataset.goods) {
      // в массиве товаров меняем количество товаров в магазине и в корзине
      goods[i].splice(3, 1, goods[i][3] - 1);
      goods[i].splice(4, 1, goods[i][4] + 1);
      localStorage.setItem("goods", JSON.stringify(goods));
      update_goods();
    }
  }
});

// удалить  товар из козину
document.querySelector(".cart").addEventListener("click", function (e) {
  // если клик был не по кнопки с атрибутом data-delete
  if (!e.target.dataset.delete) {
    return;
  }
  let goods = JSON.parse(localStorage.getItem("goods"));
  for (let i = 0; i < goods.length; i++) {
    // найти  товар для перемещения  в корзину
    if (goods[i][4] > 0 && goods[i][0] == e.target.dataset.delete) {
      // в массиве товаров меняем количество товаров в магазине и в корзине
      goods[i].splice(3, 1, goods[i][3] + 1);
      goods[i].splice(4, 1, goods[i][4] - 1);
      localStorage.setItem("goods", JSON.stringify(goods));
      update_goods();
    }
  }
});

document.querySelector(".cart").addEventListener("input", function (e) {
  if (!e.target.dataset.goodid) {
    return;
  }
  let goods = JSON.parse(localStorage.getItem("goods"));
  for (let i = 0; i < goods.length; i++) {
    if (goods[i][0] == e.target.dataset.goodid) {
      goods[i][5] = e.target.value;
      //   расчет скидки
      goods[i][6] =
        goods[i][4] * goods[i][2] -
        goods[i][4] * goods[i][2] * goods[i][5] * 0.01;
      localStorage.setItem("goods", JSON.stringify(goods));
      update_goods();

      //   для возврата фокуса
      let input = document.querySelector(`[data-goodid="${goods[i][0]}"]`);
      input.focus();
      input.selectionStart = input.value.length;
    }
  }
});
