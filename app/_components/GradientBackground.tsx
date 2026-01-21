export default function GradientBackground() {
  return (
    <>
      <div className="absolute -bottom-40 -left-40 h-[500px] w-[500px] bg-purple-400/20 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute top-20 left-1/3 h-[500px] w-[500px] bg-pink-400/20 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-200px] left-1/3 h-[500px] w-[500px] bg-blue-400/20 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute top-[200px] left-1/2 h-[500px] w-[500px] bg-sky-400/20 blur-[120px] rounded-full pointer-events-none" />
    </>
  );
}
