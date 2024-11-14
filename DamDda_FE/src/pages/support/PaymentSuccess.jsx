import { PaymentSuccessPage } from "components/support/PaymentSuccess";
import { Layout } from "components/layout/DamDdaContainer";
import { useUser } from "UserContext";

export const PaymentSuccess = () => {
  const { user } = useUser();

  return (
    <div style={{ width: "100%" }}>
      <Layout>
        <div style={{ width: "100%" }}>
          <PaymentSuccessPage style={{ width: "100%" }} />
        </div>
      </Layout>
    </div>
  );
};
