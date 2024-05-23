import { useCountries } from "@/app/lib/getCountries";
import Image from "next/image";
import Link from "next/link";
import { AddToFavoriteButton, DeleteFromFavoriteButton, CancelReservationButton } from "@/components/Submitbuttons";
import { addToFavorite, deleteFromFavorite, cancelReservation } from "@/app/actions";

// Interface defining the props for the ListingCard component
interface ListingCardProps {
    imagePath: string;
    description: string;
    location: string;
    price: number;
    userId: string | undefined;
    isInFavoriteList: boolean;
    favoriteId: string;
    homeId: string;
    pathName: string;
    hasReservation: boolean;
    reservationId: string;
}

// ListingCard component displaying a card for a home listing
export function ListingCard({
    description,
    imagePath,
    location,
    price,
    userId,
    favoriteId,
    isInFavoriteList,
    homeId,
    pathName,
    hasReservation,
    reservationId
}: ListingCardProps) {
    // Retrieve country information using the useCountries hook
    const { getCountryByValue } = useCountries();
    const country = getCountryByValue(location);

    return (
        <div className="flex flex-col">
            <div className="relative h-72">
                <Image
                    src={`https://rpqcqnwjqgsjvtpsqtok.supabase.co/storage/v1/object/public/images/${imagePath}`}
                    alt="Image of House"
                    fill
                    className="rounded-lg h-full object-cover"
                />
                {/* Conditional rendering of favorite and reservation buttons */}
                {userId && (
                    <div className="z-10 absolute top-2 right-2">
                        {isInFavoriteList ? (
                            <form action={deleteFromFavorite}>
                                <input type="hidden" name="favoriteId" value={favoriteId} />
                                <input type="hidden" name="userId" value={userId} />
                                <input type="hidden" name="pathName" value={pathName} />
                                <DeleteFromFavoriteButton />
                            </form>
                        ) : (
                            <form action={addToFavorite}>
                                <input type="hidden" name="homeId" value={homeId} />
                                <input type="hidden" name="userId" value={userId} />
                                <input type="hidden" name="pathName" value={pathName} />
                                <AddToFavoriteButton />
                            </form>
                        )}
                        {hasReservation && (
                            <form action={cancelReservation}>
                                <input type="hidden" name="reservationId" value={reservationId} />
                                <CancelReservationButton />
                            </form>
                        )}
                    </div>
                )}
            </div>
            {/* Link to the detailed home page */}
            <Link href={`/home/${homeId}`} className="mt-2">
                <h3 className="font-medium text-base">
                    {/* Display country flag, label, and region */}
                    {country?.flag} {country?.label} {country?.region}
                </h3>
                <p className="text-muted-foreground text-sm line-clamp-2">{description}</p>
                <p className="pt-2 text-muted-foreground">
                    {/* Display the price per night */}
                    <span className="font-medium text-black">{price} EUR </span>/ Night
                </p>
            </Link>
        </div>
    );
}
