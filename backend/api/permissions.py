from rest_framework import permissions


class IsApproverRole(permissions.BasePermission):
    """Only users with Approver or Admin roles can perform certain actions."""

    def has_permission(self, request, view):
        if not hasattr(request.user, "profile"):
            return False
        return request.user.profile.role in ["APPROVER", "ADMIN"]

class BelongsToBusiness(permissions.BasePermission):
    """Users can only access objects belonging to their business."""

    def has_object_permission(self, request, view, obj):
        return getattr(obj, "business", None) == request.user.profile.business
    
class IsOwnerOrReadOnly(permissions.BasePermission):
    """Allow edits only for the creator; read-only for others."""

    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True
        return getattr(obj, "created_by", None) == request.user

class IsApprover(permissions.BasePermission):
    """
    Only users with the 'APPROVER' or 'ADMIN' role can approve products.
    """

    def has_permission(self, request, view):
        if not hasattr(request.user, "profile"):
            return False
        return request.user.profile.role in ["APPROVER", "ADMIN"]


class IsBusinessAdmin(permissions.BasePermission):
    """Only business admins can manage users for their business."""

    def has_permission(self, request, view):
        if not hasattr(request.user, "profile"):
            return False
        return request.user.profile.role == "ADMIN"