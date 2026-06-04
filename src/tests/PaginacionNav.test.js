import { mount } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'
import PaginacionNav from '@/components/PaginacionNav.vue'

describe('PaginacionNav.vue', () => {
  it('renderiza los botones correctamente', () => {
    // Simulamos que estamos en la página 2 de 5
    const meta = { current_page: 2, last_page: 5 }
    const wrapper = mount(PaginacionNav, { props: { meta } })
    
    // Verificamos que el botón 2 exista
    expect(wrapper.text()).toContain('2')
    expect(wrapper.text()).toContain('Siguiente')
  })

  it('emite el evento al hacer clic en Siguiente', async () => {
    const meta = { current_page: 2, last_page: 5 }
    const wrapper = mount(PaginacionNav, { props: { meta } })

    // Buscamos el botón de "Siguiente" y le hacemos clic
    const botones = wrapper.findAll('button')
    await botones[botones.length - 1].trigger('click')

    // Verificamos que le avisó al sistema que cambie de página
    expect(wrapper.emitted('cambio-pagina')).toBeTruthy()
  })
})