const baseURL = "https://smartkitchenapi20261123093015-g3hmc6hgasf9esh2.italynorth-01.azurewebsites.net/api/groceries/"
const translationCacheKey = 'ingredientTranslationsDa_v3'

function loadCachedTranslations() {
    try {
        return JSON.parse(localStorage.getItem(translationCacheKey)) || {}
    } catch (error) {
        return {}
    }
}

const app = Vue.createApp({
    data() {
        return {
            currentView: 'groceries',
            apiConfigured: Boolean(baseURL),
            groceryList: [],
            translations: loadCachedTranslations(),
            failedTranslations: {},
            ingredientList: [],
            recipeList: [
                {
                    id: 1,
                    name: 'Bagt tomatpasta',
                    type: 'Aftensmad',
                    ingredients: ['pasta', 'tomat', 'hvidløg', 'spinat'],
                    description: 'Varm ovnen op til 200 grader. Læg tomater og hele hvidløgsfed i et ovnfast fad, dryp med olivenolie, og bag dem i cirka 25 minutter, til tomaterne er bløde og begynder at sprække. Kog pastaen al dente i det mellemtid. Mos tomater og hvidløg let med en gaffel, så de danner en sauce. Vend den kogte pasta og en håndfuld spinat i saucen, til spinaten falder sammen. Smag til med salt og peber.',
                    imageLink: 'https://cdn-free.tv2i.dk/l/e/g/legacy/2/3/9/239106ee-3c28-4f79-878a-441cac6d84ae?ixlib=js-3.8.0&w=624&h=351&q=45&auto=format&fit=crop&rect64=MCwwLDI3MTYsMTUyNQ&s=5707cdebb918268738e5eb9d1554597c',
                },
                {
                    id: 2,
                    name: 'Kikærtewrap',
                    type: 'Frokost',
                    ingredients: ['tortilla', 'kikærter', 'agurk', 'tomat'],
                    description: 'Skyl kikærterne, og mos dem groft med en gaffel, så nogle stadig er hele. Krydr med salt, peber og gerne lidt spidskommen. Skær agurk og tomat i tern. Varm tortillaen kort på en tør pande, så den bliver blød. Fordel kikærtemosen på tortillaen, top med agurk og tomat, og rul den stramt sammen. Skær wrappen over på midten, og server den med det samme.',
                    imageLink: 'https://cdn-free.tv2i.dk/l/e/g/legacy/2/3/9/239106ee-3c28-4f79-878a-441cac6d84ae?ixlib=js-3.8.0&w=624&h=351&q=45&auto=format&fit=crop&rect64=MCwwLDI3MTYsMTUyNQ&s=5707cdebb918268738e5eb9d1554597c',
                },
                {
                    id: 3,
                    name: 'Havregrød med æble',
                    type: 'Morgenmad',
                    ingredients: ['havregryn', 'mælk', 'æble', 'kanel'],
                    description: 'Kom havregryn og mælk i en gryde, og bring det i kog under omrøring. Lad grøden simre i 5 minutter, til den er tyk og cremet. Riv eller skær æblet i små stykker, og rør det i grøden de sidste par minutter. Hæld grøden i en skål, og drys med kanel. Server den varm.',
                    imageLink: 'https://cdn-free.tv2i.dk/l/e/g/legacy/2/3/9/239106ee-3c28-4f79-878a-441cac6d84ae?ixlib=js-3.8.0&w=624&h=351&q=45&auto=format&fit=crop&rect64=MCwwLDI3MTYsMTUyNQ&s=5707cdebb918268738e5eb9d1554597c',
                },
                {
                    id: 4,
                    name: 'Tomatsuppe',
                    type: 'Frokost',
                    ingredients: ['tomat', 'løg', 'grøntsagsbouillon'],
                    description: 'Hak løget fint, og svits det i olie i en gryde, til det er blødt og klart. Tilsæt hakkede tomater og grøntsagsbouillon med vand efter anvisning på pakken. Lad suppen simre i 20 minutter. Blend den glat med en stavblender. Smag til med salt og peber, og server den gerne med et stykke brød.',
                    imageLink: 'https://cdn-free.tv2i.dk/l/e/g/legacy/2/3/9/239106ee-3c28-4f79-878a-441cac6d84ae?ixlib=js-3.8.0&w=624&h=351&q=45&auto=format&fit=crop&rect64=MCwwLDI3MTYsMTUyNQ&s=5707cdebb918268738e5eb9d1554597c',
                },
                {
                    id: 5,
                    name: 'Ovnbagte rodfrugter',
                    type: 'Aftensmad',
                    ingredients: ['kartoffel', 'gulerod', 'rødløg'],
                    description: 'Varm ovnen op til 200 grader. Skær kartofler og gulerødder i grove tern, og skær rødløget i både. Vend det hele med olivenolie, salt og peber, og fordel det i et enkelt lag på en bageplade. Bag i 35 til 40 minutter, og vend grøntsagerne halvvejs, så de bliver gyldne og møre på hele overfladen.',
                    imageLink: 'https://cdn-free.tv2i.dk/l/e/g/legacy/2/3/9/239106ee-3c28-4f79-878a-441cac6d84ae?ixlib=js-3.8.0&w=624&h=351&q=45&auto=format&fit=crop&rect64=MCwwLDI3MTYsMTUyNQ&s=5707cdebb918268738e5eb9d1554597c',
                },
                {
                    id: 6,
                    name: 'Bananpandekager',
                    type: 'Morgenmad',
                    ingredients: ['banan', 'æg', 'havregryn'],
                    description: 'Mos en moden banan i en skål, og pisk to æg i. Rør havregryn i, og lad dejen hvile i 5 minutter, så havregrynene suger lidt væske. Varm en pande op ved middel varme med lidt smør eller olie. Hæld små portioner dej på panden, og steg dem i cirka 2 minutter på hver side, til de er gyldne. Server dem med frugt eller honning.',
                    imageLink: 'https://cdn-free.tv2i.dk/l/e/g/legacy/2/3/9/239106ee-3c28-4f79-878a-441cac6d84ae?ixlib=js-3.8.0&w=624&h=351&q=45&auto=format&fit=crop&rect64=MCwwLDI3MTYsMTUyNQ&s=5707cdebb918268738e5eb9d1554597c',
                },
            ],
            recipeDataIsDemo: true,
            newItem: {
                id: null,
                name: '',
                barcode: '',
                ingredient: '',
                quantity: 0,
            },
            sortBy: null,
            sortAscending: true,
            editingId: null, // Keeps track of what item is being edited
            editItem: null, // Temporary item to store updated values
            isUpdating: false, // Keeps track of whether something is being updated or not
            deletingId: null, // Keeps track of what item to delete
            deleteTarget: null,
            updateMessage: '',
            updateError: '',
            deleteError: '',
            isRemoving: false,
            removeError: '',
            removeCompleted: 0,
            editCompleted: 0,
            isSubmitting: false,
            postMessage: '',
            postError: '',
            errorMessage: '',

        }
    },
    created() {
        // Plain (non-reactive) set that tracks translations currently being fetched
        this.pendingTranslations = new Set()
    },
    mounted() {
        this.getAll()
    },
    watch: {
        groceryList: {
            deep: true,
            handler() {
                this.translateGroceries()
            },
        },
    },
    computed: {
        // Same items as groceryList, plus ingredientDa (the Danish name) for display and comparison
        translatedGroceryList() {
            return this.groceryList.map((item) => {
                const key = this.normalizeIngredient(item.ingredient)
                let danish = this.translations[key]
                if (!danish) {
                    danish = this.failedTranslations[key] ? 'gorba' : '...'
                }
                return { ...item, ingredientDa: danish }
            })
        },
        myComputed() {
            return ''
        },
    },
    methods: {
        normalizeIngredient(value) {
            return String(value ?? '').trim().toLocaleLowerCase('da')
        },
        // Remove UI-only fields before sending an item to the API
        toApiItem(item) {
            const { ingredientDa, ...apiItem } = item
            return apiItem
        },
        saveCachedTranslations() {
            try {
                localStorage.setItem(translationCacheKey, JSON.stringify(this.translations))
            } catch (error) {
                console.log(error)
            }
        },
        // Translation API 1: MyMemory
        async translateWithMyMemory(name) {
            const response = await axios.get('https://api.mymemory.translated.net/get', {
                params: { q: name, langpair: 'en|da' },
            })
            const result = response.data
            const text = result.responseData?.translatedText || ''
            const isWarning = text.toUpperCase().includes('MYMEMORY WARNING')
            if (Number(result.responseStatus) === 200 && text && isWarning == false) {
                return text
            }
            console.log('MyMemory did not return a usable translation for', name, result)
            return null
        },
        // Translation API 2 (fallback): Google's public translate endpoint, no key needed
        async translateWithGoogle(name) {
            const response = await axios.get('https://translate.googleapis.com/translate_a/single', {
                params: { client: 'gtx', sl: 'en', tl: 'da', dt: 't', q: name },
            })
            return response.data?.[0]?.[0]?.[0] || null
        },
        // Translate each stored ingredient from English to Danish once, then cache it in localStorage.
        // If both APIs fail, the ingredient is marked as failed and shows "gorba".
        async translateGroceries() {
            const missing = [...new Set(
                this.groceryList
                    .map((item) => this.normalizeIngredient(item.ingredient))
                    .filter((name) => name
                        && !this.translations[name]
                        && !this.pendingTranslations.has(name))
            )]

            for (const name of missing) {
                this.pendingTranslations.add(name)
                try {
                    let translated = null

                    try {
                        translated = await this.translateWithMyMemory(name)
                    } catch (error) {
                        console.log('MyMemory request failed for', name, error)
                    }

                    // Try the second API if the first failed or just returned the same word
                    if (!translated || this.normalizeIngredient(translated) === name) {
                        try {
                            const fallback = await this.translateWithGoogle(name)
                            if (fallback) {
                                translated = fallback
                            }
                        } catch (error) {
                            console.log('Fallback translation request failed for', name, error)
                        }
                    }

                    if (translated) {
                        const { [name]: removed, ...stillFailed } = this.failedTranslations
                        this.failedTranslations = stillFailed
                        this.translations = {
                            ...this.translations,
                            [name]: this.normalizeIngredient(translated),
                        }
                        this.saveCachedTranslations()
                    } else {
                        this.failedTranslations = { ...this.failedTranslations, [name]: true }
                    }
                } finally {
                    this.pendingTranslations.delete(name)
                }
            }
        },
        // Fetch items using the current filters and sort order.
        getAll() {
            if (!baseURL) {
                this.errorMessage = "URL-adressen til SmartKitchen-API'en er endnu ikke konfigureret."
                return
            }

            axios
                .get(baseURL)
                .then((response) => {
                    this.groceryList = response.data.filter((item) => Number(item.quantity) > 0)
                    this.errorMessage = ''
                })
                .catch((error) => {
                    console.log(error)
                    this.groceryList = []
                    this.errorMessage = this.getRequestErrorMessage(error)
                })
        },
        // Create an item and reset the form after success.
        postItem(item) {
            if (!baseURL) {
                this.postError = "URL-adressen til SmartKitchen-API'en er endnu ikke konfigureret."
                return
            }

            const request = {
                name: item.name.trim(),
                ingredient: item.ingredient.trim(),
                quantity: Number(item.quantity),
            }
            this.newItem = { ...this.newItem, ...request }
            this.isSubmitting = true
            this.postMessage = ''
            this.postError = ''
            axios
                .post(`${baseURL.replace(/\/+$/, '')}/Manuel`, request)
                .then((response) => {
                    if (!response.data) {
                        this.postError = "API'et returnerede ikke en vare. Kontrollér oplysningerne, og prøv igen."
                        return
                    }
                    this.completePostItem(response, 'Varen blev tilføjet.')
                })
                .catch((error) => {
                    this.postError = error.response?.status === 404
                        ? 'Varen blev ikke fundet. Kontrollér navn og ingrediens. Den blev ikke tilføjet.'
                        : this.getRequestErrorMessage(error)
                })
                .finally(() => {
                    this.isSubmitting = false
                })
        },
        completePostItem(response, message) {
            if (response.data) {
                const hasId = response.data.id !== undefined && response.data.id !== null
                const index = hasId
                    ? this.groceryList.findIndex((item) => item.id === response.data.id)
                    : -1
                if (Number(response.data.quantity) > 0) {
                    if (index === -1) {
                        this.groceryList.push(response.data)
                    } else {
                        this.groceryList.splice(index, 1, response.data)
                    }
                } else if (index !== -1) {
                    this.groceryList.splice(index, 1)
                }
            }
            this.postMessage = message
            this.newItem = {
                id: null,
                name: '',
                barcode: '',
                ingredient: '',
                quantity: 0,
            }
        },
        // Copy a Item's values into the inline editor.
        startEdit(item) {
            this.editingId = item.id
            this.editItem = {
                name: item.name,
                ingredient: item.ingredient,
                quantity: item.quantity,
                // Fill with rest of properties

            }
            this.updateMessage = ''
            this.updateError = ''
        },
        // Discard the inline edits without saving.
        cancelEdit() {
            this.editingId = null
            this.editItem = null
            this.updateError = ''
        },
        putItem() {
            if (!this.editItem || this.editingId === null) {
                return
            }

            this.isUpdating = true
            this.updateMessage = ''
            this.updateError = ''
            const id = this.editingId
            const updatedItem = { id, ...this.editItem }

            axios
                .put(baseURL + id, updatedItem)
                .then((response) => {
                    // Update the local list with the new values, using the response data if available.
                    const index = this.groceryList.findIndex((item) => item.id === id)
                    if (index !== -1) {
                        this.groceryList.splice(index, 1, {
                            ...this.groceryList[index],
                            ...(response.data && typeof response.data === 'object'
                                ? response.data
                                : updatedItem),
                        })
                        // Using ... this way preserves properties that aren't included in replacement data
                    }
                    this.editingId = null
                    this.editItem = null
                    this.updateMessage = 'Varen blev opdateret.'
                    this.getAll()
                })
                .catch((error) => {
                    this.updateError = this.getRequestErrorMessage(error)
                })
                .finally(() => {
                    this.isUpdating = false
                })
        },
        updateGroceryItem({ item, name, ingredient, quantity }) {
            const updatedQuantity = Number(quantity)
            if (!name || !name.trim()
                || (ingredient !== null && ingredient !== ''
                    && (typeof ingredient !== 'string' || !ingredient.trim()))) {
                this.updateError = 'Navn skal udfyldes, og ingrediens skal være tekst eller null.'
                return
            }
            if (!Number.isInteger(updatedQuantity) || updatedQuantity < 0) {
                this.updateError = 'Mængden skal være et helt tal på 0 eller større.'
                return
            }
            if (!baseURL) {
                this.updateError = "URL-adressen til SmartKitchen-API'en er endnu ikke konfigureret."
                return
            }

            const updatedItem = {
                ...this.toApiItem(item),
                name: name.trim(),
                ingredient: ingredient === null || ingredient === '' ? null : ingredient.trim(),
                quantity: updatedQuantity,
            }

            this.isUpdating = true
            this.updateError = ''
            axios
                .put(baseURL + item.id, updatedItem)
                .then((response) => {
                    if (updatedQuantity === 0) {
                        this.groceryList = this.groceryList.filter((grocery) => grocery.id !== item.id)
                    } else {
                        const index = this.groceryList.findIndex((grocery) => grocery.id === item.id)
                        if (index !== -1) {
                            this.groceryList.splice(index, 1, {
                                ...this.groceryList[index],
                                ...(response.data && typeof response.data === 'object'
                                    ? response.data
                                    : updatedItem),
                            })
                        }
                    }
                    this.editCompleted += 1
                })
                .catch((error) => {
                    this.updateError = this.getRequestErrorMessage(error)
                })
                .finally(() => {
                    this.isUpdating = false
                })
        },
        removeItem({ item, amount }) {
            if (!item || amount === null || amount === undefined) {
                return
            }

            const removeAmount = Number(amount)
            const currentQuantity = Number(item.quantity)
            if (!Number.isInteger(removeAmount) || removeAmount < 1 || removeAmount > currentQuantity) {
                this.removeError = `Angiv et antal mellem 1 og ${currentQuantity}.`
                return
            }

            if (!baseURL) {
                this.removeError = "URL-adressen til SmartKitchen-API'en er endnu ikke konfigureret."
                return
            }

            const remainingQuantity = currentQuantity - removeAmount
            this.isRemoving = true
            this.removeError = ''

            if (remainingQuantity === 0) {
                axios
                    .put(baseURL + item.id, { ...this.toApiItem(item), quantity: 0 })
                    .then((response) => {
                        this.groceryList = this.groceryList.filter((grocery) => grocery.id !== item.id)
                        this.removeCompleted += 1
                    })
                    .catch((error) => {
                        this.removeError = this.getRequestErrorMessage(error)
                    })
                    .finally(() => {
                        this.isRemoving = false
                    })
                return
            }

            const updatedItem = { ...this.toApiItem(item), quantity: remainingQuantity }
            axios
                .put(baseURL + item.id, updatedItem)
                .then((response) => {
                    const index = this.groceryList.findIndex((grocery) => grocery.id === item.id)
                    if (index !== -1) {
                        this.groceryList.splice(index, 1, {
                            ...this.groceryList[index],
                            ...(response.data && typeof response.data === 'object'
                                ? response.data
                                : updatedItem),
                        })
                    }
                    this.removeCompleted += 1
                })
                .catch((error) => {
                    this.removeError = this.getRequestErrorMessage(error)
                })
                .finally(() => {
                    this.isRemoving = false
                })
        },

        // Delete the confirmed item with a DELETE request
        deleteItem() {
            const item = this.deleteTarget
            if (!item) {
                return
            }

            this.deletingId = item.id
            this.deleteError = ''

            axios
                .delete(baseURL + item.id)
                .then(() => {
                    this.groceryList = this.groceryList.filter((grocery) => grocery.id !== item.id)
                    bootstrap.Modal.getOrCreateInstance(document.getElementById('deleteModal')).hide()
                    this.deleteTarget = null
                })
                .catch((error) => {
                    this.deleteError = this.getRequestErrorMessage(error)
                })
                .finally(() => {
                    this.deletingId = null
                })
        },
        // Extract a readable message from an Axios error.
        getRequestErrorMessage(error) {
            const responseData = error.response?.data
            if (typeof responseData === 'string') {
                return responseData
            }
            if (responseData?.title || responseData?.message) {
                return responseData.title || responseData.message
            }
            if (responseData && typeof responseData === 'object') {
                return JSON.stringify(responseData)
            }
            return error.message || 'Forespørgslen mislykkedes.'
        },
    },
})