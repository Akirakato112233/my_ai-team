import json

from django.test import TestCase
from django.urls import reverse

from .models import Product


class TestProductApi(TestCase):
    def setUp(self):
        self.list_url = reverse("product-list-create")

    def test_create_product(self):
        response = self.client.post(
            self.list_url,
            data=json.dumps(
                {
                    "name": "Desk Lamp",
                    "price": "49.90",
                    "description": "Soft light for the office",
                }
            ),
            content_type="application/json",
        )

        self.assertEqual(response.status_code, 201)
        self.assertEqual(response.json()["status"], "success")
        self.assertEqual(Product.objects.count(), 1)

    def test_list_products(self):
        Product.objects.create(name="Notebook", price="12.00", description="A5")

        response = self.client.get(self.list_url)

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()["data"]["products"][0]["name"], "Notebook")

    def test_update_product(self):
        product = Product.objects.create(
            name="Chair",
            price="120.00",
            description="Wood frame",
        )

        response = self.client.put(
            reverse("product-detail", args=[product.id]),
            data=json.dumps(
                {
                    "name": "Chair Pro",
                    "price": "149.00",
                    "description": "Wood frame with cushion",
                }
            ),
            content_type="application/json",
        )

        self.assertEqual(response.status_code, 200)
        product.refresh_from_db()
        self.assertEqual(product.name, "Chair Pro")
        self.assertEqual(str(product.price), "149.00")

    def test_delete_product(self):
        product = Product.objects.create(name="Table", price="220.00", description="")

        response = self.client.delete(reverse("product-detail", args=[product.id]))

        self.assertEqual(response.status_code, 200)
        self.assertFalse(Product.objects.filter(id=product.id).exists())

    def test_validation_error_for_missing_required_fields(self):
        response = self.client.post(
            self.list_url,
            data=json.dumps({"name": "", "price": "", "description": ""}),
            content_type="application/json",
        )

        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.json()["status"], "error")
        self.assertIn("name", response.json()["errors"])
        self.assertIn("price", response.json()["errors"])
