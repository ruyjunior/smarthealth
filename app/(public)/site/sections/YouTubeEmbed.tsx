import React from "react";

interface YouTubeEmbedProps {
  videoId: string;
  title?: string;
}

const YouTubeEmbed: React.FC<YouTubeEmbedProps> = ({ videoId, title }) => {
  return (
    <section id="video" className="py-20 bg-gradient-to-b from-blue-50 to-white text-center">
      <h2 className="text-3xl sm:text-4xl font-extrabold mb-6 text-blue-800">
        Vídeo de apresentação
      </h2>
      <p className="max-w-2xl mx-auto text-gray-600 mb-12 text-lg">
        Assita o nosso vídeo de apresentação para saber mais sobre o Smart Health App.
      </p>


      <div className="w-full max-w-4xl mx-auto aspect-video">
        <iframe
          className="w-full h-full rounded-lg shadow-lg"
          src={`https://www.youtube.com/embed/${videoId}`}
          title={title || "YouTube video player"}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        ></iframe>
      </div>
    </section>
  );
};

export default YouTubeEmbed;
