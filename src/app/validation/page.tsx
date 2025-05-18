'use client'
import { useState } from 'react'
import { Scanner } from '@yudiel/react-qr-scanner'
import { FaCamera, FaCheckCircle, FaTimesCircle, FaSpinner } from 'react-icons/fa'
import { useRouter } from 'next/navigation'
import axios from 'axios'

const QrScannerPage = () => {
  const [result, setResult] = useState<string | number | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isScanning, setIsScanning] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleScanResult = async (result: any) => {
    if (!result || !Array.isArray(result) || result.length === 0 || !result[0]?.rawValue) {
      console.log('Invalid scan result', result)
      return
    }

    const scannedValue = result[0].rawValue
    console.log('Scanned value:', scannedValue)
    setIsLoading(true)

    try {
      // Handle special code case
      if (scannedValue === "PPKDJS-Collaboration-Day") {
        await handleValidCode(scannedValue)
        return
      }

      // Handle PPKD-JS-xxx format
      if (/^PPKD-JS-(?:[1-9][0-9]?|100)$/.test(scannedValue)) {
        const numericValue = parseInt(scannedValue.split('-')[2], 10)
        if (numericValue >= 1 && numericValue <= 100) {
          await handleNumericCode(numericValue)
          return
        }
      }

      // If we get here, the code is invalid
      setError('Kode QR tidak valid. Harus berupa PPKD-JS-1 sampai PPKD-JS-100 atau kode khusus')
      setIsScanning(false)
    } catch (err) {
      console.error('Error processing QR code:', err)
      setError(err instanceof Error ? err.message : 'Terjadi kesalahan saat memproses QR code')
    } finally {
      setIsLoading(false)
    }
  }

  const handleValidCode = async (code: string) => {
    setResult(code)
    setIsScanning(false)
    console.log('Scan successful - Special code accepted:', code)
    localStorage.setItem("qr_code", JSON.stringify(code))
    router.push('/')
  }

  const handleNumericCode = async (code: number) => {
    setIsScanning(false)
    console.log('Scan successful - Valid number:', code)

    try {
      const response = await axios.post('/api/qr-code', { code })
      
      if (response.status !== 200) {
        console.log("Response:", { status: response.status, data: response.data })
        throw new Error("QR Sudah Pernah Digunakan")
      }

      localStorage.setItem("qr_code", JSON.stringify(code))
      setResult(code)
      router.push('/')
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || 'QR Sudah Pernah Digunakan')
      } else {
        setError(err instanceof Error ? err.message : 'Terjadi kesalahan')
      }
      setIsScanning(true) // Allow rescanning
      throw err // Re-throw for the outer catch
    }
  }

  const resetScanner = () => {
    setResult(null)
    setError(null)
    setIsScanning(true)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg overflow-hidden">
        {/* Header */}
        <div className="bg-blue-600 p-5 text-center">
          <h1 className="text-2xl font-bold text-white flex items-center justify-center gap-2">
            <FaCamera className="inline" /> QR Code Scanner
          </h1>
        </div>

        <div className="p-5">
          {isLoading ? (
            <div className="aspect-square w-full rounded-lg flex items-center justify-center bg-gray-100">
              <div className="flex flex-col items-center">
                <FaSpinner className="text-blue-500 text-4xl animate-spin mb-2" />
                <p className="text-gray-700">Memproses QR code...</p>
              </div>
            </div>
          ) : isScanning ? (
            <div className="relative aspect-square w-full rounded-lg overflow-hidden border-2 border-dashed border-blue-300">
              <Scanner
                onScan={handleScanResult}
                onError={(error: any): void => {
                  setError(error?.message || 'Gagal memindai')
                  setIsScanning(false)
                }}
                allowMultiple={true}
                formats={['qr_code', 'code_128', 'code_39', 'data_matrix']}
                components={{ audio: true }}
                classNames={{
                  container: 'w-full h-full',
                  video: 'object-cover',
                }}
              />
              <div className="absolute inset-0 border-4 border-blue-400 rounded-lg m-2 pointer-events-none animate-pulse"></div>
            </div>
          ) : (
            <div className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center">
              <p className="text-gray-500">Kamera tidak aktif</p>
            </div>
          )}

          {/* Hasil Scan */}
          {result && !isLoading && (
            <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg flex items-start gap-3">
              <FaCheckCircle className="text-green-500 text-xl mt-0.5" />
              <div>
                <h3 className="font-semibold text-green-800">Berhasil!</h3>
                <p className="text-sm break-all mt-1">
                  {typeof result === 'number' ? `PPKD-JS-${result}` : result}
                </p>
              </div>
            </div>
          )}

          {/* Error Message */}
          {error && !isLoading && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
              <FaTimesCircle className="text-red-500 text-xl mt-0.5" />
              <div>
                <h3 className="font-semibold text-red-800">Error</h3>
                <p className="text-sm mt-1">QR Sudah Digunakan</p>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="mt-6 flex gap-3">
            <button
              onClick={resetScanner}
              disabled={isLoading}
              className={`flex-1 py-2 rounded-lg transition-colors flex items-center justify-center gap-2 ${
                isLoading
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700 text-white'
              }`}
            >
              <FaCamera /> Scan Lagi
            </button>
            
            {result && !isLoading && (
              <button
                onClick={() => router.push('/')}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg transition-colors"
              >
                Lanjutkan
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default QrScannerPage