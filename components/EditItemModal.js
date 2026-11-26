app.component('edit-item-modal', {
    props: {
        isUpdating: {
            type: Boolean,
            default: false,
        },
        updateError: {
            type: String,
            default: '',
        },
        editCompleted: {
            type: Number,
            default: 0,
        },
    },
    emits: ['confirm-edit'],
    data() {
        return {
            item: null,
            name: '',
            ingredient: '',
            quantity: 0,
        }
    },
    computed: {
        isValid() {
            const quantity = Number(this.quantity)
            if (this.quantity === '' || this.quantity === null) {
                return false
            }
            return Boolean(this.item)
                && Boolean(this.name.trim())
                && Boolean(this.ingredient.trim())
                && Number.isInteger(quantity)
                && quantity >= 0
        },
    },
    watch: {
        editCompleted() {
            bootstrap.Modal.getOrCreateInstance(document.getElementById('editItemModal')).hide()
            this.item = null
        },
    },
    methods: {
        open(item) {
            this.item = { ...item }
            this.name = item.name
            this.ingredient = item.ingredient
            this.quantity = item.quantity
            bootstrap.Modal.getOrCreateInstance(document.getElementById('editItemModal')).show()
        },
        confirmEdit() {
            if (!this.isValid || this.isUpdating) {
                return
            }
            this.$emit('confirm-edit', {
                item: this.item,
                name: this.name,
                ingredient: this.ingredient,
                quantity: Number(this.quantity),
            })
        },
    },
    template:
        /*html*/
        `<div class="modal fade" id="editItemModal" tabindex="-1" aria-labelledby="editItemTitle"
            aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered">
                <form class="modal-content" @submit.prevent="confirmEdit">
                    <div class="modal-header">
                        <h2 class="modal-title fs-5" id="editItemTitle">Rediger vare</h2>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Luk"></button>
                    </div>
                    <div class="modal-body">
                        <div class="mb-3">
                            <label class="form-label" for="editItemName">Navn</label>
                            <input id="editItemName" v-model.trim="name" type="text" class="form-control" required>
                        </div>
                        <div class="mb-3">
                            <label class="form-label" for="editItemIngredient">Ingrediens</label>
                            <input id="editItemIngredient" v-model.trim="ingredient" type="text"
                                class="form-control" required>
                        </div>
                        <div>
                            <label class="form-label" for="editItemQuantity">Mængde</label>
                            <input id="editItemQuantity" v-model.number="quantity" type="number" class="form-control"
                                min="0" step="1" required>
                        </div>
                        <div v-if="updateError" class="alert alert-danger mt-3 mb-0" role="alert">
                            {{ updateError }}
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Annuller</button>
                        <button type="submit" class="btn btn-success" :disabled="isUpdating || !isValid">
                            {{ isUpdating ? 'Gemmer…' : 'Gem ændringer' }}
                        </button>
                    </div>
                </form>
            </div>
        </div>`,
})
