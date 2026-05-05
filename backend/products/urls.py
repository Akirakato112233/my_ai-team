from django.urls import include, path

urlpatterns = [
    path("", include("products.api.urls")),
]
