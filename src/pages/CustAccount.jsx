import React from "react";
import UserAccount from "../components/UserAccount";

const CustAccount = () => {
  return (
    <UserAccount
      userType="cust"
      apiEndpoint="http://localhost:5000/api/cust/update-Custuser"
      fields={[]} // no 'descrption' fields needed for customer
    />
  );
};

export default CustAccount;
