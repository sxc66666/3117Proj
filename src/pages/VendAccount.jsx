import React from "react";
import UserAccount from "../components/UserAccount";

const VendAccount = () => {
  return (
    <UserAccount
      userType="vend"
      apiEndpoint="/api/Vend/update-Venduser"
      fields={["description"]}
    />
  );
};

export default VendAccount;
