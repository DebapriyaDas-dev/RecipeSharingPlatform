import React from "react";
import { currentUserId } from "../api";
import UserProfile from "./UserProfile";

export default function Profile() {
  return <UserProfile userId={currentUserId()} isOwn />;
}
