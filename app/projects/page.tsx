// app/projects/page.tsx
import Clients from "@/components/Clients";
import { Meteors } from "@/components/ui/Meteors";
import { getAllProjects } from "@/lib/actions/project.actions";
import Link from "next/link";
import { FaArrowRight } from "react-icons/fa6";

export default async function ProjectsPage() {
  const projects = await getAllProjects();

  return (
    <main className="min-h-screen bg-black-100 pt-32 pb-20 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Meteors number={50} />
        {/* Titel */}
        <header className="mb-12">
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-4">Meine Projekte</h1>
          <p className="text-lg text-zinc-400 max-w-3xl">
            Eine Auswahl meiner Fullstack-, Coding- und Design-Arbeiten. Klicke auf ein Projekt für Details.
          </p>
        </header>

        {/* Projekt-Grid */}
        {projects.length === 0 ? (
          <p className="text-zinc-500 text-center py-20">Aktuell sind keine Projekte verfügbar.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project) => (
              // Link zur dynamischen Detailseite: /projects/dein-projekt-slug
              <Link 
                key={project.id} 
                href={`/projects/${project.slug}`} 
                className="group block bg-zinc-900/50 rounded-2xl overflow-hidden border border-zinc-800 hover:border-purple transition-all duration-300"
              >
                {/* Projektbild */}
                <div className="relative h-48 w-full overflow-hidden">
                  {project.imageUrl && (
                    <img
                      src={project.imageUrl}
                      alt={project.title}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  )}
                  {/* Kategorie-Tag */}
                  <span className="absolute top-4 left-4 bg-black/70 text-xs text-white px-3 py-1 rounded-full backdrop-blur-sm">
                    {project.category}
                  </span>
                </div>

                {/* Projekt-Informationen */}
                <div className="p-6">
                  <h2 className="text-2xl font-bold mb-2 text-white group-hover:text-purple transition-colors">
                    {project.title}
                  </h2>
                  <p className="text-zinc-400 text-sm mb-4 line-clamp-2">
                    {project.shortDescription}
                  </p>
                  
                  {/* Tech Stack Tags */}
                  <div className="flex flex-wrap gap-2 mt-auto pt-2">
                    {project.techStack?.slice(0, 3).map((tech, index) => (
                      <span key={index} className="bg-zinc-800 text-xs text-zinc-400 px-3 py-1 rounded-full">
                        {tech}
                      </span>
                    ))}
                  </div>

                  {/* Call to Action */}
                  <div className="flex items-center mt-4 text-purple-400 font-semibold group-hover:translate-x-1 transition-transform">
                    Details ansehen <FaArrowRight className="ml-2 text-sm" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
        <Clients />
      </div>
    </main>
  );
}