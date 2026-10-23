import React from "react";
import { useParams } from "react-router-dom";
import { currentUserId } from "../api";
import UserProfile from "./UserProfile";

export default function ViewUser() {
  const { id } = useParams();
  return <UserProfile userId={id} isOwn={id === currentUserId()} />;
}
