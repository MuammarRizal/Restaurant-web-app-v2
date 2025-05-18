'use client'
import { useState } from 'react'
import { Scanner } from '@yudiel/react-qr-scanner'
import { FaCamera, FaCheckCircle, FaTimesCircle } from 'react-icons/fa'
import { ScannerError } from '@/types/scanner'
import { useRouter } from 'next/navigation'
import axios from 'axios'

const QrScannerPage = () => {
  const [result, setResult] = useState<string | null | number>(null)
  const [error, setError] = useState<string | null>(null)
  const [isScanning, setIsScanning] = useState(true)
  const router = useRouter()

  // Format yang didukung
  const formats = [
    'qr_code',
    'code_128',
    'code_39',
    'data_matrix'
  ]

  const handleScanResult = async (result: any) => {
  // Validate the result structure
  if (!result || !Array.isArray(result) || result.length === 0 || !result[0]?.rawValue) {
    console.log('Invalid scan result', result);
    return;
  }

  const scannedValue = result[0].rawValue;
  console.log('Scanned value:', scannedValue);

  // Check for special string case first
  if (scannedValue === "PPKDJS-Collaboration-Day") {
    setResult(scannedValue);
    setIsScanning(false);
    console.log('Scan successful - Special code accepted:', scannedValue);
    localStorage.setItem("qr_code",JSON.stringify(scannedValue));
    router.push('/')
    return;
  }

  // Check if it's a number between 1-100
  if (/^[1-9][0-9]?$|^100$/.test(scannedValue)) {
    const numericValue = parseInt(scannedValue, 10);
    
    if (numericValue >= 1 && numericValue <= 100) {
      setResult(numericValue);
      setIsScanning(false);
      console.log('Scan successful - Valid number:', numericValue);
      try{
        const response = await axios.post('/api/qr-code',{code: numericValue})
        console.log(response)
        if(response.status !== 200 ){
            console.log("response:",{response})
            console.log("response:",{status: response.status})
            alert("QR Sudah Pernah Digunakan")
            throw new Error('Something went wrong');
        }

        localStorage.setItem("qr_code",JSON.stringify(numericValue));
        router.push('/')
        return;
      }catch(err){
        console.log(err)
      }
    }
  }

  console.log('Invalid value (must be 1-100 or special code):', scannedValue);
  // Optional: Show error to user
  // setError('Please scan a QR code with number 1-100 or the special code');
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
                  audio: true,
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