import Image from "next/image"

export const InboxView = () => {
  return (
    <div className="w-full h-full flex justify-center items-center gap-2">
      <Image src="/cenra-logo.svg" alt="cenra" className="border border-neutral-300 rounded-full p-1" width={50} height={50} />
      <span className="text-emerald-800 font-semibold text-3xl tracking-tighter">Cenra</span>
    </div>
  )
}
