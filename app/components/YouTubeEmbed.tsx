interface YouTubeEmbedProps {
  videoId: string;
  autoplay?: boolean;
  title?: string;
}

export default function YouTubeEmbed({
  videoId,
  autoplay = false,
  title = "YouTube video",
}: YouTubeEmbedProps) {
  const params = new URLSearchParams({
    rel: "0",
    modestbranding: "1",
    ...(autoplay && { autoplay: "1", mute: "1" }),
  });

  return (
    <div className="bg-black border-2 border-green-500 rounded-lg shadow-[0_0_20px_rgba(0,255,0,0.3)] overflow-hidden">
      <div className="bg-gray-900 border-b border-green-800 px-4 py-2 flex items-center gap-2">
        <div className="w-3 h-3 rounded-full bg-red-600" />
        <div className="w-3 h-3 rounded-full bg-yellow-600" />
        <div className="w-3 h-3 rounded-full bg-green-600" />
        <span className="ml-4 text-green-600 text-xs font-mono">
          VIDEOFEED — {title.toUpperCase()}
        </span>
      </div>
      <div className="relative w-full" style={{ paddingBottom: "56.25%" }}>
        <iframe
          className="absolute inset-0 w-full h-full"
          src={`https://www.youtube.com/embed/${videoId}?${params.toString()}`}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    </div>
  );
}
