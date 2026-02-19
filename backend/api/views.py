from api.serializers import (
    MyTokenObtainPairSerializer,
    ProductSerializer,
    BusinessUserSerializer,
)
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework import status

from django.contrib.auth.models import User

from .models import Product
from .permissions import IsApprover, IsBusinessAdmin


class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer


@api_view(['GET', 'POST'])
def product_list(request):
    """List products for the current user's business, or create a new product."""
    if request.method == 'GET':
        if not request.user.is_authenticated:
            return Response(
                {'detail': 'Authentication required.'},
                status=status.HTTP_401_UNAUTHORIZED,
            )
        try:
            business = request.user.profile.business
        except Exception:
            return Response(
                {'detail': 'User profile not set up.'},
                status=status.HTTP_403_FORBIDDEN,
            )
        products = Product.objects.filter(business=business).order_by('-created_at')
        serializer = ProductSerializer(products, many=True)
        return Response(serializer.data)

    # POST – create a new product scoped to the user's business
    serializer = ProductSerializer(data=request.data, context={'request': request})
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([IsApprover])
def approve_product(request, pk):
    """Approve a product belonging to the current user's business."""
    try:
        product = Product.objects.get(pk=pk, business=request.user.profile.business)
    except Product.DoesNotExist:
        return Response({'error': 'Product not found'}, status=status.HTTP_404_NOT_FOUND)

    product.status = 'APPROVED'
    product.save()
    return Response(
        {'message': 'Product approved and is now public.'},
        status=status.HTTP_200_OK,
    )


@api_view(['GET'])
@permission_classes([])  # Public endpoint – no authentication required
def public_products(request):
    """Public listing of products that have been approved."""
    products = Product.objects.filter(status='APPROVED').order_by('-created_at')
    serializer = ProductSerializer(products, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)


@api_view(['GET', 'PUT', 'DELETE'])
def product_detail(request, pk):
    """
    Retrieve, update, or delete a single product.
    - Access is always scoped to the user's business.
    - Only Admin / Editor / Approver (or the creator) can update/delete.
    """
    if not request.user.is_authenticated:
        return Response(
            {"detail": "Authentication required."},
            status=status.HTTP_401_UNAUTHORIZED,
        )

    try:
        product = Product.objects.get(pk=pk, business=request.user.profile.business)
    except Product.DoesNotExist:
        return Response(
            {"detail": "Product not found."},
            status=status.HTTP_404_NOT_FOUND,
        )

    if request.method == "GET":
        serializer = ProductSerializer(product)
        return Response(serializer.data)

    # For update/delete, enforce role/ownership
    role = request.user.profile.role
    can_modify = role in ["ADMIN", "EDITOR", "APPROVER"] or product.created_by == request.user
    if not can_modify:
        return Response(
            {"detail": "You do not have permission to modify this product."},
            status=status.HTTP_403_FORBIDDEN,
        )

    if request.method == "PUT":
        serializer = ProductSerializer(
            product, data=request.data, partial=True, context={"request": request}
        )
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    # DELETE
    product.delete()
    return Response(status=status.HTTP_204_NO_CONTENT)


@api_view(['GET', 'POST'])
@permission_classes([IsBusinessAdmin])
def business_users(request):
    """
    List or create users that belong to the current admin's business.
    - GET: list all users for this business
    - POST: create a new user with a role in this business
    """
    if request.method == "GET":
        users = User.objects.filter(profile__business=request.user.profile.business)
        data = [
            {
                "id": u.id,
                "username": u.username,
                "email": u.email,
                "role": u.profile.role,
            }
            for u in users
        ]
        return Response(data)

    serializer = BusinessUserSerializer(
        data=request.data, context={"request": request}
    )
    if serializer.is_valid():
        user = serializer.save()
        return Response(
            {
                "id": user.id,
                "username": user.username,
                "email": user.email,
                "role": user.profile.role,
            },
            status=status.HTTP_201_CREATED,
        )
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)