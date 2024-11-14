import { DetailPage } from "components/detail/DetailPage";
import { Layout } from "components/layout/DamDdaContainer";
import { useUser } from "UserContext";

export const ProjectDetail = () => {
  const { user } = useUser();

  return (
    <div style={{ width: "100%" }}>
      <Layout>
        <div style={{ width: "100%" }}>
          <DetailPage style={{ width: "100%" }} />
        </div>
      </Layout>
    </div>
  );
};
