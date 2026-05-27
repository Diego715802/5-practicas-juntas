import { defineStore } from 'pinia'

export const useCarritoStore = defineStore('carrito', {
  state: () => ({
    items: JSON.parse(localStorage.getItem('carrito') || '[]')
  }),
  getters: {
    totalItems: (state) => state.items.reduce((s, i) => s + i.cantidad, 0),
    totalPrecio: (state) => state.items.reduce((s, i) => s + (i.precio * i.cantidad), 0),
    cantidadDeProducto: (state) => (id) => state.items.find(i => i.id === id)?.cantidad || 0,
  },
  actions: {
    agregar(producto) {
      const existe = this.items.find(i => i.id === producto.id)
      if (existe) {
        existe.cantidad++
      } else {
        this.items.push({ ...producto, cantidad: 1 })
      }
      this.guardar()
    },
    quitar(id) {
      this.items = this.items.filter(i => i.id !== id)
      this.guardar()
    },
    cambiarCantidad(id, cantidad) {
      if (cantidad <= 0) {
        this.quitar(id)
      } else {
        const item = this.items.find(i => i.id === id)
        if (item) item.cantidad = cantidad
        this.guardar()
      }
    },
    vaciar() {
      this.items = []
      this.guardar()
    },
    guardar() {
      localStorage.setItem('carrito', JSON.stringify(this.items))
    }
  }
})