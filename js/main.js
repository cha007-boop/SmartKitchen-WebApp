const baseURL = 'https://smartkitchenapi20261123093015-g3hmc6hgasf9esh2.italynorth-01.azurewebsites.net/api/groceries'

const app = Vue.createApp({
    data() {
        return {
            currentView: 'groceries',
            apiConfigured: Boolean(baseURL),
            groceryList: [],
            ingredientList: [],
            recipeList: [
                {
                    id: 1,
                    name: 'Bagt tomatpasta',
                    type: 'Aftensmad',
                    ingredients: ['pasta', 'tomat', 'hvidløg', 'spinat'],
                },
                {
                    id: 2,
                    name: 'Kikærtewrap',
                    type: 'Frokost',
                    ingredients: ['tortilla', 'kikærter', 'agurk', 'tomat'],
                },
                {
                    id: 3,
                    name: 'Havregrød med æble',
                    type: 'Morgenmad',
                    ingredients: ['havregryn', 'mælk', 'æble', 'kanel'],
                },
                {
                    id: 4,
                    name: 'Tomatsuppe',
                    type: 'Frokost',
                    ingredients: ['tomat', 'løg', 'grøntsagsbouillon'],
                },
                {
                    id: 5,
                    name: 'Ovnbagte rodfrugter',
                    type: 'Aftensmad',
                    ingredients: ['kartoffel', 'gulerod', 'rødløg'],
                },
                {
                    id: 6,
                    name: 'Bananpandekager',
                    type: 'Morgenmad',
                    ingredients: ['banan', 'æg', 'havregryn'],
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
    mounted() {
        this.getAll()
    },
    methods: {
        // Fetch items using the current filters and sort order.
        getAll() {
            if (!baseURL) {
                this.errorMessage = 'URL-adressen til SmartKitchen-API’en er endnu ikke konfigureret.'
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
                this.postError = 'URL-adressen til SmartKitchen-API’en er endnu ikke konfigureret.'
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
                        this.postError = 'API’et returnerede ikke en vare. Kontrollér oplysningerne, og prøv igen.'
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
            if (!name || !name.trim() || !ingredient || !ingredient.trim()) {
                this.updateError = 'Navn og ingrediens skal udfyldes.'
                return
            }
            if (!Number.isInteger(updatedQuantity) || updatedQuantity < 0) {
                this.updateError = 'Mængden skal være et helt tal på 0 eller større.'
                return
            }
            if (!baseURL) {
                this.updateError = 'URL-adressen til SmartKitchen-API’en er endnu ikke konfigureret.'
                return
            }

            const updatedItem = {
                ...item,
                name: name.trim(),
                ingredient: ingredient.trim(),
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
                this.removeError = 'URL-adressen til SmartKitchen-API’en er endnu ikke konfigureret.'
                return
            }

            const remainingQuantity = currentQuantity - removeAmount
            this.isRemoving = true
            this.removeError = ''

            if (remainingQuantity === 0) {
                axios
                    .put(baseURL + item.id, { ...item, quantity: 0 })
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

            const updatedItem = { ...item, quantity: remainingQuantity }
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
    computed: {
        myComputed() {
            return ''
        },
    }
})