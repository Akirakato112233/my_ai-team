from django.urls import path

from . import auth_views, product_views

urlpatterns = [
    path("", product_views.product_list, name="product-list-create"),
    path("login/", auth_views.login, name="login"),
    path("<int:product_id>/", product_views.product_detail, name="product-detail"),
]
