from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods

from ..forms import ProductForm
from ..models import Product
from .helpers import error_response, form_errors, parse_json_body, success_response


def product_data(product):
    return {
        "id": product.id,
        "name": product.name,
        "price": f"{product.price:.2f}",
        "description": product.description,
    }


def product_detail_or_404(product_id):
    try:
        return Product.objects.get(pk=product_id), None
    except Product.DoesNotExist:
        return None, error_response({"product": ["Not found."]}, status_code=404)


@csrf_exempt
@require_http_methods(["GET", "POST"])
def product_list(request):
    if request.method == "GET":
        products = Product.objects.order_by("-id")
        data = {"products": [product_data(product) for product in products]}
        return success_response(data)

    try:
        payload = parse_json_body(request)
    except ValueError as error:
        return error_response({"body": [str(error)]})

    form = ProductForm(payload)
    if not form.is_valid():
        return error_response(form_errors(form))

    product = form.save()
    return success_response({"product": product_data(product)}, status_code=201)


@csrf_exempt
@require_http_methods(["GET", "PUT", "DELETE"])
def product_detail(request, product_id):
    product, not_found_response = product_detail_or_404(product_id)
    if not_found_response:
        return not_found_response

    if request.method == "GET":
        return success_response({"product": product_data(product)})

    if request.method == "DELETE":
        product.delete()
        return success_response({"id": product_id})

    try:
        payload = parse_json_body(request)
    except ValueError as error:
        return error_response({"body": [str(error)]})

    form = ProductForm(payload, instance=product)
    if not form.is_valid():
        return error_response(form_errors(form))

    updated_product = form.save()
    return success_response({"product": product_data(updated_product)})
