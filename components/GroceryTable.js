app.component('grocery-table', {
    props: {
        items: {
            type: Array,
            required: true,
        },
        errorMessage: {
            type: String,
            required: true,
        },
        apiConfigured: {
            type: Boolean,
            required: true,
        },
        isRemoving: {
            type: Boolean,
            default: false,
        },
        removeError: {
            type: String,
            default: '',
        },
        removeCompleted: {
            type: Number,
            default: 0,
        },
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
    emits: ['remove-item', 'edit-item', 'edit-modal-open'],
    methods: {
        openRemoveModal(item) {
            this.$refs.removeItemModal.open(item)
        },
        openEditModal(item) {
            this.$emit('edit-modal-open')
            this.$refs.editItemModal.open(item)
        },
    },
    template:
        /*html*/
        `<section class="grocery-card card shadow-sm border-0 overflow-hidden" aria-label="Indkøb">
            <div class="card-heading card-body d-flex justify-content-between align-items-center gap-3">
                <div>
                    <h2 class="h5 mb-1">Alle varer</h2>
                    <p class="small text-secondary mb-0">Varer, der i øjeblikket er i dit køkken</p>
                </div>
                <span class="item-count badge rounded-pill text-bg-success-subtle">
                    {{ items.length }} {{ items.length === 1 ? 'vare' : 'varer' }}
                </span>
            </div>

            <div v-if="errorMessage" class="api-notice alert mx-3 mb-3 py-2 d-flex align-items-center gap-2 small"
                :class="apiConfigured ? 'alert-warning' : 'alert-info'" role="status">
                <span class="badge rounded-circle text-bg-secondary" aria-hidden="true">i</span>
                <span>{{ errorMessage }}</span>
            </div>

            <div class="grocery-table-wrap table-responsive border-top">
                <table class="grocery-table table table-hover align-middle mb-0">
                    <thead class="table-light">
                        <tr>
                            <th scope="col" class="small text-uppercase text-secondary">ID</th>
                            <th scope="col" class="small text-uppercase text-secondary">Navn</th>
                            <th scope="col" class="small text-uppercase text-secondary">Ingrediens</th>
                            <th scope="col" class="small text-uppercase text-secondary">Antal</th>
                            <th scope="col" class="small text-uppercase text-secondary">Handlinger</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="item in items" :key="item.id">
                            <td class="text-secondary">{{ item.id }}</td>
                            <td class="fw-semibold">{{ item.name }}</td>
                            <td>
                                <span class="ingredient-tag badge rounded-pill text-bg-success-subtle">
                                    {{ item.ingredient }}
                                </span>
                            </td>
                            <td>{{ item.quantity }}</td>
                            <td>
                                <div class="d-flex gap-2">
                                    <button
                                        type="button"
                                        class="btn btn-outline-secondary btn-sm"
                                        @click="openEditModal(item)">
                                        Rediger
                                    </button>
                                    <button
                                        type="button"
                                        class="btn btn-outline-danger btn-sm"
                                        :disabled="item.quantity < 1"
                                        @click="openRemoveModal(item)">
                                        Fjern
                                    </button>
                                </div>
                            </td>
                        </tr>
                        <tr v-if="items.length === 0">
                            <td colspan="5" class="empty-state text-center py-5">
                                <span class="empty-icon d-block fs-3 text-success" aria-hidden="true">+</span>
                                <strong class="d-block">Ingen varer endnu</strong>
                                <span class="d-block small text-secondary mt-1">
                                    Din indkøbsliste vises her, når forbindelsen er oprettet.
                                </span>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <remove-item-modal
                ref="removeItemModal"
                :is-removing="isRemoving"
                :remove-error="removeError"
                :remove-completed="removeCompleted"
                @confirm-remove="$emit('remove-item',$event)">
            </remove-item-modal>
            <edit-item-modal
                ref="editItemModal"
                :is-updating="isUpdating"
                :update-error="updateError"
                :edit-completed="editCompleted"
                @confirm-edit="$emit('edit-item',$event)">
            </edit-item-modal>
        </section>`,
})