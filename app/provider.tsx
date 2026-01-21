"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { UserDeatailContext } from "@/UserDetailContext";
import Header from "./_components/Header";

function Provider({ children }: { children: React.ReactNode }) {
  const [userDetail, setUserDetail] = useState(null);

  useEffect(() => {
    CreateNewUser();
  }, []);

  const CreateNewUser = async () => {
    //user api endpoint call to create user in db
    const result = await axios.post("/api/user", {});
    console.log(result.data);
    setUserDetail(result.data);
  };
  return (
    <div>
      <UserDeatailContext.Provider value={{ userDetail, setUserDetail }}>
        <div className="max-w-7xl mx-auto">
                <Header />
          
          {children}</div>
      </UserDeatailContext.Provider>
    </div>
  );
}

export default Provider;
