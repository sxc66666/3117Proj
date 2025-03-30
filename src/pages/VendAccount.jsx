import React from "react";
import UserAccount from "../components/UserAccount";

const VendAccount = () => {
  return (
    <UserAccount
      userType="vend"
      apiEndpoint="http://localhost:5000/api/Vend/update-Venduser"
      fields={["description"]}
    />
  );
};

export default VendAccount;
