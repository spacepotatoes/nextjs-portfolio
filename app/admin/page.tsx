"use client";

import { useEffect, useState } from "react";
import { createProject, deleteProject, updateProject } from "@/lib/actions/project.actions";
import { CldUploadWidget } from "next-cloudinary";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { availableTech } from "@/data";

export default function AdminPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const editId = searchParams.get("edit");

  const [projects, setProjects] = useState<any[]>([]);
  const [imageUrl, setImageUrl] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  
  // State für die Checkboxen
  const [selectedTech, setSelectedTech] = useState<string[]>([]);

  const projectToEdit = editId ? projects.find((p) => p.id === editId) : null;

  useEffect(() => {
    fetch("/api/projects")
      .then((res) => res.json())
      .then((data) => setProjects(data));
  }, []);

  useEffect(() => {
    if (projectToEdit) {
      setImageUrl(projectToEdit.imageUrl || "");
      setSelectedTech(projectToEdit.techStack || []);
    } else {
      setImageUrl("");
      setSelectedTech([]);
    }
  }, [projectToEdit]);

  const handleTechChange = (techName: string) => {
    setSelectedTech((prev) =>
      prev.includes(techName)
        ? prev.filter((t) => t !== techName)
        : [...prev, techName]
    );
  };

  return (
    <main className="min-h-screen bg-black pt-32 pb-12 px-4 text-white">
      <div className="max-w-4xl mx-auto space-y-12">
        
        <section className="bg-zinc-900/40 p-8 rounded-2xl border border-zinc-800 backdrop-blur-md">
          <h2 className="text-2xl font-bold mb-6 text-purple-400">
            {projectToEdit ? `"${projectToEdit.title}" bearbeiten` : "Neues Projekt"}
          </h2>
          
          <form 
            action={async (formData) => {
              formData.append("imageUrl", imageUrl);
              // Die ausgewählten Techs als kommagetrennten String anhängen
              formData.append("techStack", selectedTech.join(","));
              
              if (projectToEdit) {
                await updateProject(projectToEdit.id, formData);
                router.push("/admin");
              } else {
                await createProject(formData);
              }
              setImageUrl("");
              setSelectedTech([]);
              window.location.reload(); 
            }} 
            className="space-y-6"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input name="title" defaultValue={projectToEdit?.title || ""} placeholder="Titel *" required className="p-3 rounded-xl bg-black border border-zinc-800 outline-none focus:border-purple-500" />
              <select name="category" defaultValue={projectToEdit?.category || "DESIGN"} className="p-3 rounded-xl bg-black border border-zinc-800 outline-none">
                <option value="DESIGN">Design</option>
                <option value="CODING">Coding</option>
                <option value="FULLSTACK">Fullstack</option>
              </select>
            </div>

            <div className="space-y-2">
              <CldUploadWidget 
                uploadPreset="portfolio_preset" 
                onSuccess={(result: any) => {
                  setImageUrl(result.info.secure_url);
                  setIsUploading(false);
                }}
                onOpen={() => setIsUploading(true)}
              >
                {({ open }) => (
                  <button 
                    type="button" 
                    onClick={() => open()}
                    className={`w-full py-4 border-2 border-dashed rounded-xl transition-all ${imageUrl ? 'border-green-500/50 bg-green-500/5 text-green-400' : 'border-zinc-800 hover:border-purple-500 text-zinc-400'}`}
                  >
                    {imageUrl ? "Bild verknüpft" : "Projekt-Bild hochladen"}
                  </button>
                )}
              </CldUploadWidget>
              {imageUrl && (
                <div className="relative w-32 h-20 group">
                  <img src={imageUrl} alt="Preview" className="h-full w-full object-cover rounded-lg border border-zinc-800" />
                  <button type="button" onClick={() => setImageUrl("")} className="absolute -top-2 -right-2 bg-red-500 rounded-full w-5 h-5 text-[10px] flex items-center justify-center">✕</button>
                </div>
              )}
            </div>

            <div className="space-y-3">
              <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Technologien und Tools</label>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 p-4 bg-black/50 border border-zinc-800 rounded-xl max-h-60 overflow-y-auto">
                {availableTech.map((tech) => (
                  <label 
                    key={tech.name} 
                    className={`flex items-center p-2 rounded-lg cursor-pointer transition-all border ${
                      selectedTech.includes(tech.name) 
                        ? "border-purple-500/50 bg-purple-500/10" 
                        : "border-transparent hover:bg-zinc-800/50"
                    }`}
                  >
                    <input
                      type="checkbox"
                      hidden
                      checked={selectedTech.includes(tech.name)}
                      onChange={() => handleTechChange(tech.name)}
                    />
                    <span className={`text-xs ${selectedTech.includes(tech.name) ? "text-white font-bold" : "text-zinc-500"}`}>
                      {tech.name}
                    </span>
                  </label>
                ))}
              </div>
            </div>
            
            <input name="shortDescription" defaultValue={projectToEdit?.shortDescription || ""} placeholder="Kurzbeschreibung (Teaser) *" required className="w-full p-3 rounded-xl bg-black border border-zinc-800 outline-none focus:border-purple-500" />
            <input name="role" defaultValue={projectToEdit?.role || ""} placeholder="Rolle im Projekt *" required className="w-full p-3 rounded-xl bg-black border border-zinc-800 outline-none focus:border-purple-500" />
            
            <textarea name="description" defaultValue={projectToEdit?.description || ""} placeholder="Vollständige Beschreibung *" required rows={3} className="w-full p-3 rounded-xl bg-black border border-zinc-800 outline-none resize-none focus:border-purple-500" />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input name="liveLink" defaultValue={projectToEdit?.liveLink || ""} type="url" placeholder="Live Demo (https://...)" className="p-3 rounded-xl bg-black border border-zinc-800 outline-none focus:border-purple-500" />
              <input name="githubLink" defaultValue={projectToEdit?.githubLink || ""} type="url" placeholder="GitHub Repository (https://...)" className="p-3 rounded-xl bg-black border border-zinc-800 outline-none focus:border-purple-500" />
            </div>

            <div className="flex gap-4 pt-4">
              <button type="submit" className="flex-1 bg-white text-black py-4 rounded-xl font-bold hover:bg-zinc-200 transition-transform active:scale-95">
                {projectToEdit ? "Änderungen speichern" : "Projekt veröffentlichen"}
              </button>
              {projectToEdit && (
                <button type="button" onClick={() => router.push("/admin")} className="px-8 py-4 bg-zinc-800 rounded-xl hover:bg-zinc-700 transition-colors">Abbrechen</button>
              )}
            </div>
          </form>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-bold flex items-center gap-2 text-zinc-400">
            <span className="w-2 h-2 bg-green-500 rounded-full"></span>
            Live Projekte
          </h2>
          <div className="grid gap-4">
            {projects.map((p) => (
              <div key={p.id} className="flex items-center justify-between bg-zinc-900/20 p-5 rounded-2xl border border-zinc-800 hover:border-zinc-700 transition-all">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-10 bg-zinc-800 rounded overflow-hidden">
                    {p.imageUrl && <img src={p.imageUrl} alt="" className="w-full h-full object-cover" />}
                  </div>
                  <div>
                    <h3 className="font-semibold text-zinc-100">{p.title}</h3>
                    <p className="text-[10px] text-zinc-500">{p.techStack?.slice(0, 3).join(" • ")}</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <Link href={`/admin?edit=${p.id}`} className="px-4 py-2 bg-zinc-800 rounded-xl text-xs font-bold hover:bg-purple-600 transition-colors">Edit</Link>
                  <button onClick={async () => { if(confirm("Löschen?")) { await deleteProject(p.id); window.location.reload(); } }} className="px-4 py-2 bg-red-500/10 text-red-500 rounded-xl text-xs font-bold hover:bg-red-500 hover:text-white transition-all">Löschen</button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}