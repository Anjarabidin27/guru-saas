import { Document, Paragraph, TextRun, Packer, AlignmentType, Header, Footer, ImageRun } from "docx"
import { saveAs } from "file-saver"

export async function generateQuestionWord(
  soalList: any[], 
  sekolahData: { nama: string; alamat?: string; npsn?: string },
  guruNama: string,
  mapel: string,
  shuffle: boolean = false
) {
  // 1. Logic Shuffle (Acak Soal)
  let finalSoal = [...soalList]
  if (shuffle) {
    finalSoal = finalSoal.sort(() => Math.random() - 0.5)
  }

  const children: any[] = []

  // 2. KOP SEKOLAH (Header)
  children.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      children: [
        new TextRun({
          text: sekolahData.nama.toUpperCase(),
          bold: true,
          size: 28, // 14pt (di docx size dihitung dalam setengah poin)
          font: "Times New Roman"
        }),
      ],
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      children: [
        new TextRun({
          text: sekolahData.alamat || "",
          size: 20, // 10pt
          font: "Times New Roman"
        }),
      ],
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      children: [
        new TextRun({
          text: `NPSN: ${sekolahData.npsn || '-'} | Mata Pelajaran: ${mapel}`,
          size: 20,
          font: "Times New Roman"
        }),
      ],
    }),
    new Paragraph({ text: "=====================================================================", alignment: AlignmentType.CENTER })
  )

  // Spacing
  children.push(new Paragraph({ text: "" }))

  // 3. IDENTITAS UJIAN
  children.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      children: [
        new TextRun({
          text: "LEMBAR SOAL LATIHAN / UJIAN",
          bold: true,
          size: 24, // 12pt
          font: "Times New Roman"
        }),
      ],
    }),
    new Paragraph({ text: "" }),
    new Paragraph({
      children: [
        new TextRun({ text: `Nama Guru : ${guruNama}`, size: 24, font: "Times New Roman" }),
      ],
    }),
    new Paragraph({
      children: [
        new TextRun({ text: `Tanggal   : .......................................`, size: 24, font: "Times New Roman" }),
      ],
    }),
    new Paragraph({ text: "--------------------------------------------------------------------------------------------------------" })
  )
  
  children.push(new Paragraph({ text: "" }))

  // 4. DAFTAR SOAL
  for (const [index, soal] of finalSoal.entries()) {
    // Nomor & Pertanyaan
    children.push(
      new Paragraph({
        children: [
          new TextRun({ text: `${index + 1}. `, bold: true, size: 24, font: "Times New Roman" }),
          new TextRun({ text: soal.teks_soal || "Isi soal tidak ditemukan", size: 24, font: "Times New Roman" }),
        ],
      })
    )

    // Gambar soal (jika ada)
    if (soal.gambar_url) {
      try {
        const response = await fetch(soal.gambar_url)
        const blob = await response.blob()
        const arrayBuffer = await blob.arrayBuffer()
        
        children.push(
          new Paragraph({
            indent: { left: 720 },
            children: [
              new ImageRun({
                data: arrayBuffer,
                transformation: {
                  width: 300,
                  height: 200,
                },
              }),
            ],
          })
        )
      } catch (e) {
        console.error('Gagal memuat gambar ke Word', e)
        children.push(new Paragraph({ indent: { left: 720 }, children: [new TextRun({ text: "[Gambar tidak dapat dimuat]", color: "FF0000", size: 20 })] }))
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
        children.push(
          new Paragraph({
            indent: { left: 720 }, // 0.5 inch (720 twips)
            children: [
              new TextRun({ text: `${o.k}. ${o.v}`, size: 24, font: "Times New Roman" }),
            ]
          })
        )
      })
    } else {
      // Space for Essai
      children.push(new Paragraph({ text: "" }), new Paragraph({ text: "" }), new Paragraph({ text: "" }))
    }

    children.push(new Paragraph({ text: "" })) // Spasi antar soal
  }

  // 5. Build Document
  const doc = new Document({
    sections: [{
      properties: {},
      headers: {
        default: new Header({
          children: [new Paragraph({ text: "Dokumen Cetak WiyataGuru", alignment: AlignmentType.RIGHT })],
        }),
      },
      footers: {
        default: new Footer({
          children: [new Paragraph({ text: "Halaman", alignment: AlignmentType.CENTER })],
        }),
      },
      children: children,
    }],
  })

  // Generate & Save
  const blob = await Packer.toBlob(doc)
  saveAs(blob, `Naskah_Soal_${mapel}_${new Date().getTime()}.docx`)
}
