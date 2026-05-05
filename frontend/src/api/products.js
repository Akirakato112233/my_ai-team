async function readJson(response) {
  try {
    return await response.json()
  } catch {
    return null
  }
}

function buildError(payload) {
  const errors = payload?.errors ?? { body: ['Something went wrong.'] }
  const message = Object.values(errors).flat()[0] ?? 'Something went wrong.'
  const error = new Error(message)
  error.errors = errors
  return error
}

async function sendRequest(path, options = {}) {
  const response = await fetch(path, {
    headers: {
      'Content-Type': 'application/json',
    },
    ...options,
  })

  const payload = await readJson(response)

  if (!response.ok || payload?.status !== 'success') {
    throw buildError(payload)
  }

  return payload.data
}

export async function fetchProducts() {
  const data = await sendRequest('/api/products/')
  return data.products
}

export async function createProduct(form) {
  return sendRequest('/api/products/', {
    method: 'POST',
    body: JSON.stringify(form),
  })
}

export async function updateProduct(productId, form) {
  return sendRequest(`/api/products/${productId}/`, {
    method: 'PUT',
    body: JSON.stringify(form),
  })
}

export async function deleteProduct(productId) {
  return sendRequest(`/api/products/${productId}/`, {
    method: 'DELETE',
  })
}
