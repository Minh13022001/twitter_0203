import { useEffect, useState } from "react";
import Sidebar from "../../pages/Home/components/Siderbar";
import Widgets from "../../pages/Home/components/Widgets";
import CommentModal from "../../components/CommentModal";
import TweetModal from "../../components/TweetModal";

interface Props {
  children: React.ReactNode;
}

const MainLayout = ({ children }: Props) => {
  const [newsResults, setNewsResults] = useState([]);
  const [randomUsersResults, setRandomUsersResults] = useState([]);

  useEffect(() => {
    const fetchNewsResults = async () => {
      try {
        const res = await fetch(
          "https://saurav.tech/NewsAPI/top-headlines/category/business/us.json"
        );
        const data = await res.json();
        setNewsResults(data.articles);
      } catch (error) {
        console.error("Error fetching news:", error);
      }
    };

    const fetchRandomUsersResults = async () => {
      try {
        const res = await fetch(
          "https://randomuser.me/api/?results=30&inc=name,login,picture"
        );
        const data = await res.json();
        setRandomUsersResults(data.results || null);
      } catch (error) {
        setRandomUsersResults([]);
      }
    };

    fetchNewsResults();
    fetchRandomUsersResults();
  }, []);

  return (
    <div>
      <main className="flex min-h-screen mx-auto">
        {/* Sidebar */}
        <Sidebar />

        {/* Feed */}
        {children}
        {/* Widgets */}
        <Widgets
          newsResults={newsResults}
          randomUsersResults={randomUsersResults}
        />

        {/* Modal */}
        <CommentModal />
        <TweetModal/>
      </main>
    </div>
  );
};

export default MainLayout;
