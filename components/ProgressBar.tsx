import { CheckIcon } from '@heroicons/react/24/solid';

function classNames(...classes: any) {
  return classes.filter(Boolean).join(' ')
}

interface Step {
  id: string;
  name: string;
  description: string;
  href: string;
}

interface ProgressBarProps {
  currentStep: string;
  steps: Step[];
}

const ProgressBar = ({ currentStep, steps }: ProgressBarProps) => {
  const stepsWithStatus = steps.map((step) => ({
    ...step,
    status: step.id === currentStep ? 'current' : step.id < currentStep ? 'complete' : 'upcoming',
  }));

  return (
    <div className="lg:border-b lg:border-t lg:border-gray-200">
      <nav className="mx-auto max-w-7xl" aria-label="Progress">
        <ol
          role="list"
          className="overflow-hidden rounded-md lg:flex lg:rounded-none lg:border-l lg:border-r lg:border-gray-200"
        >
          {stepsWithStatus.map((step, stepIdx) => (
            <li key={step.id} className="relative overflow-hidden lg:flex-1">
              <div
                className={classNames(
                  stepIdx === 0 ? 'rounded-t-md border-b-0' : '',
                  stepIdx === stepsWithStatus.length - 1 ? 'rounded-b-md border-t-0' : '',
                  'overflow-hidden border border-gray-200 lg:border-0'
                )}
              >
                {step.status === 'complete' ? (
                  <a href={step.href} className="group">
                    <span
                      className="absolute left-0 top-0 h-full w-1 bg-transparent group-hover:bg-gray-200 lg:bottom-0 lg:top-auto lg:h-1 lg:w-full"
                      aria-hidden="true"
                    />
                    <span
                      className={classNames(
                        stepIdx !== 0 ? 'lg:pl-9' : '',
                        'flex items-start px-6 py-5 text-sm font-medium'
                      )}
                    >
                      <span className="flex-shrink-0">
                        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-lime-700">
                          <CheckIcon className="h-6 w-6 text-white" aria-hidden="true" />
                        </span>
                      </span>
                      <span className="ml-4 mt-0.5 gap-1 flex min-w-0 flex-col">
                        <span className="text-sm font-semibold">{step.name}</span>
                        <span className="text-sm font-medium text-gray-400">{step.description}</span>
                      </span>
                    </span>
                  </a>
                ) : step.status === 'current' ? (
                  <a href={step.href} aria-current="step">
                    <span
                      className="absolute left-0 top-0 h-full w-1 bg-lime-700 lg:bottom-0 lg:top-auto lg:h-1 lg:w-full"
                      aria-hidden="true"
                    />
                    <span
                      className={classNames(
                        stepIdx !== 0 ? 'lg:pl-9' : '',
                        'flex items-start px-6 py-5 text-sm font-medium'
                      )}
                    >
                      <span className="flex-shrink-0">
                        <span className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-lime-700">
                          <span className="text-lime-700">{step.id}</span>
                        </span>
                      </span>
                      <span className="ml-4 mt-0.5 gap-1 flex min-w-0 flex-col">
                        <span className="text-sm font-semibold text-lime-700">{step.name}</span>
                        <span className="text-sm font-medium text-gray-400">{step.description}</span>
                      </span>
                    </span>
                  </a>
                ) : (
                  <a href={step.href} className="group">
                    <span
                      className="absolute left-0 top-0 h-full w-1 bg-transparent group-hover:bg-gray-200 lg:bottom-0 lg:top-auto lg:h-1 lg:w-full"
                      aria-hidden="true"
                    />
                    <span
                      className={classNames(
                        stepIdx !== 0 ? 'lg:pl-9' : '',
                        'flex items-start px-6 py-5 text-sm font-medium'
                      )}
                    >
                      <span className="flex-shrink-0">
                        <span className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-gray-300">
                          <span className="text-gray-500">{step.id}</span>
                        </span>
                      </span>
                      <span className="ml-4 mt-0.5 gap-1 flex min-w-0 flex-col">
                        <span className="text-sm font-semibold text-gray-500">{step.name}</span>
                        <span className="text-sm font-medium text-gray-400">{step.description}</span>
                      </span>
                    </span>
                  </a>
                )}

                {stepIdx !== 0 ? (
                  <>
                    <div className="absolute inset-0 left-0 top-0 hidden w-3 lg:block" aria-hidden="true">
                      <svg
                        className="h-full w-full text-gray-300"
                        viewBox="0 0 12 82"
                        fill="none"
                        preserveAspectRatio="none"
                      >
                        <path d="M0.5 0V31L10.5 41L0.5 51V82" stroke="currentcolor" vectorEffect="non-scaling-stroke" />
                      </svg>
                    </div>
                  </>
                ) : null}
              </div>
            </li>
          ))}
        </ol>
      </nav>
    </div>
  )
}

export default ProgressBar;