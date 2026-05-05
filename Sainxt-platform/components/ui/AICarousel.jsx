"use client";

import * as React from "react";
import useEmblaCarousel from "embla-carousel-react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import Image from "next/image";

export function AICarousel({ className, items = [] }) {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    align: "start",
    skipSnaps: false,
    inViewThreshold: 0.7,
  });

  // Auto-advance
  React.useEffect(() => {
    if (!emblaApi) return;
    const interval = setInterval(() => emblaApi.scrollNext(), 5000);
    return () => clearInterval(interval);
  }, [emblaApi]);

  const scrollPrev = React.useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = React.useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  return (
    <div className={cn("relative w-full overflow-hidden", className)}>
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex">
          {items.map((item, index) => (
            <div key={index} className="flex-[0_0_100%] min-w-0 relative">
              <div className="relative aspect-video w-full overflow-hidden bg-muted">
                {/* Background Image */}
                {item.imageUrl && (
                  <Image
                    src={item.imageUrl}
                    alt={item.title}
                    fill
                    unoptimized
                    className="object-cover"
                  />
                )}

                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />

                {/* Content */}
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                  <h3 className="text-2xl font-bold mb-2">{item.title}</h3>
                  <p className="text-muted-foreground line-clamp-2">
                    {item.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Navigation Buttons */}
      <Button
        variant="ghost"
        size="icon"
        className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-background/80 backdrop-blur-sm hover:bg-background/90 h-10 w-10 z-10"
        onClick={scrollPrev}
      >
        <ArrowLeft className="h-5 w-5" />
        <span className="sr-only">Previous slide</span>
      </Button>
      <Button
        variant="ghost"
        size="icon"
        className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-background/80 backdrop-blur-sm hover:bg-background/90 h-10 w-10 z-10"
        onClick={scrollNext}
      >
        <ArrowRight className="h-5 w-5" />
        <span className="sr-only">Next slide</span>
      </Button>

      {/* Dots Indicator */}
      <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
        {items.map((_, index) => (
          <button
            key={index}
            className="h-2 w-2 rounded-full bg-background/50 hover:bg-background/80 transition-colors"
            onClick={() => emblaApi?.scrollTo(index)}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}

// "use client";

// import * as React from "react";
// import useEmblaCarousel from "embla-carousel-react";
// import { ArrowLeft, ArrowRight } from "lucide-react";
// import { cn } from "@/lib/utils";
// import { Button } from "@/components/ui/button";
// import Image from "next/image";
// import axios from "axios";

// export function AICarousel({ className }) {
//   const [emblaRef, emblaApi] = useEmblaCarousel({
//     loop: true,
//     align: "start",
//     skipSnaps: false,
//     inViewThreshold: 0.7,
//   });

//   const [items, setItems] = React.useState([]);

//   // Fetch articles from backend
//   React.useEffect(() => {
//     axios
//       .get("https://www.jobraze.in/get-all-articles/")
//       .then((res) => {
//         const rawArticles = res.data.articles || [];
//         const normalized = rawArticles.map((a) => ({
//           title: a.title || "No title",
//           description: a.description || "No description",
//           imageUrl: a.image || null,
//           content_type: a.content_type || "image/png",
//           filename: a.filename || "default.jpg",
//           tags: Array.isArray(a.tags) ? a.tags : [],
//         }));
//         setItems(normalized);
//       })
//       .catch((err) => {
//         console.error("Error fetching articles:", err);
//       });
//   }, []);

//   // Auto-advance
//   React.useEffect(() => {
//     if (!emblaApi) return;
//     const interval = setInterval(() => emblaApi.scrollNext(), 5000);
//     return () => clearInterval(interval);
//   }, [emblaApi]);

//   const scrollPrev = React.useCallback(() => {
//     if (emblaApi) emblaApi.scrollPrev();
//   }, [emblaApi]);

//   const scrollNext = React.useCallback(() => {
//     if (emblaApi) emblaApi.scrollNext();
//   }, [emblaApi]);

//   return (
//     <div className={cn("relative w-full overflow-hidden", className)}>
//       <div className="overflow-hidden" ref={emblaRef}>
//         <div className="flex">
//           {items.map((item, index) => (
//             <div key={index} className="flex-[0_0_100%] min-w-0 relative">
//               <div className="relative aspect-video w-full overflow-hidden bg-muted">
//                 {/* Background Image */}
//                 {item.imageUrl && (
//                   <Image
//                     src={item.imageUrl}
//                     alt={item.title}
//                     fill
//                     unoptimized
//                     className="object-cover"
//                   />
//                 )}

//                 {/* Gradient Overlay */}
//                 <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />

//                 {/* Content */}
//                 <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
//                   <h3 className="text-2xl font-bold mb-2">{item.title}</h3>
//                   <p className="text-muted-foreground line-clamp-2">
//                     {item.description}
//                   </p>
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>

//       {/* Navigation Buttons */}
//       <Button
//         variant="ghost"
//         size="icon"
//         className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-background/80 backdrop-blur-sm hover:bg-background/90 h-10 w-10 z-10"
//         onClick={scrollPrev}
//       >
//         <ArrowLeft className="h-5 w-5" />
//         <span className="sr-only">Previous slide</span>
//       </Button>
//       <Button
//         variant="ghost"
//         size="icon"
//         className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-background/80 backdrop-blur-sm hover:bg-background/90 h-10 w-10 z-10"
//         onClick={scrollNext}
//       >
//         <ArrowRight className="h-5 w-5" />
//         <span className="sr-only">Next slide</span>
//       </Button>

//       {/* Dots Indicator */}
//       <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
//         {items.map((_, index) => (
//           <button
//             key={index}
//             className="h-2 w-2 rounded-full bg-background/50 hover:bg-background/80 transition-colors"
//             onClick={() => emblaApi?.scrollTo(index)}
//             aria-label={`Go to slide ${index + 1}`}
//           />
//         ))}
//       </div>
//     </div>
//   );
// }
