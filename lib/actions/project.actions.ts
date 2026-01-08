"use server"

import { auth } from "@clerk/nextjs/server"
import { PrismaClient } from "@prisma/client"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}
const prisma = globalForPrisma.prisma ?? new PrismaClient()
if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma

/**
 * Hilfsfunktion: Wandelt kommagetrennte Strings in Arrays um.
 * Beispiel: "React, Next.js" -> ["React", "Next.js"]
 */
const parseArray = (val: any) => {
  if (!val || typeof val !== "string") return [];
  return val.split(",").map(item => item.trim()).filter(item => item !== "");
}

export async function createProject(formData: FormData) {
  const { userId } = await auth()
  if (!userId) redirect("/sign-in")

  const title = formData.get("title")?.toString().trim() || ""
  const category = formData.get("category")?.toString().trim() || "Fullstack"
  const shortDescription = formData.get("shortDescription")?.toString().trim() || ""
  const description = formData.get("description")?.toString().trim() || ""
  const imageUrl = formData.get("imageUrl")?.toString() || null

  if (!title || !shortDescription || !description) {
    return { success: false, error: "Pflichtfelder fehlen (Titel, Kurzbeschreibung, Beschreibung)." }
  }

  const slug = title.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "") || `project-${Date.now()}`

  try {
    await prisma.project.create({
      data: {
        title,
        slug,
        category,
        shortDescription,
        description,
        imageUrl,
        liveLink: formData.get("liveLink")?.toString() || null,
        githubLink: formData.get("githubLink")?.toString() || null,
        behanceUrl: formData.get("behanceUrl")?.toString() || null,
        role: formData.get("role")?.toString() || null,
        isFeatured: formData.get("isFeatured") === "true",
        techStack: parseArray(formData.get("techStack")),
        designTools: parseArray(formData.get("designTools")),
        galleryImages: [], 
      },
    })
    
    console.log(`Projekt "${title}" erfolgreich erstellt.`)
    revalidatePath("/")
    revalidatePath("/admin")
  } catch (error: any) {
    console.error("Prisma Error:", error)
    return { success: false, error: "Datenbankfehler beim Speichern." }
  }

  redirect("/admin")
}

export async function updateProject(id: string, formData: FormData) {
  const { userId } = await auth();
  if (!userId) throw new Error("Nicht autorisiert");

  try {
    await prisma.project.update({
      where: { id },
      data: {
        title: formData.get("title")?.toString(),
        category: formData.get("category")?.toString(),
        shortDescription: formData.get("shortDescription")?.toString(),
        description: formData.get("description")?.toString(),
        role: formData.get("role")?.toString() || null,
        imageUrl: formData.get("imageUrl")?.toString() || null,
        liveLink: formData.get("liveLink")?.toString() || null,
        githubLink: formData.get("githubLink")?.toString() || null,
        techStack: parseArray(formData.get("techStack")),
        designTools: parseArray(formData.get("designTools")),
      },
    });
    
    revalidatePath("/admin");
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("Update Fehler:", error);
    return { success: false };
  }
}

export async function deleteProject(id: string) {
  const { userId } = await auth();
  if (!userId) throw new Error("Nicht autorisiert");

  try {
    await prisma.project.delete({ 
      where: { id } 
    });
    
    revalidatePath("/admin");
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("Fehler beim Löschen:", error);
    return { success: false };
  }
}