import { CheckCircleIcon, XMarkIcon } from '@heroicons/react/20/solid'

interface SuccessAlertsProps {
  description: string
  linkText?: string
}

export default function SuccessAlerts({
  description,
  linkText,
}: SuccessAlertsProps) {
  return (
    <div className="rounded-md bg-green-50 p-4">
      <div className="lg:flex lg:items-center">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <CheckCircleIcon
              className="h-5 w-5 text-green-400"
              aria-hidden="true"
            />
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium text-green-800">{description}</p>
          </div>
        </div>
        {linkText && (
          <div className="mt-3 ml-8 lg:mt-0 lg:ml-auto lg:pl-3">
            <div className="lg:-mx-1.5 lg:-my-1.5">
              <button
                type="button"
                className="inline-flex items-center rounded-md bg-green-50 lg:p-1.5 text-green-500 hover:bg-green-100 focus:outline-none focus:ring-2 focus:ring-green-600 focus:ring-offset-2 focus:ring-offset-green-50"
              >
                <span className="text-sm mr-1">{linkText}</span>
                <span aria-hidden="true"> &rarr;</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
