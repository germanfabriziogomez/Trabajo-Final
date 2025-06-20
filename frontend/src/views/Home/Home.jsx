import { useState, useEffect } from "react"
import { Layout } from "../../components/Layout"
import { Link } from "react-router-dom"
import { useAuth } from "../../context/AuthContext"
import { FormUpdate } from "../../components/FormUpdate"

const Home = () => {
  const [products, setProducts] = useState([])
  const [error, setError] = useState(null)
  const [isEditing, setIsEditing] = useState(null)
  const [productEditing, setProductEditing] = useState(null)
  const [inputSearchProduct, setInputSearchProduct] = useState("")
  const { user, logout, token } = useAuth()
  const url_backend = import.meta.env.VITE_DEV_MODE === "development" ? "http://localhost:3000" : import.meta.env.VITE_URL_BACKEND;

  //FUNCIONALIDAD AGREGADA
  const fetchingProductsByName = async () => {
    //limpio el error anterior
    setError("")
    if (inputSearchProduct.length === 0) {
      //si esta vacio el input, solo hago el fetch de todos los productos y no muestro ningun error, y retorno para que no siga ejecutando las lineas siguientes
      fetchingProducts()
      return;
    }

    try {
      const promiseResponse = await fetch(`${url_backend}/api/products/search`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ input: inputSearchProduct })
      })
      const response = await promiseResponse.json()
      if (!response.success) {
        throw new Error(response.message)
      }
      setProducts(response.data)
    } catch (error) {
      setError(error.message)
      //seteo la lista de productos vacia para que no se muestre nada
      setProducts([])
    }
  }
  
  //FUNCIONALIDAD AGREGADA
  useEffect(() => {
    fetchingProductsByName()
  }, [inputSearchProduct])

  const fetchingProducts = async () => {
    try {
      const response = await fetch(`${url_backend}/api/products`)

      if (!response.ok) {
        setError("Sesión terminada, vuelve a loguearte.")
        logout()
        // continuar controlando el home como ruta privada
        throw new Error("Falló el fetch :(")
      }
      const dataProducts = await response.json()

      setProducts(dataProducts.data)
    } catch (error) {
      setError(error.message)
    }
  }



  const handleDelete = async (product) => {
    if (confirm("Esta seguro que quieres borrar el producto?")) {
      try {
        const response = await fetch(`${url_backend}/api/products/${product._id}`, {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` }
        })
        if (response.ok) {
          fetchingProducts()
        }
      } catch (error) {
        setError(error.message)
      }
    }
  }

  const handleUpdate = async (product) => {
    setIsEditing(true)
    setProductEditing(product)
  }


  const handleCancelEditing = () => {
    setIsEditing(null)
    setProductEditing(null)
  }


  return (
    <Layout>
      {user && <p>Bienvenido, {user.email}</p>}
      <h1>Lista de productos</h1>
      <div className="search-bar">
        <input
          type="text"
          placeholder="Busca un producto"
          onChange={(e) => { setInputSearchProduct(e.target.value) }}
          value={inputSearchProduct}
        />
      </div>
      {error && <>
        <div className="error-home">
          <h2>{error}</h2>
          <Link to={"/login"}>Ir al login</Link>
        </div>
      </>}
      {
        isEditing && <FormUpdate product={productEditing} handleCancelEditing={handleCancelEditing} fetchingProducts={fetchingProducts} />
      }
      <section className="grid-products">
        {
          products.map((product) => {
            return (
              <div key={product._id}>
                <h2>{product.name}</h2>
                <p>${product.price}</p>
                <p className="category-product">{product.category}</p>
                {
                  user && <div className="control-product">
                    <button className="btn-update" onClick={() => { handleUpdate(product) }}>Actualizar</button>
                    <button className="btn-delete" onClick={() => { handleDelete(product) }}>Borrar</button>
                  </div>
                }
              </div>
            )
          })
        }
      </section>
    </Layout>
  )
}

export { Home }