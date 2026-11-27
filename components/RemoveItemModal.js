app.component('remove-item-modal', {
    props: {
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
    },
    emits: ['confirm-remove'],
    data() {
        return {
            item: null,
            amount: 1,
        }
    },
    computed: {
        amountIsValid() {
            if (!this.item) {
                return false
            }
            const amount = Number(this.amount)
            return Number.isInteger(amount) && amount >= 1 && amount <= Number(this.item.quantity)
        },
    },
    watch: {
        removeCompleted(newVal, oldVal) {
            if (newVal === oldVal || newVal === 0) {
                return
            }
            const confirmEl = document.getElementById('removeConfirmModal')
            if (confirmEl && typeof bootstrap !== 'undefined') {
                bootstrap.Modal.getOrCreateInstance(confirmEl).hide()
            }
            this.item = null
            this.amount = 1
        },
    },
    methods: {
        open(item) {
            this.item = item
            this.amount = 1

            if (Number(item.quantity) === 1) {
                const confirmEl = document.getElementById('removeConfirmModal')
                if (confirmEl && typeof bootstrap !== 'undefined') {
                    bootstrap.Modal.getOrCreateInstance(confirmEl).show()
                }
                return
            }

            const amountEl = document.getElementById('removeAmountModal')
            if (amountEl && typeof bootstrap !== 'undefined') {
                bootstrap.Modal.getOrCreateInstance(amountEl).show()
            }
        },
        showConfirmModal() {
            const amountEl = document.getElementById('removeAmountModal')
            const confirmEl = document.getElementById('removeConfirmModal')
            if (!confirmEl || typeof bootstrap === 'undefined') {
                return
            }

            if (amountEl && amountEl.classList.contains('show')) {
                amountEl.addEventListener(
                    'hidden.bs.modal',
                    () => {
                        bootstrap.Modal.getOrCreateInstance(confirmEl).show()
                    },
                    { once: true }
                )
                bootstrap.Modal.getOrCreateInstance(amountEl).hide()
            } else {
                bootstrap.Modal.getOrCreateInstance(confirmEl).show()
            }
        },
        confirmRemove() {
            if (!this.amountIsValid || this.isRemoving) {
                return
            }
            this.$emit('confirm-remove', { item: this.item, amount: Number(this.amount) })
        },
    },
    template:
        /*html*/
        `<div>
            <div class="modal fade" id="removeAmountModal" tabindex="-1" aria-labelledby="removeAmountTitle"
                aria-hidden="true">
                <div class="modal-dialog modal-dialog-centered">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h2 class="modal-title fs-5" id="removeAmountTitle">Fjern antal</h2>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Luk"></button>
                        </div>
                        <div class="modal-body">
                            <p class="mb-3">
                                Hvor mange <strong>{{ item ? item.name : '' }}</strong> vil du fjerne?
                            </p>
                            <label class="form-label" for="removeAmount">Antal</label>
                            <input id="removeAmount" v-model.number="amount" type="number" class="form-control"
                                min="1" :max="item ? item.quantity : 1" step="1" required>
                            <div v-if="item" class="form-text">Der er {{ item.quantity }} på lager.</div>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Annuller</button>
                            <button type="button" class="btn btn-danger" :disabled="!amountIsValid"
                                @click="showConfirmModal">
                                Fortsæt
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div class="modal fade" id="removeConfirmModal" tabindex="-1" aria-labelledby="removeConfirmTitle"
                aria-hidden="true">
                <div class="modal-dialog modal-dialog-centered">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h2 class="modal-title fs-5" id="removeConfirmTitle">Bekræft fjernelse</h2>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Luk"></button>
                        </div>
                        <div class="modal-body">
                            <p v-if="item" class="mb-0">
                                Er du sikker på, at du vil fjerne
                                <strong>{{ amount }} {{ amount === 1 ? 'vare' : 'varer' }}</strong>
                                af <strong>{{ item.name }}</strong>?
                            </p>
                            <div v-if="removeError" class="alert alert-danger mt-3 mb-0" role="alert">
                                {{ removeError }}
                            </div>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Nej</button>
                            <button type="button" class="btn btn-danger" :disabled="isRemoving || !amountIsValid"
                                @click="confirmRemove">
                                {{ isRemoving ? 'Fjerner…' : 'Ja, fjern' }}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>`,
})