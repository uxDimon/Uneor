const activeClass = "active";

// Переключение табов
// demo
// button(data-tab-id="tabId1", data-tab-control="tab1") 1
// button(data-tab-id="tabId1", data-tab-control="tab2") 2
// .tab-block(data-tab-id="tabId1", data-tab-block="tab1") 1
// .tab-block(data-tab-id="tabId1", data-tab-block="tab2") 2
const tabIdList = document.querySelectorAll("[data-tab-id]");
if (tabIdList) {
	let tabGroupList = new Set();
	for (const tabId of tabIdList) {
		tabGroupList.add(tabId.dataset.tabId);
	}

	function tabSwith(name, tab, tabGroup) {
		for (const control of tab.controlList) control.classList.remove(activeClass);
		for (const block of tab.blockList) block.style.display = "none";
		document.querySelector(`[data-tab-id="${tabGroup}"][data-tab-control="${name}"]`).classList.add(activeClass);
		document.querySelector(`[data-tab-id="${tabGroup}"][data-tab-block="${name}"]`).style.display = "";
	}

	for (const tabGroup of tabGroupList) {
		const tab = {
			controlList: document.querySelectorAll(`[data-tab-id="${tabGroup}"][data-tab-control]`),
			blockList: document.querySelectorAll(`[data-tab-id="${tabGroup}"][data-tab-block]`),
		};
		console.log(tab);
		tabSwith(tab.controlList[0].dataset.tabControl, tab, tabGroup);

		for (const control of tab.controlList) {
			control.addEventListener("click", () => {
				tabSwith(control.dataset.tabControl, tab, tabGroup);
			});
		}
	}
}

// data-active
for (const activeBlock of document.querySelectorAll("[data-active-block]")) {
	const activeControlList = document.querySelectorAll(`[data-active-control="${activeBlock.dataset.activeBlock}"]`);
	for (const activeControl of activeControlList) {
		activeControl.addEventListener("click", () => {
			for (const activeControlItem of activeControlList) activeControlItem.classList.toggle(activeClass);
			activeBlock.classList.toggle(activeClass);
		});
	}
	document.addEventListener("click", (event) => {
		if (
			activeBlock.classList.contains(activeClass) &&
			event.target.closest(`[data-active-block="${activeBlock.dataset.activeBlock}"]`) === null &&
			event.target.closest(`[data-active-control="${activeBlock.dataset.activeBlock}"]`) === null
		) {
			for (const activeControlItem of activeControlList) activeControlItem.classList.toggle(activeClass);
			activeBlock.classList.toggle(activeClass);
		}
	});
}

// Выбор региона location-choice
document.querySelectorAll("[data-location-choice]").forEach((choice) => {
	const button = choice.querySelector("button[data-location-button]"),
		buttonText = button.querySelector(".location-choice__text"),
		optionsLisWrap = choice.querySelector("[data-location-option-list]"),
		telSize = {
			list: [],
			create() {
				for (const telItem of document.querySelectorAll("[data-size-viseble]")) {
					const telItemId = telItem.dataset.sizeViseble;
					this.list.push(telItem);
					if (telItemId) this[telItemId] = telItem;
				}
			},
		},
		inputs = {
			list: {},
			create() {
				for (const input of optionsLisWrap.querySelectorAll("input")) this.list[input.value] = input;
			},
		};
	telSize.create();
	inputs.create();

	function telSizeClass(telSize, input) {
		// Добавляет класс к телефону выборного региона
		if (input.checked) {
			for (const telItem of telSize.list) telItem.classList.remove("head-tel_choice");
			telSize[input.value].classList.add("head-tel_choice");
		}
	}

	document.addEventListener("click", (event) => {
		// Закрывает модалку
		if (button.classList.contains(activeClass) && event.target.closest("[data-location-choice]") === null) {
			optionsLisWrap.classList.remove(activeClass);
			button.classList.remove(activeClass);
		}
	});

	for (const key in inputs.list) {
		if (Object.hasOwnProperty.call(inputs.list, key)) {
			const input = inputs.list[key];
			// Выбор региона
			input.addEventListener("change", () => {
				buttonText.innerText = input.dataset.name;
				optionsLisWrap.classList.remove(activeClass);
				button.classList.remove(activeClass);
				telSizeClass(telSize, input);
				localStorage.locationChoice = input.value;
			});
			telSizeClass(telSize, input);
		}
	}

	button.addEventListener("click", () => {
		// Открытие модалку
		optionsLisWrap.classList.toggle(activeClass);
		button.classList.toggle(activeClass);
	});

	if (localStorage.locationChoice) inputs.list[localStorage.locationChoice].click();
	optionsLisWrap.style.width = optionsLisWrap.scrollWidth + "px";
});

// header-search
for (const searchWrap of document.querySelectorAll(".header-search")) {
	const input = searchWrap.querySelector(".header-search__input"),
		cancel = searchWrap.querySelector(".header-search__clear");

	input.addEventListener("input", () => {
		input.value ? cancel.classList.add(activeClass) : cancel.classList.remove(activeClass);
	});

	cancel.addEventListener("click", () => {
		input.value = "";
		input.focus();
		cancel.classList.remove(activeClass);
	});
}

// catalog-list
for (const catalog of document.querySelectorAll(".catalog-list")) {
	const list = catalog.querySelectorAll(".catalog-list__item:nth-child(1n + 5):not(.catalog-list__item_catalog)"),
		button = catalog.querySelector("[data-catalog-list-more]");
	function hideItems() {
		for (const item of list) item.style.display = document.documentElement.clientWidth <= 767 && !button.checked ? "none" : "block";
	}
	hideItems();

	window.addEventListener("resize", function () {
		hideItems();
	});
	button.addEventListener("change", () => {
		for (const item of list) item.style.display = !button.checked ? "none" : "block";
		button.parentElement.querySelector("span").innerText = button.checked ? "Скрыть" : "Показать больше";
	});
}

//cooperation slider
if (document.querySelector(".cooperation__slider")) {
	let styleProjects;
	let sliderOn = false;

	function initSlider() {
		if (document.body.clientWidth >= 768 && sliderOn) {
			styleProjects.destroy();
			sliderOn = false;
		}
		if (document.body.clientWidth < 768 && !sliderOn) {
			styleProjects = new Swiper(".cooperation__slider .swiper-container", {
				slidesPerView: 1,
				spaceBetween: 20,

				// Navigation arrows
				navigation: {
					nextEl: ".swiper-button-next",
					prevEl: ".swiper-button-prev",
				},
			});
			sliderOn = true;
		}
	}

	window.onresize = function () {
		initSlider();
	};

	initSlider();
}

if (document.querySelector(".career-slider__slider-wrap")) {
	const swiper = new Swiper(".career-slider__slider-wrap .swiper-container", {
		// Optional parameters
		slidesPerView: 1,
		spaceBetween: 20,
		loop: true,

		breakpoints: {
			0: {
				slidesPerView: 1.15,
			},
			768: {
				slidesPerView: 1,
			},
		},

		// Navigation arrows
		navigation: {
			nextEl: ".swiper-button-next",
			prevEl: ".swiper-button-prev",
		},
	});
}

//goods slider
if (document.querySelectorAll(".goods-list")) {
	let styleProjects;
	let sliderOn = false;

	function initSlider() {
		if (document.body.clientWidth < 768 && sliderOn) {
			styleProjects.destroy();
			sliderOn = false;
		}
		if (document.body.clientWidth >= 768 && !sliderOn) {
			styleProjects = new Swiper(".goods-list .swiper-container", {
				spaceBetween: 30,
				breakpoints: {
					1240: {
						slidesPerView: 4,
					},
					768: {
						slidesPerView: 3,
					},
				},

				// Navigation arrows
				navigation: {
					nextEl: ".swiper-button-next",
					prevEl: ".swiper-button-prev",
				},
			});
			sliderOn = true;
		}
	}

	window.onresize = function () {
		initSlider();
	};

	initSlider();
}

// input_file
for (const wrap of document.querySelectorAll(".input_file")) {
	const input = wrap.querySelector('input[type="file"]'),
		listNme = wrap.querySelector(".input_file__name");

	function html(name) {
		return `<li>${name}</li>`;
	}

	input.addEventListener("change", () => {
		listNme.innerHTML = "";
		if (input.files.length >= 1) {
			for (const fileName of input.files) {
				listNme.insertAdjacentHTML("beforeend", html(fileName.name));
			}
		} else {
			listNme.insertAdjacentHTML("beforeend", html("Прикрепить файл"));
		}
	});
}

//zoom
// const zoomButton = document.querySelectorAll('[data-action="zoom"]')
// const zoom = mediumZoom('[data-zoomable]')

// zoomButton.forEach((item) => {
// 	item.addEventListener('click', () => zoom.open())
// })

//sert slider
if (document.querySelector(".tech-information__slider")) {
	const swiper = new Swiper(".tech-information__slider .swiper-container", {
		// Optional parameters
		// slidesPerView: 6,
		// spaceBetween: 30,

		breakpoints: {
			0: {
				slidesPerView: 1.5,
				spaceBetween: 20,
			},
			500: {
				slidesPerView: 2,
				spaceBetween: 20,
			},
			768: {
				slidesPerView: 4,
				spaceBetween: 20,
			},
			1024: {
				slidesPerView: 6,
				spaceBetween: 30,
			},
		},

		// Navigation arrows
		navigation: {
			nextEl: ".swiper-button-next",
			prevEl: ".swiper-button-prev",
		},
	});
}

//news-item slider
if (document.querySelector(".news-item__slider")) {
	const swiper = new Swiper(".news-item__slider .swiper-container", {
		// Optional parameters
		slidesPerView: 1,
		spaceBetween: 30,

		pagination: {
			el: ".swiper-pagination",
			type: "fraction",
		},

		// Navigation arrows
		navigation: {
			nextEl: ".swiper-button-next",
			prevEl: ".swiper-button-prev",
		},
	});
}

//catalog slider with thumbs
if (document.querySelector(".catalog-item__slider")) {
	const sliderThumbs = new Swiper(".slider-thumbs .swiper-container", {
		width: "auto",
		spaceBetween: 20,
		slidesPerView: 3.5,
		watchSlidesVisibility: true,
		watchSlidesProgress: true,
		// observer: true,
		// observeParents: true,
		direction: "vertical",

		breakpoints: {
			0: {
				direction: "horizontal",
				spaceBetween: 20,
			},
			1024: {
				direction: "vertical",
				spaceBetween: 20,
			},
		},
	});
	const galleryTop = new Swiper(".slider-main .swiper-container", {
		slidesPerView: 1,
		spaceBetween: 20,
		// observer: true,
		// observeParents: true,

		thumbs: {
			swiper: sliderThumbs,
		},
	});
}

//popup close
if (document.querySelectorAll(".popup").length) {
	let popups = document.querySelectorAll(".popup");

	popups.forEach((item) => {
		item.querySelectorAll("[data-close-popup]").forEach((closeBtn) => {
			closeBtn.addEventListener("click", function () {
				item.style.display = "none";
			});
		});
	});
}

//добавить товар +1 -1 кнопка
let orderBtns = document.querySelectorAll("[data-add-order]");

orderBtns.forEach((item) => {
	let input = item.querySelector("input");
	let inputValue = parseInt(item.querySelector("input").value, 10);

	item.querySelector(".add-group__btn_plus").addEventListener("click", function () {
		input.value = ++inputValue;
	});

	item.querySelector(".add-group__btn_minus").addEventListener("click", function () {
		if (inputValue > 1) {
			input.value = --inputValue;
		}
	});
});

//acc
if (document.querySelector(".vacancy-ac")) {
	const vacAcc = new Accordion(".vacancy-ac");
}

if (document.querySelectorAll(".catalog-ac").length) {
	const accordions = Array.from(document.querySelectorAll(".catalog-ac"));
	new Accordion(accordions, {
		showMultiple: true,
	});
}

Spotlight.init();

var button = Spotlight.addControl(".tech-information__hover-zoom", function (event) {
	// handle click event
	// console.log("button clicked");
});

// Дилеры Карта
const dealerMap = document.querySelector("#mother-russia"),
	dealerSelectList = document.querySelector("[data-region-select]");
if (dealerMap) {
	const mapActiveItem = {},
		tabActiveItem = {},
		dealerSelectOptions = dealerSelectList.querySelectorAll("option");

	function changeMapItem(listItem, item, listTab, tab) {
		for (const key in listItem) {
			if (Object.hasOwnProperty.call(listItem, key)) {
				listItem[key].style.fill = "";
				listTab[key].classList.remove(activeClass);
			}
		}
		item.style.fill = "#0077c1";
		tab.classList.add(activeClass);
	}

	for (const item of dealerSelectOptions) {
		mapActiveItem[item.value] = dealerMap.querySelector(`[data-region="${item.value}"]`);
		tabActiveItem[item.value] = document.querySelector(`[data-region-tab="${item.value}"]`);

		mapActiveItem[item.value].addEventListener("click", () => {
			changeMapItem(mapActiveItem, mapActiveItem[item.value], tabActiveItem, tabActiveItem[item.value]);
			dealerSelectList.value = item.value;
		});

		mapActiveItem[item.value].classList.add(activeClass);
		tabActiveItem[item.value].classList.add(activeClass);
	}

	dealerSelectList.addEventListener("change", () => {
		changeMapItem(mapActiveItem, mapActiveItem[dealerSelectList.value], tabActiveItem, tabActiveItem[dealerSelectList.value]);
	});

	changeMapItem(mapActiveItem, mapActiveItem[dealerSelectList.value], tabActiveItem, tabActiveItem[dealerSelectList.value]);
}
