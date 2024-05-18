"use server";

import prisma from "./lib/db";
import { redirect } from "next/navigation";
import { supabase } from "./lib/supabase";
import { revalidatePath } from "next/cache";

export async function createAirChezBibiHome({ userId }: { userId: string }) {
    const data = await prisma.home.findFirst({
        where: { userId },
        orderBy: { createdAt: "desc" },
    });

    if (data === null) {
        const newData = await prisma.home.create({
            data: { userId },
        });
        return redirect(`/create/${newData.id}/structure`);
    } else if (!data.addedCategory && !data.addedDescription && !data.addedLocation) {
        return redirect(`/create/${data.id}/structure`);
    } else if (data.addedCategory && !data.addedDescription) {
        return redirect(`/create/${data.id}/description`);
    } else if (data.addedCategory && data.addedDescription && !data.addedLocation) {
        return redirect(`/create/${data.id}/address`);
    } else if (data.addedCategory && data.addedDescription && data.addedLocation) {
        const newData = await prisma.home.create({
            data: { userId },
        });
        return redirect(`/create/${newData.id}/structure`);
    }
}

export async function createCategoryPage(formData: FormData) {
    const categoryName = formData.get("categoryName") as string;
    const homeId = formData.get("homeId") as string;

    await prisma.home.update({
        where: { id: homeId },
        data: {
            categoryName,
            addedCategory: true,
        },
    });
    return redirect(`/create/${homeId}/description`);
}

export async function CreateDescription(formData: FormData) {
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const price = formData.get("price");
    const imageFile = formData.get("image") as File;
    const homeId = formData.get("homeId") as string;
  
    const guestNumber = formData.get("guest") as string;
    const roomNumber = formData.get("room") as string;
    const bathroomsNumber = formData.get("bathroom") as string;
  
    const { data: imageData } = await supabase.storage
      .from("images")
      .upload(`${imageFile.name}-${new Date()}`, imageFile, {
        cacheControl: "2592000",
        contentType: "image/png",
      });

    const data = await prisma.home.update({
        where: { id: homeId },
        data: {
            title,
            description,
            price: Number(price),
            bedrooms: roomNumber,
            bathrooms: bathroomsNumber,
            guests: guestNumber,
            photo: imageData?.path,
            addedDescription: true,
        },
    });

    return redirect(`/create/${homeId}/address`);
}

export async function createLocation(formData: FormData) {
    const homeId = formData.get("homeId") as string;
    const countryValue = formData.get("countryValue") as string;

    await prisma.home.update({
        where: { id: homeId },
        data: {
            addedLocation: true,
            country: countryValue,
        },
    });

    return redirect("/");
}


export async function addToFavorite(formData:FormData) {
    const homeId = formData.get("homeId") as string;
    const userId = formData.get("userId") as string;
    const pathName = formData.get("pathName") as string;


    const data = await prisma.favorite.create({
        data: {
            homeId:homeId,
            userId:userId,
        }
    });
    revalidatePath(pathName)
}

export async function deleteFromFavorite (formData:FormData) {
   const favoriteid = formData.get("favoriteId") as string;
   const pathName = formData.get("pathName") as string;
   const userId = formData.get("userId") as string;

    const data = await prisma.favorite.delete({
        where: {
            id: favoriteid,
            userId: userId,
        }
    });
    revalidatePath(pathName);
}

export async function createReservation(formData:FormData) {
    const userId = formData.get("userId") as string;
    const homeId = formData.get("homeId") as string;
    const startDate = formData.get("startDate") as string;
    const endDate = formData.get("endDate") as string;

    const data = await prisma.reservation.create({
        data: {
            userId:userId,
            endDate:endDate,
            startDate:startDate,
            homeId:homeId
        }
    });

    return redirect("/");
}