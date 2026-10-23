import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import { FiArrowLeft, FiCheck, FiEye, FiEyeOff, FiLock, FiMail, FiUser } from "react-icons/fi";
import { AuthContext } from "../App";
import { API_BASE, currentUserId, errorMessage } from "../api";
import { Avatar, PageHeader, Skeleton, ease, rise, stagger } from "../ui/Primitives";
import "./EditUser.css";

export default function EditUser() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { setUserName } = useContext(AuthContext);
  const [user, setUser] = useState({
    name: "",
    password: "",
    email: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const result = await axios.get(`${API_BASE}/users/${id}`);
        setUser(result.data);
      } catch (err) {
        console.log(err);
        toast.error("Could not load this profile.");
      } finally {
        setLoading(false);
      }
    };
    loadUser();
  }, [id]);

  const onInputChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const result = await axios.put(`${API_BASE}/users/update-user/${id}`, user);
      setUser(result.data);
      if (id === currentUserId()) {
        localStorage.setItem("userName", result.data.name);
        setUserName(result.data.name);
      }
      toast.success("Profile updated!");
      navigate("/profile");
    } catch (err) {
      console.log(err);
      toast.error(errorMessage(err, "Could not save your changes."));
      setSaving(false);
    }
  };

  return (
    <div className="sn-page">
      <div className="sn-container sn-container--narrow">
        <Link className="sn-back" to="/profile">
          <FiArrowLeft /> Back to profile
        </Link>
        <PageHeader eyebrow="Account" title="Edit" highlight="profile" subtitle="Update how you appear across the community." />

        <motion.form
          className="sn-card sn-edit-user"
          onSubmit={handleSubmit}
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease }}
        >
          <div className="sn-edit-user__preview">
            <motion.div key={user.name} initial={{ scale: 0.9 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 400, damping: 18 }}>
              <Avatar name={user.name || "?"} size={96} ring />
            </motion.div>
            <div className="sn-edit-user__who">
              <strong>{user.name || "Your name"}</strong>
              <span>{user.email || "you@example.com"}</span>
            </div>
          </div>

          {loading ? (
            <div className="sn-edit-user__fields" style={{ gap: 16 }}>
              <Skeleton height={50} />
              <Skeleton height={50} />
              <Skeleton height={50} />
            </div>
          ) : (
            <motion.div className="sn-edit-user__fields" variants={stagger} initial="hidden" animate="show">
              <motion.div variants={rise} className="sn-field">
                <label className="sn-label" htmlFor="eu-name">
                  Name
                </label>
                <div className="sn-input-wrap">
                  <FiUser />
                  <input
                    id="eu-name"
                    className="sn-input"
                    name="name"
                    placeholder="Your name"
                    minLength={3}
                    required
                    value={user.name || ""}
                    onChange={onInputChange}
                  />
                </div>
              </motion.div>
              <motion.div variants={rise} className="sn-field">
                <label className="sn-label" htmlFor="eu-email">
                  Email
                </label>
                <div className="sn-input-wrap">
                  <FiMail />
                  <input
                    id="eu-email"
                    type="email"
                    className="sn-input"
                    name="email"
                    placeholder="you@example.com"
                    required
                    value={user.email || ""}
                    onChange={onInputChange}
                  />
                </div>
              </motion.div>
              <motion.div variants={rise} className="sn-field">
                <label className="sn-label" htmlFor="eu-password">
                  Password
                </label>
                <div className="sn-input-wrap sn-edit-user__password">
                  <FiLock />
                  <input
                    id="eu-password"
                    type={showPassword ? "text" : "password"}
                    className="sn-input"
                    name="password"
                    placeholder="Password"
                    minLength={8}
                    required
                    value={user.password || ""}
                    onChange={onInputChange}
                  />
                  <button
                    type="button"
                    className="sn-edit-user__toggle"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <FiEyeOff /> : <FiEye />}
                  </button>
                </div>
                <p className="sn-hint">At least 8 characters, with a number and a special character (@#$%^&+=).</p>
              </motion.div>
              <motion.div variants={rise} className="sn-edit-user__actions">
                <Link className="sn-btn sn-btn--ghost" to="/profile">
                  Cancel
                </Link>
                <button type="submit" className="sn-btn sn-btn--primary sn-shine" disabled={saving}>
                  {saving ? <span className="sn-spinner" aria-hidden="true" /> : <FiCheck />}
                  {saving ? "Saving…" : "Save changes"}
                </button>
              </motion.div>
            </motion.div>
          )}
        </motion.form>
      </div>
    </div>
  );
}
