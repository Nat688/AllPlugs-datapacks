(() => {
	"use strict";

	const SOURCE_ID = "bc-recipe-source";

	const source = document.getElementById(SOURCE_ID);
	if (!source) {
		console.error("better-crafts.html: missing #" + SOURCE_ID + " markup block");
		return;
	}

	const ICON_BASE = "../images/item/";
	const FALLBACK_ICON = "data:image/svg+xml;utf8," + encodeURIComponent(
		'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><rect width="16" height="16" fill="%23555"/><text x="8" y="12" font-size="10" text-anchor="middle" fill="%23fff">?</text></svg>'
	);

	const GROUP_TITLES = {
		pottery_sherds: "Pottery Sherds",
		froglights: "Froglights",
		decraftable: "Decraftable Materials",
		soul_items: "Soul Items",
		suspicious: "Suspicious Blocks",
		arrow_bundle: "Arrow Bundle",
		bonemeal_growth: "Bonemeal Growth",
		dye_crafting: "Dye Crafting",
		sculk_family: "Sculk Family",
		sand_dye: "Sand Dye",
		utility_blocks: "Utility Blocks",
		end_progression: "End Progression",
		amethyst_family: "Amethyst Family",
		bulk: "Bulk Crafting",
		armor_sets: "Armor Sets",
		nether_blocks: "Nether Blocks",
		dirt: "Dirt & Soil",
		miscellaneous: "Miscellaneous",
		stone: "Stone Variants",
		stone_tools: "Stone Tools & Utility",
		loot_drop: "Loot Drops",
	};

	function titleCase(id) {
		return id.replace(/_/g, " ").replace(/\b\w/g, c => c.toUpperCase());
	}

	function groupTitle(id) {
		return GROUP_TITLES[id] || titleCase(id);
	}

	// Icons live under ../images/item/<range>/<name>.png, where <range> is
	// the letter bucket the item id's first character falls into:
	// a-f, g-m, n-t, u-z (anything else, e.g. digits, falls back to u-z).
	function letterRange(itemId) {
		const c = itemId.charAt(0).toLowerCase();
		if (c >= "a" && c <= "f") return "a-f";
		if (c >= "g" && c <= "m") return "g-m";
		if (c >= "n" && c <= "t") return "n-t";
		return "u-z";
	}

	function iconPath(itemId) {
		return ICON_BASE + letterRange(itemId) + "/" + itemId + ".png";
	}

	function setIconWithFallback(img, itemId) {
		img.src = iconPath(itemId);
		img.onerror = () => {
			img.onerror = null;
			img.src = FALLBACK_ICON;
		};
	}

	// Item tags used by the datapack's recipes (mirrors data/better_crafts/tags/item/*.json,
	// plus the vanilla #minecraft:wool tag). A <bc-slot tag="any_log"> references one of
	// these by name so the full item list doesn't have to be repeated in every recipe.
	const TAGS = {
		any_log: [
			"oak_log", "stripped_oak_log", "oak_wood", "stripped_oak_wood",
			"spruce_log", "stripped_spruce_log", "spruce_wood", "stripped_spruce_wood",
			"birch_log", "stripped_birch_log", "birch_wood", "stripped_birch_wood",
			"jungle_log", "stripped_jungle_log", "jungle_wood", "stripped_jungle_wood",
			"acacia_log", "stripped_acacia_log", "acacia_wood", "stripped_acacia_wood",
			"dark_oak_log", "stripped_dark_oak_log", "dark_oak_wood", "stripped_dark_oak_wood",
			"mangrove_log", "stripped_mangrove_log", "mangrove_wood", "stripped_mangrove_wood",
			"cherry_log", "stripped_cherry_log", "cherry_wood", "stripped_cherry_wood",
			"pale_oak_log", "stripped_pale_oak_log", "pale_oak_wood", "stripped_pale_oak_wood",
			"crimson_stem", "stripped_crimson_stem", "crimson_hyphae", "stripped_crimson_hyphae",
			"warped_stem", "stripped_warped_stem", "warped_hyphae", "stripped_warped_hyphae",
		],
		extra_stone_materials: [
			"netherrack", "basalt", "smooth_basalt", "polished_basalt",
			"stone_bricks", "mossy_stone_bricks", "cracked_stone_bricks", "chiseled_stone_bricks",
			"cobbled_deepslate", "polished_deepslate", "deepslate_bricks", "deepslate_tiles", "chiseled_deepslate",
			"tuff", "polished_tuff", "tuff_bricks", "calcite",
			"granite", "diorite", "andesite", "polished_granite", "polished_diorite", "polished_andesite",
			"end_stone", "end_stone_bricks", "purpur_block", "prismarine", "dark_prismarine", "red_sandstone",
		],
		glass_blocks: [
			"glass", "tinted_glass", "white_stained_glass", "orange_stained_glass", "magenta_stained_glass",
			"light_blue_stained_glass", "yellow_stained_glass", "lime_stained_glass", "pink_stained_glass",
			"gray_stained_glass", "light_gray_stained_glass", "cyan_stained_glass", "purple_stained_glass",
			"blue_stained_glass", "brown_stained_glass", "green_stained_glass", "red_stained_glass", "black_stained_glass",
		],
		wool: [
			"white_wool", "orange_wool", "magenta_wool", "light_blue_wool", "yellow_wool", "lime_wool",
			"pink_wool", "gray_wool", "light_gray_wool", "cyan_wool", "purple_wool", "blue_wool",
			"brown_wool", "green_wool", "red_wool", "black_wool",
		],
	};

	// Reads one <bc-slot> element into { items: [...] }.
	// - <bc-slot tag="any_log"></bc-slot>       -> every item in TAGS.any_log
	// - <bc-slot>charcoal,coal</bc-slot>        -> ["charcoal", "coal"] (explicit alternatives)
	// - <bc-slot>sand</bc-slot>                 -> ["sand"]
	// - <bc-slot></bc-slot>                     -> [] (empty slot)
	function readSlot(slotEl) {
		const tag = slotEl.getAttribute("tag");
		if (tag) return { items: TAGS[tag] || [tag] };

		const text = slotEl.textContent.trim();
		if (!text) return { items: [] };
		return { items: text.split(",").map(s => s.trim()).filter(Boolean) };
	}

	function buildSlot(cell) {
		const slot = document.createElement("div");
		slot.className = "bc-slot";
		if (!cell || cell.items.length === 0) return slot;

		const primary = cell.items[0];
		const img = document.createElement("img");
		img.alt = titleCase(primary);
		img.draggable = false;
		setIconWithFallback(img, primary);

		if (cell.items.length > 1) {
			const names = cell.items.map(titleCase).join(", ");
			slot.title = "Any of: " + names;
			const badge = document.createElement("span");
			badge.className = "bc-alt-badge";
			badge.textContent = "+" + (cell.items.length - 1);
			slot.appendChild(badge);
		} else {
			slot.title = titleCase(primary);
		}

		slot.appendChild(img);
		return slot;
	}

	function buildCard(recipeEl) {
		const resultId = recipeEl.getAttribute("result");
		const count = parseInt(recipeEl.getAttribute("count"), 10) || 1;
		const cells = Array.from(recipeEl.querySelectorAll("bc-slot")).map(readSlot);

		const card = document.createElement("div");
		card.className = "bc-card";
		card.dataset.search = resultId.toLowerCase();

		const craftRow = document.createElement("div");
		craftRow.className = "bc-card-craft";

		const miniGrid = document.createElement("div");
		miniGrid.className = "bc-mini-grid";
		cells.forEach(cell => miniGrid.appendChild(buildSlot(cell)));

		const arrow = document.createElement("div");
		arrow.className = "bc-arrow";
		arrow.textContent = "\u25B6";

		const output = document.createElement("div");
		output.className = "bc-output";
		const outImg = document.createElement("img");
		outImg.alt = titleCase(resultId);
		outImg.draggable = false;
		setIconWithFallback(outImg, resultId);
		output.appendChild(outImg);
		output.title = titleCase(resultId) + (count > 1 ? " x" + count : "");

		if (count > 1) {
			const countBadge = document.createElement("span");
			countBadge.className = "bc-count-badge";
			countBadge.textContent = "x" + count;
			output.appendChild(countBadge);
		}

		craftRow.appendChild(miniGrid);
		craftRow.appendChild(arrow);
		craftRow.appendChild(output);

		const name = document.createElement("div");
		name.className = "bc-card-name";
		name.textContent = titleCase(resultId);

		card.appendChild(craftRow);
		card.appendChild(name);
		return card;
	}

	function buildGroup(groupEl) {
		const groupId = groupEl.id;
		const recipeEls = Array.from(groupEl.querySelectorAll("bc-recipe"));

		const details = document.createElement("details");
		details.className = "recipe-group";
		details.dataset.group = groupId;

		const summary = document.createElement("summary");
		summary.textContent = groupTitle(groupId) + " ";
		const count = document.createElement("span");
		count.className = "bc-count";
		count.textContent = recipeEls.length + (recipeEls.length > 1 ? " recipes" : " recipe");
		summary.appendChild(count);
		details.appendChild(summary);

		const cmdLine = document.createElement("div");
		cmdLine.className = "bc-cmd-line";
		cmdLine.innerHTML =
			'<code>/function better_crafts:enable/' + groupId + '</code>' +
			'<code>/function better_crafts:disable/' + groupId + '</code>';
		details.appendChild(cmdLine);

		const list = document.createElement("div");
		list.className = "bc-recipe-list";
		recipeEls.forEach(recipeEl => list.appendChild(buildCard(recipeEl)));
		details.appendChild(list);

		return details;
	}

	function render() {
		const root = document.getElementById("bc-recipes-root");
		if (!root) return;

		Array.from(source.querySelectorAll("bc-group")).forEach(groupEl => {
			root.appendChild(buildGroup(groupEl));
		});

		const expandBtn = document.getElementById("bc-expand-all");
		const collapseBtn = document.getElementById("bc-collapse-all");

		if (expandBtn) {
			expandBtn.addEventListener("click", () => {
				root.querySelectorAll(".recipe-group").forEach(g => { g.open = true; });
			});
		}
		if (collapseBtn) {
			collapseBtn.addEventListener("click", () => {
				root.querySelectorAll(".recipe-group").forEach(g => { g.open = false; });
			});
		}
	}

	if (document.readyState === "loading") {
		document.addEventListener("DOMContentLoaded", render);
	} else {
		render();
	}
})();
