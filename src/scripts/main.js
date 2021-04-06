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
		};
	telSize.create();

	function telSizeClass(telSize, input) {
		if (input.checked) {
			for (const telItem of telSize.list) telItem.classList.remove("head-tel_choice");
			telSize[input.value].classList.add("head-tel_choice");
		}
	}

	document.addEventListener("click", (event) => {
		if (button.classList.contains(activeClass) && event.target.closest("[data-location-choice]") === null) {
			optionsLisWrap.classList.toggle(activeClass);
			button.classList.toggle(activeClass);
		}
	});

	for (const input of optionsLisWrap.querySelectorAll("input")) {
		input.addEventListener("change", () => {
			buttonText.innerText = input.dataset.name;
			optionsLisWrap.classList.toggle(activeClass);
			button.classList.toggle(activeClass);
			telSizeClass(telSize, input);
		});
		telSizeClass(telSize, input);
	}

	button.addEventListener("click", () => {
		optionsLisWrap.classList.toggle(activeClass);
		button.classList.toggle(activeClass);
	});

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
