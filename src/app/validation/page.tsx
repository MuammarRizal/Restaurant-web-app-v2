'use client'
import { useState } from 'react'
import { Scanner } from '@yudiel/react-qr-scanner'
import { FaCamera, FaCheckCircle, FaTimesCircle } from 'react-icons/fa'
import { ScannerError } from '@/types/scanner'

const QrScannerPage = () => {
  const [result, setResult] = useState<string | null | number>(null)
  const [error, setError] = useState<string | null>(null)
  const [isScanning, setIsScanning] = useState(true)

  // Format yang didukung
  const formats = [
    'qr_code',
    'code_128',
    'code_39',
    'data_matrix'
  ]

  const handleScanResult = (result: any) => {
  // Pastikan result ada dan memiliki struktur yang diharapkan
  if (!result || !Array.isArray(result) || result.length === 0 || !result[0]?.rawValue) {
    console.log('Hasil scan tidak valid', result);
    return;
  }

  const scannedValue = result[0].rawValue;
  console.log('Hasil scan:', scannedValue);

  // Cek apakah hasil scan adalah angka antara 1-100
  if (/^[1-9][0-9]?$|^100$/.test(scannedValue)) {
    const numericValue = parseInt(scannedValue, 10);
    
    if (numericValue >= 1 && numericValue <= 100) {
      setResult(numericValue);
      setIsScanning(false);
      console.log('Scan berhasil - Nilai valid:', numericValue);
      return;
    }
  }

  console.log('Nilai tidak valid (harus 1-100):', scannedValue);
  // Optional: Tampilkan pesan error ke user
  // setError('Harap scan QR code dengan angka 1-100');
};

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
          {isScanning ? (
            <div className="relative aspect-square w-full rounded-lg overflow-hidden border-2 border-dashed border-blue-300">
              <Scanner
                // onScan={(result) => {
                //   if ( result?.[0]?.rawValue) {
                //     setResult(result[0].rawValue)
                //     setIsScanning(false)
                //   }
                //   console.log(result)
                // }}
                onScan={handleScanResult}
                onError={(error: any):void => {
                  setError(error?.message || 'Gagal memindai')
                  setIsScanning(false)
                }}
                allowMultiple={true}
                formats={[ 'qr_code','code_128','code_39','data_matrix']}
                // options={{
                //   delayBetweenScanAttempts: 500,
                //   maxScansPerSecond: 5,
                // }}
                components={{
                  audio: false, // Matikan suara beep
                }}
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
          {result && (
            <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg flex items-start gap-3">
              <FaCheckCircle className="text-green-500 text-xl mt-0.5" />
              <div>
                <h3 className="font-semibold text-green-800">Berhasil!</h3>
                <p className="text-sm break-all mt-1">{result}</p>
              </div>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
              <FaTimesCircle className="text-red-500 text-xl mt-0.5" />
              <div>
                <h3 className="font-semibold text-red-800">Error</h3>
                <p className="text-sm mt-1">{error}</p>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="mt-6 flex gap-3">
            <button
              onClick={() => {
                setResult(null)
                setError(null)
                setIsScanning(true)
              }}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              <FaCamera /> Scan Lagi
            </button>
            
            {result && (
              <button
                onClick={() => alert(`Proses data: ${result}`)}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg transition-colors"
              >
                Proses Hasil
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default QrScannerPage