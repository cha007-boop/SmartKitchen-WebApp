const baseURL = "https://smartkitchenapi20261123093015-g3hmc6hgasf9esh2.italynorth-01.azurewebsites.net/api/groceries/"

// Saved translation API endpoints for later:
// 1. MyMemory: https://api.mymemory.translated.net/get (params: { q, langpair: 'en|da' })
// 2. Google Translate (gtx): https://translate.googleapis.com/translate_a/single (params: { client: 'gtx', sl: 'en', tl: 'da', dt: 't', q })

const app = Vue.createApp({
    data() {
        return {
            currentView: 'groceries',
            apiConfigured: Boolean(baseURL),
            groceryList: [],
            ingredientList: [],
            recipeList: [
                {
                    //This is how the properties match onto the backend model
                    //id = Id
                    //name = Name
                    //ingredients = IngredientStrings
                    //description = Instructions
                    //imageLink = thumbnailUrl
                    id: 1,
                    name: 'Baked Tomato Pasta',
                    type: 'Dinner',
                    ingredients: ['pasta', 'tomato', 'garlic', 'spinach'],
                    description: 'Preheat the oven to 200 degrees. Place tomatoes and whole garlic cloves in an ovenproof dish, drizzle with olive oil, and bake for about 25 minutes until the tomatoes are soft and start to split. Boil the pasta al dente in the meantime. Lightly mash the tomatoes and garlic with a fork to form a sauce. Toss the cooked pasta and a handful of spinach into the sauce until the spinach wilts. Season to taste with salt and pepper.',
                    imageLink: 'https://cdn-free.tv2i.dk/l/e/g/legacy/2/3/9/239106ee-3c28-4f79-878a-441cac6d84ae?ixlib=js-3.8.0&w=624&h=351&q=45&auto=format&fit=crop&rect64=MCwwLDI3MTYsMTUyNQ&s=5707cdebb918268738e5eb9d1554597c',
                },
                {
                    id: 2,
                    name: 'Chickpea Wrap',
                    type: 'Lunch',
                    ingredients: ['tortilla', 'chickpeas', 'cucumber', 'tomato'],
                    description: 'Rinse the chickpeas and coarsely mash them with a fork so some stay whole. Season with salt, pepper, and a little cumin if desired. Dice the cucumber and tomato. Warm the tortilla briefly in a dry pan until soft. Spread the mashed chickpeas on the tortilla, top with cucumber and tomato, and roll it up tightly. Cut the wrap in half and serve immediately.',
                    imageLink: 'https://cdn-free.tv2i.dk/l/e/g/legacy/2/3/9/239106ee-3c28-4f79-878a-441cac6d84ae?ixlib=js-3.8.0&w=624&h=351&q=45&auto=format&fit=crop&rect64=MCwwLDI3MTYsMTUyNQ&s=5707cdebb918268738e5eb9d1554597c',
                },
                {
                    id: 3,
                    name: 'Oatmeal with Apple',
                    type: 'Breakfast',
                    ingredients: ['oats', 'milk', 'apple', 'cinnamon'],
                    description: 'Put oats and milk in a saucepan and bring to a boil while stirring. Let the porridge simmer for 5 minutes until thick and creamy. Grate or chop the apple into small pieces and stir it into the porridge during the last couple of minutes. Spoon into a bowl, sprinkle with cinnamon, and serve warm.',
                    imageLink: 'https://cdn-free.tv2i.dk/l/e/g/legacy/2/3/9/239106ee-3c28-4f79-878a-441cac6d84ae?ixlib=js-3.8.0&w=624&h=351&q=45&auto=format&fit=crop&rect64=MCwwLDI3MTYsMTUyNQ&s=5707cdebb918268738e5eb9d1554597c',
                },
                {
                    id: 4,
                    name: 'Tomato Soup',
                    type: 'Lunch',
                    ingredients: ['tomato', 'onion', 'vegetable broth'],
                    description: 'Finely chop the onion and sauté it in oil in a pot until soft and translucent. Add crushed tomatoes and vegetable broth prepared with water according to package instructions. Let the soup simmer for 20 minutes. Blend until smooth with an immersion blender. Season to taste with salt and pepper and serve with a piece of bread.',
                    imageLink: 'https://cdn-free.tv2i.dk/l/e/g/legacy/2/3/9/239106ee-3c28-4f79-878a-441cac6d84ae?ixlib=js-3.8.0&w=624&h=351&q=45&auto=format&fit=crop&rect64=MCwwLDI3MTYsMTUyNQ&s=5707cdebb918268738e5eb9d1554597c',
                },
                {
                    id: 5,
                    name: 'Oven-Roasted Root Vegetables',
                    type: 'Dinner',
                    ingredients: ['potato', 'carrot', 'red onion'],
                    description: 'Preheat the oven to 200 degrees. Cut potatoes and carrots into rough chunks and cut the red onion into wedges. Toss everything with olive oil, salt, and pepper, and spread in a single layer on a baking sheet. Bake for 35 to 40 minutes, turning halfway through so they become golden and tender all over.',
                    imageLink: 'https://cdn-free.tv2i.dk/l/e/g/legacy/2/3/9/239106ee-3c28-4f79-878a-441cac6d84ae?ixlib=js-3.8.0&w=624&h=351&q=45&auto=format&fit=crop&rect64=MCwwLDI3MTYsMTUyNQ&s=5707cdebb918268738e5eb9d1554597c',
                },
                {
                    id: 6,
                    name: 'Banana Pancakes',
                    type: 'Breakfast',
                    ingredients: ['banana', 'egg', 'oats'],
                    description: 'Mash a ripe banana in a bowl and whisk in two eggs. Stir in oats and let the batter rest for 5 minutes so the oats absorb some liquid. Heat a pan over medium heat with a little butter or oil. Spoon small portions of batter onto the pan and cook for about 2 minutes per side until golden. Serve with fruit or honey.',
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
            editingId: null,
            editItem: null,
            isUpdating: false,
            deletingId: null,
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
    computed: {
        myComputed() {
            return ''
        },
    },
    methods: {
        toApiItem(item) {
            return {
                id: item.id,
                name: item.name,
                barcode: item.barcode ?? '',
                ingredient: item.ingredient,
                quantity: Number(item.quantity),
            }
        },
        getAll() {
            if (!baseURL) {
                this.errorMessage = 'The SmartKitchen API URL is not configured yet.'
                return
            }

            axios
                .get(baseURL)
                .then((response) => {
                    this.groceryList = response.data.filter((item) => Number(item.quantity) > 0)
                    this.errorMessage = ''
                })
                .catch((error) => {
                    console.error('getAll failed:', error)
                    this.groceryList = []
                    this.errorMessage = this.getRequestErrorMessage(error)
                })
        },
        postItem(item) {
            if (!baseURL) {
                this.postError = 'The SmartKitchen API URL is not configured yet.'
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
                        this.postError = 'The API did not return an item. Check the details and try again.'
                        return
                    }
                    this.completePostItem(response, 'Item added.')
                })
                .catch((error) => {
                    console.error('postItem failed:', error)
                    this.postError = error.response?.status === 404
                        ? 'Item not found. Check the name and ingredient. It was not added.'
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
        startEdit(item) {
            this.editingId = item.id
            this.editItem = {
                name: item.name,
                ingredient: item.ingredient,
                quantity: item.quantity,
            }
            this.updateMessage = ''
            this.updateError = ''
        },
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
                    const index = this.groceryList.findIndex((item) => item.id === id)
                    if (index !== -1) {
                        this.groceryList.splice(index, 1, {
                            ...this.groceryList[index],
                            ...(response.data && typeof response.data === 'object'
                                ? response.data
                                : updatedItem),
                        })
                    }
                    this.editingId = null
                    this.editItem = null
                    this.updateMessage = 'Item updated.'
                    this.getAll()
                })
                .catch((error) => {
                    console.error('putItem failed:', error)
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
                this.updateError = 'Quantity must be a whole number of 0 or greater.'
                return
            }
            if (!baseURL) {
                this.updateError = 'The SmartKitchen API URL is not configured yet.'
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
                    console.error('updateGroceryItem failed:', error)
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
                this.removeError = `Enter a number between 1 and ${currentQuantity}.`
                return
            }

            if (!baseURL) {
                this.removeError = 'The SmartKitchen API URL is not configured yet.'
                return
            }

            const remainingQuantity = currentQuantity - removeAmount
            this.isRemoving = true
            this.removeError = ''

            if (remainingQuantity === 0) {
                axios
                    .put(baseURL + item.id, { ...this.toApiItem(item), quantity: 0 })
                    .then(() => {
                        this.groceryList = this.groceryList.filter((grocery) => grocery.id !== item.id)
                        this.removeCompleted += 1
                    })
                    .catch((error) => {
                        console.error('removeItem (0) failed:', error)
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
                    console.error('removeItem failed:', error)
                    this.removeError = this.getRequestErrorMessage(error)
                })
                .finally(() => {
                    this.isRemoving = false
                })
        },
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
                    const modalEl = document.getElementById('deleteModal')
                    if (modalEl && typeof bootstrap !== 'undefined') {
                        bootstrap.Modal.getOrCreateInstance(modalEl).hide()
                    }
                    this.deleteTarget = null
                })
                .catch((error) => {
                    console.error('deleteItem failed:', error)
                    this.deleteError = this.getRequestErrorMessage(error)
                })
                .finally(() => {
                    this.deletingId = null
                })
        },
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
            return error.message || 'The request failed.'
        },
    },
})