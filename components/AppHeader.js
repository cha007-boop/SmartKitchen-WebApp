app.component('app-header', {
    props: {
        currentView: {
            type: String,
            required: true,
        },
    },
    emits: ['view-change'],
    template:
        /*html*/
        `<header class="py-3 border-bottom d-flex justify-content-between align-items-center">
            <a class="d-inline-flex align-items-center gap-2 text-decoration-none text-body fw-bold fs-5"
                href="#" aria-label="Pantry home">
                <span class="badge bg-success rounded-3 p-2" aria-hidden="true">P</span>
                <span>pantry<span class="text-success">.</span></span>
            </a>
            <nav class="btn-group" role="group" aria-label="Choose a view">
                <button
                    type="button"
                    class="btn btn-outline-success"
                    :class="{ active: currentView === 'groceries' }"
                    :aria-pressed="currentView === 'groceries'"
                    @click="$emit('view-change', 'groceries')">
                    Groceries
                </button>
                <button
                    type="button"
                    class="btn btn-outline-success"
                    :class="{ active: currentView === 'recipes' }"
                    :aria-pressed="currentView === 'recipes'"
                    @click="$emit('view-change', 'recipes')">
                    Recipes
                </button>
            </nav>
        </header>`,
})
