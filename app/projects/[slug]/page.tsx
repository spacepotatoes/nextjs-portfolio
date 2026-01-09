// app/projects/[slug]/page.tsx
import { notFound } from "next/navigation";
import { getProjectBySlug } from "@/lib/actions/project.actions";
import { FaGithub, FaLink } from "react-icons/fa";
import { HiOutlineLightBulb } from "react-icons/hi";
import { IoDiamondOutline } from "react-icons/io5";

// Korrekte Props mit Promise
interface ProjectDetailPageProps {
  params: Promise<{ slug: string }>;
}

export default async function ProjectDetailPage({ params }: ProjectDetailPageProps) {
  // ← Das ist der entscheidende Fix!
  const { slug } = await params;

  const project = await getProjectBySlug(slug);

  if (!project) {
    notFound();
  }

  const techStack = project.techStack || [];

  return (
    <main className="min-h-screen bg-gray-950 pt-20 pb-20 text-white">
  {/* 1. Hero / Titel Sektion */}
  <section className="relative h-[60vh] md:h-[75vh] mb-16 overflow-hidden">
    {/* Hintergrundbild */}
    {project.imageUrl && (
      <img
        src={project.imageUrl}
        alt={`Titelbild für ${project.title}`}
        className="w-full h-full object-cover opacity-30 lg:opacity-50"
      />
    )}
    <div className="absolute inset-0 bg-black/60 flex items-end">  {/* ← Hier geändert: bg-black/60 statt bg-black-100/70 */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 w-full">
        <h1 className="text-5xl md:text-7xl font-bold text-white mb-4 leading-tight">
          {project.title}
        </h1>
        <p className="text-lg text-zinc-400 max-w-3xl">
          {project.shortDescription}
        </p>
        {/* ... der Rest deiner Buttons, Metadaten, Beschreibung usw. bleibt genau so ... */}
      </div>
    </div>
  </section>

  {/* Der Rest deines Codes (Grid mit Kategorie/Rolle/TechStack, detaillierte Beschreibung etc.) */}
  <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
    {/* ... dein gesamter restlicher JSX ... */}
  </div>
 
</main>
  );
}

// Metadata muss auch angepasst werden!
export async function generateMetadata({ params }: ProjectDetailPageProps) {
  const { slug } = await params;

  const project = await getProjectBySlug(slug);

console.log("Projekt geladen:", project ? "JA" : "NEIN");
if (project) {
  console.log("Titel:", project.title);
  console.log("Slug aus DB:", project.slug);
  console.log("Image URL:", project.imageUrl);
}

  if (!project) {
    return {
      title: "Projekt nicht gefunden",
    };
  }

  return {
    title: project.title,
    description: project.shortDescription || `Details zum Projekt ${project.title}.`,
  };
}