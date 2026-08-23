/*
 * ==========================================
 * NAT'S PROJECTS - CRAFTING RECIPE DISPLAY
 * ==========================================
 */

const MC_ASSETS =
    "https://mcasset.cloud/26.2/assets/minecraft/textures/item/";


/*
 * ==========================================
 * RECIPES
 * ==========================================
 *
 * null = slot vide
 *
 * Chaque recette possède :
 * - grid   : grille 3x3
 * - result : item obtenu
 * - amount : quantité obtenue
 */

const craftingRecipes = {

    crafting_table: {
        grid: [
            ["oak_planks", "oak_planks", null],
            ["oak_planks", "oak_planks", null],
            [null, null, null]
        ],
        result: "crafting_table",
        amount: 1
    },

    iron_block: {
        grid: [
            ["iron_ingot", "iron_ingot", "iron_ingot"],
            ["iron_ingot", "iron_ingot", "iron_ingot"],
            ["iron_ingot", "iron_ingot", "iron_ingot"]
        ],
        result: "iron_block",
        amount: 1
    },

    diamond_pickaxe: {
        grid: [
            ["diamond", "diamond", "diamond"],
            [null, "stick", null],
            [null, "stick", null]
        ],
        result: "diamond_pickaxe",
        amount: 1
    }

};


/*
 * ==========================================
 * CREATE ITEM
 * ==========================================
 */

function createCraftingItem(item, className = "") {

    if (!item) {
        return null;
    }

    const img = document.createElement("img");

    img.className = className;
    img.src = `${MC_ASSETS}${item}.png`;

    /*
     * Convert:
     * oak_planks
     * ->
     * Oak Planks
     */

    img.alt = item
        .replaceAll("_", " ")
        .replace(/\b\w/g, letter => letter.toUpperCase());

    /*
     * Tooltip navigateur
     */

    img.title = img.alt;

    /*
     * Si une texture n'existe pas,
     * on cache simplement l'image.
     */

    img.onerror = () => {
        img.style.display = "none";
        console.warn(
            `Crafting texture not found: ${item}`
        );
    };

    return img;
}


/*
 * ==========================================
 * DISPLAY ONE RECIPE
 * ==========================================
 */

function displayCraftingRecipe(container, recipe) {

    const grid = container.querySelector(
        ".crafting-grid"
    );

    const result = container.querySelector(
        ".crafting-result"
    );

    /*
     * Nettoyage
     */

    grid.innerHTML = "";
    result.innerHTML = "";


    /*
     * ======================================
     * GRID 3x3
     * ======================================
     */

    recipe.grid.flat().forEach(item => {

        const slot = document.createElement("div");

        slot.className = "crafting-slot";


        if (item) {

            const img =
                createCraftingItem(item);

            slot.appendChild(img);

        }

        grid.appendChild(slot);

    });


    /*
     * ======================================
     * RESULT
     * ======================================
     */

    const resultItem =
        createCraftingItem(
            recipe.result
        );

    result.appendChild(resultItem);


    /*
     * ======================================
     * AMOUNT
     * ======================================
     */

    if (recipe.amount > 1) {

        const amount =
            document.createElement("span");

        amount.className =
            "crafting-amount";

        amount.textContent =
            recipe.amount;

        result.appendChild(amount);

    }

}


/*
 * ==========================================
 * INITIALIZE ANIMATED CRAFTING
 * ==========================================
 */

function initializeCraftingAnimations() {

    const animations =
        document.querySelectorAll(
            ".crafting-animation"
        );


    animations.forEach(container => {

        /*
         * data-recipes="crafting_table,iron_block"
         */

        const recipeNames =
            container.dataset.recipes
                .split(",")
                .map(recipe =>
                    recipe.trim()
                )
                .filter(recipe =>
                    craftingRecipes[recipe]
                );


        /*
         * Pas de recette valide
         */

        if (!recipeNames.length) {

            console.warn(
                "No valid crafting recipes found.",
                container
            );

            return;

        }


        /*
         * Crée le fond
         */

        container.innerHTML = `
            <div class="crafting-table">
                <div class="crafting-grid"></div>
                <div class="crafting-result"></div>
            </div>
        `;


        const table =
            container.querySelector(
                ".crafting-table"
            );


        /*
         * Index actuel
         */

        let currentIndex = 0;


        /*
         * Première recette
         */

        displayCraftingRecipe(
            table,
            craftingRecipes[
                recipeNames[currentIndex]
            ]
        );


        /*
         * Une seule recette ?
         * Pas besoin d'animation.
         */

        if (recipeNames.length <= 1) {
            return;
        }


        /*
         * ==================================
         * CHANGE EVERY 1 SECOND
         * ==================================
         */

        setInterval(() => {

            /*
             * Petit fondu
             */

            table.classList.add(
                "crafting-changing"
            );


            setTimeout(() => {

                /*
                 * Recette suivante
                 */

                currentIndex++;

                if (
                    currentIndex >=
                    recipeNames.length
                ) {
                    currentIndex = 0;
                }


                /*
                 * Affichage
                 */

                displayCraftingRecipe(
                    table,
                    craftingRecipes[
                        recipeNames[currentIndex]
                    ]
                );


                /*
                 * Réapparition
                 */

                table.classList.remove(
                    "crafting-changing"
                );

            }, 120);

        }, 1000);

    });

}


/*
 * ==========================================
 * START
 * ==========================================
 */

if (
    document.readyState === "loading"
) {

    document.addEventListener(
        "DOMContentLoaded",
        initializeCraftingAnimations
    );

} else {

    initializeCraftingAnimations();

}
