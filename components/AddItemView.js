app.component('add-item-view', {
    props: {
        isSubmitting: Boolean,
        postMessage: String,
        postError: String,
        apiConfigured: Boolean,
    },
    emits: ['submit-item'],
    data() {
        return {
            item: {
                id: null,
                name: '',
                barcode: '',
                ingredient: '',
                quantity: 1,
            },
        }
    },
    methods: {
        submitItem() {
            this.$emit('submit-item', { ...this.item })
        },
    },
    watch: {
        postMessage(message) {
            if (message) {
                this.item = {
                    id: null,
                    name: '',
                    barcode: '',
                    ingredient: '',
                    quantity: 1,
                }
            }
        },
    },
    template:
        /*html*/
        `<section class="add-item-card card shadow-sm border-0" aria-label="Tilføj en vare">
            <div class="card-heading card-body">
                <h2 class="h5 mb-1">Ny vare</h2>
                <p class="small text-secondary mb-0">Udfyld oplysningerne for varen</p>
            </div>

            <form class="add-item-form p-4" @submit.prevent="submitItem">
                <div v-if="!apiConfigured" class="api-notice alert alert-info py-2 mb-4" role="status">
                    Varen kan først gemmes, når URL-adressen til SmartKitchen-API’en er konfigureret.
                </div>

                <div class="row g-3">
                    <div class="col-md-6">
                        <label class="form-label" for="item-name">Navn</label>
                        <input id="item-name" v-model.trim="item.name" class="form-control" type="text" required>
                    </div>
                    <div class="col-md-6">
                        <label class="form-label" for="item-ingredient">Ingrediens</label>
                        <input id="item-ingredient" v-model.trim="item.ingredient" class="form-control" type="text" required>
                    </div>
                    <div class="col-md-6">
                        <label class="form-label" for="item-quantity">Antal</label>
                        <input id="item-quantity" v-model.number="item.quantity" class="form-control" type="number"
                            min="1" step="1" required>
                    </div>
                </div>

                <div v-if="postMessage" class="alert alert-success mt-4 mb-0" role="status">{{ postMessage }}</div>
                <div v-if="postError" class="alert alert-danger mt-4 mb-0" role="alert">{{ postError }}</div>

                <div class="d-flex justify-content-end mt-4">
                    <button class="btn btn-success px-4" type="submit" :disabled="isSubmitting || !apiConfigured">
                        {{ isSubmitting ? 'Tilføjer…' : 'Tilføj vare' }}
                    </button>
                </div>
            </form>
        </section>`,
})
