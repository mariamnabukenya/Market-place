from django.contrib import admin
from django.urls import path
from api.views import (
    MyTokenObtainPairView,
    product_list,
    product_detail,
    approve_product,
    public_products,
    business_users,
)

urlpatterns = [
    # Authentication
    path("api/token/", MyTokenObtainPairView.as_view(), name="token_obtain_pair"),

    # Internal product management
    path("api/products/", product_list),
    path("api/products/<int:pk>/", product_detail),
    path("api/products/<int:pk>/approve/", approve_product),

    # Public catalogue
    path("api/products/public/", public_products),

    # Business user & role management
    path("api/business/users/", business_users),

    path('admin/', admin.site.urls),
]
