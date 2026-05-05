function ProductForm({
  form,
  errors,
  isEditing,
  submitting,
  onChange,
  onSubmit,
  onCancel,
}) {
  return (
    <form className="rounded-lg border bg-white p-6 shadow-sm" onSubmit={onSubmit}>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-slate-900">
            {isEditing ? 'Edit Product' : 'Create Product'}
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Fill in the product details below.
          </p>
        </div>

        {isEditing ? (
          <button
            type="button"
            onClick={onCancel}
            className="rounded-md border px-3 py-2 text-sm text-slate-600 hover:bg-slate-50"
          >
            Cancel
          </button>
        ) : null}
      </div>

      <div className="space-y-4">
        <label className="block">
          <span className="mb-1 block text-sm font-medium text-slate-700">Name</span>
          <input
            name="name"
            value={form.name}
            onChange={onChange}
            placeholder="Desk lamp"
            className="w-full rounded-md border px-3 py-2 text-sm focus:border-slate-900 focus:outline-none"
          />
          {errors.name ? (
            <p className="mt-1 text-sm text-red-600">{errors.name[0]}</p>
          ) : null}
        </label>

        <label className="block">
          <span className="mb-1 block text-sm font-medium text-slate-700">Price</span>
          <input
            name="price"
            value={form.price}
            onChange={onChange}
            placeholder="49.90"
            className="w-full rounded-md border px-3 py-2 text-sm focus:border-slate-900 focus:outline-none"
          />
          {errors.price ? (
            <p className="mt-1 text-sm text-red-600">{errors.price[0]}</p>
          ) : null}
        </label>

        <label className="block">
          <span className="mb-1 block text-sm font-medium text-slate-700">
            Description
          </span>
          <textarea
            name="description"
            rows="4"
            value={form.description}
            onChange={onChange}
            placeholder="Short product details"
            className="w-full rounded-md border px-3 py-2 text-sm focus:border-slate-900 focus:outline-none"
          />
        </label>
      </div>

      <button
        type="submit"
        disabled={submitting}
        className="mt-6 w-full rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-400"
      >
        {submitting ? 'Saving...' : isEditing ? 'Save Changes' : 'Create Product'}
      </button>
    </form>
  )
}

export default ProductForm
