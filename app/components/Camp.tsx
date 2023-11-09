interface CampProps {
 backgroundImage: string;
}

const CampSite = ({ backgroundImage }: CampProps) => {
 return (
  <div className={`h-full w-full min-w-[1100px] ${backgroundImage} bg-cover bg-no-repeat lg:rounded-r-5xl 2xl:rounded-5xl`}>
   <div className="flex h-full flex-col items-start justify-between p-6 lg:px-20 lg:py-10">
    <div className="flexCenter gap-4">
    </div>
   </div>
  </div>
 )
}
const Camp = () => {
 return (
  <section className="2xl:max-container relative flex flex-col py-10 lg:py-20 xl:mb-20">
   <div className="hide-scrollbar flex h-[340px] w-full items-start justify-start gap-8 overflow-x-auto lg:h-[400px] xl:h-[640px]">
    <CampSite
     backgroundImage="bg-bg-img-1"
    />
    <CampSite
     backgroundImage="bg-bg-img-2"
    />
   </div>

   <div className="flexEnd mt-10 px-6 lg:-mt-60 lg:mr-6">
    <div className="bg-blue-500 p-8 lg:max-w-[500px] xl:max-w-[734px] xl:rounded-5xl xl:px-16 xl:py-20 relative w-full overflow-hidden rounded-3xl">
     <h2 className="regular-24 md:regular-32 2xl:regular-64 capitalize text-white">
      <strong>Need Information</strong> About the things you care about?
     </h2>
     <p className="regular-14 xl:regular-16 mt-5 text-white">
      Never miss out on the things that matter. Vervet allows you to connect to people and establishments you are subscribed to
     </p>
    </div>
   </div>
  </section>
 )
}

export default Camp