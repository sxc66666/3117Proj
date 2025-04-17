import React from "react";
import UserAccount from "../components/UserAccount";

const CustAccount = () => {
  return (
    <UserAccount
      userType="cust"
      apiEndpoint="/api/cust/update-Custuser"
      fields={[]} // no 'descrption' fields needed for customer
    />
  );
};

export default CustAccount;
