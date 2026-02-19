from django.core.management.base import BaseCommand
from django.contrib.auth.models import User

from api.models import Business, UserProfile


class Command(BaseCommand):
    help = "Seed one demo user for each role under a single demo business"

    def handle(self, *args, **options):
        business, _ = Business.objects.get_or_create(name="Demo Business")

        demo_users = [
            ("admin_user", "ADMIN"),
            ("editor_user", "EDITOR"),
            ("approver_user", "APPROVER"),
            ("viewer_user", "VIEWER"),
        ]

        for username, role in demo_users:
            user, created = User.objects.get_or_create(username=username)
            # Always reset password so you can re-run the command safely
            user.set_password("marketplace123")
            user.save()
            if created:
                self.stdout.write(self.style.SUCCESS(f"Created user {username}"))
            else:
                self.stdout.write(
                    self.style.WARNING(f"Updated password for existing user {username}")
                )

            profile, created_profile = UserProfile.objects.get_or_create(
                user=user,
                defaults={
                    "business": business,
                    "role": role,
                },
            )
            if not created_profile:
                profile.business = business
                profile.role = role
                profile.save()

        self.stdout.write(
            self.style.SUCCESS(
                "Demo users seeded. Password for all demo users is 'marketplace123'."
            )
        )

