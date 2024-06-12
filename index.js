const basket = document.querySelector(".basket-items");
const productBlock = document.querySelector(".product-right-block");
const searchInput = document.querySelector(".src-input");
const elements = document.querySelectorAll("[data-lang]");
const selected = document.querySelector("#lang-select");
const basketInner = document.querySelector(".basket-inner");

let productsArr = null;
const fetchProductData = () => {
  return fetch("https://dummyjson.com/products/category/smartphones")
    .then((response) => {
      return response.json();
    })
    .then((responseData) => {
      productsArr = responseData.products;
      init();
    });
};
fetchProductData();
const init = () => {
  const basketArr = [];

  const language = {
    az: {
      ["filter-lang"]: "Filtrasiya",
    },
    en: {
      ["filter-lang"]: "Filtered",
    },
    ru: {
      ["filter-lang"]: "Фильтрация",
    },
  };
  selected.addEventListener("change", () => {
    const selectedLanguage = selected.value;
    localStorage.lang = selectedLanguage;
    elements.forEach((el) => {
      const dataLangValue = el.getAttribute("data-lang");
      el.textContent = language[selectedLanguage][dataLangValue];
    });
  });
  console.log(productsArr);
  document.addEventListener("click", (e) => {
    const target = e.target;
    if (target.closest(".product-item-basket-icon")) {
      addToBasket(target);
    }
    if (target.closest(".header-basket-icon")) {
      document.querySelector(".basket-inner").style.display = "flex";
    }
    if (target.closest(".basket-close")) {
      document.querySelector(".basket-inner").style.display = "none";
    }
    if (target.closest(".product-plus")) {
      plusProductCount(target);
    }
    if (target.closest(".product-minus")) {
      minusProductCount(target);
    }
    if (target.closest(".delete-item")) {
      deleteBasketItem(target);
    }
    document.addEventListener("keydown", (e) => {
      if (e.keyCode === 27) {
        document.querySelector(".basket-inner").style.display = "none";
      }
    });
    if (target.closest(".basket-inner") && !target.closest(".basket-window")) {
      document.querySelector(".basket-inner").style.display = "none";
    }
  });

  function renderItems(productsArr) {
    let itemBlock = "";
    productBlock.innerText = "";
    productsArr.forEach((i) => {
      itemBlock += `
      <div class="product-item" data-id="${i.id}">
      <img
        src="${i.thumbnail}"
        alt=""
      />
      <div class ="product-brand">${i.category}</div>
      <div class="product-name">
      ${i.title}
      </div>
      <div class="product-desc">
      ${i.description}
      </div>
      <div class="product-price">$${i.price}</div>
      <div class="product-func">
      <div class="product-num">
        <div class="product-minus">-</div>
        <div class="product-count">1</div>
        <div class="product-plus">+</div>
      </div>
      <img class="product-item-basket-icon" src="img/basket-svgrepo-com.svg" alt="" />
    </div>
  </div>
    </div>
      `;
    });
    productBlock.innerHTML = itemBlock;
  }

  function loadItem() {
    const loader = document.querySelector(".lds-dual-ring");
    setTimeout(() => {
      loader.style.display = "none";
      renderItems(productsArr);
    }, 1000);
  }
  loadItem();

  function addToBasket(target) {
    const productItem = target.closest(".product-item");
    const itemId = productItem.dataset.id;
    const productCount = parseInt(
      productItem.querySelector(".product-count").textContent
    );
    const product = productsArr.find((item) => {
      console.log("item.id", item.id);
      console.log("itemId", itemId);
      console.log("item.id === itemId", +item.id === +itemId);
      return +item.id === +itemId;
    });

    console.log("product", product);

    const basketItem = basketArr.find((item) => {
      return +item.id === +itemId;
    });
    if (basketItem) {
      basketItem.count += productCount;
    } else {
      const basketProduct = product;
      basketProduct.count = productCount;
      basketArr.push(basketProduct);
    }
    productItem.querySelector(".product-count").textContent = 1;
    renderBasket();
    totalPriceBlock();
    totalBasketCount();
    saveCartToLocalStorage();

    console.log(basketArr);
  }

  function renderBasket() {
    let basketDivItem = "";

    basket.innerText = "";
    basketArr.forEach((i) => {
      basketDivItem += `
      <div class="product-item" data-id="${i.id}">
      <img
        src="${i.thumbnail}"
        alt=""
      />
      <div class="product-brand">${i.brand}</div>
      <div class="product-name">
      ${i.title}
      </div>
      <div class="product-desc">
      ${i.description}
      </div>
      <div class="product-price">$${i.price}</div>
      <div class="product-total-price">$${i.price * i.count}</div>
      <div class="product-func">
      <div class="product-num">
        <div class="product-minus">-</div>
        <div class="product-count">${i.count}</div>
        <div class="product-plus">+</div>
      </div>
      <img class="delete-item" src="img/delete-svgrepo-com.svg" alt="" />
        </div>
      </div>
    </div>
      `;
    });
    basket.innerHTML = basketDivItem;
  }

  function plusProductCount(target) {
    const productNumDiv = target.closest(".product-num");
    const productCount = productNumDiv.querySelector(".product-count");

    let productNumber = +productCount.textContent;
    productNumber += 1;
    productCount.textContent = productNumber;

    const product = target.closest(".product-item");
    const productId = product.dataset.id;
    const basketItem = basketArr.find((item) => {
      return +item.id === +productId;
    });
    if (basketItem) {
      basketItem.count = productNumber;
      product.querySelector(".product-total-price").textContent = `${
        basketItem.price * basketItem.count
      }$`;
    }
    totalBasketCount();
    totalPriceBlock();
    saveCartToLocalStorage();
  }

  function minusProductCount(target) {
    const productNumDiv = target.closest(".product-num");
    const productCount = productNumDiv.querySelector(".product-count");

    let productNumber = +productCount.textContent;
    if (productNumber === 1 && target.closest(".basket-items")) {
      deleteBasketItem(target);
    }
    if (productNumber > 1) {
      productNumber -= 1;
      productCount.textContent = productNumber;

      const product = target.closest(".product-item");
      const productId = product.dataset.id;
      const basketItem = basketArr.find((item) => {
        return +item.id === +productId;
      });
      if (basketItem) {
        basketItem.count = productNumber;
        product.querySelector(".product-total-price").textContent = `${
          basketItem.price * basketItem.count
        }$`;
      }
    }

    totalBasketCount();
    totalPriceBlock();
    saveCartToLocalStorage();
  }

  function deleteBasketItem(target) {
    const basketEl = target.closest(".product-item");
    const basketItemsId = basketEl.dataset.id;

    const basketItem = basketArr.find((item) => {
      return +item.id === +basketItemsId;
    });
    if (basketItem) {
      const index = basketArr.indexOf(basketItem);
      basketArr.splice(index, 1);
    }
    renderBasket();
    totalBasketCount();
    totalPriceBlock();
    saveCartToLocalStorage();
  }

  function totalBasketCount() {
    const basketCountDiv = document.querySelector(".basket-count");
    let totalCount = 0;
    for (const item of basketArr) {
      totalCount += item.count;
    }
    basketCountDiv.textContent = totalCount;
  }

  function totalPriceBlock() {
    const totalPriceDiv = document.querySelector(".total-price");
    let totalPrice = 0;

    for (const item of basketArr) {
      totalPrice += item.price * item.count;
    }

    totalPriceDiv.textContent =
      totalPrice > 0 ? `Total Price: $${totalPrice}` : "Your basket is empty";
  }

  function handleSearch(e) {
    const searchTerm = e.target.value.toLowerCase();
    const filteredProducts = productsArr.filter((product) => {
      console.log("product", product);
      return (
        product.description?.toLowerCase().includes(searchTerm) ||
        product.category?.toLowerCase().includes(searchTerm) ||
        product.brand?.toLowerCase().includes(searchTerm) ||
        product.price?.toString().includes(searchTerm)
      );
    });
    renderItems(filteredProducts);
  }
  searchInput.addEventListener("input", (e) => {
    handleSearch(e);
  });

  function selectOptions() {
    const getSelectValue = (array, key) => {
      const selectValue = [];
      array.forEach((item) => {
        if (!selectValue.includes(item[key])) {
          selectValue.push(item[key]);
        }
      });
      return selectValue;
    };

    const categories = getSelectValue(productsArr, "category");
    const brands = getSelectValue(productsArr, "brand");

    const categorySelect = document.getElementById("category");
    const brandSelect = document.getElementById("brand");

    function populateSelect(selectElement, options) {
      selectElement.innerHTML = `<option value="">Select ${selectElement.title}</option>`;
      options.forEach((option) => {
        selectElement.innerHTML += `<option value=${option}>${option}</option>`;
      });
    }

    populateSelect(categorySelect, categories);
    populateSelect(brandSelect, brands);
  }

  selectOptions();

  document.querySelectorAll("select").forEach((selectElement) => {
    selectElement.addEventListener("change", applyFilters);
  });

  function applyFilters() {
    const selectedCategory = document.getElementById("category").value;
    const selectedBrand = document.getElementById("brand").value;

    const filteredProducts = productsArr.filter((product) => {
      return (
        (selectedCategory === "" || product.category === selectedCategory) &&
        (selectedBrand === "" || product.brand === selectedBrand)
      );
    });

    renderItems(filteredProducts);
  }

  function saveCartToLocalStorage() {
    localStorage.setItem("cartItems", JSON.stringify(basketArr));
  }

  function loadCartFromLocalStorage() {
    const storedCartItems = localStorage.getItem("cartItems");

    if (storedCartItems) {
      basketArr.push(...JSON.parse(storedCartItems));
      renderBasket();
      totalBasketCount();
      totalPriceBlock();
      saveCartToLocalStorage();
    }
  }

  loadCartFromLocalStorage();
};
