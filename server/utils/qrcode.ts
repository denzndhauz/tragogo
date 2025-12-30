import QRCode from 'qrcode'

/**
 * Generate a QR code as a data URL
 */
export async function generateQRCode(data: string): Promise<string> {
    try {
        return await QRCode.toDataURL(data, {
            errorCorrectionLevel: 'M',
            type: 'image/png',
            width: 300,
            margin: 2,
        })
    } catch (error) {
        console.error('QR code generation error:', error)
        throw new Error('Failed to generate QR code')
    }
}
