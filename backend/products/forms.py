from django import forms

from .models import Product


class ProductForm(forms.ModelForm):
    class Meta:
        model = Product
        fields = ["name", "price", "description"]

    def clean_name(self):
        name = self.cleaned_data["name"].strip()
        if not name:
            raise forms.ValidationError("This field is required.")
        return name
