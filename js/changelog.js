(() => {
	"use strict";

	function setup() {
		const list = document.getElementById("changelog-list");
		const filter = document.getElementById("changelog-filter");
		const countEl = document.getElementById("changelog-count");
		const emptyEl = document.getElementById("changelog-empty");
		if (!list || !filter) return;

		const entries = Array.from(list.querySelectorAll(".changelog-entry"));

		// <time datetime="YYYY-MM-DDTHH:MM">.
		entries.sort((a, b) => {
			const da = a.querySelector("time")?.getAttribute("datetime") || "";
			const db = b.querySelector("time")?.getAttribute("datetime") || "";
			return db.localeCompare(da);
		});
		entries.forEach(entry => list.appendChild(entry));

		function applyFilter() {
			const value = filter.value;
			let visible = 0;

			entries.forEach(entry => {
				const isBig = entry.dataset.big === "true";
				const project = entry.dataset.project;
				let show;
				if (value === "all") show = true;
				else if (value === "big") show = isBig;
				else show = project === value;

				entry.classList.toggle("changelog-hidden", !show);
				if (show) visible++;
			});

			if (countEl) {
				countEl.textContent = visible + (visible === 1 ? " update" : " updates");
			}
			if (emptyEl) {
				emptyEl.hidden = visible !== 0;
			}
		}

		filter.addEventListener("change", applyFilter);
		applyFilter();
	}

	if (document.readyState === "loading") {
		document.addEventListener("DOMContentLoaded", setup);
	} else {
		setup();
	}
})();
