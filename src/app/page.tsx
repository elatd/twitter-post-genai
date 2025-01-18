import { RiStarFill, RiTwitterXLine } from "react-icons/ri";
import InteractiveForm from "./components/InteractiveForm";

export default function Home() {
  return (
    <div className="flex flex-col items-center  justify-center min-h-screen container mx-auto ">
      <RiTwitterXLine size={50} color="white" className="mb-4" />
      <div className=" w-full flex flex-col items-center  justify-center ">
        <h3 className="text-2xl font-bold text-gray-100 flex items-center text-center">
          Effortless Tweet Inspiration{" "}
          <RiStarFill size={20} className="inline ml-2" />
        </h3>
        <p className="text-gray-400 mb-4 text-center">
          Discover creative and impactful ideas tailored to your needs.
        </p>

        <InteractiveForm></InteractiveForm>
      </div>
    </div>
  );
}
