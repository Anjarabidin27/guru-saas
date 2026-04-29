import pptxgen from 'pptxgenjs'

export async function generateMateriPPT(
  materi: { judul: string; deskripsi?: string; mapel: string; isi_ekstraksi?: string },
  sekolahNama: string
) {
  const pptx = new pptxgen()

  // 1. Slide Judul (Cover)
  const slide1 = pptx.addSlide()
  slide1.background = { color: 'F1F5F9' } // Slate 100
  
  slide1.addText(materi.judul.toUpperCase(), {
    x: 0.5, y: 1.5, w: 9, h: 2,
    fontSize: 44, bold: true, color: '0F172A', // Slate 900
    align: 'center', fontFace: 'Arial'
  })

  slide1.addText(`${materi.mapel} | Disusun oleh AI WiyataGuru`, {
    x: 0.5, y: 3.5, w: 9, h: 0.5,
    fontSize: 18, color: '64748B', // Slate 500
    align: 'center'
  })

  slide1.addText(sekolahNama, {
    x: 0.5, y: 4.2, w: 9, h: 0.5,
    fontSize: 14, color: '3B82F6', // Blue 500
    bold: true, align: 'center'
  })

  // 2. Slide Konten (Pecah berdasarkan poin-poin)
  const paragraphs = materi.isi_ekstraksi?.split('\n\n') || []
  
  paragraphs.forEach((p, idx) => {
    if (p.trim().length < 10) return
    
    const slide = pptx.addSlide()
    
    // Header Slide
    slide.addText(materi.judul, { 
      x: 0.5, y: 0.2, w: 9, h: 0.5, 
      fontSize: 12, color: '94A3B8', bold: true 
    })

    // Konten Slide
    slide.addText(p, {
      x: 0.5, y: 1.2, w: 9, h: 4,
      fontSize: 24, color: '1E293B',
      align: 'left', valign: 'top'
    })

    // Footer
    slide.addText(`Halaman ${idx + 2} | ${sekolahNama}`, {
      x: 0.5, y: 5.2, w: 9, h: 0.3,
      fontSize: 10, color: 'CBD5E1', align: 'right'
    })
  })

  return pptx
}
