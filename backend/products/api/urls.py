from django.urls import path

from . import product_views

urlpatterns = [
    path("", product_views.product_list, name="product-list-create"),
    path("<int:product_id>/", product_views.product_detail, name="product-detail"),
]
