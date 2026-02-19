from django.contrib.auth.models import User
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework import serializers
from .models import Product, Business, UserProfile

def get_or_create_user_profile(user):
    """Ensure user has a profile (fixes first-login error when profile is missing)."""
    try:
        return user.profile
    except UserProfile.DoesNotExist:
        business, _ = Business.objects.get_or_create(
            name="Default Business",
            defaults={"name": "Default Business"}
        )
        return UserProfile.objects.create(user=user, business=business, role="VIEWER")


class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        profile = get_or_create_user_profile(user)
        token['role'] = profile.role
        return token

    def validate(self, attrs):
        data = super().validate(attrs)
        profile = get_or_create_user_profile(self.user)
        data['role'] = profile.role
        data['business_id'] = profile.business.id
        return data
    
class ProductSerializer(serializers.ModelSerializer):
    # We use ReadOnlyField for metadata the user shouldn't manually type in
    created_by_name = serializers.ReadOnlyField(source='created_by.username')
    business_name = serializers.ReadOnlyField(source='business.name')

    class Meta:
        model = Product
        fields = [
            'id', 'name', 'description', 'price', 
            'status', 'business', 'business_name', 
            'created_by', 'created_by_name', 'created_at'
        ]
        # These fields are set automatically in the backend for security
        read_only_fields = ['status', 'business', 'created_by']

    def create(self, validated_data):
        # Automatically assign the product to the user's business and themselves
        user = self.context['request'].user
        validated_data['created_by'] = user
        validated_data['business'] = user.profile.business
        return super().create(validated_data)


class BusinessUserSerializer(serializers.ModelSerializer):
    """
    Serializer used by business admins to create users that belong
    to their business with an assigned role.
    """

    role = serializers.ChoiceField(choices=UserProfile.ROLE_CHOICES)

    class Meta:
        model = User
        fields = ["id", "username", "email", "password", "role"]
        extra_kwargs = {
            "password": {"write_only": True},
            "email": {"required": False},
        }

    def create(self, validated_data):
        role = validated_data.pop("role")
        request = self.context["request"]
        business = request.user.profile.business

        user = User.objects.create_user(**validated_data)
        UserProfile.objects.create(user=user, business=business, role=role)
        return user