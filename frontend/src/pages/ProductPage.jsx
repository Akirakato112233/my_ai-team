import { useEffect, useState } from 'react'

import {
  createProduct,
  deleteProduct,
  fetchProducts,
  updateProduct,
} from '../api/products'
import ProductForm from '../components/ProductForm'
import ProductList from '../components/ProductList'

const emptyForm = {
  name: '',
  price: '',
  description: '',
}

function validateForm(form) {
  const errors = {}

  if (!form.name.trim()) {
    errors.name = ['Name is required.']
  }

  if (!form.price.trim()) {
    errors.price = ['Price is required.']
  } else if (Number.isNaN(Number(form.price))) {
    errors.price = ['Price must be a number.']
  }

  return errors
}

function filterProducts(products, searchTerm) {
  const normalizedSearch = searchTerm.trim().toLowerCase()
  if (!normalizedSearch) {
    return products
  }

  return products.filter((product) =>
    product.name.toLowerCase().includes(normalizedSearch),
  )
}

function ProductPage() {
  const [products, setProducts] = useState([])
  const [form, setForm] = useState(emptyForm)
  const [editingId, setEditingId] = useState(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [deletingId, setDeletingId] = useState(null)
  const [serverError, setServerError] = useState('')
  const [formErrors, setFormErrors] = useState({})
  const [searchTerm, setSearchTerm] = useState('')

  const isEditing = editingId !== null
  const filteredProducts = filterProducts(products, searchTerm)

  useEffect(() => {
    let active = true

    async function loadInitialProducts() {
      try {
        const nextProducts = await fetchProducts()
        if (active) {
          setProducts(nextProducts)
        }
      } catch (error) {
        if (active) {
          setServerError(error.message)
        }
      } finally {
        if (active) {
          setLoading(false)
        }
      }
    }

    loadInitialProducts()

    return () => {
      active = false
    }
  }, [])

  async function refreshProducts() {
    const nextProducts = await fetchProducts()
    setProducts(nextProducts)
  }

  function resetForm() {
    setForm(emptyForm)
    setEditingId(null)
    setFormErrors({})
  }

  function handleChange(event) {
    const { name, value } = event.target
    setForm((currentForm) => ({
      ...currentForm,
      [name]: value,
    }))
  }

  async function handleSubmit(event) {
    event.preventDefault()

    const errors = validateForm(form)
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors)
      return
    }

    setSubmitting(true)
    setServerError('')
    setFormErrors({})

    try {
      if (isEditing) {
        await updateProduct(editingId, form)
      } else {
        await createProduct(form)
      }

      resetForm()
      await refreshProducts()
    } catch (error) {
      setServerError(error.message)
      setFormErrors(error.errors ?? {})
    } finally {
      setSubmitting(false)
    }
  }

  function handleEdit(product) {
    setEditingId(product.id)
    setForm({
      name: product.name,
      price: product.price,
      description: product.description,
    })
    setFormErrors({})
    setServerError('')
  }

  async function handleDelete(product) {
    const confirmed = window.confirm(`Delete "${product.name}"?`)
    if (!confirmed) {
      return
    }

    setDeletingId(product.id)
    setServerError('')

    try {
      await deleteProduct(product.id)

      if (editingId === product.id) {
        resetForm()
      }

      await refreshProducts()
    } catch (error) {
      setServerError(error.message)
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <main className="min-h-screen bg-slate-100 px-4 py-8">
      <div className="mx-auto max-w-5xl">
        <header className="mb-6 rounded-lg border bg-white p-6 shadow-sm">
          <h1 className="text-3xl font-bold text-slate-900">Product Manager</h1>
          <p className="mt-2 text-sm text-slate-500">
            Simple CRUD page for creating, editing, and deleting products.
          </p>
        </header>

        {serverError ? (
          <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {serverError}
          </div>
        ) : null}

        <div className="grid gap-6 lg:grid-cols-2">
          <ProductForm
            form={form}
            errors={formErrors}
            isEditing={isEditing}
            submitting={submitting}
            onChange={handleChange}
            onSubmit={handleSubmit}
            onCancel={resetForm}
          />

          <ProductList
            products={filteredProducts}
            totalProducts={products.length}
            searchTerm={searchTerm}
            loading={loading}
            deletingId={deletingId}
            onSearchChange={setSearchTerm}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </div>
      </div>
    </main>
  )
}

export default ProductPage
