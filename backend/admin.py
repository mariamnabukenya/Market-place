from django.contrib import admin
from .models import Business, UserProfile, Product

@admin.register(Business)
class BusinessAdmin(admin.ModelAdmin):
    list_display = ('name', 'created_at') 

@admin.register(UserProfile)
class UserProfileAdmin(admin.ModelAdmin):
    list_display = ('user', 'business', 'role') 
    list_filter = ('role', 'business') 

@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ('name', 'price', 'status', 'business', 'created_by') 
    list_filter = ('status', 'business') 
    # Bonus: Specific actions to approve products directly from Admin [cite: 50, 55]
    actions = ['approve_products']

    def approve_products(self, request, queryset):
        queryset.update(status='approved') 