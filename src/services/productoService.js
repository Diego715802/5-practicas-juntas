import api from '@/plugins/axios'

export const getProductos = () => api.get('/productos')
// FormData requiere headers específicos
export const createProducto = (fd) => api.post('/productos', fd, {
    headers: { 'Content-Type': 'multipart/form-data' }
})
// Truco de Laravel: mandamos archivo como POST pero con _method=PUT adentro
export const updateProducto = (id, fd) => {
    fd.append('_method', 'PUT')
    return api.post(`/productos/${id}`, fd, {
        headers: { 'Content-Type': 'multipart/form-data' }
    })
}
export const deleteProducto = (id) => api.delete(`/productos/${id}`)