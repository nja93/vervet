import {
  ClockIcon,
  DeviceTabletIcon,
  QueueListIcon,
  WrenchScrewdriverIcon
} from "@heroicons/react/24/outline";

const features = [
  {
    name: "Timely",
    description:
      "Get prompt updates as soon as one is posted.",
    icon: ClockIcon,
  },
  {
    name: "Multiplatform",
    description:
      "Our services are multiplatform delivering a consistent and seamless user experience accessible on any device, whether you are on phone, tablet or laptop.",
    icon: DeviceTabletIcon,
  },
  {
    name: "Customizable",
    description:
      "Be in Control of what your users see and how they respond using Actions.",
    icon: WrenchScrewdriverIcon,
  },
  {
    name: "Granular",
    description:
      "Get to know what you need to know. No distractions.",
    icon: QueueListIcon,
  },
];

export default function Features() {
  return (
    <div id="features" className="bg-white py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 sm:gap-y-20 lg:mx-0 lg:max-w-none lg:grid-cols-3">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Our Features
          </h2>
          <dl className="col-span-2 grid grid-cols-1 gap-x-8 gap-y-16 sm:grid-cols-2">
            {features.map((feature) => (
              <div key={feature.name}>
                <dt className="text-base font-semibold leading-7 text-gray-900">
                  <div className="mb-6 flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-600">
                    <feature.icon
                      className="h-6 w-6 text-white"
                      aria-hidden="true"
                    />
                  </div>
                  {feature.name}
                </dt>
                <dd className="mt-1 text-base leading-7 text-gray-600">
                  {feature.description}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </div>
  );
}
