import React from 'react'
import Image from 'next/image'


/*for vervet features*/
const FEATURES = [
  {
    title: 'Multiplatform',
    icon: '/multiplatform.svg',
    description:
      'Our services are multiplatform delivering a consistent and seamless user experience accessible on any device, whether you are on phone, tablet or laptop',
  },

  {
    title: 'Fully online',
    icon: '/alerts.svg',
    description:
      "The application promptly updates you as soon as an update is posted",
  },

  {
    title: 'View your Feeds In a Click',
    icon: '/tech.svg',
    description:
      'Easily access your subscription and feeds in a click',
  },
  {
    title: 'Lets add one more thing',
    icon: '/location.svg',
    variant: 'orange',
    description:
      'Let\'s add one more THING'
  },
];

/*for vervet footer*/
// export const FOOTER_CONTACT_INFO = {
//  title: 'Contact Us',
//  links: [
//    { label: 'Admin Officer', value: '0' },
//    { label: 'Email Officer', value: 'paulwahome' },
//  ],
// };

// /*social media*/
// export const SOCIALS = {
//  title: 'Social',
//  links: [
//    '/facebook.svg',
//    '/instagram.svg',
//    '/twitter.svg',
//    '/youtube.svg',
//    '/wordpress.svg',
//  ],
// };

const Features = () => {
  return (
    <section className="flex-col flexCenter overflow-hidden bg-feature-bg bg-center bg-no-repeat py-24">
      <div className="max-container padding-container relative w-full flex justify-end">
        <div className="flex flex-1 lg:min-h-[900px]">
          <Image
            src="/phone.PNG"
            alt="phone"
            width={440}
            height={1000}
            className="feature-phone"
          />
        </div>
        <div className="z-20 flex w-full flex-col lg:w-[60%]">
          <div className='relative'>

            <h2 className="bold-40 lg:bold-64">Our Features</h2>
          </div>
          <ul className="mt-10 grid gap-10 md:grid-cols-2 lg:mg-20 lg:gap-20">
            {FEATURES.map((feature) => (
              <FeatureItem
                key={feature.title}
                title={feature.title}
                icon={feature.icon}
                description={feature.description}
              />

            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
type FeatureItem = {
  title: string;
  icon: string;
  description: string;

}
const FeatureItem = ({ title, icon, description }: FeatureItem) => {
  return (
    <li className="flex w-full flex-1 flex-col items-start">
      <div className="rounded-full p-4 lg:p-7">
        <Image src={icon} alt="map" width={100} height={50} />
      </div>
      <h2 className="bold-20 lg:bold-32 mt-5 capitalize">
        {title}
      </h2>
      <p className="regular-16 mt-5 bg-white/80 text-gray-30 lg:mt-[30px] lg:bg-none">
        {description}
      </p>
    </li>
  )
}

export default Features
