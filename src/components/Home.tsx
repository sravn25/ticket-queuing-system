import { Mail } from "lucide-react";
import QueueModal from "./home/queueModal";
import QueueProgress from "./home/queueProgress";
import QueueSearch from "./home/queueSearch";

const Home = () => {
  return (
    <>
      <div className="bg-slate-800 h-screen text-slate-50 flex flex-col justify-between">
        <div className="p-6 text-center space-y-6 sm:w-8/12 mx-auto">
          <h1 className="text-4xl font-bold">Time to Queue</h1>
          <p className="text-slate-400">
            This is the ticket queuing system, please register with your full
            name, student ID, and student email ID, Full name in English, Email
          </p>
          <QueueProgress />
          <QueueModal />
          <QueueSearch />
        </div>
        <footer className="flex justify-center items-center p-8 gap-2 bg-slate-600">
          <Mail className="mr-2" />
          <p>
            Please contact{" "}
            <a
              href="mailto:victorwongym@gmail.com"
              className="hover:text-slate-400"
            >
              victorwongym@gmail.com
            </a>{" "}
            if there is any discrepancy.
          </p>
        </footer>
      </div>
    </>
  );
};

export default Home;
