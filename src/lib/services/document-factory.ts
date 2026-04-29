import jsPDF from 'jspdf'
import 'jspdf-autotable'
import { format } from 'date-fns'
import { id } from 'date-fns/locale'

// Extend jsPDF locally for autotable support
interface jsPDFWithPlugin extends jsPDF {
  autoTable: (options: any) => jsPDF
}

export async function generateQuestionPDF(
  soalList: any[], 
  sekolahData: { nama: string; alamat?: string; npsn?: string },
  guruNama: string,
  mapel: string,
  shuffle: boolean = false
) {
  const doc = new jsPDF() as jsPDFWithPlugin
  const margin = 20
  let currentY = margin

  // 1. Logic Shuffle (Acak Soal)
  let finalSoal = [...soalList]
  if (shuffle) {
    finalSoal = finalSoal.sort(() => Math.random() - 0.5)
  }

  // 2. KOP SEKOLAH (Header)
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(14)
  doc.text(sekolahData.nama.toUpperCase(), 105, currentY, { align: 'center' })
  currentY += 7
  
  doc.setFontSize(9)
  doc.setFont('helvetica', 'normal')
  if (sekolahData.alamat) {
    doc.text(sekolahData.alamat, 105, currentY, { align: 'center' })
    currentY += 5
  }
  doc.text(`NPSN: ${sekolahData.npsn || '-'} | Mapel: ${mapel}`, 105, currentY, { align: 'center' })
  currentY += 5

  // Garis KOP
  doc.setLineWidth(0.5)
  doc.line(margin, currentY, 190, currentY)
  currentY += 10

  // 3. IDENTITAS UJIAN
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(11)
  doc.text('LEMBAR SOAL LATIHAN / UJIAN', 105, currentY, { align: 'center' })
  currentY += 10

  doc.setFontSize(10)
  doc.setFont('helvetica', 'normal')
  doc.text(`Pengampu: ${guruNama}`, margin, currentY)
  doc.text(`Tanggal: ${format(new Date(), 'dd MMMM yyyy', { locale: id })}`, 190, currentY, { align: 'right' })
  currentY += 5
  doc.line(margin, currentY, 190, currentY)
  currentY += 10

  // 4. DAFTAR SOAL
  finalSoal.forEach((soal, index) => {
    // Cek tinggi halaman
    if (currentY > 270) {
      doc.addPage()
      currentY = margin
    }

    doc.setFont('helvetica', 'bold')
    doc.text(`${index + 1}.`, margin, currentY)
    
    // Pertanyaan (Multi-line) - Menggunakan teks_soal
    const splitPertanyaan = doc.splitTextToSize(soal.teks_soal || 'Isi soal tidak ditemukan', 160)
    doc.setFont('helvetica', 'normal')
    doc.text(splitPertanyaan, margin + 7, currentY)
    currentY += (splitPertanyaan.length * 5) + 2

    // Gambar soal (jika ada)
    if (soal.gambar_url) {
      try {
        // Cek ruang halaman
        if (currentY > 230) {
          doc.addPage()
          currentY = margin
        }
        doc.addImage(soal.gambar_url, 'JPEG', margin + 10, currentY, 80, 50)
        currentY += 55
      } catch (e) {
        console.error('Gagal memuat gambar ke PDF', e)
        doc.setFontSize(8)
        doc.text('[Gambar tidak dapat dimuat]', margin + 10, currentY)
        currentY += 5
      }
    }

    // Opsi Jawaban Dinamis (Hanya jika terisi)
    const options = [
      { k: 'A', v: soal.pilihan_a },
      { k: 'B', v: soal.pilihan_b },
      { k: 'C', v: soal.pilihan_c },
      { k: 'D', v: soal.pilihan_d },
      { k: 'E', v: soal.pilihan_e }
    ].filter(o => o.v && o.v.trim().length > 0)

    if (options.length > 0) {
      options.forEach(o => {
        doc.text(`${o.k}. ${o.v}`, margin + 10, currentY)
        currentY += 6
      })
    } else {
      currentY += 15 // Space kosong untuk Essai
    }
    
    currentY += 5 // Spacing antar soal
  })

  // 5. FOOTER
  const pageCount = doc.getNumberOfPages()
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i)
    doc.setFontSize(8)
    doc.text(`Halaman ${i} dari ${pageCount} | WiyataGuru AI System`, 105, 285, { align: 'center' })
  }

  return doc
}
