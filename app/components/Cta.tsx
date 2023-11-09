import Image from "next/image"
import Button from "./Button"

const Cta = () => {
 return (
  <section className="max-container padding-container flex flex-col gap-20 py-10 pb-32 md:gap-28 lg:py-20 xl:flex-row">
   <div className="hero-map" />

   <div className="relative z-20 flex flex-1 flex-col xl:w-1/2">
    <Image
     src="/vervet.svg"
     alt="camp"
     width={50}
     height={50}
     className="absolute left-[-5px] top-[-30px] w-10 lg:w-[50px]"
    />
    <h1 className="bold-32 lg:bold-88"> Real-Time Alerts Real Life Impact</h1>
    <p className="regular-16 mt-6 text-gray-30 xl:max-w-[520px]">
     We aim to make each of your lives easier and more convenient
    </p>

    <div className="flex flex-col w-full gap-3 sm:flex-row">
     <Button
      type="button"
      title="Get Started"
      variant="btn_blue"
     />
     <Button
      type="button"
      title="Learn More"
      variant="btn_white_text"
     />
    </div>
   </div>


  </section >
 )
}

export default Cta  