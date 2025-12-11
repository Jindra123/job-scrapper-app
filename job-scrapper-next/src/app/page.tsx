import Footer from "@/components/Footer";
import JobSearch from "@/components/JobSearch";
import Navbar from "@/components/Navbar";

const Home = async () => {
  return (
    <div className="min-h-screen bg-secondary">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <JobSearch />
      </main>
      <Footer />
    </div>
  );
};

export default Home;
