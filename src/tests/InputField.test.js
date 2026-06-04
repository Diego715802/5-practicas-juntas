import { mount } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'
import InputField from '@/components/InputField.vue'

describe('InputField.vue', () => {
  it('muestra el nombre del label correctamente', () => {
    const wrapper = mount(InputField, {
      props: { label: 'Precio', name: 'precio', modelValue: 10 }
    })
    expect(wrapper.text()).toContain('Precio:')
  })

  it('muestra el mensaje de error cuando se le pasa la propiedad', () => {
    const wrapper = mount(InputField, {
      props: { label: 'Stock', name: 'stock', error: 'El campo es obligatorio' }
    })
    expect(wrapper.text()).toContain('El campo es obligatorio')
    expect(wrapper.find('.error-msg').exists()).toBe(true)
  })

  it('emite el evento al escribir en el input', async () => {
    const wrapper = mount(InputField, {
      props: { label: 'Nombre', name: 'nombre', modelValue: '' }
    })
    const input = wrapper.find('input')
    await input.setValue('Nuevo Valor')
    
    // Verificamos que el input le avise a Vue que el texto cambió
    expect(wrapper.emitted('update:modelValue')).toBeTruthy()
    expect(wrapper.emitted('update:modelValue')[0]).toEqual(['Nuevo Valor'])
  })
})