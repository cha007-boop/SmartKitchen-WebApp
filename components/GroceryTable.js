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
    },
    template:
        /*html*/
        `<section class="grocery-card card shadow-sm border-0 overflow-hidden" aria-label="Groceries">
            <div class="card-heading card-body d-flex justify-content-between align-items-center gap-3">
                <div>
                    <h2 class="h5 mb-1">All groceries</h2>
                    <p class="small text-secondary mb-0">Items currently in your kitchen</p>
                </div>
                <span class="item-count badge rounded-pill text-bg-success-subtle">
                    {{ items.length }} {{ items.length === 1 ? 'item' : 'items' }}
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
                            <th scope="col" class="small text-uppercase text-secondary">Name</th>
                            <th scope="col" class="small text-uppercase text-secondary">Barcode</th>
                            <th scope="col" class="small text-uppercase text-secondary">Ingredient</th>
                            <th scope="col" class="small text-uppercase text-secondary">Quantity</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="item in items" :key="item.id">
                            <td class="text-secondary">{{ item.id }}</td>
                            <td class="fw-semibold">{{ item.name }}</td>
                            <td>{{ item.barcode }}</td>
                            <td>
                                <span class="ingredient-tag badge rounded-pill text-bg-success-subtle">
                                    {{ item.ingredient }}
                                </span>
                            </td>
                            <td>{{ item.quantity }}</td>
                        </tr>
                        <tr v-if="items.length === 0">
                            <td colspan="5" class="empty-state text-center py-5">
                                <span class="empty-icon d-block fs-3 text-success" aria-hidden="true">+</span>
                                <strong class="d-block">No groceries yet</strong>
                                <span class="d-block small text-secondary mt-1">
                                    Your grocery list will appear here once connected.
                                </span>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </section>`,
})
