import React from 'react'
import { AlertTriangle, RotateCcw } from 'lucide-react'

interface ErrorMessageProps {
    message: string
    icon?: React.ReactNode
    onRetry?: () => void
}

export default function ErrorMessage({ message, icon, onRetry }: ErrorMessageProps) {
    return (
        <div className="flex flex-col items-center justify-center min-h-[200px] text-center p-6">
            <div className="text-red-500 mb-4">
                {icon || <AlertTriangle className="w-12 h-12" />}
            </div>
            <p className="text-lg font-semibold text-red-700 mb-2">{message}</p>
            {onRetry && (
                <button
                    onClick={onRetry}
                    className="mt-2 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 flex items-center gap-2"
                >
                    <RotateCcw className="w-4 h-4" /> Tentar novamente
                </button>
            )}
        </div>
    )
} 