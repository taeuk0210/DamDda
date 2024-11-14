import { PaymentPage } from 'components/support/Payment';
import { Layout } from 'components/layout/DamDdaContainer';
import { useUser } from 'UserContext';

export const Payment = () => {
    const { user } = useUser();

    return (
        <div style={{ width: '100%' }}>
            <Layout>
                <div style={{ width: '100%' }}>
                    <PaymentPage style={{ width: '100%' }} />
                </div>
            </Layout>
        </div>
    );
};
