import Link from "next/link"; // Wichtig: Für die interne Navigation
import { FaLocationArrow } from "react-icons/fa6";
import { PrismaClient } from "@prisma/client";
import { PinContainer } from "./ui/Pin";

const prisma = new PrismaClient();

const RecentProjects = async () => {
  // Daten direkt vom Server laden
  const projects = await prisma.project.findMany({
    orderBy: { createdAt: "desc" },
    take: 4, // Nur die neuesten 4 anzeigen
  });

  return (
    <div className="py-20" id="projects">
      <h1 className="heading">
        A small selection of{" "}
        <span className="text-purple">recent projects</span>
      </h1>
      <div className="flex flex-wrap items-center justify-center p-4 gap-16 mt-10">
        {projects.map((item) => (
          <div
            className="lg:min-h-[32.5rem] h-[25rem] flex items-center justify-center sm:w-96 w-[80vw]"
            key={item.id}
          >
            
              <PinContainer
                
              >
                <div className="relative flex items-center justify-center sm:w-96 w-[80vw] overflow-hidden h-[20vh] lg:h-[30vh] mb-10">
                  <div
                    className="relative w-full h-full overflow-hidden lg:rounded-3xl"
                    style={{ backgroundColor: "#13162D" }}
                  >
                    <img src="/bg.png" alt="bgimg" />
                  </div>
                  {/* Dein Cloudinary Bild oder Fallback */}
                  <img
                    src={item.imageUrl || "/placeholder.png"}
                    alt={item.title}
                    className="z-10 absolute bottom-0 w-full h-full object-cover rounded-t-xl"
                  />
                </div>

                <h1 className="font-bold lg:text-2xl md:text-xl text-base line-clamp-1">
                  {item.title}
                </h1>

                <p
                  className="lg:text-xl lg:font-normal font-light text-sm line-clamp-2"
                  style={{
                    color: "#BEC1DD",
                    margin: "1vh 0",
                  }}
                >
                  {item.shortDescription}
                </p>

                <div className="flex items-center justify-between mt-7 mb-3">
                  <div className="flex items-center">
                    {/* Tech Stack Tags */}
                    {item.techStack.map((tech, index) => (
                      <div
                        key={tech}
                        className="border border-white/20 rounded-full bg-black lg:w-10 lg:h-10 w-8 h-8 flex justify-center items-center text-[10px] text-white font-bold"
                        style={{
                          transform: `translateX(-${5 * index + 2}px)`,
                        }}
                      >
                        {/* Falls du keine Icons hast, zeigen wir den ersten Buchstaben an */}
                        {tech.substring(0, 2)}
                      </div>
                    ))}
                  </div>

                  {/* Call to Action: Zeigt an, dass der Pin klickbar ist */}
                  <div className="flex justify-center items-center">
                    <p className="flex lg:text-xl md:text-xs text-sm text-purple">
                      Details ansehen
                    </p>
                    <FaLocationArrow className="ms-3" color="#CBACF9" />
                  </div>
                </div>
              </PinContainer>
            
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentProjects;