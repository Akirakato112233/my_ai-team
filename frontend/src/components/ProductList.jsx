function formatPrice(price) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(Number(price || 0))
}

function ProductList({
  products,
  totalProducts,
  searchTerm,
  loading,
  deletingId,
  onSearchChange,
  onEdit,
  onDelete,
}) {
  if (loading) {
    return (
      <section className="rounded-lg border bg-white p-6 shadow-sm">
        <h2 className="text-xl font-semibold text-slate-900">Products</h2>
        <p className="mt-4 text-sm text-slate-500">Loading products...</p>
      </section>
    )
  }

  return (
    <section className="rounded-lg border bg-white p-6 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-semibold text-slate-900">Products</h2>
        <p className="text-sm text-slate-500">{products.length} item(s)</p>
      </div>

      <label className="mb-4 block">
        <span className="mb-1 block text-sm font-medium text-slate-700">
          Search products
        </span>
        <input
          type="search"
          value={searchTerm}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="Search by product name"
          className="w-full rounded-md border px-3 py-2 text-sm focus:border-slate-900 focus:outline-none"
        />
      </label>

      {products.length === 0 ? (
        <p className="mt-4 rounded-md border border-dashed border-slate-300 bg-slate-50 px-4 py-6 text-center text-sm text-slate-500">
          {totalProducts === 0
            ? 'No products yet. Create your first product from the form.'
            : 'No products found.'}
        </p>
      ) : (
        <div className="space-y-3">
          {products.map((product) => (
            <div
              key={product.id}
              className="rounded-lg border border-slate-200 p-4"
            >
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <h3 className="text-base font-semibold text-slate-900">
                    {product.name}
                  </h3>
                  <p className="mt-1 text-sm font-medium text-slate-700">
                    {formatPrice(product.price)}
                  </p>
                  <p className="mt-2 text-sm text-slate-500">
                    {product.description || 'No description.'}
                  </p>
                </div>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => onEdit(product)}
                    className="rounded-md border px-3 py-2 text-sm text-slate-700 hover:bg-slate-50"
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => onDelete(product)}
                    disabled={deletingId === product.id}
                    className="rounded-md border border-red-200 px-3 py-2 text-sm text-red-600 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {deletingId === product.id ? 'Deleting...' : 'Delete'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  )
}

export default ProductList
