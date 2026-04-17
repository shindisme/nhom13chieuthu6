import { getInitials, getAvatarColor } from "../../utils/helpers";

function AvatarInitials({ name, id, size = "md", image, className = "" }) {
  const sizeClasses = {
    sm: "w-8 h-8 text-xs",
    md: "w-10 h-10 text-sm",
    lg: "w-12 h-12 text-base",
    xl: "w-20 h-20 text-3xl",
  };

  const sizeClass = sizeClasses[size] || sizeClasses.md;

  if (image) {
    return (
      <img
        src={image}
        alt="Avatar"
        className={`${sizeClass} rounded-full object-cover shadow-sm shrink-0 ${className}`}
      />
    );
  }

  return (
    <div
      className={`${sizeClass} rounded-full ${getAvatarColor(id)} flex items-center justify-center text-white font-bold shrink-0 shadow-sm ${className}`}
    >
      {getInitials(name)}
    </div>
  );
}

export default AvatarInitials;
