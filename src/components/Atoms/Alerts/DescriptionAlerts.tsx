import { ExclamationTriangleIcon } from '@heroicons/react/20/solid'

interface DescriptionAlertsProps {
  description: string
  accentText: string
}

export default function DescriptionAlerts({
  description,
  accentText,
}: DescriptionAlertsProps) {
  return (
    <div className="border-l-4 border-yellow-400 bg-yellow-50 p-4">
      <div className="flex">
        <div className="flex-shrink-0">
          <ExclamationTriangleIcon
            className="h-5 w-5 text-yellow-400"
            aria-hidden="true"
          />
        </div>
        <div className="ml-3">
          <p className="text-sm text-yellow-700">
            {description}{' '}
            <span className="font-medium text-yellow-700 underline hover:text-yellow-600">
              {accentText}
            </span>
          </p>
        </div>
      </div>
    </div>
  )
}
