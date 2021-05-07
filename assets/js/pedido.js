document.addEventListener("DOMContentLoaded", () => {
    fetchData()
})

const fetchData = async () => {
    try {
        const res = await fetch('https://proyecto2-b.herokuapp.com//Medicamentos')
        const data = await res.json()        
        pintarProductos(data)
    } catch (error) {
        console.log(error)
    }
}

const contendorProductos = document.querySelector('#filas_medicamentos')

contendorProductos.addEventListener('click', e =>{
    addCarrito(e)
})

const pintarProductos = (data) => {
    const template = document.querySelector('#cuadrados_medi').content
    const fragment = document.createDocumentFragment()    
    data.forEach(producto => {        
        template.querySelector('h5').textContent = producto.Nombre
        template.querySelector('p').textContent = producto.Descripcion
        template.querySelector('button').textContent = producto.Precio
        template.querySelector('button').dataset.nombre = producto.Nombre
        const clone = template.cloneNode(true)
        fragment.appendChild(clone)
    })
    contendorProductos.appendChild(fragment)
}

let carrito = {}

const addCarrito = e => {      
    if(e.target.classList.contains('btn-outline-info')){        
        setCarrito(e.target.parentElement)
    }
    e.stopPropagation()
}

const setCarrito = objeto => {      
    const producto = {
      nombre: objeto.querySelector('h5').textContent,
      precio: objeto.querySelector('button').textContent,
      cantidad: 1
    }

    if(carrito.hasOwnProperty(producto.nombre)){
        producto.cantidad = carrito[producto.nombre].cantidad + 1
    }
    
    carrito[producto.nombre] = {...producto}
    pintarCarrito()      
}

const items = document.querySelector('#medicamentos')

items.addEventListener('click', e =>{
    btnAccion(e)
})

const pintarCarrito = () => {
    
    items.innerHTML = ''

    const template = document.querySelector('#carrito_medicamentos').content
    const fragment = document.createDocumentFragment()

    Object.values(carrito).forEach(producto => {        
        template.querySelector('th').textContent = producto.nombre
        template.querySelectorAll('td')[0].textContent = producto.precio
        template.querySelectorAll('td')[1].textContent = producto.cantidad
        template.querySelector('span').textContent = parseFloat(producto.precio) * producto.cantidad
                
        template.querySelector('.btn-outline-primary').dataset.nombre = producto.nombre
        template.querySelector('.btn-outline-warning').dataset.nombre = producto.nombre

        const clone = template.cloneNode(true)
        fragment.appendChild(clone)
    })

    items.appendChild(fragment)

    pintarFooter()    
}

const footer = document.querySelector('#ultima_fila')
const pintarFooter = () => {

    footer.innerHTML = ''

    if (Object.keys(carrito).length === 0) {
        footer.innerHTML = `
        <th scope="row" colspan="5">El Carrito esta vacio :(</th>
        `
        return
    }

    const template = document.querySelector('#totales').content
    const fragment = document.createDocumentFragment()

    const nCantidad = Object.values(carrito).reduce((acc, { cantidad }) => acc + cantidad, 0)
    const nPrecio = Object.values(carrito).reduce((acc, {cantidad, precio}) => acc + cantidad * precio ,0)
    
    template.querySelectorAll('td')[0].textContent = nCantidad
    template.querySelector('span').textContent = nPrecio

    const clone = template.cloneNode(true)
    fragment.appendChild(clone)

    footer.appendChild(fragment)

    const boton = document.querySelector('#limpiar_carrito')
    boton.addEventListener('click', () => {
        carrito = {}
        pintarCarrito()
    })

}

const btnAccion = e => {    
    if(e.target.classList.contains('btn-outline-primary')){        
        console.log(carrito[e.target.dataset.nombre])
        const producto = carrito[e.target.dataset.nombre]
        producto.cantidad = carrito[e.target.dataset.nombre].cantidad + 1
        carrito[e.target.dataset.nombre] = {...producto}
        pintarCarrito()        
    }
    
    if(e.target.classList.contains('btn-outline-warning')){        
        console.log(carrito[e.target.dataset.nombre])
        const producto = carrito[e.target.dataset.nombre]
        producto.cantidad = carrito[e.target.dataset.nombre].cantidad - 1
        if(producto.cantidad == 0){
            delete carrito[e.target.dataset.nombre]
        }        
        pintarCarrito()        
    }
    e.stopPropagation()
}

function HacerPedido(){    
    var paciente = sessionStorage.buscar_apaciente
    var productos = []
    productos = carrito

    var objeto = {        
        'paciente': paciente,
        'medicamento': productos
    }
    console.log(objeto)

    fetch('http://localhost:3000/Pedido', {
    method: 'POST',
    body: JSON.stringify(objeto),
    headers:{
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',}})
        
    .then(res => res.json())
    .catch(err => {
        console.error('Error:', err)
        alert("Datos Incompletos")
    })
    .then(response =>{        
        console.log(response);   
        alert(response.Mensaje);
        carrito = {}
        pintarCarrito()
    })   
}
