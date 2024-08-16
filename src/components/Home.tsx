import { Mail } from "lucide-react";
import QueueModal from "./home/queueModal";
import QueueProgress from "./home/queueProgress";
import QueueSearch from "./home/queueSearch";
import HomeHeader from "./home/header";
import bgProp from "../assets/2_Logo without word.png";

const Home = () => {
  return (
    <>
      <div className="flex flex-col justify-between bg-gradient-to-b from-celestialSecondary to-celestialPrimary h-screen text-slate-50 relative overflow-x-hidden">
        <div className="absolute top-52 left-[-300px] opacity-50 ">
          <img src={bgProp} alt="background planet" className="h-72 sm:h-96" />
        </div>

        <div className="absolute bottom-52 right-[-300px] opacity-50 ">
          <img src={bgProp} alt="background planet" className="h-72 sm:h-96" />
        </div>

        <HomeHeader />
        <div className="p-6 space-y-6 flex flex-col items-center relative z-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 sm:gap-8 w-full lg:w-1/2">
            <h1 className="text-4xl sm:text-5xl md:text-7xl text-center md:text-left font-bold font-zendots tracking-wider leading-none">
              You Are in the Queue
            </h1>
            <div className="flex-1 flex items-center">
              <QueueSearch />
            </div>
          </div>
          <p className="font-alata tracking-wide sm:w-1/2">
            Welcome to Orientation Party ticket queuing system, please register
            by filling the required fields.
          </p>
          <div className="w-full lg:w-1/2">
            <QueueProgress />
          </div>
          <QueueModal />
        </div>
        <footer className="flex justify-center items-center p-8 gap-2 bg-slate-600 relative z-10">
          <Mail className="mr-2 w-8 sm:w-4" />
          <p>
            Please contact{" "}
            <a
              href="mailto:opcelestial2024@gmail.com"
              className="hover:text-slate-400 text-slate-300"
            >
              opcelestial2024@gmail.com
            </a>{" "}
            if there is any discrepancy.
          </p>
        </footer>
      </div>
    </>
  );
};

export default Home;
