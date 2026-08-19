import { toggleFavoriteAsClient } from "@/app/dashboard/[token]/actions";

export function StarButton({
  token,
  propertyId,
  isFavorite,
}: {
  token: string;
  propertyId: string;
  isFavorite: boolean;
}) {
  return (
    <form action={toggleFavoriteAsClient.bind(null, token, propertyId)}>
      <button
        type="submit"
        aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
        className={`flex h-8 w-8 items-center justify-center rounded-full border shadow-sm ${
          isFavorite
            ? "border-terracotta bg-terracotta text-white"
            : "border-line bg-white text-warm-gray hover:border-terracotta hover:text-terracotta"
        }`}
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill={isFavorite ? "currentColor" : "none"}
          aria-hidden="true"
        >
          <path
            d="M12 2.5l2.9 6.3 6.9.7-5.2 4.6 1.6 6.8L12 17.6l-6.2 3.3 1.6-6.8-5.2-4.6 6.9-.7L12 2.5z"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
        </svg>
      </button>
    </form>
  );
}
