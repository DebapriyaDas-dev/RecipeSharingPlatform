import axios from "axios";
import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FiSearch, FiArrowUpRight, FiMail, FiRefreshCw } from "react-icons/fi";
import { API_BASE, currentUserId } from "../api";
import { Avatar, CountUp, EmptyState, PageHeader, Skeleton, rise, stagger } from "../ui/Primitives";
import { CommunityArt } from "../ui/Illustrations";
import "./UserTable.css";

export default function UserTable() {
  const [users, setUsers] = useState([]);
  const [status, setStatus] = useState("loading"); // loading | ready | error
  const [search, setSearch] = useState("");
  const me = currentUserId();

  const loadUsers = async () => {
    setStatus("loading");
    try {
      const result = await axios.get(`${API_BASE}/users`);
      setUsers(result.data || []);
      setStatus("ready");
    } catch (err) {
      console.log(err);
      setStatus("error");
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const visible = useMemo(() => {
    const term = search.trim().toLowerCase();
    const list = term
      ? users.filter(
          (u) => (u.name || "").toLowerCase().includes(term) || (u.email || "").toLowerCase().includes(term)
        )
      : users;
    // You first, then alphabetical
    return [...list].sort((a, b) => (b.id === me) - (a.id === me) || (a.name || "").localeCompare(b.name || ""));
  }, [users, search, me]);

  const online = users.filter((u) => u.loggedIn).length;

  return (
    <div className="sn-page">
      <div className="sn-container">
        <PageHeader
          eyebrow="Community"
          title="Meet the"
          highlight="cooks"
          subtitle="Everyone sharing recipes and ratings on the platform. Open a profile to see what they've been cooking."
        >
          <motion.div variants={rise} className="sn-people__stats">
            <span>
              <strong>
                <CountUp value={users.length} />
              </strong>{" "}
              members
            </span>
            <span className="sn-people__online">
              <i /> <strong>{online}</strong> signed in now
            </span>
          </motion.div>
        </PageHeader>

        <div className="sn-input-wrap sn-people__search">
          <FiSearch />
          <input
            className="sn-input"
            type="search"
            placeholder="Search by name or email…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            aria-label="Search members"
          />
        </div>

        {status === "loading" ? (
          <div className="sn-people">
            {[0, 1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="sn-card sn-person">
                <Skeleton height={64} width={64} radius={999} />
                <Skeleton height={18} width="60%" />
                <Skeleton height={14} width="80%" />
              </div>
            ))}
          </div>
        ) : status === "error" ? (
          <EmptyState
            art={<CommunityArt />}
            title="Couldn't load the community"
            text="The user service didn't respond. Check that it's running and try again."
            action={
              <button type="button" className="sn-btn sn-btn--ghost" onClick={loadUsers}>
                <FiRefreshCw /> Try again
              </button>
            }
          />
        ) : visible.length === 0 ? (
          <EmptyState
            art={<CommunityArt />}
            title="No one by that name"
            text="Try a different name or email address."
            action={
              <button type="button" className="sn-btn sn-btn--ghost" onClick={() => setSearch("")}>
                Clear search
              </button>
            }
          />
        ) : (
          <motion.div className="sn-people" variants={stagger} initial="hidden" animate="show">
            <AnimatePresence>
              {visible.map((item) => {
                const isMe = item.id === me;
                return (
                  <motion.div
                    key={item.id}
                    layout
                    variants={rise}
                    exit={{ opacity: 0, scale: 0.94 }}
                    whileHover={{ y: -6 }}
                    className={`sn-card sn-person ${isMe ? "sn-person--me" : ""}`}
                  >
                    <div className="sn-person__avatar">
                      <Avatar name={item.name} size={64} ring={isMe} />
                      {item.loggedIn && <span className="sn-person__presence" title="Signed in" />}
                    </div>
                    <h3>
                      {item.name}
                      {isMe && <span className="sn-person__you">You</span>}
                    </h3>
                    <p className="sn-person__email">
                      <FiMail /> {item.email}
                    </p>
                    <Link
                      className="sn-btn sn-btn--ghost sn-btn--sm sn-person__cta"
                      to={isMe ? "/profile" : `/viewuser/${item.id}`}
                    >
                      View profile <FiArrowUpRight />
                    </Link>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    </div>
  );
}
