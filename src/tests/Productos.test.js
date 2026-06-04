import { mount, flushPromises } from '@vue/test-utils'
import { describe, it, expect, vi } from 'vitest'
import Productos from '@/views/admin/Productos.vue'
import api from '@/plugins/axios'

// Simulamos los roles
vi.mock('@/stores/auth', () => ({
  useAuthStore: vi.fn(() => ({ user: { rol: 'admin' } }))
}))

// Simulamos la API
vi.mock('@/plugins/axios', () => ({
  default: {
    get: vi.fn().mockResolvedValue({
      data: { 
        data: [{ id: 1, nombre: 'Monitor 4K', precio: 5600.00, stock: 12 }],
        meta: { current_page: 1, last_page: 1 }
      }
    })
  }
}))

// Simulamos los servicios
vi.mock('@/services/productoService', () => ({
  createProducto: vi.fn().mockResolvedValue({}),
  updateProducto: vi.fn().mockResolvedValue({}),
  deleteProducto: vi.fn().mockResolvedValue({})
}))

describe('Productos.vue (Inventario Admin)', () => {
  it('carga y muestra los productos desde la API falsa', async () => {
    const wrapper = mount(Productos)
    await flushPromises()
    expect(wrapper.text()).toContain('Monitor 4K')
  })

  it('hace clic en Editar y cambia el formulario', async () => {
    const wrapper = mount(Productos)
    await flushPromises() 
    
    const btnEditar = wrapper.find('.btn-edit')
    await btnEditar.trigger('click')
    
    expect(wrapper.text()).toContain('Editar Producto')
  })

  it('hace clic en Eliminar y muestra alerta de confirmación', async () => {
    window.confirm = vi.fn(() => true) 
    const wrapper = mount(Productos)
    await flushPromises()
    
    const btnEliminar = wrapper.find('.btn-danger')
    await btnEliminar.trigger('click')
    
    expect(window.confirm).toHaveBeenCalled()
  })

  it('llena el formulario y hace clic en guardar', async () => {
    // attachTo: document.body arregla el error de document.getElementById
    const wrapper = mount(Productos, { attachTo: document.body })
    await flushPromises()

    // Buscamos usando el ID (#) porque así lo configura tu InputField
    await wrapper.find('#nombre').setValue('Teclado Mecánico')
    await wrapper.find('#precio').setValue(1200)
    await wrapper.find('#stock').setValue(15)

    await wrapper.find('form').trigger('submit.prevent')
    await flushPromises()
    
    wrapper.unmount() // Limpiamos la memoria del navegador fantasma
  })

  it('usa el botón cancelar después de editar', async () => {
    // attachTo: document.body arregla el error de document.getElementById
    const wrapper = mount(Productos, { attachTo: document.body })
    await flushPromises()
    
    await wrapper.find('.btn-edit').trigger('click')
    await flushPromises()
    
    await wrapper.find('.btn-secondary').trigger('click')
    await flushPromises()
    
    expect(wrapper.text()).toContain('Nuevo Producto')
    wrapper.unmount() // Limpiamos la memoria del navegador fantasma
  })
})