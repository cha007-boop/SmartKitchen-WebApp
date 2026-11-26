const api = axios.create({ baseURL: 'https://smartkitchenapi20261123093015-g3hmc6hgasf9esh2.italynorth-01.azurewebsites.net/api/groceries' })

const app = Vue.createApp({
    data() {
        return {
            currentView: 'groceries',
            apiConfigured: Boolean(api.defaults.baseURL),
            groceryList: [],
            ingredientList: [],
            recipeList: [],
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
                api.get('')
                .then((response) => {
                    this.groceryList = response.data
                    this.errorMessage = ''
                })
                .catch((error) => {
                    console.log(error)
                    this.groceryList = []
                    this.errorMessage = this.getRequestErrorMessage(error)
                })
        },
        // Create an item and reset the form after success.
        postItem() {
            this.isSubmitting = true
            this.postMessage = ''
            this.postError = ''
            axios
                .post(baseURL, this.newItem)
                .then((response) => {
                    console.log('Post method called')
                    this.groceryList.push(response.data)
                    this.postMessage = 'Varen blev tilføjet.'
                    this.newItem = {

                    }
                })
                .catch((error) => {
                    this.postError = this.getRequestErrorMessage(error)
                })
                .finally(() => {
                    this.isSubmitting = false
                })
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

        // Delete the confirmed item with a DELETE request
        deleteItem() {
            const item = this.deleteTarget
            if (!item) {
                return
            }

            this.deletingId = item.id
            this.deleteError = ''

                api.delete('/' + item.id)
                .then(() => {
                    if (item.quantity > 1) {
                        const row = this.groceryList.find((g) => g.id === item.id)
                        row.quantity -= 1
                    } else {
                        this.groceryList = this.groceryList.filter((g) => g.id !== item.id)
                    }
                    this.deleteTarget = null
                })
                .catch((error) => {
                    this.deleteError = this.getRequestErrorMessage(error)
                })
                .finally(() => {
                    this.deletingId = null
                })
        },
    },
    computed: {
        myComputed() {
            return ''
        },
    }
})