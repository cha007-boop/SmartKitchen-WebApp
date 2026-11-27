app.component('recipe-view', {
    props: {
        recipes: {
            type: Array,
            required: true,
        },
        stock: {
            type: Array,
            default: () => [],
        },
        isDemoData: {
            type: Boolean,
            default: false,
        },
    },
    data() {
        return {
            nameSearch: '',
            ingredientInput: '',
            typeInput: '',
            activeIngredients: [],
            activeTypes: [],
            sortDirection: 'asc',
            selectedRecipe: null,
        }
    },
    computed: {
        stockedIngredients() {
            const names = new Set()
            this.stock
                .filter((item) => Number(item.quantity) > 0)
                .forEach((item) => {
                    names.add(String(item.ingredient || '').trim().toLocaleLowerCase('da'))
                })
            return names
        },
        ingredientOptions() {
            const ingredients = this.recipes.flatMap((recipe) => recipe.ingredients)
            return [...new Set(ingredients)].sort((first, second) => first.localeCompare(second, 'da'))
        },
        typeOptions() {
            return [...new Set(this.recipes.map((recipe) => recipe.type))]
                .sort((first, second) => first.localeCompare(second, 'da'))
        },
        filteredRecipes() {
            const searchTerm = this.nameSearch.trim().toLocaleLowerCase('da')
            const selectedIngredients = this.activeIngredients.map((ingredient) => ingredient.toLocaleLowerCase('da'))
            const recipes = this.recipes.filter((recipe) => {
                const matchesName = recipe.name.toLocaleLowerCase('da').includes(searchTerm)
                const recipeIngredients = recipe.ingredients.map((ingredient) => ingredient.toLocaleLowerCase('da'))
                const hasAllIngredients = selectedIngredients.every((ingredient) =>
                    recipeIngredients.includes(ingredient))
                const matchesType = this.activeTypes.length === 0 || this.activeTypes.includes(recipe.type)
                return matchesName && hasAllIngredients && matchesType
            })

            return recipes.sort((first, second) => {
                const order = first.name.localeCompare(second.name, 'da')
                return this.sortDirection === 'asc' ? order : -order
            })
        },
    },
    methods: {
        isInStock(ingredient) {
            return this.stockedIngredients.has(String(ingredient).trim().toLocaleLowerCase('da'))
        },
        addIngredientFilter() {
            const ingredient = this.ingredientInput.trim()
            const normalizedIngredient = ingredient.toLocaleLowerCase('da')
            if (!ingredient || this.activeIngredients.some((activeIngredient) =>
                activeIngredient.toLocaleLowerCase('da') === normalizedIngredient)) {
                return
            }

            this.activeIngredients.push(ingredient)
            this.ingredientInput = ''
        },
        addTypeFilter() {
            if (!this.typeInput || this.activeTypes.includes(this.typeInput)) {
                return
            }

            this.activeTypes.push(this.typeInput)
            this.typeInput = ''
        },
        clearNameSearch() {
            this.nameSearch = ''
        },
        removeIngredientFilter(ingredientToRemove) {
            this.activeIngredients = this.activeIngredients.filter((ingredient) =>
                ingredient !== ingredientToRemove)
        },
        removeTypeFilter(typeToRemove) {
            this.activeTypes = this.activeTypes.filter((type) => type !== typeToRemove)
        },
        clearFilters() {
            this.nameSearch = ''
            this.activeIngredients = []
            this.activeTypes = []
        },
    },
    template:
        /*html*/
        `<section class="recipe-browser card shadow-sm border-0" aria-label="Opskrifter">
            <header class="card-heading d-flex justify-content-between align-items-center gap-3">
                <div>
                    <h2 class="h5 mb-1">Opskrifter</h2>
                    <p class="small text-secondary mb-0">Find opskrifter efter ingredienser eller retstype</p>
                </div>
                <span v-if="isDemoData" class="badge rounded-pill text-bg-warning">Demodata</span>
            </header>

            <div class="recipe-filters p-4 border-bottom">
                <div class="mb-3">
                    <label class="form-label" for="recipe-name-search">Søg efter opskriftens navn</label>
                    <input id="recipe-name-search" v-model="nameSearch" class="form-control" type="search"
                        placeholder="Skriv et opskriftsnavn" autocomplete="off">
                </div>
                <div class="row g-3 align-items-end">
                    <div class="col-md-5">
                        <label class="form-label" for="recipe-ingredient-filter">Ingrediens</label>
                        <div class="input-group">
                            <input id="recipe-ingredient-filter" v-model="ingredientInput" class="form-control"
                                type="text" list="recipe-ingredient-options" placeholder="Søg efter ingrediens"
                                @keydown.enter.prevent="addIngredientFilter">
                            <datalist id="recipe-ingredient-options">
                                <option v-for="ingredient in ingredientOptions" :key="ingredient" :value="ingredient">
                                </option>
                            </datalist>
                            <button class="btn btn-outline-success" type="button" :disabled="!ingredientInput.trim()"
                                @click="addIngredientFilter">
                                Tilføj filter
                            </button>
                        </div>
                    </div>
                    <div class="col-md-4">
                        <label class="form-label" for="recipe-type-filter">Retstype</label>
                        <div class="input-group">
                            <select id="recipe-type-filter" v-model="typeInput" class="form-select">
                                <option value="">Vælg retstype</option>
                                <option v-for="type in typeOptions" :key="type" :value="type">{{ type }}</option>
                            </select>
                            <button class="btn btn-outline-success" type="button" :disabled="!typeInput"
                                @click="addTypeFilter">
                                Tilføj filter
                            </button>
                        </div>
                    </div>
                    <div class="col-md-3">
                        <label class="form-label" for="recipe-sort">Sortér efter navn</label>
                        <select id="recipe-sort" v-model="sortDirection" class="form-select">
                            <option value="asc">A-Å</option>
                            <option value="desc">Å-A</option>
                        </select>
                    </div>
                </div>

                <div v-if="nameSearch.trim() || activeIngredients.length || activeTypes.length"
                    class="d-flex flex-wrap align-items-center gap-2 mt-3" aria-label="Aktive filtre">
                    <span class="small fw-semibold text-secondary">Aktive filtre:</span>
                    <button v-if="nameSearch.trim()" class="btn btn-sm btn-outline-primary rounded-pill"
                        type="button" :aria-label="'Fjern navnesøgning ' + nameSearch"
                        @click="clearNameSearch">
                        Navn: {{ nameSearch }} <span aria-hidden="true">×</span>
                    </button>
                    <button v-for="ingredient in activeIngredients" :key="'ingredient-' + ingredient"
                        class="btn btn-sm btn-outline-success rounded-pill" type="button"
                        :aria-label="'Fjern ingrediensfilter ' + ingredient"
                        @click="removeIngredientFilter(ingredient)">
                        {{ ingredient }} <span aria-hidden="true">×</span>
                    </button>
                    <button v-for="type in activeTypes" :key="'type-' + type"
                        class="btn btn-sm btn-outline-secondary rounded-pill" type="button"
                        :aria-label="'Fjern retstypefilter ' + type"
                        @click="removeTypeFilter(type)">
                        {{ type }} <span aria-hidden="true">×</span>
                    </button>
                    <button class="btn btn-sm btn-link" type="button" @click="clearFilters">Ryd søgning og filtre</button>
                </div>
            </div>

            <div class="p-4">
                <div class="d-flex justify-content-between align-items-center mb-3">
                    <h3 class="h6 mb-0">Resultater</h3>
                    <span class="small text-secondary">
                        {{ filteredRecipes.length }} {{ filteredRecipes.length === 1 ? 'opskrift' : 'opskrifter' }}
                    </span>
                </div>

                <div v-if="filteredRecipes.length === 0" class="alert alert-light border mb-0" role="status">
                    Ingen opskrifter matcher søgningen og de valgte filtre.
                </div>
                <div v-else class="row g-3">
                    <article v-for="recipe in filteredRecipes" :key="recipe.id" class="col-md-6 col-lg-4">
                        <div class="recipe-result card h-100" role="button" tabindex="0"
                            :aria-label="'Se opskrift: ' + recipe.name"
                            @click="selectedRecipe = recipe"
                            @keydown.enter="selectedRecipe = recipe">
                            <div class="card-body">
                                <span class="badge rounded-pill text-bg-success-subtle mb-2">{{ recipe.type }}</span>
                                <h4 class="h6">{{ recipe.name }}</h4>
                                <p class="small text-secondary mb-2">Ingredienser</p>
                                <div class="d-flex flex-wrap gap-1">
                                    <span v-for="ingredient in recipe.ingredients" :key="ingredient"
                                        class="ingredient-tag badge rounded-pill"
                                        :class="{ 'ingredient-missing': !isInStock(ingredient) }">
                                        {{ ingredient }}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </article>
                </div>
            </div>

            <teleport to="body">
                <div v-if="selectedRecipe">
                    <div class="modal fade show d-block" tabindex="-1" role="dialog" aria-modal="true"
                        aria-labelledby="recipe-details-title" @click.self="selectedRecipe = null">
                        <div class="modal-dialog modal-xl modal-dialog-centered">
                            <div class="modal-content border-0 shadow">
                                <div class="modal-header py-3">
                                    <div>
                                        <span class="badge rounded-pill text-bg-success-subtle mb-1">{{ selectedRecipe.type }}</span>
                                        <h2 id="recipe-details-title" class="modal-title h4 mb-0">{{ selectedRecipe.name }}</h2>
                                    </div>
                                    <button type="button" class="btn-close" aria-label="Luk" @click="selectedRecipe = null"></button>
                                </div>
                                <div class="modal-body p-4">
                                    <div class="row g-4">
                                        <div v-if="selectedRecipe.imageLink" class="col-md-4">
                                            <img :src="selectedRecipe.imageLink" :alt="selectedRecipe.name"
                                                class="img-fluid rounded w-100"
                                                style="max-height: 220px; object-fit: cover;">
                                        </div>
                                        <div :class="selectedRecipe.imageLink ? 'col-md-8' : 'col-12'">
                                            <h3 class="h6 text-secondary mb-2">Ingredienser</h3>
                                            <div class="d-flex flex-wrap gap-2 mb-3">
                                                <span v-for="ingredient in selectedRecipe.ingredients" :key="ingredient"
                                                    class="ingredient-tag badge rounded-pill"
                                                    :class="{ 'ingredient-missing': !isInStock(ingredient) }">
                                                    {{ ingredient }}
                                                </span>
                                            </div>

                                            <template v-if="selectedRecipe.description">
                                                <h3 class="h6 text-secondary mb-2">Fremgangsmåde</h3>
                                                <p class="mb-0">{{ selectedRecipe.description }}</p>
                                            </template>
                                        </div>
                                    </div>
                                </div>
                                <div class="modal-footer py-2">
                                    <button type="button" class="btn btn-outline-secondary" @click="selectedRecipe = null">Luk</button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="modal-backdrop fade show"></div>
                </div>
            </teleport>
        </section>`,
})