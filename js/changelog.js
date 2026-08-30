(() => {
	"use strict";

	const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];

	function localizeDates() {
		document.querySelectorAll(".changelog-date").forEach(el => {
			const iso = el.getAttribute("datetime");
			if (!iso) return;
			const date = new Date(iso);
			if (isNaN(date.getTime())) return;
			const month = MONTHS[date.getMonth()];
			const day = date.getDate();
			const year = date.getFullYear();
			const hour = date.getHours();
			const minutes = String(date.getMinutes()).padStart(2, "0");
			const offsetMin = -date.getTimezoneOffset();
			const sign = offsetMin >= 0 ? "+" : "-";
			const abs = Math.abs(offsetMin);
			const offH = Math.floor(abs / 60);
			const offM = abs % 60;
			const offsetLabel = offM === 0 ? `UTC${sign}${offH}` : `UTC${sign}${offH}:${String(offM).padStart(2, "0")}`;
			el.textContent = `${month} ${day}, ${year} - ${hour}:${minutes} (${offsetLabel})`;
		});
	}

	function setup() {
		localizeDates();
		const list = document.getElementById("changelog-list");
		const filter = document.getElementById("changelog-filter");
		const countEl = document.getElementById("changelog-count");
		const emptyEl = document.getElementById("changelog-empty");
		if (!list || !filter) return;
		const entries = Array.from(list.querySelectorAll(".changelog-entry"));
		entries.sort((a, b) => {
			const da = a.querySelector("time")?.getAttribute("datetime") || "";
			const db = b.querySelector("time")?.getAttribute("datetime") || "";
			return db.localeCompare(da);
		});
		entries.forEach(entry => list.appendChild(entry));
		const STATUS_VALUES = ["alpha", "beta", "release"];
		function applyFilter() {
			const value = filter.value;
			let visible = 0;
			entries.forEach(entry => {
				const isBig = entry.dataset.big === "true";
				const project = entry.dataset.project;
				const status = entry.dataset.status;
				let show;
				if (value === "all") show = true;
				else if (value === "big") show = isBig;
				else if (STATUS_VALUES.includes(value)) show = status === value;
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
