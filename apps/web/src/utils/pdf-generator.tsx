import jsPDF from "jspdf"
import html2canvas from "html2canvas"

export interface ReportConfig {
  title: string
  subtitle?: string
  dateRange: string
  data: any[]
  summary?: Record<string, any>
  footer?: string
}

export const generatePDFReport = async (elementId: string, config: ReportConfig): Promise<void> => {
  const element = document.getElementById(elementId)
  if (!element) {
    throw new Error("Element not found")
  }

  // Create canvas from HTML element
  const canvas = await html2canvas(element, {
    scale: 2,
    useCORS: true,
    allowTaint: true,
    backgroundColor: "#ffffff",
    width: element.scrollWidth,
    height: element.scrollHeight,
  })

  const imgData = canvas.toDataURL("image/png")
  const pdf = new jsPDF("p", "mm", "a4")

  const pdfWidth = pdf.internal.pageSize.getWidth()
  const pdfHeight = pdf.internal.pageSize.getHeight()
  const imgWidth = canvas.width
  const imgHeight = canvas.height
  const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight)
  const imgX = (pdfWidth - imgWidth * ratio) / 2
  const imgY = 30

  // Add header
  pdf.setFontSize(20)
  pdf.setFont("helvetica", "bold")
  pdf.text(config.title, pdfWidth / 2, 20, { align: "center" })

  if (config.subtitle) {
    pdf.setFontSize(12)
    pdf.setFont("helvetica", "normal")
    pdf.text(config.subtitle, pdfWidth / 2, 25, { align: "center" })
  }

  // Add content
  pdf.addImage(imgData, "PNG", imgX, imgY, imgWidth * ratio, imgHeight * ratio)

  // Add footer
  const pageCount = pdf.internal.getNumberOfPages()
  for (let i = 1; i <= pageCount; i++) {
    pdf.setPage(i)
    pdf.setFontSize(8)
    pdf.setFont("helvetica", "normal")
    pdf.text(
      `Página ${i} de ${pageCount} - Generado el ${new Date().toLocaleDateString("es-ES")}`,
      pdfWidth / 2,
      pdfHeight - 10,
      { align: "center" },
    )
  }

  // Download PDF
  const fileName = `${config.title.replace(/\s+/g, "_").toLowerCase()}_${new Date().toISOString().split("T")[0]}.pdf`
  pdf.save(fileName)
}

export const generateExcelReport = (data: any[], filename: string): void => {
  // Convert data to CSV format
  if (data.length === 0) return

  const headers = Object.keys(data[0])
  const csvContent = [
    headers.join(","),
    ...data.map((row) => headers.map((header) => `"${row[header] || ""}"`).join(",")),
  ].join("\n")

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
  const link = document.createElement("a")
  const url = URL.createObjectURL(blob)
  link.setAttribute("href", url)
  link.setAttribute("download", `${filename}.csv`)
  link.style.visibility = "hidden"
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}
