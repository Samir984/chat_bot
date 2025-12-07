import type { UserApiGoogleLogin200 } from "@/gen/types";

interface UserProfileProps {
  user: UserApiGoogleLogin200;
}

export default function UserProfile({ user }: UserProfileProps) {
  return (
    <div className="flex items-center gap-3 p-1 rounded-full border bg-background">
      <img
        src={
          user.profile_picture_url ||
          `https://ui-avatars.com/api/?name=${user.first_name}+${user.last_name}`
        }
        alt={user.first_name}
        className="w-8 h-8 rounded-full object-cover"
      />
    </div>
  );
}
