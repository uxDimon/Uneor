
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
	for (const tabGroup of tabGroupList) {
		const tab = {
			controlList: document.querySelectorAll(`[data-tab-id="${tabGroup}"][data-tab-control]`),
			blockList: document.querySelectorAll(`[data-tab-id="${tabGroup}"][data-tab-block]`),
		};

		function tabSwith(name) {
			for (const control of tab.controlList) control.classList.remove(activeClass);
			for (const block of tab.blockList) block.style.display = "none";
			document.querySelector(`[data-tab-id="${tabGroup}"][data-tab-control="${name}"]`).classList.add(activeClass);
			document.querySelector(`[data-tab-id="${tabGroup}"][data-tab-block="${name}"]`).style.display = "";
		}
		tabSwith(tab.controlList[0].dataset.tabControl);

		for (const control of tab.controlList) {
			control.addEventListener("click", () => {
				tabSwith(control.dataset.tabControl);
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
if(document.querySelectorAll('.goods-list')) {
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
					}
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
mediumZoom(document.querySelectorAll('[data-zoom-src]'));

//sert slider
if (document.querySelector(".tech-information__slider")) {
	const swiper = new Swiper(".tech-information__slider .swiper-container", {
		// Optional parameters
		slidesPerView: 6,
		spaceBetween: 30,

		breakpoints: {
			0: {
				slidesPerView: 1.5,
				spaceBetween: 20,
			},
			500: {
				slidesPerView: 2,
			},
			768: {
				slidesPerView: 4,
			},
			1024: {
				slidesPerView: 6,
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
			el: '.swiper-pagination',
			type: 'fraction',
		},

		// Navigation arrows
		navigation: {
			nextEl: ".swiper-button-next",
			prevEl: ".swiper-button-prev",
		},
	});
}

//popup close
if(document.querySelectorAll('.popup').length) {
	let popups = document.querySelectorAll('.popup');

	popups.forEach((item) => {
		item.querySelectorAll('[data-close-popup]').forEach((closeBtn) => {
			closeBtn.addEventListener('click', function(){
				item.style.display = 'none';
			});
		});
	})
}

new Accordion(".vacancy-ac");