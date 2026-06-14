import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import Navbar from "@/components/Navbar";
import Home from "@/pages/Home";
import ProposalDetail from "@/pages/ProposalDetail";
import Ranking from "@/pages/Ranking";
import SubmitProposal from "@/pages/SubmitProposal";
import Changelog from "@/pages/Changelog";
import Admin from "@/pages/Admin";
import { useStore } from "@/store/useStore";

export default function App() {
  const { initUser, fetchProposals, fetchChangelog, fetchVotingCycles } = useStore();

  useEffect(() => {
    initUser();
    fetchProposals();
    fetchChangelog();
    fetchVotingCycles();
  }, [initUser, fetchProposals, fetchChangelog, fetchVotingCycles]);

  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-slate-100">
        <Navbar />
        <main className="container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/proposal/:id" element={<ProposalDetail />} />
            <Route path="/ranking" element={<Ranking />} />
            <Route path="/submit" element={<SubmitProposal />} />
            <Route path="/changelog" element={<Changelog />} />
            <Route path="/admin" element={<Admin />} />
          </Routes>
        </main>
        <footer className="border-t border-slate-800 py-8 mt-16">
          <div className="container mx-auto px-4 text-center text-slate-500 text-sm">
            <p>Feature Voting Platform © 2025 · 开源社区路线图投票系统</p>
          </div>
        </footer>
      </div>
    </Router>
  );
}
