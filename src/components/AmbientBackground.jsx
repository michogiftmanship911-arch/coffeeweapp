/** Fixed, blurred colour blobs that give the glass panels something to refract. */
export default function AmbientBackground() {
  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-forest-950">
      <div className="absolute -left-40 -top-40 h-[34rem] w-[34rem] rounded-full bg-forest-600/40 blur-[120px]" />
      <div className="absolute -right-32 top-1/3 h-[30rem] w-[30rem] rounded-full bg-gold-600/20 blur-[130px]" />
      <div className="absolute -bottom-48 left-1/4 h-[32rem] w-[32rem] rounded-full bg-earth-700/40 blur-[130px]" />
    </div>
  )
}
