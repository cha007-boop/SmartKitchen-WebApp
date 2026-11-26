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
        `<header class="app-header py-3 border-bottom d-flex justify-content-between align-items-center">
            <a class="brand d-inline-flex align-items-center gap-2 text-decoration-none text-body fw-bold fs-5"
                href="#" aria-label="Pantry-startside">
                <span class="brand-mark badge bg-success rounded-3 p-2" aria-hidden="true">S</span>
                <span>SmartKitchen<span class="text-success">.</span></span>
            </a>
            <nav class="view-switch btn-group" role="group" aria-label="Vælg en visning">
                <button
                    type="button"
                    class="view-button btn btn-outline-success"
                    :class="{ active: currentView === 'groceries' }"
                    :aria-pressed="currentView === 'groceries'"
                    @click="$emit('view-change', 'groceries')">
                    Varer
                </button>
                <button
                    type="button"
                    class="view-button btn btn-outline-success"
                    :class="{ active: currentView === 'recipes' }"
                    :aria-pressed="currentView === 'recipes'"
                    @click="$emit('view-change', 'recipes')">
                    Opskrifter
                </button>
            </nav>
        </header>`,
})
