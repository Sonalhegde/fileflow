import { supabase } from "@/lib/supabase"
import { notFound } from "next/navigation"
import ImageViewer from "@/components/image-viewer"

interface PageProps {
  params: {
    code: string
  }
}

export default async function ViewPage({ params }: PageProps) {
  const { data: imageData, error } = await supabase
    .from("shared_images")
    .select("*")
    .eq("code", params.code.toUpperCase())
    .single()

  if (error || !imageData) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-50 to-blue-100">
      <ImageViewer imageData={imageData} />
    </div>
  )
}
