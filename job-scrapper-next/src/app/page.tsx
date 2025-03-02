import Footer from "@/components/Footer";
import Searchbar from "@/components/Searchbar";
import JobsScrollGrid from "@/components/JobsScrollGrid";
import Navbar from "@/components/Navbar";

const Home = async () => {
  return (
    <div className="grid grid-rows-[auto_1fr_auto] justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <Navbar />
      <main className="flex flex-col gap-8 row-start-2 items-center">
        <Searchbar />
        <JobsScrollGrid />
      </main>
      <Footer />
    </div>
  );
};

export default Home;
